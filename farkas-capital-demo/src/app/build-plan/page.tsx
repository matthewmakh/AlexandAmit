import type { Metadata } from "next";
import Link from "next/link";
import { FloatingNav } from "@/components/marketing/FloatingNav";
import { FarkasLogo } from "@/components/brand/FarkasMark";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Eyebrow } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { FundsFlowDiagram } from "@/components/diagrams/FundsFlowDiagram";
import { EventFlowDiagram } from "@/components/diagrams/EventFlowDiagram";
import { Reveal } from "@/components/marketing/Reveal";

export const metadata: Metadata = { title: "Build plan" };

const TEAM = [
  ["Project lead (part-time)", "Architecture, provider selection, review, delivery management. Owns technical delivery; does not build everything personally."],
  ["Design lead", "Visual standard, clickable prototype, empty/loading/error states, mobile screens, pass template within Apple's limits."],
  ["Frontend engineer × 2", "Checkout and JS embed, investor dashboard on the issuer domain, issuer dashboard, operations console."],
  ["Backend / integrations engineer × 2", "TypeScript services, PostgreSQL, webhook verification and replay, reconciliation jobs, pass web service, provider adapters."],
  ["QA engineer", "End-to-end scripts for the definition of done: failures, refunds, reinstalls, delayed updates, duplicate events, tenant isolation."],
  ["DevOps / deployment", "Dev, staging and production environments, managed secrets, certificate renewal, backups, alerts, runbooks."],
];

const MILESTONES = [
  {
    key: "A",
    title: "Feasibility",
    weeks: "3–4 weeks",
    start: 0,
    span: 4,
    outputs: ["Working wallet demonstration", "Provider comparison", "Funds-flow diagram", "Unresolved dependencies", "Proposed team, budget, and schedule"],
    checks: ["Signed Apple pass installs and updates on a real device", "Google eligibility answered in writing", "Sandbox access confirmed for the rails and transfer agent"],
  },
  {
    key: "B",
    title: "Product design",
    weeks: "4 weeks",
    start: 3,
    span: 4,
    outputs: ["Approved clickable checkout", "Website investor dashboard", "Issuer dashboard", "Operations screens", "Pass-to-dashboard journey"],
    checks: ["Realistic data, empty/loading/error states, mobile screens", "Issuer finds an issue and reaches the investor in two clicks", "Visual standard agreed before full development"],
  },
  {
    key: "C",
    title: "End-to-end build",
    weeks: "10–12 weeks",
    start: 7,
    span: 12,
    outputs: ["One sandbox issuer: checks → documents → payment → issuance → wallet → portal", "Failures, refunds, and provider reconciliation included"],
    checks: ["Pending payments never appear as issued shares", "Duplicate events do not double-charge or double-issue", "One issuer cannot access another issuer's records"],
  },
  {
    key: "D",
    title: "Pilot and handover",
    weeks: "4–6 weeks",
    start: 19,
    span: 6,
    outputs: ["One approved live issuer with limited users", "Monitored launch", "Source code, deployment scripts, API/data documentation, operating runbooks, team training"],
    checks: ["Dashboard totals reconcile with payment records", "Backup restoration, tenant isolation and incident alerts tested", "Certificate ownership and renewal assigned"],
  },
];

const VENDORS = [
  ["North Capital TransactAPI", "KYC/AML, accreditation, securities payment and escrow", "Sandbox/docs and pricing; support for Farkas Capital as broker-dealer; each party's role; ACH/wire flows; webhooks; refunds; branding; funds release.", "Quote pending"],
  ["Kore / KoreBuilders", "Transfer-agent API candidate", "Contracted legal transfer agent; issuance and holdings endpoints; registered names; share classes; corporate actions; webhooks; export rights; reconciliation; adapter for an issuer's existing agent.", "Quote pending"],
  ["Docusign eSignature API", "Embedded document signing", "Embedded signing; templates; envelope status; completion certificate; signed PDF retrieval; branding. Use the rails provider's integration if sufficient to avoid duplicate contracts.", "Quote pending"],
  ["Apple Developer Program", "Direct pass integration", "Pass Type IDs, certificates, signing keys, brand authorization, pass hosting, registration/update endpoints, APNs; validate financial-summary use and visible identity.", "US$99 / year (published)"],
  ["Google Wallet", "Direct pass integration", "Issuer account, service credentials, use-case approval, permitted private pass type, add-to-wallet flow, updates, branding, production publishing access.", "No fee published; approval required"],
  ["Stablecoin settlement provider (optional)", "USDC/USDT acceptance, screening, USD conversion", "Jurisdictions, coins, networks, conversion costs, settlement timing, refund procedures; approved for securities-related payments; platform never holds keys.", "Quote pending"],
  ["Managed cloud (Railway, Vercel or AWS)", "Dev, staging, production", "Separate environments, managed secrets, PostgreSQL, encrypted document storage, background job queue, backups.", "Usage-based; estimate at feasibility"],
  ["Branded email", "Transactional and investor-relations email", "Per-issuer sending domain, DKIM/SPF, delivery results, retention.", "Usage-based; estimate at feasibility"],
];

