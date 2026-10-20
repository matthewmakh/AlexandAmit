import { getStore } from "@/lib/data/store";
import { date, money } from "@/lib/data/format";
import { OpsHeader, OpsCard, OpsCardTitle, DarkBadge, OpsButton } from "@/components/ops/ui";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export default function OpsOfferings() {
  const s = getStore();
  const o = s.offerings[0];
  const issuer = s.issuers[0];
  const pending = o.termsVersions.filter((t) => t.status === "pending_approval");
  const others = o.termsVersions.filter((t) => t.status !== "pending_approval").sort((a, b) => b.version - a.version);

  return (
    <>
      <OpsHeader eyebrow="Offerings" title="Offering approval" lede="Material changes to published terms are versioned and need compliance approval before they reach the issuer's website or any pass." />

      <OpsCard>
        <OpsCardTitle title="Awaiting approval" hint={`${pending.length} version${pending.length === 1 ? "" : "s"} across all issuers`} />
        {pending.map((t) => (
          <div key={t.version} className="rounded-[20px] border border-gold/30 bg-gold/[0.06] p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-semibold">{issuer.name} · {o.name} · terms v{t.version}</span>
                  <DarkBadge tone="gold" dot>Pending approval</DarkBadge>
                </div>
                <div className="mt-1 text-[13.5px] text-white/70">{t.summary}</div>
                <div className="mt-1 text-[12px] text-white/40">Submitted {date(t.createdAt)} by Avery Lindqvist (Company admin) · diff against v{t.version - 1}</div>
              </div>
              <div className="flex gap-2">
                <OpsButton tone="gold"><Icon name="check" size={14} /> Approve</OpsButton>
                <OpsButton>Request changes</OpsButton>
              </div>
            </div>
            <div className="mt-4 grid gap-2 text-[13px] sm:grid-cols-3">
              <Diff label="Maximum per entity investor" from={money(o.maxInvestment)} to={money(750_000)} />
              <Diff label="Maximum per individual" from={money(o.maxInvestment)} to={money(o.maxInvestment)} same />
              <Diff label="Risk factors" from="v2" to="v2" same />
            </div>
            <p className="mt-3 text-[12px] text-white/40">Approval publishes v{t.version} to lumenrobotics.com/invest and records a signed audit event. The checkout will show the new maximum for entity investors only.</p>
          </div>
        ))}
      </OpsCard>

      <OpsCard className="mt-5">
        <OpsCardTitle title="Version history" hint="Published and superseded terms" />
        <ul className="divide-y divide-white/[0.07]">
          {others.map((t) => (
            <li key={t.version} className="flex items-start justify-between gap-4 py-3">
              <div>
                <div className="text-[14px] font-medium">Terms v{t.version} <span className="text-white/40">· {date(t.createdAt)}</span></div>
                <div className="text-[12.5px] text-white/50">{t.summary}</div>
                {t.approvedBy ? <div className="text-[12px] text-white/35">Approved by {t.approvedBy}</div> : null}
              </div>
              <DarkBadge tone={t.status === "published" ? "green" : "neutral"} dot>{t.status === "published" ? "Published" : "Superseded"}</DarkBadge>
            </li>
          ))}
        </ul>
      </OpsCard>

      <OpsCard className="mt-5">
        <OpsCardTitle title="Published offering" hint="What investors see today" />
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-[13.5px] sm:grid-cols-4">
          {[
            ["Exemption", o.exemption],
            ["Price", money(o.pricePerShare, true)],
            ["Minimum", money(o.minInvestment)],
            ["Maximum", money(o.maxInvestment)],
            ["Target", money(o.targetAmount)],
            ["Next closing", date(o.nextClosingAt)],
            ["Closes", date(o.closesAt)],
            ["Documents", `${o.documents.length} on file`],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-[12px] text-white/40">{k}</dt>
              <dd className="tabular text-white/85">{v}</dd>
            </div>
          ))}
        </dl>
      </OpsCard>
    </>
  );
}

function Diff({ label, from, to, same = false }: { label: string; from: string; to: string; same?: boolean }) {
  return (
    <div className="rounded-xl bg-white/[0.04] p-3">
      <div className="text-[11px] uppercase tracking-[0.06em] text-white/40">{label}</div>
      <div className="mt-1 tabular">
        {same ? <span className="text-white/60">{to} · unchanged</span> : <><span className="text-white/40 line-through">{from}</span> <span className="mx-1 text-white/30">→</span> <span className="font-semibold text-gold">{to}</span></>}
      </div>
    </div>
  );
}
