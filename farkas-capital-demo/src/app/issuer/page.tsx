import Link from "next/link";
import { getStore } from "@/lib/data/store";
import { raiseSummary, dailySeries, cumulative, actionItems, STATUS_LABEL } from "@/lib/data/derive";
import { money, moneyCompact, pct, number, date, dateTime } from "@/lib/data/format";
import { PageHeader } from "@/components/dashboard/Shell";
import { Tile, Segmented } from "@/components/dashboard/Tile";
import { Card, CardHeader } from "@/components/ui/Card";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { StackedBar, BarRows } from "@/components/charts/Bars";
import { ORDER_TONE, Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import type { OrderStatus } from "@/lib/data/types";

export const dynamic = "force-dynamic";

export default async function OverviewPage({ searchParams }: PageProps<"/issuer">) {
  const sp = await searchParams;
  const range = (typeof sp.range === "string" ? sp.range : "30") as "7" | "30" | "60";
  const days = range === "7" ? 7 : range === "60" ? 60 : 30;
  const s = getStore();
  const offering = s.offerings[0];
  const r = raiseSummary();
  const series = dailySeries(days);
  const labels = series.map((p) => date(p.date, "short"));
  const actions = actionItems();

  const statusOrder: OrderStatus[] = ["issued", "accepted", "payment_cleared", "payment_pending", "awaiting_payment", "awaiting_signature", "verifying", "started", "check_failed", "refunded", "cancelled"];

  return (
    <>
      <PageHeader
        eyebrow={`${offering.name} · ${offering.exemption}`}
        title="Raise overview"
        subtitle={`${money(r.committed)} committed of ${money(offering.targetAmount)}. Next closing ${date(offering.nextClosingAt)}. Clock ${dateTime(s.now)}.`}
        actions={
          <>
            <div className="inline-flex h-9 items-center gap-2 rounded-full bg-paper px-3.5 text-[13px] ring-hair">
              <Icon name="filter" size={14} className="text-ink-4" />
              <span className="text-ink-3">Offering</span>
              <span className="font-medium">{offering.name}</span>
              <Icon name="chevron-down" size={13} className="text-ink-4" />
            </div>
            <Segmented
              value={range}
              options={[
                { key: "7", label: "7d", href: "/issuer?range=7" },
                { key: "30", label: "30d", href: "/issuer?range=30" },
                { key: "60", label: "60d", href: "/issuer?range=60" },
              ]}
            />
          </>
        }
      />

      {/* Progress */}
      <Card className="mb-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-[13px] font-medium text-ink-3">Committed vs target</div>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="text-display-md tabular">{money(r.committed)}</span>
              <span className="text-[15px] text-ink-4">/ {money(offering.targetAmount)}</span>
            </div>
          </div>
          <div className="flex gap-8 text-[13px]">
            <div>
              <div className="text-ink-4">Progress</div>
              <div className="text-[20px] font-semibold tabular">{pct(r.progress)}</div>
            </div>
            <div>
              <div className="text-ink-4">Investors committed</div>
              <div className="text-[20px] font-semibold tabular">{r.investorsCommitted}</div>
            </div>
            <div>
              <div className="text-ink-4">Funded investors</div>
              <div className="text-[20px] font-semibold tabular">{r.investorsFunded}</div>
            </div>
            <div>
              <div className="text-ink-4">Open actions</div>
              <Link href="/issuer/actions" className="text-[20px] font-semibold tabular text-orange hover:underline">{actions.length}</Link>
            </div>
          </div>
        </div>
        <StackedBar
          className="mt-6"
          total={offering.targetAmount}
          segments={[
            { label: `Released ${moneyCompact(r.released)}`, value: r.released, color: "var(--color-green)" },
            { label: `Cleared in escrow ${moneyCompact(r.cleared - r.released)}`, value: Math.max(0, r.cleared - r.released), color: "var(--color-blue)" },
            { label: `Received, not cleared ${moneyCompact(r.received - r.cleared)}`, value: Math.max(0, r.received - r.cleared), color: "#5ea0ff" },
            { label: `Signed, unpaid ${moneyCompact(r.committed - r.received)}`, value: Math.max(0, r.committed - r.received), color: "var(--color-orange)" },
          ]}
        />
      </Card>

      {/* KPI tiles */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <Tile label="Target" value={moneyCompact(r.target)} hint={`closes ${date(offering.closesAt)}`} />
        <Tile label="Committed" value={moneyCompact(r.committed)} hint={`${r.counts.awaiting_payment + r.counts.payment_pending + r.counts.payment_cleared + r.counts.accepted + r.counts.issued} signed orders`} href="/issuer/orders?metric=committed" />
        <Tile label="Received" value={moneyCompact(r.received)} hint="payment submitted" href="/issuer/orders?metric=received" />
        <Tile label="Cleared" value={moneyCompact(r.cleared)} hint="in escrow or released" href="/issuer/orders?metric=cleared" accent="var(--color-blue)" />
        <Tile label="Refunded" value={moneyCompact(r.refunded)} hint={`${r.counts.refunded} orders`} href="/issuer/orders?metric=refunded" accent={r.refunded ? "var(--color-red)" : undefined} />
        <Tile label="Released" value={moneyCompact(r.released)} hint="first closing, Oct 1" href="/issuer/orders?metric=released" accent="var(--color-green)" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        {/* Trend */}
        <Card>
          <CardHeader title="Daily trend" subtitle={`Cumulative over the last ${days} days`} action={<Link href="/issuer/orders?metric=committed" className="text-[13px] font-medium text-blue hover:underline">Open orders</Link>} />
          <TrendChart
            labels={labels}
            series={[
              { key: "committed", label: "Committed", color: "#ff9f0a", values: cumulative(series, "committed").map((p) => p.value) },
              { key: "received", label: "Received", color: "#5ea0ff", values: cumulative(series, "received").map((p) => p.value) },
              { key: "cleared", label: "Cleared", color: "#0071e3", values: cumulative(series, "cleared").map((p) => p.value) },
            ]}
          />
          <div className="mt-4 grid grid-cols-3 gap-3 text-[12px] text-ink-3">
            <div><span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#ff9f0a]" />Committed in range: <span className="font-medium text-ink tabular">{money(series.reduce((a, p) => a + p.committed, 0))}</span></div>
            <div><span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#5ea0ff]" />Received: <span className="font-medium text-ink tabular">{money(series.reduce((a, p) => a + p.received, 0))}</span></div>
            <div><span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#0071e3]" />Cleared: <span className="font-medium text-ink tabular">{money(series.reduce((a, p) => a + p.cleared, 0))}</span></div>
          </div>
        </Card>

        {/* Fees */}
        <Card>
          <CardHeader title="Fees and net proceeds" subtitle="On cleared funds" action={<Link href="/issuer/money" className="text-[13px] font-medium text-blue hover:underline">Report</Link>} />
          <dl className="space-y-3 text-[14px]">
            <Row k="Gross cleared" v={money(r.cleared)} strong />
            <Row k={`Placement fee (${(offering.placementFeeBps / 100).toFixed(1)}%)`} v={`− ${money(r.placementFees)}`} />
            <Row k={`Platform fee (${(offering.platformFeeBps / 100).toFixed(1)}%)`} v={`− ${money(r.platformFees)}`} />
            <Row k="Payment rail fees" v={`− ${money(r.railFees)}`} />
            <div className="border-t border-line-2 pt-3">
              <Row k="Net proceeds" v={money(r.netProceeds)} strong accent />
            </div>
          </dl>
          <div className="mt-6 rounded-2xl bg-canvas p-4 text-[13px] text-ink-3">
            <div className="flex items-center gap-2 font-medium text-ink"><Icon name="lock" size={14} /> Escrow</div>
            {money(r.cleared - r.released)} remains in escrow for the {date(offering.nextClosingAt)} closing. {money(r.released)} was released on Oct 1.
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader title="Orders by status" subtitle={`${s.orders.length} orders in total`} action={<Link href="/issuer/investors" className="text-[13px] font-medium text-blue hover:underline">Investor CRM</Link>} />
          <BarRows
            rows={statusOrder.map((st) => ({ label: <Badge tone={ORDER_TONE[st]} dot>{STATUS_LABEL[st]}</Badge>, value: r.counts[st], hint: moneyCompact(s.orders.filter((o) => o.status === st).reduce((a, o) => a + o.amount, 0)) }))}
            format={(v) => `${v}`}
          />
        </Card>
        <Card>
          <CardHeader title="Needs attention" subtitle={`${actions.length} open items`} action={<Link href="/issuer/actions" className="text-[13px] font-medium text-blue hover:underline">Action center</Link>} />
          <ul className="divide-y divide-line-2">
            {actions.slice(0, 6).map((a) => (
              <li key={a.id}>
                <Link href={`/issuer/investors/${a.investorId}`} className="flex items-center justify-between gap-3 py-3 hover:bg-canvas -mx-2 px-2 rounded-xl">
                  <div className="min-w-0">
                    <div className="truncate text-[14px] font-medium">{a.title}</div>
                    <div className="truncate text-[12px] text-ink-4">{a.nextAction}</div>
                  </div>
                  <Badge tone={a.severity === "high" ? "red" : "orange"}>{a.severity}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Tile label="Shares issued" value={number(r.sharesIssued)} hint="confirmed by transfer agent" href="/issuer/orders?metric=issued" />
        <Tile label="Shares pending" value={number(r.sharesPending)} hint="accepted, next closing" href="/issuer/orders?metric=pending" />
        <Tile label="Avg. ticket" value={money(Math.round(r.committed / Math.max(1, r.investorsCommitted)))} hint="committed per investor" />
        <Tile label="Price per share" value={money(offering.pricePerShare, true)} hint={`terms v${offering.termsVersions.find((t) => t.status === "published")?.version}`} href="/issuer/offering" />
      </div>
    </>
  );
}

function Row({ k, v, strong = false, accent = false }: { k: string; v: string; strong?: boolean; accent?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={strong ? "font-medium" : "text-ink-3"}>{k}</dt>
      <dd className={`tabular ${strong ? "text-[16px] font-semibold" : ""} ${accent ? "text-green" : ""}`}>{v}</dd>
    </div>
  );
}