const RISKS = [
  ["Google Wallet approval", "Generic Private passes carrying financial data need pre-approval and may be refused or limited.", "Apply during feasibility; ship Apple first; Android investors get the same branded portal link and email until approved."],
  ["Provider commercial access", "Commercial terms and support for Farkas Capital's broker-dealer role are unconfirmed.", "Treat as a launch dependency: request sandbox, pricing and role confirmation before estimating the full build."],
  ["Apple pass field limits", "Apple controls fields and layout; no custom front-of-pass button, no full dashboard.", "Essential holdings on the front, other fields in details, 'View investor dashboard' link in the details area. Test long names."],
  ["Duplicate and out-of-order webhooks", "Replayed or reordered provider events could double-charge or double-issue.", "Idempotency keys per event, signature verification, state machine that rejects backwards transitions, daily reconciliation."],
  ["Tenant isolation", "One issuer's access leaking another's investor data would be unrecoverable.", "Issuer id on every record and query, row-level checks in the data layer, isolation tests in CI, audit on every export."],
  ["Counsel and compliance approvals", "Regulated workflows cannot launch on developer assumptions.", "Counsel approves 506(c) workflow, disclosures and pass wording; configurable eligibility rules so Reg A and Reg CF are separate approved workflows later."],
];

const DECISIONS = [
  ["First release scope", "U.S. direct share offerings under Rule 506(c) only, subject to counsel. Reg A and Reg CF as later, separately approved workflows."],
  ["Stablecoin payments", "Optional, enabled per issuer after testing and approval; built as a separate integration so it never delays the first release."],
  ["Hosting on the issuer's site", "JavaScript embed on the existing website, a hosted route such as invest.company.com, or both. Decide per issuer; demo shows the hosted route."],
  ["Transfer agent", "Kore as default via API, with an adapter for an issuer's existing agent if required. Confirm the contracted legal transfer agent."],
  ["Pass value labelling", "Show 'Indicative value' only with an approved reference price for the same class; otherwise 'Value unavailable' plus the original amount. Counsel to approve wording."],
  ["Design standard sign-off", "Approve the visual standard from the clickable prototype before full development starts."],
];

const PROVES = [
  ["Investor journey on the issuer's website", "/lumen/invest", "Offering page, six-step checkout, branded confirmation with Add to Wallet."],
  ["One investment, one pass", "/wallet/pass_jordan_1", "Pixel-faithful pass with the scope's field rules; real .pkpass bundle, web service endpoints, version bumps on updates."],
  ["Investor dashboard on the issuer domain", "/lumen/investors", "Holdings, valuation basis, documents, updates; only that company's investments."],
  ["An issuer dashboard worth using", "/issuer", "Raise overview with drill-downs, action center, CRM with timeline, conversion analytics, money and ownership."],
  ["Private operations console", "/ops", "Queues the broker-dealer owns; company users cannot bypass compliance decisions."],
];

const MOCKED = [
  "North Capital, Kore and Docusign calls are simulated behind the same interfaces the real adapters will implement.",
  "Email verification shows the code on screen; no email is sent.",
  "Pass bundles are unsigned until an Apple Pass Type ID certificate is configured; the signing path is implemented.",
  "Google Wallet is a preview; the Generic Private pass class needs Google approval.",
  "Data lives in memory and resets on restart; the real build uses PostgreSQL with the same record shapes.",
];

