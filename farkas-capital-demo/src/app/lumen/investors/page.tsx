import type { Metadata } from "next";
import Link from "next/link";
import { currentInvestorId, investorLogoutAction } from "@/app/actions";
import { getInvestor, getStore, ordersForInvestor } from "@/lib/data/store";
import { passView } from "@/lib/data/derive";
import { money, number, date, dateTime } from "@/lib/data/format";
import { LumenNav, LumenFooter } from "@/components/lumen/LumenChrome";
import { InvestorLogin } from "./InvestorLogin";
import { OrderBadge } from "@/components/ui/Badge";
import { Button, TextLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow } from "@/components/ui/Card";

export const metadata: Metadata = { title: "Investor dashboard" };
export const dynamic = "force-dynamic";

/**
 * The private investor dashboard on the issuer's website. Shows only this
 * company's investments for the signed-in investor, including repeat
 * purchases. No cross-company portfolio page.
 */
export default async function InvestorDashboard() {
  const s = getStore();
  const issuer = s.issuers[0];
  const id = await currentInvestorId();
  const investor = id ? getInvestor(id) : undefined;

  if (!investor) {
    return (
      <main className="min-h-screen bg-aurora">
        <LumenNav />
        <div className="mx-auto flex min-h-screen max-w-6xl items-center px-5 pb-24 pt-28">
          <InvestorLogin issuerName={issuer.name} />
        </div>
      </main>
    );
  }

  const orders = ordersForInvestor(investor.id);
  const views = orders.filter((o) => o.passId).map((o) => passView(o.passId!)!);
  const totalInvested = orders.filter((o) => !["refunded", "cancelled", "started", "verifying", "check_failed"].includes(o.status)).reduce((a, o) => a + o.amount, 0);
  const sharesIssued = views.filter((v) => v.holdingStatus === "issued").reduce((a, v) => a + v.holding!.shares, 0);
  const sharesPending = orders.filter((o) => ["payment_pending", "payment_cleared", "accepted"].includes(o.status)).reduce((a, o) => a + o.shares, 0);
  const indicative = views.reduce((a, v) => a + (v.indicativeValue ?? 0), 0);
  const valuation = s.valuations.find((v) => v.current)!;
  const signed = s.signatures.filter((g) => orders.some((o) => o.signatureId === g.id) && g.status === "signed");

  return (
    <main className="bg-canvas">
      <LumenNav />
      <div className="mx-auto max-w-6xl px-5 pb-28 pt-28 lg:pt-32">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow tone="lumen">Investor dashboard</Eyebrow>
            <h1 className="text-display-md mt-2">Welcome back, {investor.firstName}.</h1>
            <p className="mt-2 text-[15px] text-ink-3">{investor.owner.registeredName} · {investor.email} · signed in securely</p>
          </div>
          <form action={investorLogoutAction}>
            <Button variant="secondary" size="sm">Sign out</Button>
          </form>
        </div>

        {/* Summary */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Tile label="Total invested" value={money(totalInvested)} hint={`${orders.length} investment${orders.length === 1 ? "" : "s"} in ${issuer.name}`} />
          <Tile label="Shares issued" value={number(sharesIssued)} hint={s.securityClasses[0].name} />
          <Tile label="Pending issuance" value={number(sharesPending)} hint={sharesPending ? `next closing ${date(s.offerings[0].nextClosingAt)}` : "nothing pending"} />
          <Tile label="Indicative value" value={indicative ? money(indicative) : "—"} hint={indicative ? `${money(valuation.referencePrice!, true)}/share · ${date(valuation.date)}` : "appears after issuance"} />
        </div>

        {/* Investments */}
        <section className="mt-12">
          <SectionHead title="Your investments" sub="One record per purchase. Each has its own Wallet pass." />
          <div className="grid gap-4 md:grid-cols-2">
            {views.length === 0 ? (
              <div className="card-tint col-span-full p-10 text-center text-[14px] text-ink-3">
                No investments yet. <Link href="/lumen/invest" className="text-blue">Read the offering</Link>.
              </div>
            ) : null}
            {views.map((v) => (
              <Link key={v.order.id} href={`/lumen/investors/${v.order.id}`} className="card group p-6 transition-shadow hover:shadow-lift">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[13px] text-ink-3">{date(v.order.createdAt, "long")}</div>
                    <div className="mt-1 text-display-sm tabular">{v.holdingStatus === "issued" ? `${number(v.holding!.shares)} shares` : money(v.order.amount)}</div>
                    <div className="text-[13px] text-ink-3">{v.holdingStatus === "issued" ? `${v.securityClass.name} · ${money(v.order.amount)} invested` : `${number(v.order.shares)} shares on issuance`}</div>
                  </div>
                  <OrderBadge status={v.order.status} />
                </div>
                <div className="mt-5 flex items-center justify-between text-[13px]">
                  <span className="inline-flex items-center gap-1.5 text-ink-3">
                    <Icon name="wallet" size={15} /> {v.pass.platform ? `In ${v.pass.platform === "apple" ? "Apple" : "Google"} Wallet · v${v.pass.version}` : "Pass not added"}
                  </span>
                  <span className="inline-flex items-center gap-1 font-medium text-blue">
                    Details <Icon name="chevron-right" size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          {/* Documents */}
          <section>
            <SectionHead title="Agreements and documents" sub="Your signed documents and the issuer's filings. Restricted to entitled investors." />
            <div className="card divide-y divide-line-2 p-0">
              {signed.map((g) => {
                const o = orders.find((x) => x.signatureId === g.id)!;
                return (
                  <DocRow key={g.id} name={`Signed subscription agreement · ${o.id}`} meta={`Signed ${date(g.signedAt!)} · completion certificate ${g.completionCertificate}`} />
                );
              })}
              {s.offerings[0].documents.filter((d) => !d.requiresSignature).map((d) => (
                <DocRow key={d.id} name={d.name} meta={`${d.pages} pages · ${d.version}`} />
              ))}
            </div>
          </section>

          {/* Valuation */}
          <section>
            <SectionHead title="Valuation basis" sub="Approved reported valuations. Not a live market price." />
            <div className="card p-6">
              <div className="text-[13px] text-ink-3">Current</div>
              <div className="mt-1 text-display-sm tabular">{money(valuation.amount)}</div>
              <div className="text-[13px] text-ink-3">{valuation.basis} · {valuation.source} · {date(valuation.date, "long")}</div>
              <div className="mt-1 text-[12px] text-ink-4">Approved by {valuation.approvedBy}</div>
              <table className="mt-5 w-full text-[13px]">
                <thead className="text-left text-[11px] uppercase tracking-[0.06em] text-ink-4">
                  <tr><th className="pb-2 font-medium">Date</th><th className="pb-2 font-medium">Basis</th><th className="pb-2 text-right font-medium">Ref. price</th></tr>
                </thead>
                <tbody className="divide-y divide-line-2">
                  {[...s.valuations].reverse().map((v) => (
                    <tr key={v.id}>
                      <td className="py-2">{date(v.date)}</td>
                      <td className="py-2 text-ink-3">{v.source}</td>
                      <td className="py-2 text-right tabular">{v.referencePrice ? money(v.referencePrice, true) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Updates */}
        <section className="mt-12">
          <SectionHead title="Company updates" sub="Shareholder letters, reports and notices from Lumen." />
          <div className="grid gap-4 md:grid-cols-3">
            {s.updates.map((u) => (
              <article key={u.id} className="card p-6">
                <div className="text-[12px] text-ink-4">{date(u.publishedAt, "long")}</div>
                <h3 className="mt-1 text-[16px] font-semibold">{u.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-3">{u.summary}</p>
                {u.attachments.length ? (
                  <div className="mt-3 inline-flex items-center gap-1.5 text-[12px] text-blue"><Icon name="doc" size={13} /> {u.attachments[0]}</div>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        {/* Distributions, support */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <div className="card-tint p-6">
            <div className="text-[15px] font-semibold">Distributions and tax documents</div>
            <p className="mt-2 text-[13px] text-ink-3">None yet. Documents will appear here when applicable, with a notice to your email.</p>
          </div>
          <div className="card-tint p-6">
            <div className="text-[15px] font-semibold">Meetings and consents</div>
            <p className="mt-2 text-[13px] text-ink-3">No open votes or consent requests. Notices are published here and emailed.</p>
          </div>
          <div className="card-tint p-6">
            <div className="text-[15px] font-semibold">Support</div>
            <p className="mt-2 text-[13px] text-ink-3">Re-download a Wallet pass from any investment page, or request a correction to your registered details.</p>
            <div className="mt-3 flex flex-col gap-1.5">
              <TextLink href={`mailto:${issuer.supportEmail}?subject=Profile correction request`}>Request a profile correction</TextLink>
              <TextLink href={`mailto:${issuer.supportEmail}`}>Contact {issuer.supportEmail}</TextLink>
            </div>
          </div>
        </div>

        <p className="mt-10 text-[12px] text-ink-4">Last synchronised {dateTime(s.now)}. The dashboard shows the authoritative status; Wallet pass updates may be delayed or offline.</p>
      </div>
      <LumenFooter />
    </main>
  );
}

function Tile({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="card p-6">
      <div className="text-[13px] text-ink-3">{label}</div>
      <div className="mt-1 text-display-sm tabular">{value}</div>
      <div className="mt-1 text-[12px] text-ink-4">{hint}</div>
    </div>
  );
}

function SectionHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-[20px] font-semibold tracking-[-0.01em]">{title}</h2>
      <p className="text-[13px] text-ink-3">{sub}</p>
    </div>
  );
}

function DocRow({ name, meta }: { name: string; meta: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lumen-soft text-lumen"><Icon name="doc" size={16} /></span>
        <div className="min-w-0">
          <div className="truncate text-[14px] font-medium">{name}</div>
          <div className="truncate text-[12px] text-ink-4">{meta}</div>
        </div>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1 text-[13px] font-medium text-blue"><Icon name="download" size={14} /> PDF</span>
    </div>
  );
}
