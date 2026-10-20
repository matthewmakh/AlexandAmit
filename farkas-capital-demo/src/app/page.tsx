import type { Metadata } from "next";
import Link from "next/link";
import { passView, raiseSummary } from "@/lib/data/derive";
import { passFace } from "@/components/wallet/pass-face";
import { qrSvg } from "@/lib/wallet/qr";
import { FloatingNav } from "@/components/marketing/FloatingNav";
import { FarkasLogo, FarkasMark } from "@/components/brand/FarkasMark";
import { LumenMark } from "@/components/brand/LumenMark";
import { Button, TextLink } from "@/components/ui/Button";
import { Eyebrow, SectionTitle } from "@/components/ui/Card";
import { Photo } from "@/components/ui/Photo";
import { PlatformDiagram } from "@/components/diagrams/PlatformDiagram";
import { ArchitectureDiagram } from "@/components/diagrams/ArchitectureDiagram";
import { Icon } from "@/components/ui/Icon";
import { Reveal, Stagger, StaggerItem } from "@/components/marketing/Reveal";
import { HeroPhone } from "@/components/pitch/HeroPhone";
import { PassStack } from "@/components/wallet/PassStack";
import { HARBOR_FACE, VERDANT_FACE } from "@/components/pitch/otherIssuers";
import { HarborMark, VerdantMark } from "@/components/pitch/IssuerMarks";
import { WalletPass } from "@/components/wallet/WalletPass";
import { money, number } from "@/lib/data/format";

export const metadata: Metadata = {
  title: "Invest on the company website. Keep it in your Wallet.",
};
export const dynamic = "force-dynamic";

/**
 * The pitch. An Apple-style product page for the platform itself: what it
 * is, the investor journey, the pass, the issuer dashboard, the rails and
 * the delivery plan, with live links into every surface of the demo.
 */
