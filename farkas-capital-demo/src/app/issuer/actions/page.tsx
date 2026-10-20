import Link from "next/link";
import { actionItems } from "@/lib/data/derive";
import { ageDays } from "@/lib/data/format";
import { PageHeader } from "@/components/dashboard/Shell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Empty } from "@/components/dashboard/Table";
import type { ActionType } from "@/lib/data/types";

export const dynamic = "force-dynamic";

const TYPE_META: Record<ActionType, { label: string; icon: Parameters<typeof Icon>[0]["name"]; blurb: string }> = {
  failed_check: { label: "Failed checks", icon: "shield", blurb: "KYC, AML or accreditation did not clear" },
  missing_document: { label: "Missing documents", icon: "doc", blurb: "Cannot sign until a document is on file" },
  unpaid_order: { label: "Unpaid orders", icon: "cash", blurb: "Signed three or more days ago, no payment" },
  return: { label: "Returns", icon: "refresh", blurb: "Payments returned by the rail" },
  ta_mismatch: { label: "Transfer-agent mismatches", icon: "building", blurb: "Registered name differs from the register" },
};
const ORDER: ActionType[] = ["failed_check", "return", "unpaid_order", "missing_document", "ta_mismatch"];

export default async function ActionsPage({ searchParams }: PageProps<"/issuer/actions">) {
  const sp = await searchParams;
  const type = typeof sp.type === "string" ? sp.type : "";
  const owner = typeof sp.owner === "string" ? sp.owner : "";
  const all = actionItems();
  const owners = Array.from(new Set(all.map((a) => a.owner)));
  const items = all.filter((a) => (!type || a.type === type) && (!owner || a.owner === owner));
  const groups = ORDER.map((t) => ({ type: t, items: items.filter((a) => a.type === t) })).filter((g) => g.items.length);

  const chip = (active: boolean) => `rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${active ? "bg-ink text-white" : "bg-paper text-ink-2 ring-hair hover:bg-canvas-2"}`;
  const q = (t: string, o: string) => `/issuer/actions?${new URLSearchParams({ ...(t ? { type: t } : {}), ...(o ? { owner: o } : {}) }).toString()}`;

  return (
    <>
      <PageHeader
        title="Action center"
        subtitle="What needs attention, with an owner, an age and a next action. Each item opens the investor; the investor page reaches them in one more click."
        actions={<Badge tone={items.some((i) => i.severity === "high") ? "red" : "orange"} dot>{items.length} open</Badge>}
      />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Link href={q("", owner)} className={chip(!type)}>All types</Link>
        {ORDER.map((t) => (
          <Link key={t} href={q(t, owner)} className={chip(type === t)}>
            {TYPE_META[t].label} <span className="ml-1 opacity-60">{all.filter((a) => a.type === t).length}</span>
          </Link>
        ))}
        <span className="mx-1 h-5 w-px bg-line" />
        <Link href={q(type, "")} className={chip(!owner)}>Any owner</Link>
        {owners.map((o) => (
          <Link key={o} href={q(type, o)} className={chip(owner === o)}>{o}</Link>
        ))}
      </div>

      {groups.length ? (
        <div className="space-y-6">
          {groups.map((g) => {
            const meta = TYPE_META[g.type];
            return (
              <Card key={g.type} padded={false}>
                <div className="flex items-center justify-between gap-4 px-6 pt-5 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-canvas text-ink-2"><Icon name={meta.icon} size={17} /></span>
                    <div>
                      <div className="text-[16px] font-semibold">{meta.label}</div>
                      <div className="text-[12px] text-ink-4">{meta.blurb}</div>
                    </div>
                  </div>
                  <span className="text-[13px] text-ink-3">{g.items.length}</span>
                </div>
                <ul className="divide-y divide-line-2">
                  {g.items.map((a) => (
                    <li key={a.id}>
                      <Link href={`/issuer/investors/${a.investorId}`} className="grid gap-2 px-6 py-4 transition-colors hover:bg-canvas sm:grid-cols-[1fr_auto] sm:items-center">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <Badge tone={a.severity === "high" ? "red" : a.severity === "medium" ? "orange" : "neutral"}>{a.severity}</Badge>
                            <span className="truncate text-[15px] font-medium">{a.title}</span>
                          </div>
                          <div className="mt-1 text-[13px] text-ink-3">{a.detail}</div>
                          <div className="mt-1.5 flex items-center gap-1.5 text-[13px] text-blue"><Icon name="arrow-right" size={13} /> {a.nextAction}</div>
                        </div>
                        <div className="flex items-center gap-5 text-[12px] text-ink-4 sm:flex-col sm:items-end sm:gap-1">
                          <span><span className="text-ink-3">Owner</span> <span className="font-medium text-ink">{a.owner}</span></span>
                          <span className={ageDays(a.openedAt) >= 7 ? "font-medium text-red" : ""}>{ageDays(a.openedAt)}d open</span>
                          {a.orderId ? <span className="tabular">{a.orderId}</span> : null}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      ) : (
        <Empty title="Nothing needs attention" hint="Failed checks, missing documents, unpaid orders, returns and transfer-agent mismatches land here." />
      )}
    </>
  );
}
