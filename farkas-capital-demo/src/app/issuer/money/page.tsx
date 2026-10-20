import Link from "next/link";
import { getStore } from "@/lib/data/store";
import { raiseSummary, reconciliation, transferAgentSync } from "@/lib/data/derive";
import { money, number, date, dateTime } from "@/lib/data/format";
import { PageHeader } from "@/components/dashboard/Shell";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge, type Tone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Tile } from "@/components/dashboard/Tile";
import { Table, Th, Td } from "@/components/dashboard/Table";

export const dynamic = "force-dynamic";

const STATE_TONE: Record<string, Tone> = { matched: "green", exception: "orange", returned: "red", pending: "blue", refunded: "neutral" };

export default function MoneyPage() {
  const s = getStore();
  const o = s.offerings[0];
  const r = raiseSummary();
  const recon = reconciliation();
  const ta = transferAgentSync();
  const exceptions = recon.filter((x) => x.state === "exception" || x.state === "returned" || x.state === "refunded");

  return (
    <>
      <PageHeader
        title="Money and ownership"
        subtitle="Payment reconciliation, refunds and exceptions, gross-to-net, escrow release and transfer-agent sync. Requests and approvals are separate permissions."
        actions={
          <>
            <Button size="sm" variant="secondary"><Icon name="download" size={14} /> Closing report</Button>
            <Button size="sm" variant="secondary"><Icon name="download" size={14} /> Shareholder report</Button>
          </>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Tile label="Cleared in escrow" value={money(r.cleared - r.released)} hint={`for the ${date(o.nextClosingAt)} closing`} href="/issuer/orders?metric=cleared" accent="var(--color-blue)" />
        <Tile label="Released" value={money(r.released)} hint="first closing, Oct 1" href="/issuer/orders?metric=released" accent="var(--color-green)" />
        <Tile label="Net proceeds" value={money(r.netProceeds)} hint="after placement, platform and rail fees" />
        <Tile label="Exceptions" value={String(exceptions.length)} hint="returns, refunds, variances" accent={exceptions.length ? "var(--color-orange)" : undefined} />
      </div>

      <div className="mb-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader title="Gross to net" subtitle="On cleared funds" />
          <dl className="space-y-2.5 text-[14px]">
            <R k="Gross cleared" v={money(r.cleared)} strong />
            <R k={`Placement fee · ${(o.placementFeeBps / 100).toFixed(1)}% · Farkas Capital`} v={`− ${money(r.placementFees)}`} />
            <R k={`Platform fee · ${(o.platformFeeBps / 100).toFixed(1)}%`} v={`− ${money(r.platformFees)}`} />
            <R k="Rail fees · ACH, wire, stablecoin conversion" v={`− ${money(r.railFees)}`} />
            <div className="border-t border-line-2 pt-2.5"><R k="Net proceeds to issuer" v={money(r.netProceeds)} strong /></div>
          </dl>
        </Card>
        <Card>
          <CardHeader title="Transfer-agent sync" subtitle="Kore · nightly reconciliation" action={<Badge tone={ta.mismatched ? "orange" : "green"} dot>{ta.mismatched ? `${ta.mismatched} mismatched` : "In sync"}</Badge>} />
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="rounded-2xl bg-canvas p-4"><div className="text-[24px] font-semibold tabular">{ta.matched}</div><div className="text-[12px] text-ink-4">holdings matched</div></div>
            <div className="rounded-2xl bg-canvas p-4"><div className="text-[24px] font-semibold tabular">{ta.pending}</div><div className="text-[12px] text-ink-4">pending issuance</div></div>
            <div className="rounded-2xl bg-canvas p-4"><div className="text-[24px] font-semibold tabular text-orange">{ta.mismatched}</div><div className="text-[12px] text-ink-4">name mismatches</div></div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[13px] text-ink-3">
            <span>Last run {dateTime(ta.lastRun)} · {number(r.sharesIssued)} shares on the register</span>
            <Link href="/issuer/actions?type=ta_mismatch" className="font-medium text-blue hover:underline">Review mismatches</Link>
          </div>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader title="Refunds and exceptions" subtitle="Each needs a request and a separate approval" action={<Button size="sm" variant="secondary"><Icon name="plus" size={14} /> Request refund</Button>} />
        {exceptions.length ? (
          <Table>
            <thead><tr><Th>Investor</Th><Th>Provider ref</Th><Th>Method</Th><Th align="right">Internal</Th><Th align="right">Provider</Th><Th align="right">Variance</Th><Th>State</Th><Th>Detail</Th></tr></thead>
            <tbody>
              {exceptions.map((x) => (
                <tr key={x.payment.id}>
                  <Td><Link href={`/issuer/investors/${x.investor.id}`} className="font-medium hover:text-blue">{x.investor.owner.registeredName}</Link></Td>
                  <Td mono className="text-ink-3">{x.payment.providerRef}</Td>
                  <Td>{x.payment.method.toUpperCase()}</Td>
                  <Td align="right" mono>{money(x.payment.amount)}</Td>
                  <Td align="right" mono>{money(x.payment.providerAmount)}</Td>
                  <Td align="right" mono className={x.variance ? "font-medium text-orange" : "text-ink-4"}>{x.variance ? money(x.variance) : "—"}</Td>
                  <Td><Badge tone={STATE_TONE[x.state]} dot>{x.state}</Badge></Td>
                  <Td className="text-[13px] text-ink-3">{x.payment.returnCode ?? (x.state === "refunded" ? `Refunded ${date(x.payment.refundedAt!)}` : "Provider amount differs; bank fee deducted in transit")}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : <div className="text-[13px] text-ink-4">No exceptions.</div>}
      </Card>

      <Card>
        <CardHeader title="Payment reconciliation" subtitle={`${recon.length} payments · provider records vs internal`} action={<Button size="sm" variant="secondary"><Icon name="download" size={14} /> Export</Button>} />
        <Table>
          <thead><tr><Th>Initiated</Th><Th>Investor</Th><Th>Order</Th><Th>Method</Th><Th>Provider ref</Th><Th align="right">Amount</Th><Th align="right">Rail fee</Th><Th>Cleared</Th><Th>State</Th></tr></thead>
          <tbody>
            {recon.map((x) => (
              <tr key={x.payment.id}>
                <Td className="text-ink-3">{date(x.payment.initiatedAt)}</Td>
                <Td><Link href={`/issuer/investors/${x.investor.id}`} className="font-medium hover:text-blue">{x.investor.owner.registeredName}</Link></Td>
                <Td mono className="text-ink-3">{x.order.id}</Td>
                <Td>{x.payment.method === "stablecoin" ? `${x.payment.coin} · ${x.payment.network}` : x.payment.method.toUpperCase()}</Td>
                <Td mono className="text-ink-3">{x.payment.providerRef}</Td>
                <Td align="right" mono className="font-medium">{money(x.payment.amount)}</Td>
                <Td align="right" mono className="text-ink-3">{money(x.payment.railFee, true)}</Td>
                <Td className="text-ink-3">{x.payment.clearedAt ? date(x.payment.clearedAt) : "—"}</Td>
                <Td><Badge tone={STATE_TONE[x.state]} dot>{x.state}</Badge></Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </>
  );
}

function R({ k, v, strong = false }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={strong ? "font-medium" : "text-ink-3"}>{k}</dt>
      <dd className={`tabular ${strong ? "text-[16px] font-semibold" : ""}`}>{v}</dd>
    </div>
  );
}