export default function BuildPlanPage() {
  return (
    <main className="bg-paper text-ink">
      <FloatingNav
        brand={<Link href="/" aria-label="Farkas Capital demo home"><FarkasLogo size={28} /></Link>}
        links={[{ href: "/", label: "Pitch" }, { href: "/build-plan", label: "Build plan" }, { href: "/issuer", label: "Issuer dashboard" }]}
        cta={<Button href="/lumen/invest" size="sm">Try the journey</Button>}
      />

      <header className="bg-aurora">
        <div className="mx-auto max-w-3xl px-5 pb-16 pt-36 sm:pt-44">
          <Reveal>
            <Eyebrow tone="blue">Project lead&rsquo;s first deliverable</Eyebrow>
            <h1 className="text-display-lg mt-4 text-balance">Build plan.</h1>
            <p className="text-lede mt-5 text-ink-3">The team, the milestones with their acceptance checks, the vendor items still to confirm, the risks, and the decisions only the product owner and counsel can make. Written against the scope dated 4 September 2026.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge tone="blue">Wallet-led first release</Badge>
              <Badge tone="neutral">Rule 506(c)</Badge>
              <Badge tone="neutral">About 26 weeks to pilot</Badge>
            </div>
          </Reveal>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-5">
        {/* 01 Team */}
        <Section n="01" title="The team" lede="Seven roles, one of them part-time. The project lead reviews work and manages delivery.">
          <div className="divide-y divide-line-2 overflow-hidden rounded-[24px] border border-line-2">
            {TEAM.map(([role, what]) => (
              <div key={role} className="grid gap-1 bg-paper px-5 py-4 sm:grid-cols-[220px_1fr] sm:gap-6">
                <div className="text-[15px] font-semibold">{role}</div>
                <div className="text-[14px] leading-relaxed text-ink-3">{what}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* 02 Milestones */}
        <Section n="02" title="Milestones" lede="Validate before estimating the full build. Then design, build, and pilot.">
          <div className="card p-6">
            <div className="mb-3 flex justify-between text-[11px] uppercase tracking-[0.08em] text-ink-4">
              <span>Week 0</span><span>Week 13</span><span>Week 26</span>
            </div>
            <div className="space-y-2">
              {MILESTONES.map((m, i) => (
                <div key={m.key} className="relative h-9">
                  <div className="absolute inset-y-0 rounded-full" style={{ left: `${(m.start / 26) * 100}%`, width: `${(m.span / 26) * 100}%`, background: ["#0071e3", "#5e5ce6", "#2b5cff", "#30b0c7"][i] }}>
                    <span className="flex h-full items-center truncate px-3 text-[12.5px] font-semibold text-white">{m.key} · {m.title}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[12px] text-ink-4">Overlaps are deliberate: design starts while feasibility finishes; pilot preparation starts before the build is complete. Dates firm up after vendor confirmation.</p>
          </div>
          <div className="mt-6 space-y-5">
            {MILESTONES.map((m) => (
              <div key={m.key} className="rounded-[24px] bg-canvas p-6">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-[19px] font-semibold tracking-[-0.01em]"><span className="mr-2 text-blue">{m.key}</span>{m.title}</h3>
                  <span className="text-[13px] text-ink-3">{m.weeks}</span>
                </div>
                <div className="mt-4 grid gap-5 sm:grid-cols-2">
                  <div>
                    <div className="text-eyebrow mb-2 text-ink-4">Required output</div>
                    <ul className="space-y-1.5 text-[14px] text-ink-2">{m.outputs.map((o) => <li key={o} className="flex gap-2"><Icon name="arrow-right" size={14} className="mt-1 shrink-0 text-blue" />{o}</li>)}</ul>
                  </div>
                  <div>
                    <div className="text-eyebrow mb-2 text-ink-4">Acceptance checks</div>
                    <ul className="space-y-1.5 text-[14px] text-ink-2">{m.checks.map((c) => <li key={c} className="flex gap-2"><Icon name="check" size={14} className="mt-1 shrink-0 text-green" />{c}</li>)}</ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Diagrams */}
        <Section n="03" title="Funds and data flow" lede="Money moves through contracted financial providers to the designated escrow or issuer account. The platform never holds investor money.">
          <div className="card overflow-x-auto p-4 sm:p-6"><div className="min-w-[760px]"><FundsFlowDiagram /></div></div>
          <div className="card mt-5 overflow-x-auto p-4 sm:p-6"><div className="min-w-[760px]"><EventFlowDiagram /></div></div>
        </Section>

        {/* 04 Vendors */}
        <Section n="04" title="Vendor items to confirm" lede="Commercial access is not yet confirmed for any provider. Only Apple's developer fee is public.">
          <div className="divide-y divide-line-2 overflow-hidden rounded-[24px] border border-line-2">
            {VENDORS.map(([name, role, confirm, cost]) => (
              <div key={name} className="bg-paper px-5 py-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="text-[15px] font-semibold">{name} <span className="font-normal text-ink-4">· {role}</span></div>
                  <Badge tone={cost.startsWith("Quote") ? "orange" : cost.startsWith("US$") ? "green" : "neutral"}>{cost}</Badge>
                </div>
                <div className="mt-1.5 text-[13.5px] leading-relaxed text-ink-3"><span className="font-medium text-ink-2">Confirm:</span> {confirm}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* 05 Risks */}
        <Section n="05" title="Risks and mitigations">
          <div className="space-y-3">
            {RISKS.map(([r, why, how]) => (
              <div key={r} className="rounded-[24px] bg-canvas p-5">
                <div className="flex items-center gap-2 text-[15px] font-semibold"><Icon name="warning" size={16} className="text-orange" />{r}</div>
                <p className="mt-1.5 text-[14px] text-ink-3">{why}</p>
                <p className="mt-2 text-[14px] text-ink-2"><span className="font-medium">Mitigation:</span> {how}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 06 Decisions */}
        <Section n="06" title="Decisions for the product owner" lede="The product owner approves product and design; counsel and compliance approve regulated workflows.">
          <ol className="space-y-3">
            {DECISIONS.map(([d, rec], i) => (
              <li key={d} className="flex gap-4 rounded-[24px] border border-line-2 p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-soft text-[13px] font-semibold text-blue">{i + 1}</span>
                <div>
                  <div className="text-[15px] font-semibold">{d}</div>
                  <div className="mt-1 text-[14px] text-ink-3"><span className="font-medium text-ink-2">Recommendation:</span> {rec}</div>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        {/* 07 Demo */}
        <Section n="07" title="What this demo already proves" lede="And, honestly, what it mocks.">
          <div className="divide-y divide-line-2 overflow-hidden rounded-[24px] border border-line-2">
            {PROVES.map(([t, href, d]) => (
              <Link key={href} href={href} className="group flex items-center justify-between gap-4 bg-paper px-5 py-4 transition-colors hover:bg-canvas">
                <div>
                  <div className="text-[15px] font-semibold">{t}</div>
                  <div className="text-[13.5px] text-ink-3">{d}</div>
                </div>
                <Icon name="chevron-right" size={16} className="shrink-0 text-ink-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
          <div className="mt-5 rounded-[24px] bg-orange-soft p-5 text-[14px] text-[#7a4a00]">
            <div className="mb-2 font-semibold">Mocked in this demo</div>
            <ul className="space-y-1.5">{MOCKED.map((m) => <li key={m} className="flex gap-2"><span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-current" />{m}</li>)}</ul>
          </div>
        </Section>

        <div className="border-t border-line-2 py-16 text-center">
          <p className="text-lede text-ink-3">Next step: vendor sandbox requests and the Apple pass validation, then an estimate with real numbers.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button href="/lumen/invest">Try the investor journey</Button>
            <Button href="/" variant="secondary">Back to the pitch</Button>
          </div>
          <p className="mt-10 text-[12px] text-ink-4">Provider and platform references checked 4 September 2026. Availability, commercial terms and approval of this exact use case must be confirmed during feasibility.</p>
        </div>
      </article>
    </main>
  );
}

function Section({ n, title, lede, children }: { n: string; title: string; lede?: string; children: React.ReactNode }) {
  return (
    <Reveal as="section" className="py-14">
      <div className="mb-8">
        <div className="font-display text-[44px] font-bold leading-none tracking-[-0.04em] text-blue/25">{n}</div>
        <h2 className="text-display-md mt-2">{title}</h2>
        {lede ? <p className="text-lede mt-3 text-ink-3">{lede}</p> : null}
      </div>
      {children}
    </Reveal>
  );
}
