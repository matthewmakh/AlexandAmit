import type { NextRequest } from "next/server";
import { investorRows, STATUS_LABEL } from "@/lib/data/derive";

/**
 * CSV export of permitted investor fields. Phone numbers, provider
 * references and verification details are excluded by design.
 */
export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").toLowerCase();
  const status = req.nextUrl.searchParams.get("status") ?? "";
  const rows = investorRows().filter((r) => {
    const i = r.investor;
    if (q && !`${i.firstName} ${i.lastName} ${i.email} ${i.owner.registeredName}`.toLowerCase().includes(q)) return false;
    if (status && r.latestStatus !== status) return false;
    return true;
  });
  const header = ["Investor", "Email", "Registered owner", "Owner type", "State", "Latest status", "Committed USD", "Shares issued", "Shares pending", "Tags", "Account manager", "Created"];
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const lines = [header.map(esc).join(",")];
  for (const r of rows) {
    const i = r.investor;
    lines.push([`${i.firstName} ${i.lastName}`, i.email, i.owner.registeredName, i.owner.ownerType, i.owner.region, STATUS_LABEL[r.latestStatus], r.committed, r.sharesIssued, r.sharesPending, i.tags.join("; "), i.accountManager, i.createdAt.slice(0, 10)].map(esc).join(","));
  }
  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="lumen-investors-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
