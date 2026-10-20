import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { currentInvestorId } from "@/app/actions";
import { getOrder, getStore } from "@/lib/data/store";
import { passView } from "@/lib/data/derive";
import type { TimelineEvent } from "@/lib/data/types";
import { passFace } from "@/components/wallet/pass-face";
import { WalletPass } from "@/components/wallet/WalletPass";
import { qrSvg } from "@/lib/wallet/qr";
import { LumenNav, LumenFooter } from "@/components/lumen/LumenChrome";
import { InvestorLogin } from "../InvestorLogin";
import { money, number, date, dateTime } from "@/lib/data/format";
import { OrderBadge } from "@/components/ui/Badge";
import { Button, TextLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow } from "@/components/ui/Card";

export const metadata: Metadata = { title: "Investment" };
export const dynamic = "force-dynamic";

/** Wallet pass → "View investor dashboard" → secure login → this investment's detail page. */
export default async function InvestmentDetail({ params }: PageProps<"/lumen/investors/[orderId]">) {
  const { orderId } = await params;
  const s = getStore();
  const issuer = s.issuers[0];
  const order = getOrder(orderId);
  if (!order?.passId) notFound();

  const id = await currentInvestorId();
  if (!id) {
    return (
      <main className="min-h-screen bg-aurora">
        <LumenNav />
        <div className="mx-auto flex min-h-screen max-w-6xl items-center px-5 pb-24 pt-28">
          <InvestorLogin issuerName={issuer.name} hint="Sign in to open this investment. Your pass link only works for the investor it belongs to." />
        </div>
      </main>
    );
  }
  if (order.investorId !== id) {
    // Entitlement check: an investor's access never reveals another investor's record.
    return (
      <main className="min-h-screen bg-aurora">
        <LumenNav />
        <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-5 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-soft text-red"><Icon name="lock" size={22} /></span>
          <h1 className="text-display-sm mt-5">This investment belongs to another investor.</h1>
          <p className="mt-2 text-[14px] text-ink-3">Access is enforced per record. Sign in with the email on the investment, or go back to your own dashboard.</p>
          <Button href="/lumen/investors" variant="brand" className="mt-6">Your dashboard</Button>
        </div>
      </main>
    );
  }

  const view = passView(order.passId)!;
  const h = await headers();
  const origin = `${h.get("x-forwarded-proto") ?? "http"}://${h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000"}`;
  const face = passFace(view, origin);
  const qr = await qrSvg(view.pass.serial);
  const timeline = orderTimeline(order.id);

  return (
    <main className="bg-canvas">
      <LumenNav />
      <div className="mx-auto max-w-6xl px-5 pb-28 pt-28 lg:pt-32">
        <Link href="/lumen/investors" className="inline-flex items-center gap-1 text-[13px] font-medium text-blue hover:underline">
          <Icon name="chevron-right" size={14} className="rotate-180" /> All investments
        </Link>
        <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow tone="lumen">{issuer.name} · {order.id}</Eyebrow>
            <h1 className="text-display-md mt-2 tabular">{view.holdingStatus === "issued" ? `${number(view.holding!.shares)} shares` : money(order.amount)}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-[14px] text-ink-3">
              <OrderBadge status={order.status} />
              <span>{view.securityClass.name}</span>
              <span>·</span>
              <span>purchased {date(order.createdAt, "long")}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button href={`/wallet/${view.pass.id}`} variant="secondary" size="sm"><Icon name="wallet" size={15} /> {view.pass.platform ? "Re-download pass" : "Add to Wallet"}</Button>
            <Button href={`mailto:${issuer.supportEmail}?subject=Correction request ${order.id}`} variant="secondary" size="sm" external><Icon name="pen" size={15} /> Request correction</Button>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-8">
            {/* Holding record */}
            <section className="card p-7">
              <h2 className="text-[17px] font-semibold">Holding and share rights</h2>
              <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 text-[14px] sm:grid-cols-3">
                <Row k="Registered owner" v={view.holdingStatus === "issued" ? view.investor.owner.transferAgentName : view.investor.owner.registeredName} />
                <Row k="Security" v={view.securityClass.name} />
                <Row k="Shares" v={view.holdingStatus === "issued" ? number(view.holding!.shares) : `${number(order.shares)} on issuance`} />
                <Row k="Price per share" v={money(view.offering.pricePerShare, true)} />
                <Row k="Amount invested" v={money(order.amount)} />
                <Row k="Issuance" v={view.holding?.issuedAt ? `${date(view.holding.issuedAt, "long")} · ${view.holding.transferAgentRef}` : "Pending"} />
                <Row k="Voting rights" v={view.securityClass.votingRights} wide />
              </dl>
              <div className="mt-5 rounded-2xl bg-canvas p-4 text-[13px] text-ink-3">
                {view.indicativeValue !== null ? (
                  <>Indicative value <span className="font-semibold text-ink tabular">{money(view.indicativeValue)}</span> = {number(view.holding!.shares)} shares × {money(view.valuation.referencePrice!, true)} approved reference price as of {date(view.valuation.date, "long")}. Not a sale or redemption price.</>
                ) : (
                  <>No indicative value is shown before issuance. Original investment amount {money(order.amount)}.</>
                )}
              </div>
            </section>

            {/* Transactions */}
            <section className="card p-7">
              <h2 className="text-[17px] font-semibold">Transaction history</h2>
              <ol className="mt-5 space-y-0">
                {timeline.map((e, i) => (
                  <li key={e.id} className="relative flex gap-4 pb-5 last:pb-0">
                    {i < timeline.length - 1 ? <span className="absolute left-[15px] top-8 h-full w-px bg-line-2" aria-hidden /> : null}
                    <span className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${e.tone === "good" ? "bg-green-soft text-[#1f7a3a]" : e.tone === "bad" ? "bg-red-soft text-red" : e.tone === "warn" ? "bg-orange-soft text-orange" : "bg-canvas text-ink-3"}`}>
                      <Icon name={e.kind === "payment" ? "bank" : e.kind === "signature" ? "pen" : e.kind === "check" ? "shield" : e.kind === "issuance" ? "doc" : e.kind === "wallet" ? "wallet" : "clock"} size={14} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                        <div className="text-[14px] font-medium">{e.title}</div>
                        <div className="text-[12px] text-ink-4">{dateTime(e.at)}</div>
                      </div>
                      {e.detail ? <div className="text-[13px] text-ink-3">{e.detail}</div> : null}
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Documents */}
            <section className="card p-7">
              <h2 className="text-[17px] font-semibold">Agreements and ownership records</h2>
              <ul className="mt-4 divide-y divide-line-2">
                {view.signature ? (
                  <>
                    <Doc name="Subscription Agreement (signed)" meta={`${view.signature.envelopeId} · certificate ${view.signature.completionCertificate}`} />
                    <Doc name="Investor Rights Letter (signed)" meta={`Signed ${date(view.signature.signedAt!, "long")}`} />
                  </>
                ) : null}
                {view.holding?.status === "issued" ? <Doc name="Issuance confirmation from transfer agent" meta={`${view.holding.transferAgentRef} · ${date(view.holding.issuedAt!, "long")}`} /> : null}
                {view.payment ? <Doc name="Payment receipt" meta={`${view.payment.providerRef} · ${view.payment.method.toUpperCase()}`} /> : null}
              </ul>
            </section>
          </div>

          {/* Pass */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="card p-6">
              <div className="text-[13px] font-semibold text-ink-3">Your Wallet pass</div>
              <div className="mt-4 flex justify-center">
                <WalletPass face={face} qrSvg={qr} width={280} flippable />
              </div>
              <div className="mt-4 text-[12px] text-ink-4">Serial {view.pass.serial} · version {view.pass.version} · {view.pass.platform ? `in ${view.pass.platform === "apple" ? "Apple" : "Google"} Wallet` : "not added"}</div>
              <TextLink href={`/wallet/${view.pass.id}`} className="mt-3">Open pass</TextLink>
            </div>
          </aside>
        </div>
      </div>
      <LumenFooter />
    </main>
  );
}

function Row({ k, v, wide }: { k: string; v: string; wide?: boolean }) {
  return (
    <div className={wide ? "col-span-full" : ""}>
      <dt className="text-[12px] text-ink-4">{k}</dt>
      <dd className="font-medium tabular">{v}</dd>
    </div>
  );
}

function Doc({ name, meta }: { name: string; meta: string }) {
  return (
    <li className="flex items-center justify-between gap-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lumen-soft text-lumen"><Icon name="doc" size={16} /></span>
        <div className="min-w-0">
          <div className="truncate text-[14px] font-medium">{name}</div>
          <div className="truncate text-[12px] text-ink-4">{meta}</div>
        </div>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1 text-[13px] font-medium text-blue"><Icon name="download" size={14} /> PDF</span>
    </li>
  );
}

/** Events that belong to this order only. */
function orderTimeline(orderId: string): TimelineEvent[] {
  const s = getStore();
  const o = getOrder(orderId)!;
  const inv = s.investors.find((i) => i.id === o.investorId)!;
  const ev: TimelineEvent[] = [];
  const push = (e: Omit<TimelineEvent, "id">) => ev.push({ id: `ot_${ev.length + 1}`, ...e });
  push({ at: o.createdAt, kind: "application", title: "Order started", detail: `${number(o.shares)} shares · ${money(o.amount)}`, tone: "neutral" });
  if (o.verifiedAt && o.status !== "check_failed") push({ at: o.verifiedAt, kind: "check", title: "KYC, AML and accreditation cleared", detail: inv.verification.providerRef, tone: "good" });
  const sig = s.signatures.find((x) => x.id === o.signatureId);
  if (sig?.signedAt) push({ at: sig.signedAt, kind: "signature", title: "Signed subscription agreement and investor rights letter", detail: `Completion certificate ${sig.completionCertificate}`, tone: "good" });
  const pay = s.payments.find((x) => x.id === o.paymentId);
  if (pay) {
    push({ at: pay.initiatedAt, kind: "payment", title: `Payment submitted by ${pay.method === "ach" ? "ACH" : pay.method === "wire" ? "wire" : `${pay.coin} on ${pay.network}`}`, detail: pay.providerRef, tone: "neutral" });
    if (pay.clearedAt) push({ at: pay.clearedAt, kind: "payment", title: "Funds cleared into escrow", detail: `${money(pay.amount)} · rail fee ${money(pay.railFee, true)}`, tone: "good" });
    if (pay.returnedAt) push({ at: pay.returnedAt, kind: "payment", title: "Payment returned", detail: pay.returnCode, tone: "bad" });
    if (pay.refundedAt) push({ at: pay.refundedAt, kind: "payment", title: "Refund issued", tone: "warn" });
  }
  if (o.acceptedAt) push({ at: o.acceptedAt, kind: "issuance", title: "Subscription accepted for the next closing", tone: "good" });
  const hold = s.holdings.find((x) => x.id === o.holdingId);
  if (hold?.releasedAt) push({ at: hold.releasedAt, kind: "issuance", title: "Escrow funds released to issuer", tone: "neutral" });
  if (hold?.issuedAt) push({ at: hold.issuedAt, kind: "issuance", title: `Transfer agent confirmed ${number(hold.shares)} shares`, detail: hold.transferAgentRef, tone: "good" });
  const pass = s.passes.find((x) => x.id === o.passId);
  if (pass?.addedAt) push({ at: pass.addedAt, kind: "wallet", title: `Added pass to ${pass.platform === "apple" ? "Apple Wallet" : "Google Wallet"}`, detail: pass.serial, tone: "neutral" });
  if (pass && pass.version > 1) push({ at: pass.lastUpdatedAt, kind: "wallet", title: `Pass updated to version ${pass.version}`, tone: "neutral" });
  return ev.sort((a, b) => b.at.localeCompare(a.at));
}
