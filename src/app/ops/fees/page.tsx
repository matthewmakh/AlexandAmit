import { getStore } from "@/lib/data/store";
import { raiseSummary } from "@/lib/data/derive";
import { money, date, moneyCompact } from "@/lib/data/format";
import { OpsHeader, OpsCard, OpsCardTitle, OpsTable, Td, DarkBadge, OpsStat } from "@/components/ops/ui";

export const dynamic = "force-dynamic";

export default function OpsFees() {
  const s = getStore();
  const o = s.offerings[0];
  const r = raiseSummary();
  const rows = [
    { label: "Gross cleared proceeds", value: r.cleared, note: "payments cleared into escrow" },
    { label: `Placement fee (${(o.placementFeeBps / 100).toFixed(1)}%)`, value: -r.placementFees, note: "Farkas Capital, broker-dealer" },
    { label: `Platform fee (${(o.platformFeeBps / 100).toFixed(1)}%)`, value: -r.platformFees, note: "platform operations" },
    { label: "Rail fees (pass-through)", value: -r.railFees, note: "ACH, wire and stablecoin conversion" },
  ];
  const invoices = [
    { period: "First closing", date: o.firstClosingAt, amount: Math.round((r.released * (o.placementFeeBps + o.platformFeeBps)) / 10_000), status: "Paid", tone: "green" as const },
    { period: "Second closing", date: o.nextClosingAt, amount: Math.round(((r.cleared - r.released) * (o.placementFeeBps + o.platformFeeBps)) / 10_000), status: "Accruing", tone: "gold" as const },
    { period: "Final closing", date: o.closesAt, amount: 0, status: "Scheduled", tone: "neutral" as const },
  ];

  return (
    <>
      <OpsHeader eyebrow="Fees" title="Gross to net" lede="Fees are computed from cleared payments only and invoiced at each closing. The platform never holds investor money in its own operating account." />

      <div className="grid gap-3 sm:grid-cols-3">
        <OpsStat label="Fees accrued to date" value={moneyCompact(r.placementFees + r.platformFees)} hint="Lumen Robotics" tone="gold" />
        <OpsStat label="Net to issuer (cleared)" value={moneyCompact(r.netProceeds)} hint="after all fees" />
        <OpsStat label="Released so far" value={moneyCompact(r.released)} hint={`first closing · ${date(o.firstClosingAt)}`} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <OpsCard>
          <OpsCardTitle title="Lumen Robotics · Series A Direct Offering" hint="Gross-to-net on cleared funds" />
          <OpsTable head={["Line", "Amount", "Note"]}>
            {rows.map((x) => (
              <tr key={x.label}>
                <Td>{x.label}</Td>
                <Td className={`tabular ${x.value < 0 ? "text-white/70" : "font-medium"}`}>{x.value < 0 ? `(${money(-x.value)})` : money(x.value)}</Td>
                <Td muted>{x.note}</Td>
              </tr>
            ))}
            <tr className="border-t border-white/[0.15]">
              <Td className="font-semibold">Net proceeds</Td>
              <Td className="tabular font-semibold text-gold">{money(r.netProceeds)}</Td>
              <Td muted>released per offering instructions at closing</Td>
            </tr>
          </OpsTable>
        </OpsCard>

        <OpsCard>
          <OpsCardTitle title="Invoice schedule" hint="Per closing" />
          <ul className="divide-y divide-white/[0.07]">
            {invoices.map((i) => (
              <li key={i.period} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <div className="text-[14px] font-medium">{i.period}</div>
                  <div className="text-[12px] text-white/45">{date(i.date)}</div>
                </div>
                <div className="text-right">
                  <div className="tabular text-[14px]">{i.amount ? money(i.amount) : "—"}</div>
                  <DarkBadge tone={i.tone} dot>{i.status}</DarkBadge>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[12px] text-white/40">Refunded subscriptions carry no fee. Returned payments are excluded until they clear.</p>
        </OpsCard>
      </div>
    </>
  );
}
