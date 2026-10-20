import { getStore } from "@/lib/data/store";
import { funnel, funnelBySource, funnelByDevice, raiseSummary } from "@/lib/data/derive";
import { money, number, pct } from "@/lib/data/format";
import { PageHeader } from "@/components/dashboard/Shell";
import { Card, CardHeader } from "@/components/ui/Card";
import { Funnel, BarRows } from "@/components/charts/Bars";
import { Table, Th, Td } from "@/components/dashboard/Table";
import { Tile } from "@/components/dashboard/Tile";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage({ searchParams }: PageProps<"/issuer/analytics">) {
  const sp = await searchParams;
  const s = getStore();
  const spend = Number(sp.spend) > 0 ? Number(sp.spend) : s.traffic.adSpend;
  const steps = funnel();
  const bySource = funnelBySource();
  const byDevice = funnelByDevice();
  const r = raiseSummary();
  const funded = steps[steps.length - 1].count;
  const overall = steps[0].count ? funded / steps[0].count : 0;

  return (
    <>
      <PageHeader title="Conversion analytics" subtitle="Visit → started application → verification → signature → payment → issuance, with drop-off by step, campaign source and device." />

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Tile label="Visits" value={number(steps[0].count)} hint="offering page, 60 days" />
        <Tile label="Started" value={number(steps[1].count)} hint={`${pct(steps[1].count / steps[0].count, 1)} of visits`} />
        <Tile label="Funded investors" value={number(funded)} hint={`${pct(overall, 2)} visit-to-funded`} href="/issuer/orders?metric=issued" accent="var(--color-green)" />
        <Tile label="Cost per funded investor" value={money(Math.round(spend / Math.max(1, funded)))} hint={`${money(spend)} spend provided`} />
      </div>

      <Card className="mb-6">
        <CardHeader title="Funnel" subtitle="Counts at each step; log scale so later steps stay readable" />
        <Funnel steps={steps} />
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[560px] text-[13px]">
            <thead>
              <tr>
                <Th>Step</Th>
                <Th align="right">Count</Th>
                <Th align="right">Step rate</Th>
                <Th align="right">Drop-off</Th>
                <Th align="right">Cumulative</Th>
              </tr>
            </thead>
            <tbody>
              {steps.map((st, i) => {
                const prev = i ? steps[i - 1].count : st.count;
                return (
                  <tr key={st.key}>
                    <Td className="font-medium">{st.label}</Td>
                    <Td align="right" mono>{number(st.count)}</Td>
                    <Td align="right" mono>{i ? pct(st.count / prev) : "—"}</Td>
                    <Td align="right" mono className={i && prev - st.count > prev * 0.6 ? "text-orange" : "text-ink-3"}>{i ? `−${number(prev - st.count)}` : "—"}</Td>
                    <Td align="right" mono>{pct(st.count / steps[0].count, 2)}</Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardHeader title="By campaign source" subtitle="UTM source on first visit" />
          <Table>
            <thead>
              <tr>
                <Th>Source</Th>
                <Th align="right">Visits</Th>
                <Th align="right">Started</Th>
                <Th align="right">Funded</Th>
                <Th align="right">Visit → funded</Th>
                <Th align="right">Committed</Th>
              </tr>
            </thead>
            <tbody>
              {bySource.map((row) => (
                <tr key={row.source}>
                  <Td className="font-medium">{row.source}</Td>
                  <Td align="right" mono>{number(row.visits)}</Td>
                  <Td align="right" mono>{number(row.started)}</Td>
                  <Td align="right" mono>{row.funded}</Td>
                  <Td align="right" mono>{row.visits ? pct(row.funded / row.visits, 2) : "—"}</Td>
                  <Td align="right" mono className="font-medium">{money(row.committed)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="By device" subtitle="Where investors start and finish" />
            <BarRows rows={byDevice.map((d) => ({ label: d.device, value: d.visits, hint: `${d.funded} funded` }))} />
          </Card>
          <Card>
            <CardHeader title="Spend" subtitle="Provided by marketing; drives cost per funded investor" />
            <form method="get" className="flex items-center gap-2">
              <label className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-ink-4">$</span>
                <input name="spend" type="number" defaultValue={spend} className="h-10 w-full rounded-full bg-canvas pl-7 pr-3 text-[14px] tabular ring-hair focus-ring" />
              </label>
              <button className="h-10 rounded-full bg-ink px-4 text-[13px] font-medium text-white" style={{ color: "#fff" }}>Update</button>
            </form>
            <div className="mt-4 space-y-2 text-[13px] text-ink-3">
              <div className="flex justify-between"><span>Cost per started application</span><span className="tabular text-ink">{money(Math.round(spend / Math.max(1, steps[1].count)))}</span></div>
              <div className="flex justify-between"><span>Cost per funded investor</span><span className="tabular text-ink">{money(Math.round(spend / Math.max(1, funded)))}</span></div>
              <div className="flex justify-between"><span>Spend as % of cleared</span><span className="tabular text-ink">{pct(spend / Math.max(1, r.cleared), 1)}</span></div>
            </div>
            <p className="mt-4 flex items-start gap-2 text-[12px] text-ink-4"><Icon name="info" size={14} className="mt-0.5 shrink-0" /> Reported only when spend data is provided; connect ad accounts later for automatic attribution.</p>
          </Card>
        </div>
      </div>
    </>
  );
}
