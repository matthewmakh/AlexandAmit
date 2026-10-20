import Link from "next/link";
import { investorRows, STATUS_LABEL } from "@/lib/data/derive";
import { money, number, date } from "@/lib/data/format";
import { daysAgo } from "@/lib/data/clock";
import { PageHeader } from "@/components/dashboard/Shell";
import { Card } from "@/components/ui/Card";
import { Table, Th, Td, Empty } from "@/components/dashboard/Table";
import { OrderBadge, Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { OrderStatus } from "@/lib/data/types";

export const dynamic = "force-dynamic";

const VIEWS: { key: string; label: string; query: string }[] = [
  { key: "all", label: "All", query: "" },
  { key: "attention", label: "Needs attention", query: "attention=1" },
  { key: "funded", label: "Funded", query: "status=issued" },
  { key: "large", label: "Large tickets", query: "tag=Large+ticket" },
  { key: "entities", label: "Entities & trusts", query: "owner=entity" },
  { key: "new", label: "New this week", query: "new=1" },
];

export default async function InvestorsPage({ searchParams }: PageProps<"/issuer/investors">) {
  const sp = await searchParams;
  const q = (typeof sp.q === "string" ? sp.q : "").trim().toLowerCase();
  const status = typeof sp.status === "string" ? sp.status : "";
  const accreditation = typeof sp.accreditation === "string" ? sp.accreditation : "";
  const tag = typeof sp.tag === "string" ? sp.tag : "";
  const owner = typeof sp.owner === "string" ? sp.owner : "";
  const attention = sp.attention === "1";
  const fresh = sp.new === "1";
  const weekAgo = daysAgo(7);

  const all = investorRows();
  const rows = all.filter((r) => {
    const i = r.investor;
    if (q && !`${i.firstName} ${i.lastName} ${i.email} ${i.owner.registeredName}`.toLowerCase().includes(q)) return false;
    if (status && r.latestStatus !== status) return false;
    if (accreditation && i.verification.accreditation !== accreditation) return false;
    if (tag && !i.tags.includes(tag)) return false;
    if (owner === "entity" && i.owner.ownerType === "individual") return false;
    if (owner === "individual" && i.owner.ownerType !== "individual") return false;
    if (attention && !r.openActions) return false;
    if (fresh && i.createdAt < weekAgo) return false;
    return true;
  });

  const current = new URLSearchParams(Object.entries(sp).filter(([, v]) => typeof v === "string") as [string, string][]).toString();
  const activeView = VIEWS.find((v) => v.query === current)?.key ?? (current ? "custom" : "all");
  const tags = Array.from(new Set(all.flatMap((r) => r.investor.tags))).sort();
  const sel = "h-9 rounded-full bg-paper pl-3 pr-8 text-[13px] ring-hair appearance-none";

  return (
    <>
      <PageHeader
        title="Investor CRM"
        subtitle={`${all.length} investors · ${rows.length} shown`}
        actions={
          <>
            <Button variant="secondary" size="sm" href={`/issuer/investors/export?${current}`} external>
              <Icon name="download" size={14} /> Export CSV
            </Button>
            <Button size="sm" href="/issuer/relations">
              <Icon name="mail" size={14} /> Email a group
            </Button>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {VIEWS.map((v) => (
          <Link key={v.key} href={`/issuer/investors${v.query ? `?${v.query}` : ""}`} className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${activeView === v.key ? "bg-ink text-white" : "bg-paper text-ink-2 ring-hair hover:bg-canvas-2"}`}>
            {v.label}
          </Link>
        ))}
        {activeView === "custom" ? <Badge tone="blue">Custom view · <Link href="/issuer/investors" className="underline">clear</Link></Badge> : null}
      </div>

      <form className="mb-5 flex flex-wrap items-center gap-2" method="get">
        <label className="relative">
          <Icon name="search" size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-4" />
          <input name="q" defaultValue={q} placeholder="Search name, email, entity" className="h-9 w-64 rounded-full bg-paper pl-9 pr-3 text-[13px] ring-hair placeholder:text-ink-4 focus-ring" />
        </label>
        <div className="relative">
          <select name="status" defaultValue={status} className={sel}>
            <option value="">Any status</option>
            {(Object.keys(STATUS_LABEL) as OrderStatus[]).map((s) => (
              <option key={s} value={s}>{STATUS_LABEL[s]}</option>
            ))}
          </select>
          <Icon name="chevron-down" size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-4" />
        </div>
        <div className="relative">
          <select name="accreditation" defaultValue={accreditation} className={sel}>
            <option value="">Any accreditation</option>
            <option value="clear">Verified</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <Icon name="chevron-down" size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-4" />
        </div>
        <div className="relative">
          <select name="tag" defaultValue={tag} className={sel}>
            <option value="">Any tag</option>
            {tags.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <Icon name="chevron-down" size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-4" />
        </div>
        <div className="relative">
          <select name="owner" defaultValue={owner} className={sel}>
            <option value="">Any owner type</option>
            <option value="individual">Individuals</option>
            <option value="entity">Entities & trusts</option>
          </select>
          <Icon name="chevron-down" size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-4" />
        </div>
        <button className="h-9 rounded-full bg-ink px-4 text-[13px] font-medium text-white" style={{ color: "#fff" }}>Apply</button>
      </form>

      <Card padded={false} className="px-6">
        {rows.length ? (
          <Table>
            <thead>
              <tr>
                <Th>Investor</Th>
                <Th>Owner</Th>
                <Th>Latest status</Th>
                <Th align="right">Committed</Th>
                <Th align="right">Shares</Th>
                <Th>Tags</Th>
                <Th>Manager</Th>
                <Th align="right">Actions</Th>
                <Th align="right">Last active</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const i = r.investor;
                return (
                  <tr key={i.id} className="group">
                    <Td>
                      <Link href={`/issuer/investors/${i.id}`} className="flex items-center gap-3">
                        <Avatar first={i.firstName} last={i.lastName} size={32} />
                        <span className="min-w-0">
                          <span className="block truncate font-medium group-hover:text-blue">{i.firstName} {i.lastName}</span>
                          <span className="block truncate text-[12px] text-ink-4">{i.email}</span>
                        </span>
                      </Link>
                    </Td>
                    <Td>
                      <span className="block text-[13px]">{i.owner.registeredName}</span>
                      <span className="text-[11px] uppercase tracking-wider text-ink-4">{i.owner.ownerType}</span>
                    </Td>
                    <Td><OrderBadge status={r.latestStatus} /></Td>
                    <Td align="right" mono className="font-medium">{r.committed ? money(r.committed) : <span className="text-ink-4">—</span>}</Td>
                    <Td align="right" mono>
                      {r.sharesIssued ? number(r.sharesIssued) : <span className="text-ink-4">—</span>}
                      {r.sharesPending ? <span className="block text-[11px] text-ink-4">+{number(r.sharesPending)} pending</span> : null}
                    </Td>
                    <Td>
                      <span className="flex flex-wrap gap-1">
                        {i.tags.slice(0, 2).map((t) => <Badge key={t}>{t}</Badge>)}
                        {i.tags.length > 2 ? <Badge>+{i.tags.length - 2}</Badge> : null}
                      </span>
                    </Td>
                    <Td className="text-[13px] text-ink-3">{i.accountManager}</Td>
                    <Td align="right">{r.openActions ? <Badge tone="orange">{r.openActions}</Badge> : <span className="text-ink-4">0</span>}</Td>
                    <Td align="right" className="text-[13px] text-ink-3">{date(i.lastActiveAt)}</Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        ) : (
          <div className="py-6"><Empty title="No investors match" hint="Try clearing a filter or a different search." /></div>
        )}
      </Card>
    </>
  );
}
