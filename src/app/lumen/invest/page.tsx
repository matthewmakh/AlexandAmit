import type { Metadata } from "next";
import { LumenNav, LumenFooter } from "@/components/lumen/LumenChrome";
import { getStore } from "@/lib/data/store";
import { raiseSummary } from "@/lib/data/derive";
import { money, number, date, pct } from "@/lib/data/format";
import { Button, TextLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Card";
import { Reveal } from "@/components/marketing/Reveal";
import { Photo } from "@/components/ui/Photo";
import { Icon } from "@/components/ui/Icon";
import { BarRows } from "@/components/charts/Bars";

export const metadata: Metadata = { title: "Invest" };
export const dynamic = "force-dynamic";

/** Step 1 of the investor journey: read the terms, price, minimum, risks and fees. */
export default function OfferingPage() {
  const s = getStore();
  const offering = s.offerings[0];
  const issuer = s.issuers[0];
  const cls = s.securityClasses[0];
  const r = raiseSummary();
  const valuation = s.valuations.find((v) => v.current)!;

  return (
    <main className="bg-paper">
      <LumenNav />

      <section className="bg-aurora">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 pb-16 pt-32 lg:grid-cols-[1.15fr_1fr] lg:pt-40">
          <Reveal>
            <Eyebrow tone="lumen">{offering.name}</Eyebrow>
            <h1 className="text-display-lg mt-4 text-balance">Invest in {issuer.name} directly, on this page.</h1>
            <p className="text-lede mt-5 max-w-xl text-ink-3">{cls.name} at {money(offering.pricePerShare, true)} per share, offered under {offering.exemption} to verified accredited investors. Sign and pay in minutes; keep a branded pass for each investment in your Wallet.</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button href="/lumen/invest/checkout" size="lg" variant="brand">
                Start investing <Icon name="arrow-right" size={18} />
              </Button>
              <TextLink href="#documents">Read the documents</TextLink>
            </div>
            <p className="mt-6 text-[12px] text-ink-4">Securities offered through Farkas Capital, a registered broker-dealer. Read the risk factors before investing.</p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="card p-7">
              <div className="flex items-baseline justify-between">
                <div className="text-[13px] font-medium text-ink-3">Raised to date</div>
                <div className="text-[13px] text-ink-4">Target {money(offering.targetAmount)}</div>
              </div>
              <div className="mt-1 text-display-sm tabular">{money(r.committed)}</div>
              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-ink/[0.06]">
                <div className="h-full rounded-full bg-lumen-gradient" style={{ width: `${Math.min(100, r.progress * 100)}%` }} />
              </div>
              <div className="mt-2 flex justify-between text-[12px] text-ink-4">
                <span>{pct(r.progress)} of target</span>
                <span>{r.investorsCommitted} investors</span>
              </div>
              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-[14px]">
                <Term k="Price per share" v={money(offering.pricePerShare, true)} />
                <Term k="Security" v={cls.shortName} />
                <Term k="Minimum" v={money(offering.minInvestment)} />
                <Term k="Maximum" v={money(offering.maxInvestment)} />
                <Term k="Next closing" v={date(offering.nextClosingAt)} />
                <Term k="Offering closes" v={date(offering.closesAt)} />
                <Term k="Valuation" v={`${money(valuation.amount)} post-money`} />
                <Term k="Exemption" v="Rule 506(c)" />
              </dl>
              <Button href="/lumen/invest/checkout" variant="brand" className="mt-6 w-full">
                Start investing
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-24">
        <Reveal className="grid items-center gap-12 lg:grid-cols-2">
          <Photo src="/images/lumen/fleet.jpg" alt="Dozens of Lumen robots parked in rows at a charging bank" aspect="4/3" />
          <div>
            <Eyebrow tone="lumen">Why now</Eyebrow>
            <h2 className="text-display-md mt-3 text-balance">Forty-one facilities. A fleet that pays for itself in under a year.</h2>
            <p className="text-lede mt-5 text-ink-3">Proceeds fund the next 1,200 robots, deployment teams in three new regions, and the perception work that lets the fleet pick an even wider range of items.</p>
            <div className="mt-8">
              <div className="mb-3 text-[13px] font-semibold text-ink-3">Use of proceeds</div>
              <BarRows rows={offering.useOfProceeds.map((u) => ({ label: u.label, value: u.pct }))} max={0.5} format={(v) => pct(v)} color="var(--color-lumen)" />
            </div>
          </div>
        </Reveal>
      </section>

      <section className="bg-canvas">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <Reveal>
            <Eyebrow tone="lumen">Terms</Eyebrow>
            <h2 className="text-display-md mt-3">Everything on one page. No surprises at signing.</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Reveal className="card p-7">
              <div className="flex items-center gap-2 text-[17px] font-semibold"><Icon name="doc" size={18} className="text-lumen" /> The security</div>
              <ul className="mt-4 space-y-3 text-[14px] text-ink-2">
                <li>{cls.name}: {cls.votingRights}</li>
                <li>{number(cls.fullyDilutedShares)} fully diluted shares before this offering.</li>
                <li>Shares are issued by the transfer agent after each closing; your pass and dashboard update when issuance is confirmed.</li>
              </ul>
            </Reveal>
            <Reveal delay={0.06} className="card p-7">
              <div className="flex items-center gap-2 text-[17px] font-semibold"><Icon name="cash" size={18} className="text-lumen" /> Fees</div>
              <ul className="mt-4 space-y-3 text-[14px] text-ink-2">
                <li>No fee is charged to investors at purchase.</li>
                <li>The issuer pays a {(offering.placementFeeBps / 100).toFixed(1)}% placement fee to the broker-dealer and a {(offering.platformFeeBps / 100).toFixed(1)}% platform fee on gross proceeds.</li>
                <li>Payment rails pass through at cost: ACH $1.50, wire $25, stablecoin conversion 1%.</li>
              </ul>
            </Reveal>
            <Reveal delay={0.12} className="card p-7">
              <div className="flex items-center gap-2 text-[17px] font-semibold"><Icon name="shield" size={18} className="text-lumen" /> Who can invest</div>
              <ul className="mt-4 space-y-3 text-[14px] text-ink-2">
                {offering.eligibility.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="documents" className="mx-auto max-w-6xl px-5 py-24">
        <Reveal>
          <Eyebrow tone="lumen">Documents</Eyebrow>
          <h2 className="text-display-md mt-3">Read before you sign.</h2>
        </Reveal>
        <Reveal className="mt-10 divide-y divide-line-2 overflow-hidden rounded-[28px] border border-line-2">
          {offering.documents.map((d) => (
            <div key={d.id} className="flex items-center justify-between gap-4 bg-paper px-6 py-4 transition-colors hover:bg-canvas">
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lumen-soft text-lumen">
                  <Icon name="doc" size={18} />
                </span>
                <div>
                  <div className="text-[15px] font-medium">{d.name}</div>
                  <div className="text-[12px] text-ink-4">{d.pages} pages · {d.version}{d.requiresSignature ? " · signed at checkout" : ""}</div>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-blue">
                <Icon name="download" size={15} /> PDF
              </span>
            </div>
          ))}
        </Reveal>
        <Reveal className="mt-8 rounded-[24px] bg-orange-soft p-6 text-[14px] leading-relaxed text-[#7a4a00]">
          <div className="mb-1 flex items-center gap-2 font-semibold"><Icon name="warning" size={16} /> Risk summary</div>
          Private company securities are illiquid and may lose all of their value. There is no public market for these shares and none is expected. Valuation figures are the issuer&rsquo;s approved reported valuation, not a market price. Read the full Risk Factors document.
        </Reveal>
      </section>

      <section className="bg-night text-white">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Reveal className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <h2 className="text-display-md text-balance">Six steps. About eight minutes.</h2>
              <p className="mt-3 max-w-xl text-[16px] text-white/65">Verify your email, enter your details, pass identity and accreditation checks, sign, pay, and add your pass to Wallet.</p>
            </div>
            <Button href="/lumen/invest/checkout" size="lg" variant="white" className="shrink-0">
              Start investing <Icon name="arrow-right" size={18} />
            </Button>
          </Reveal>
        </div>
      </section>

      <LumenFooter />
    </main>
  );
}

function Term({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-[12px] text-ink-4">{k}</dt>
      <dd className="font-medium tabular">{v}</dd>
    </div>
  );
}
