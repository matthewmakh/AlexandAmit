import Link from "next/link";
import { getStore } from "@/lib/data/store";
import { actionItems, raiseSummary, reconciliation, transferAgentSync } from "@/lib/data/derive";
import { moneyCompact, ago, number } from "@/lib/data/format";
import { Icon } from "@/components/ui/Icon";
import { OpsHeader, OpsCard, OpsCardTitle, OpsStat, DarkBadge } from "@/components/ops/ui";

export const dynamic = "force-dynamic";

export default function OpsOverview() {
  const s = getStore();
  const r = raiseSummary();
  const actions = actionItems();
  const recon = reconciliation();
  const ta = transferAgentSync();
  const failedChecks = actions.filter((a) => a.type === "failed_check").length;
  const exceptions = recon.filter((x) => x.state === "exception" || x.state === "returned").length + ta.mismatched;
  const pendingTerms = s.offerings.flatMap((o) => o.termsVersions).filter((t) => t.status === "pending_approval").length;
  const integrationIssues = s.integrations.filter((i) => i.status !== "ok").length;

  const queues = [
    { href: "/ops/review", label: "Investor review", count: failedChecks, hint: "failed or flagged checks", tone: "red" as const },
    { href: "/ops/exceptions", label: "Exceptions", count: exceptions, hint: "returns, variances, register mismatches", tone: "gold" as const },
    { href: "/ops/offerings", label: "Offering approvals", count: pendingTerms, hint: "material changes awaiting review", tone: "gold" as const },
    { href: "/ops/communications", label: "Communications review", count: 1, hint: "draft awaiting approval", tone: "neutral" as const },
    { href: "/ops/issuers", label: "Issuer onboarding", count: 2, hint: "in pipeline", tone: "neutral" as const },
    { href: "/ops/integrations", label: "Integration issues", count: integrationIssues, hint: "pending approval or degraded", tone: integrationIssues ? "gold" as const : "green" as const },
  ];

  return (
    <>
      <OpsHeader eyebrow="Farkas Capital" title="Operations overview" lede="Every queue the broker-dealer owns, across every issuer on the platform. Decisions made here are logged and cannot be overridden by company users." />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {queues.map((q) => (
          <Link key={q.href} href={q.href} className="group rounded-[20px] border border-white/[0.08] bg-white/[0.04] p-4 transition-colors hover:bg-white/[0.07]">
            <div className="flex items-center justify-between text-[12px] text-white/45">
              {q.label}
              <Icon name="chevron-right" size={14} className="text-white/30 transition-transform group-hover:translate-x-0.5" />
            </div>
            <div className={`mt-1 text-[28px] font-semibold tabular tracking-[-0.02em] ${q.tone === "red" ? "text-[#ff6b61]" : q.tone === "gold" ? "text-gold" : q.tone === "green" ? "text-[#5ad67d]" : "text-white"}`}>{q.count}</div>
            <div className="text-[12px] text-white/40">{q.hint}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <OpsCard>
          <OpsCardTitle title="Issuers on the platform" hint="One live, two in onboarding" action={<Link href="/ops/issuers" className="text-[13px] font-medium text-gold hover:underline">All issuers</Link>} />
          <div className="divide-y divide-white/[0.07]">
            <IssuerRow name="Lumen Robotics" stage="Live" tone="green" detail={`Series A Direct Offering · ${moneyCompact(r.committed)} committed of ${moneyCompact(r.target)} · ${r.investorsCommitted} investors`} />
            <IssuerRow name="Harbor Coffee Roasters" stage="KYB in progress" tone="gold" detail="Entity verification and beneficial-owner review underway · offering not yet drafted" />
            <IssuerRow name="Verdant Grid" stage="Draft offering" tone="neutral" detail="Terms v1 drafted · awaiting counsel review before compliance approval" />
          </div>
        </OpsCard>

        <OpsCard>
          <OpsCardTitle title="Platform money today" hint="Lumen Robotics, sandbox providers" />
          <div className="grid grid-cols-2 gap-3">
            <OpsStat label="In escrow (cleared)" value={moneyCompact(r.cleared - r.released)} hint="awaiting next closing" />
            <OpsStat label="Released to issuers" value={moneyCompact(r.released)} hint="first closing" />
            <OpsStat label="Pending payments" value={moneyCompact(r.received - r.cleared)} hint={`${r.counts.payment_pending} in flight`} />
            <OpsStat label="Fees accrued" value={moneyCompact(r.placementFees + r.platformFees)} hint="placement + platform" tone="gold" />
          </div>
        </OpsCard>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <OpsCard>
          <OpsCardTitle title="Needs a decision" hint="Highest severity first" action={<Link href="/ops/review" className="text-[13px] font-medium text-gold hover:underline">Open queue</Link>} />
          <ul className="divide-y divide-white/[0.07]">
            {actions.slice(0, 5).map((a) => (
              <li key={a.id} className="flex items-start justify-between gap-4 py-3">
                <div className="min-w-0">
                  <div className="truncate text-[14px] font-medium text-white/90">{a.title}</div>
                  <div className="truncate text-[12px] text-white/45">{a.detail}</div>
                </div>
                <div className="shrink-0 text-right">
                  <DarkBadge tone={a.severity === "high" ? "red" : "orange"}>{a.severity}</DarkBadge>
                  <div className="mt-1 text-[11px] text-white/35">{ago(a.openedAt)}</div>
                </div>
              </li>
            ))}
          </ul>
        </OpsCard>

        <OpsCard>
          <OpsCardTitle title="Integration health" hint="Signed webhooks, retries and daily reconciliation" action={<Link href="/ops/integrations" className="text-[13px] font-medium text-gold hover:underline">Details</Link>} />
          <ul className="divide-y divide-white/[0.07]">
            {s.integrations.map((i) => (
              <li key={i.id} className="flex items-center justify-between gap-4 py-2.5">
                <div className="flex items-center gap-3">
                  <span className={`h-2 w-2 rounded-full ${i.status === "ok" ? "bg-[#34c759]" : i.status === "pending_approval" ? "bg-gold" : "bg-[#ff3b30]"}`} />
                  <span className="text-[13.5px] text-white/85">{i.name}</span>
                </div>
                <span className="text-[12px] text-white/40">{i.lastEventAt ? ago(i.lastEventAt) : i.status.replace("_", " ")}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 text-[12px] text-white/40">Transfer-agent sync: {number(ta.matched)} matched · {ta.pending} pending issuance · {ta.mismatched} mismatched</div>
        </OpsCard>
      </div>

      <p className="mt-8 text-[12px] text-white/35">Totals reconcile to payment-provider records on the daily job. All figures in USD; stablecoin settlements are shown at their settled USD amount.</p>
    </>
  );
}

function IssuerRow({ name, stage, tone, detail }: { name: string; stage: string; tone: "green" | "gold" | "neutral"; detail: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3.5">
      <div>
        <div className="text-[14.5px] font-medium text-white/90">{name}</div>
        <div className="text-[12.5px] text-white/45">{detail}</div>
      </div>
      <DarkBadge tone={tone} dot>{stage}</DarkBadge>
    </div>
  );
}
