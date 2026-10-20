import type { NextRequest } from "next/server";
import { getPassBySerial } from "@/lib/data/store";
import { passView } from "@/lib/data/derive";
import { buildPassJson } from "@/lib/wallet/pass-json";
import { buildPkpass } from "@/lib/wallet/pkpass";

/**
 * Apple Wallet web service (PassKit Web Service Reference), in memory:
 *
 *  POST   v1/devices/:deviceId/registrations/:passTypeId/:serial   register a device for push updates
 *  DELETE v1/devices/:deviceId/registrations/:passTypeId/:serial   unregister
 *  GET    v1/devices/:deviceId/registrations/:passTypeId?passesUpdatedSince=  serials that changed
 *  GET    v1/passes/:passTypeId/:serial                            latest pass (honours If-Modified-Since)
 *  POST   v1/log                                                   device logs
 *
 * Every pass request must carry "Authorization: ApplePass <authenticationToken>".
 * In production the registrations table lives in PostgreSQL and a job sends
 * APNs pushes when a record changes; here the pass version bump stands in.
 */

declare global {
  var __walletRegistrations: Map<string, { deviceId: string; serial: string; pushToken: string; registeredAt: string }> | undefined;
}
const registrations = (globalThis.__walletRegistrations ??= new Map());

function unauthorized() {
  return new Response(null, { status: 401 });
}

function authorized(req: NextRequest, serial: string): boolean {
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.replace(/^ApplePass\s+/i, "").trim();
  const pass = getPassBySerial(serial);
  return !!pass && pass.authenticationToken === token;
}

export async function POST(req: NextRequest, ctx: RouteContext<"/api/wallet/v1/[...path]">) {
  const { path } = await ctx.params;
  if (path[0] === "log") {
    const body = await req.json().catch(() => ({}));
    console.log("[wallet log]", JSON.stringify(body));
    return new Response(null, { status: 200 });
  }
  if (path[0] === "devices" && path[2] === "registrations" && path.length === 5) {
    const [, deviceId, , , serial] = path;
    if (!authorized(req, serial)) return unauthorized();
    const body = (await req.json().catch(() => ({}))) as { pushToken?: string };
    const key = `${deviceId}:${serial}`;
    const existed = registrations.has(key);
    registrations.set(key, { deviceId, serial, pushToken: body.pushToken ?? "", registeredAt: new Date().toISOString() });
    return new Response(null, { status: existed ? 200 : 201 });
  }
  return new Response(null, { status: 404 });
}

export async function DELETE(req: NextRequest, ctx: RouteContext<"/api/wallet/v1/[...path]">) {
  const { path } = await ctx.params;
  if (path[0] === "devices" && path[2] === "registrations" && path.length === 5) {
    const [, deviceId, , , serial] = path;
    if (!authorized(req, serial)) return unauthorized();
    registrations.delete(`${deviceId}:${serial}`);
    return new Response(null, { status: 200 });
  }
  return new Response(null, { status: 404 });
}

export async function GET(req: NextRequest, ctx: RouteContext<"/api/wallet/v1/[...path]">) {
  const { path } = await ctx.params;

  if (path[0] === "devices" && path[2] === "registrations" && path.length === 4) {
    const [, deviceId] = path;
    const since = req.nextUrl.searchParams.get("passesUpdatedSince");
    const serials: string[] = [];
    let last = "";
    for (const r of registrations.values()) {
      if (r.deviceId !== deviceId) continue;
      const pass = getPassBySerial(r.serial);
      if (!pass) continue;
      if (!since || pass.lastUpdatedAt > since) serials.push(r.serial);
      if (pass.lastUpdatedAt > last) last = pass.lastUpdatedAt;
    }
    if (!serials.length) return new Response(null, { status: 204 });
    return Response.json({ serialNumbers: serials, lastUpdated: last });
  }

  if (path[0] === "passes" && path.length === 3) {
    const [, , serial] = path;
    if (!authorized(req, serial)) return unauthorized();
    const pass = getPassBySerial(serial)!;
    const ims = req.headers.get("if-modified-since");
    if (ims && new Date(ims).getTime() >= new Date(pass.lastUpdatedAt).getTime()) {
      return new Response(null, { status: 304 });
    }
    const view = passView(pass.id)!;
    const { bytes } = await buildPkpass(buildPassJson(view, req.nextUrl.origin), view.issuer.slug);
    return new Response(new Uint8Array(bytes), {
      headers: {
        "Content-Type": "application/vnd.apple.pkpass",
        "Last-Modified": new Date(pass.lastUpdatedAt).toUTCString(),
      },
    });
  }

  return new Response(null, { status: 404 });
}