export default async function PitchPage() {
  const issuedView = passView("pass_jordan_1")!;
  const pendingView = passView("pass_jordan_2")!;
  const issued = passFace(issuedView);
  const pending = passFace(pendingView);
  const qr = await qrSvg(issuedView.pass.serial);
  const r = raiseSummary();

  const stack = [
    { face: VERDANT_FACE, logo: <VerdantMark size={24} /> },
    { face: HARBOR_FACE, logo: <HarborMark size={24} /> },
    { face: issued },
  ];

  return (
    <main className="bg-paper">
      <FloatingNav
        align="wide"
        brand={
          <Link href="/" aria-label="Home">
            <FarkasLogo size={26} />
          </Link>
        }
        links={[
          { href: "/#products", label: "Products" },
          { href: "/#journey", label: "Journey" },
          { href: "/#wallet", label: "Wallet" },
          { href: "/#dashboard", label: "Dashboard" },
          { href: "/#rails", label: "Rails" },
          { href: "/build-plan", label: "Build plan" },
        ]}
        cta={
          <Button href="/lumen/invest" size="sm">
            Open the demo
          </Button>
        }
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-aurora">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-24 pt-36 lg:grid-cols-[1.15fr_1fr] lg:pt-44">
          <div>
            <Reveal>
              <Eyebrow tone="blue">A working proposal for Farkas Capital</Eyebrow>
              <h1 className="text-display-xl mt-5 text-balance">Invest on the company website. Keep it in your Wallet.</h1>
              <p className="text-lede mt-6 max-w-xl text-ink-3">A white-label capital-raising platform. Each company raises on its own site, runs the raise from a dashboard worth using, and hands every investor a branded Apple Wallet or Google Wallet pass. The company is the brand throughout.</p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button href="/lumen/invest" size="lg">
                  Walk the investor journey
                </Button>
                <TextLink href="/issuer">Open the issuer dashboard</TextLink>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[13px] text-ink-3">
                <span className="inline-flex items-center gap-2"><Icon name="check" size={14} className="text-green" /> Rule 506(c) first release</span>
                <span className="inline-flex items-center gap-2"><Icon name="check" size={14} className="text-green" /> Real .pkpass pipeline</span>
                <span className="inline-flex items-center gap-2"><Icon name="check" size={14} className="text-green" /> Providers mocked behind real interfaces</span>
              </div>
            </Reveal>
          </div>
          <div className="flex justify-center lg:justify-end">
            <HeroPhone faces={stack} qrSvg={qr} />
          </div>
        </div>
      </section>

      {/* Three products */}
      <section id="products" className="mx-auto max-w-6xl px-5 py-28">
        <Reveal>
          <SectionTitle eyebrow="Three connected products" title="One platform. Three places the investor and the issuer actually live." lede="Everything below is live in this demo, with realistic data for one sandbox issuer, Lumen Robotics." />
        </Reveal>
        <Stagger className="mt-14 grid gap-6 lg:grid-cols-3">
          {[
            {
              t: "Company website + investor dashboard",
              d: "Investment checkout and a private investor dashboard on the issuer's own website. Investors open it from their Wallet pass for detailed shareholder information.",
              href: "/lumen/invest",
              cta: "Try the checkout",
              img: "/images/screens/checkout-phone-mock.jpg",
              alt: "The checkout amount step inside the Lumen website on an iPhone",
            },
            {
              t: "Issuer dashboard",
              d: "The company's control centre for its raise, investors, payments, marketing results and shareholder communications. Every headline number opens the records behind it.",
              href: "/issuer",
              cta: "Open the dashboard",
              img: "/images/screens/issuer-laptop-mock.jpg",
              alt: "The issuer dashboard raise overview on a laptop",
            },
            {
              t: "Wallet investment passes",
              d: "A separate branded pass for each investment, updated by the server as the investment moves to issuance. Wallet is the familiar place for passes from different companies.",
              href: "/wallet/pass_jordan_1",
              cta: "See the pass",
              img: "/images/lumen/phone-pass.jpg",
              alt: "A hand holding an iPhone showing the Lumen Robotics pass in Wallet",
            },
          ].map((c) => (
            <StaggerItem key={c.t} className="card flex flex-col overflow-hidden p-0">
              <Photo src={c.img} alt={c.alt} aspect="4/3" rounded="rounded-none" sizes="(min-width: 1024px) 33vw, 100vw" />
              <div className="flex flex-1 flex-col p-7">
                <h3 className="text-[19px] font-semibold tracking-[-0.01em]">{c.t}</h3>
                <p className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-3">{c.d}</p>
                <TextLink href={c.href} className="mt-5">{c.cta}</TextLink>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Journey */}
      <section id="journey" className="bg-canvas">
        <div className="mx-auto max-w-6xl px-5 py-28">
          <Reveal>
            <SectionTitle eyebrow="The investor journey" title="Six steps. No separate app. No marketplace." lede="From the Invest button on the company website to a pass in Wallet, about eight minutes." />
          </Reveal>
          <ol className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              ["Click Invest", "Read the offering terms, price, minimum investment, risks and fees on the company's own page.", "/lumen/invest"],
              ["Create access", "Email verification, legal owner details and investment amount. No password to remember.", "/lumen/invest/checkout"],
              ["Pass the checks", "Identity (KYC), sanctions and AML, and accreditation verification when required. Failed checks block progress.", "/lumen/invest/checkout"],
              ["Sign and pay", "Embedded e-signature, then ACH, wire or, where the issuer enables it, stablecoins. Nothing is confirmed from a browser success page.", "/lumen/invest/checkout"],
              ["Add to Wallet", "A branded confirmation with Add to Apple Wallet or Add to Google Wallet. The investor confirms the add.", "/lumen/invest/confirmation/ord_jordan_2"],
              ["Open the dashboard", "Tap View investor dashboard on the pass to reach that investment on the issuer's website after secure login.", "/lumen/investors"],
            ].map(([t, d, href], i) => (
              <Reveal key={t} delay={i * 0.05}>
                <Link href={href} className="card group flex h-full flex-col p-7 transition-shadow hover:shadow-lift">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-[14px] font-semibold text-white">{i + 1}</span>
                  <h3 className="mt-5 text-[18px] font-semibold tracking-[-0.01em]">{t}</h3>
                  <p className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-3">{d}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-blue">Open <Icon name="chevron-right" size={14} className="transition-transform group-hover:translate-x-0.5" /></span>
                </Link>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Wallet */}
      <section id="wallet" className="bg-aurora-dark text-white">
        <div className="mx-auto max-w-6xl px-5 py-28">
          <div className="grid items-center gap-16 lg:grid-cols-[1fr_1.1fr]">
            <div className="flex justify-center lg:order-2">
              <Reveal>
                <PassStack faces={stack} width={320} />
              </Reveal>
            </div>
            <div className="lg:order-1">
              <Reveal>
                <SectionTitle dark eyebrow="One investment. One pass." title="Wallet is a display layer. The register is the register." lede="One pass per completed order. A second purchase creates a separate pass, even in the same company. Reinstalling or updating reuses the pass ID, never a duplicate." />
              </Reveal>
              <Reveal delay={0.1}>
                <ul className="mt-10 space-y-4 text-[15px]">
                  {[
                    ["Shares and class", "Confirmed quantity from the transfer agent. Before issuance the pass says Pending issuance, never Shares owned."],
                    ["Registered owner", "The exact name in the transfer-agent record, including an entity or trust name."],
                    ["Company valuation", "The latest approved reported valuation with date, source and basis. Never a live market price."],
                    ["Indicative value", "Confirmed shares × approved reference price for the same class, labelled, dated, and explained. No defensible price, no value shown."],
                    ["Portal access", "View investor dashboard in the pass details, opening the private dashboard on the issuer's website after login."],
                  ].map(([t, d]) => (
                    <li key={t} className="flex gap-4">
                      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10"><Icon name="check" size={13} className="text-green" /></span>
                      <span><span className="font-semibold">{t}.</span> <span className="text-white/65">{d}</span></span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>

          {/* Payment is not yet ownership */}
          <Reveal className="mt-28">
            <SectionTitle dark align="center" eyebrow="Payment is not yet ownership" title="The pass changes only when the record changes." lede="Verified provider event → internal records → reconciliation → queued pass update. The same pass, three versions." />
          </Reveal>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              { face: pending, t: "v1 · Pending issuance", d: "After verified payment submission. Shows the order amount and status." },
              { face: { ...pending, header: { label: "Status", value: "Accepted" } }, t: "v2 · Accepted", d: "Funds cleared and subscription accepted for the next closing. Still not ownership." },
              { face: issued, t: "v3 · Issued", d: "Transfer agent confirms issuance. Confirmed shares, registered owner and indicative value appear." },
            ].map((x, i) => (
              <Reveal key={x.t} delay={i * 0.1} className="flex flex-col items-center text-center">
                <WalletPass face={x.face} width={250} flippable={false} qrSvg={i === 2 ? qr : undefined} />
                <div className="mt-6 text-[16px] font-semibold">{x.t}</div>
                <p className="mt-1 max-w-xs text-[13px] text-white/60">{x.d}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-14 flex flex-wrap items-center justify-center gap-4">
            <Button href="/wallet/pass_jordan_2" variant="white">Push a server-driven update yourself</Button>
            <TextLink href="/api/passes/pass_jordan_1?format=json" tone="white">Inspect pass.json</TextLink>
          </Reveal>
        </div>
      </section>

      {/* Dashboard */}
      <section id="dashboard" className="mx-auto max-w-6xl px-5 py-28">
        <Reveal>
          <SectionTitle eyebrow="An issuer dashboard worth using" title="Clear, beautiful, fast, and useful every day." lede="A custom product experience, not a reskinned vendor portal. The issuer can identify an issue and reach the affected investor in two clicks." />
        </Reveal>
        <Reveal className="mt-12">
          <Link href="/issuer" className="block">
            <Photo src="/images/screens/issuer-overview.png" alt="Issuer dashboard raise overview" aspect="16/10" className="shadow-lift ring-hair" sizes="(min-width: 1152px) 1152px, 100vw" />
          </Link>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Raise overview", `${money(r.committed)} committed of ${money(r.target)}; committed, received, cleared, refunded and released shown separately.`, "/issuer"],
            ["Action centre", "Failed checks, missing documents, unpaid orders, returns and transfer-agent mismatches, each with an owner, age and next action.", "/issuer/actions"],
            ["Investor CRM", `${r.investorsCommitted} committed investors; search, filters, saved views, tags, notes and a full timeline. Export permitted data.`, "/issuer/investors"],
            ["Conversion analytics", "Visit → application → verification → signature → payment → issuance, by step, source and device, with cost per funded investor.", "/issuer/analytics"],
            ["Offering controls", "Price, class, limits, dates, documents and eligibility. Versioned terms with approval before material changes.", "/issuer/offering"],
            ["Money and ownership", "Reconciliation, refunds and exceptions, gross-to-net fees, escrow status and transfer-agent sync.", "/issuer/money"],
            ["Investor relations", "Approved, branded updates to selected groups, with delivery results and pass updates.", "/issuer/relations"],
            ["Team and settings", "Roles, branding, domain, email, integration health, wallet status and audit history.", "/issuer/settings"],
          ].map(([t, d, href], i) => (
            <Reveal key={t} delay={(i % 4) * 0.05}>
              <Link href={href} className="card-tint group flex h-full flex-col p-6 transition-colors hover:bg-canvas-2">
                <h3 className="text-[15px] font-semibold">{t}</h3>
                <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-ink-3">{d}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-blue">Open <Icon name="chevron-right" size={13} /></span>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="card p-7">
            <div className="flex items-center gap-3">
              <LumenMark size={22} color="var(--color-lumen)" />
              <h3 className="text-[17px] font-semibold">Investor dashboard on the issuer&rsquo;s website</h3>
            </div>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-3">Holdings and share rights, transaction history, valuation basis and history, signed agreements, issuer reports and updates, distributions and tax documents when applicable, and support. Only that company&rsquo;s investments. No cross-company portfolio page.</p>
            <TextLink href="/lumen/investors" className="mt-4">Sign in as the demo investor</TextLink>
          </div>
          <div className="card bg-farkas p-7 text-white">
            <div className="flex items-center gap-3">
              <FarkasMark size={24} />
              <h3 className="text-[17px] font-semibold">Private operations console for Farkas Capital</h3>
            </div>
            <p className="mt-2 text-[14px] leading-relaxed text-white/65">Issuer onboarding, offering approval, investor review, exception queues, communications review, fees, integration failures and audit exports. Company users cannot bypass compliance decisions or edit confirmed ownership.</p>
            <TextLink href="/ops" tone="white" className="mt-4">Open the console</TextLink>
          </div>
        </Reveal>
      </section>

      {/* Brand rules */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-6xl px-5 py-28">
          <Reveal className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionTitle eyebrow="Brand and launch rules" title="The company is the brand. The broker-dealer is still the broker-dealer." lede="The issuer's logo, colours, domain, support identity and email branding, everywhere. No Powered-by badge, no shared marketplace. Required broker-dealer identification and legal disclosures stay where counsel requires them." />
              <ul className="mt-8 space-y-3 text-[14px] text-ink-2">
                {["First release: U.S. direct share offerings under Rule 506(c), subject to business and counsel approval.", "Configurable eligibility rules; Reg A and Reg CF as separate approved workflows later.", "Small JavaScript embed for the existing site, plus a company-domain route such as invest.company.com."].map((x) => (
                  <li key={x} className="flex gap-3"><Icon name="check" size={16} className="mt-0.5 shrink-0 text-green" /> {x}</li>
                ))}
              </ul>
            </div>
            <div className="card p-6 sm:p-8"><PlatformDiagram /></div>
          </Reveal>
        </div>
      </section>

      {/* Rails */}
      <section id="rails" className="mx-auto max-w-6xl px-5 py-28">
        <Reveal>
          <SectionTitle eyebrow="Build the experience. Connect the rails." title="Our interface on top of regulated infrastructure." lede="React and Next.js with TypeScript, PostgreSQL, encrypted document storage and a background job queue. Providers do what they are licensed to do; we own the experience." />
        </Reveal>
        <Reveal className="mt-12">
          <div className="card overflow-x-auto p-4 sm:p-8"><div className="min-w-[900px]"><ArchitectureDiagram /></div></div>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {[
            ["North Capital TransactAPI", "KYC/AML, accreditation, securities payment and escrow", "Sandbox, pricing, broker-dealer roles, ACH/wire, webhooks, refunds, funds release."],
            ["Kore transfer agent", "Issuance and holdings", "Contracted legal transfer agent, registered names, classes, corporate actions, reconciliation."],
            ["Docusign eSignature", "Embedded signing", "Templates, envelope status, completion certificate, signed PDF retrieval, branding."],
            ["Apple Wallet", "Direct pass integration", "Pass Type IDs, certificates, pass hosting, registration and update endpoints, APNs."],
            ["Google Wallet", "Generic Private pass", "Issuer account, use-case approval for financial data, add-to-wallet flow, updates."],
          ].map(([t, p, c], i) => (
            <Reveal key={t} delay={i * 0.05}>
              <div className="card-tint h-full p-6">
                <h3 className="text-[15px] font-semibold">{t}</h3>
                <div className="mt-0.5 text-[12px] text-blue">{p}</div>
                <p className="mt-3 text-[13px] leading-relaxed text-ink-3"><span className="font-medium text-ink-2">To confirm:</span> {c}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            ["Money status", "Payment provider"],
            ["Registered ownership", "Transfer agent"],
            ["Valuation", "Approved issuer records"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-[24px] border border-line-2 p-6">
              <div className="text-eyebrow text-ink-4">Source of truth · {k}</div>
              <div className="mt-2 text-[20px] font-semibold tracking-[-0.01em]">{v}</div>
            </div>
          ))}
        </Reveal>
        <Reveal className="mt-6 rounded-[24px] bg-canvas p-6 text-[14px] leading-relaxed text-ink-3">
          Verified webhook → update internal records → reconcile payment and transfer-agent data → queue wallet update and approved notification. Signatures verified, duplicate and out-of-order events handled, failures retried with alerts, daily reconciliation. Never confirm a payment from a browser success page alone. Every record and request enforces issuer-level access.
        </Reveal>
      </section>

      {/* Delivery */}
      <section className="bg-night text-white">
        <div className="mx-auto max-w-6xl px-5 py-28">
          <Reveal>
            <SectionTitle dark eyebrow="Project delivery plan" title="Validate, design, build, pilot." lede="Four milestones with acceptance checks. This demo is most of milestone A and a head start on B." />
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["A", "Feasibility", "Working wallet demonstration; provider comparison; funds-flow diagram; unresolved dependencies; proposed team, budget and schedule."],
              ["B", "Product design", "Approved clickable checkout, website investor dashboard, issuer dashboard, operations screens and pass-to-dashboard journey."],
              ["C", "End-to-end build", "One sandbox issuer: checks → documents → payment → issuance → wallet → portal, including failures, refunds and reconciliation."],
              ["D", "Pilot and handover", "One approved live issuer with limited users; monitored launch; source, deployment scripts, documentation, runbooks and training."],
            ].map(([l, t, d], i) => (
              <Reveal key={l} delay={i * 0.06}>
                <div className="h-full rounded-[24px] border border-white/10 bg-white/[0.04] p-6">
                  <div className="text-display-sm text-gold">{l}</div>
                  <h3 className="mt-2 text-[16px] font-semibold">{t}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/60">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12 flex flex-wrap items-center gap-4">
            <Button href="/build-plan" variant="white">Read the build plan</Button>
            <TextLink href="/lumen/invest" tone="white">Start the demo from the Invest button</TextLink>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line-2 bg-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 text-[12px] text-ink-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-3">
            <FarkasLogo size={24} />
          </div>
          <p className="max-w-2xl leading-relaxed">
            Demonstration built from the technical scope of work dated 4 September 2026. Lumen Robotics, Harbor Coffee Roasters and Verdant Grid are fictional issuers with synthetic data. Provider integrations, e-signature, email codes and pass signing are simulated; the .pkpass pipeline signs real passes once Apple certificates are configured. {number(r.counts.issued)} issued holdings and {number(r.investorsCommitted)} committed investors in the seed.
          </p>
        </div>
      </footer>
    </main>
  );
}
