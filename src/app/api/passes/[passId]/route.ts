import type { NextRequest } from "next/server";
import { passView } from "@/lib/data/derive";
import { buildPassJson } from "@/lib/wallet/pass-json";
import { buildPkpass } from "@/lib/wallet/pkpass";

/**
 * GET /api/passes/:passId          → the .pkpass bundle
 * GET /api/passes/:passId?format=json → pass.json for inspection
 */
export async function GET(req: NextRequest, ctx: RouteContext<"/api/passes/[passId]">) {
  const { passId } = await ctx.params;
  const view = passView(passId);
  if (!view) return Response.json({ error: "Pass not found" }, { status: 404 });

  const origin = req.nextUrl.origin;
  const passJson = buildPassJson(view, origin);

  if (req.nextUrl.searchParams.get("format") === "json") {
    return Response.json(passJson, { headers: { "Cache-Control": "no-store" } });
  }

  const { bytes, signed } = await buildPkpass(passJson, view.issuer.slug);
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/vnd.apple.pkpass",
      "Content-Disposition": `attachment; filename="${view.pass.serial}.pkpass"`,
      "Cache-Control": "no-store",
      "Last-Modified": new Date(view.pass.lastUpdatedAt).toUTCString(),
      "X-Pass-Signed": signed ? "true" : "false",
      "X-Pass-Version": String(view.pass.version),
    },
  });
}
