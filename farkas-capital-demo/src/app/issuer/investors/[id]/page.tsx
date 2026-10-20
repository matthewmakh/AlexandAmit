import Link from "next/link";
import { notFound } from "next/navigation";
import { getStore, getInvestor, ordersForInvestor } from "@/lib/data/store";
import { investorTimeline, actionItems } from "@/lib/data/derive";
import { money, number, date, dateTime } from "@/lib/data/format";
import { PageHeader } from "@/components/dashboard/Shell";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge, CheckBadge, OrderBadge, PaymentBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Timeline } from "@/components/dashboard/Timeline";
import { TagEditor, NoteComposer } from "@/components/dashboard/InvestorTools";

export const dynamic = "force-dynamic";

export default async function InvestorPage({ params }: PageProps<"/issuer/investors/[id]">) {
  const { id } = await params;
  const inv = getInvestor(id);
  if (!inv) notFound();
  const s = getStore();
  const orders = ordersForInvestor(inv.id);
  const actions = actionItems().filter((a) => a.investorId === inv.id);
  const timeline = investorTimeline(inv.id);
  const mismatch = inv.owner.transferAgentName !== inv.owner.registeredName;
  const committed = orders.filter((o) => ["awaiting_payment", "payment_pending", "payment_cleared", "accepted", "issued"].includes(o.status)).reduce((a, o) => a + o.amount, 0);

  return (
    <>
      <PageHeader
        eyebrow={<Link href="/issuer/investors" className="hover:text-ink">← Investor CRM</Link>}
        title={
          <span className="flex items-center gap-4">
            <Avatar first={inv.firstName} last={inv.lastName} size={52} />
            <span>
              {inv.firstName} {inv.lastName}
              <span className="block text-[15px] font-normal text-ink-3">{inv.owner.registeredName} · {inv.owner.ownerType} · {inv.owner.region}, {inv.owner.country}</span>
            </span>
          </span>
        }
        actions={
          <>
            <Button size="sm" href={`mailto:${inv.email}?subject=${encodeURIComponent(`Your Lumen Robotics investment`)}`} external>
              <Icon name="mail" size={14} /> Email investor
            </Button>
            <Button size="sm" variant="secondary" href={`/ops?investor=${inv.id}`}>
              <Icon name="shield" size={14} /> Open in ops
            </Button>
          </>
        }
      />

      {actions.length ? (
        <div className="mb-6 space-y-2">
          {actions.map((a) => (
            <div key={a.id} className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl px-5 py-3 ${a.severity === "high" ? "bg-red-soft" : "bg-orange-soft"}`}>
              <div className="flex items-center gap-3 text-[14px]">
                <Icon name="warning" size={16} className={a.severity === "high" ? "text-red" : "text-orange"} />
                <span className="font-medium">{a.title}</span>
                <span className="text-ink-3">{a.detail}</span>
              </div>
              <span className="text-[13px] text-ink-2"><Icon name="arrow-right" size={13} className="mr-1 inline" />{a.nextAction} · {a.owner}</span>
            </div>
          ))}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              <Fact k="Committed" v={money(committed)} />
              <Fact k="Orders" v={String(orders.length)} />
              <Fact k="Shares issued" v={number(s.holdings.filter((h) => h.investorId === inv.id && h.status === "issued").reduce((a, h) => a + h.shares, 0))} />
              <Fact k="Account manager" v={inv.accountManager} />
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <CheckBadge status={inv.verification.kyc} label="KYC" />
              <CheckBadge status={inv.verification.aml} label="AML" />
              <CheckBadge status={inv.verification.accreditation} label="Accreditation" />
              {inv.walletConsent ? <Badge tone="teal">Wallet consent</Badge> : <Badge>No wallet consent</Badge>}
              {inv.missingDocuments.map((d) => <Badge key={d} tone="orange">Missing: {d}</Badge>)}
            </div>
            {inv.verification.failureReason ? <div className="mt-4 rounded-2xl bg-red-soft p-4 text-[13px] text-[#c4231a]">{inv.verification.failureReason}</div> : null}
            <dl className="mt-6 grid gap-x-8 gap-y-3 text-[14px] sm:grid-cols-2">
              <Row k="Email" v={<a href={`mailto:${inv.email}`} className="text-blue">{inv.email}</a>} />
              <Row k="Phone" v={inv.phone || "—"} />
              <Row k="Registered owner (submitted)" v={inv.owner.registeredName} />
              <Row k="Transfer-agent record" v={<span className={mismatch ? "font-medium text-red" : ""}>{inv.owner.transferAgentName}{mismatch ? " · mismatch" : ""}</span>} />
              <Row k="Accreditation method" v={inv.verification.accreditationMethod} />
              <Row k="Verification ref" v={<span className="tabular">{inv.verification.providerRef}</span>} />
              <Row k="Source" v={`${inv.source.utmSource} · ${inv.source.utmCampaign} · ${inv.source.device}`} />
              <Row k="Created" v={dateTime(inv.createdAt)} />
            </dl>
            <div className="mt-6 border-t border-line-2 pt-5">
              <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.06em] text-ink-4">Tags</div>
              <TagEditor investorId={inv.id} tags={inv.tags} />
            </div>
          </Card>

          {/* Orders */}
          <Card>
            <CardHeader title="Orders, payments and holdings" subtitle="One pass per order" />
            <div className="space-y-4">
              {orders.map((o) => {
                const pay = s.payments.find((p) => p.id === o.paymentId);
                const sig = s.signatures.find((p) => p.id === o.signatureId);
                const hold = s.holdings.find((h) => h.id === o.holdingId);
                const pass = s.passes.find((p) => p.id === o.passId);
                return (
                  <div key={o.id} className="rounded-[20px] bg-canvas p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-[18px] font-semibold tabular">{money(o.amount)}</span>
                        <span className="text-[13px] text-ink-3">{number(o.shares)} shares · {o.id}</span>
                      </div>
                      <OrderBadge status={o.status} />
                    </div>
                    <div className="mt-4 grid gap-3 text-[13px] sm:grid-cols-2 lg:grid-cols-4">
                      <Mini icon="pen" label="Signature" value={sig ? (sig.status === "signed" ? `Signed ${date(sig.signedAt!)}` : sig.status) : "Not sent"} />
                      <Mini icon="bank" label="Payment" value={pay ? <span className="flex items-center gap-2">{pay.method.toUpperCase()} <PaymentBadge status={pay.status} /></span> : "None"} />
                      <Mini icon="building" label="Holding" value={hold ? (hold.status === "issued" ? `Issued · ${hold.transferAgentRef}` : "Pending issuance") : "None"} />
                      <Mini icon="wallet" label="Wallet pass" value={pass ? <Link href={`/wallet/${pass.id}`} className="text-blue hover:underline">{pass.platform ? `${pass.platform === "apple" ? "Apple" : "Google"} · v${pass.version}` : "Not added"} →</Link> : "None"} />
                    </div>
                  </div>
                );
              })}
              {!orders.length ? <div className="text-[13px] text-ink-4">No orders yet.</div> : null}
            </div>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader title="Internal notes" subtitle={`${inv.notes.length} notes`} />
            <NoteComposer investorId={inv.id} />
            <ul className="mt-4 divide-y divide-line-2">
              {inv.notes.map((n) => (
                <li key={n.id} className="py-3">
                  <div className="text-[14px]">{n.text}</div>
                  <div className="mt-1 text-[12px] text-ink-4">{n.author} · {dateTime(n.at)}</div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card className="xl:sticky xl:top-10 xl:self-start">
          <CardHeader title="Timeline" subtitle="Checks, signatures, payments, issuance, wallet and support" />
          <div className="max-h-[70vh] overflow-y-auto pr-1">
            <Timeline events={timeline} />
          </div>
        </Card>
      </div>
    </>
  );
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-[12px] text-ink-4">{k}</div>
      <div className="mt-0.5 text-[20px] font-semibold tabular tracking-[-0.01em]">{v}</div>
    </div>
  );
}
function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <dt className="text-[12px] text-ink-4">{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}
function Mini({ icon, label, value }: { icon: Parameters<typeof Icon>[0]["name"]; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <Icon name={icon} size={15} className="mt-0.5 text-ink-4" />
      <div>
        <div className="text-[11px] uppercase tracking-wider text-ink-4">{label}</div>
        <div>{value}</div>
      </div>
    </div>
  );
}
