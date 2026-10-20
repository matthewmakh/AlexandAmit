import { getStore } from "@/lib/data/store";

/** CSV export of the audit log. Real build: scoped by role, logged as an audit event itself. */
export async function GET() {
  const s = getStore();
  const esc = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
  const lines = [
    ["id", "at", "actor", "role", "action", "subject", "detail"].join(","),
    ...s.audit.map((a) => [a.id, a.at, a.actor, a.role, a.action, a.subject, a.detail].map(esc).join(",")),
  ];
  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="farkas-audit-${s.now.slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
