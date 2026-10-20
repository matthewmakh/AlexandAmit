import { getStore } from "@/lib/data/store";
import { date, number } from "@/lib/data/format";
import { OpsHeader, OpsCard, OpsCardTitle, DarkBadge, OpsButton } from "@/components/ops/ui";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export default function OpsCommunications() {
  const s = getStore();
  const issuer = s.issuers[0];

  return (
    <>
      <OpsHeader eyebrow="Communications" title="Communications review" lede="Issuer updates and investor emails go out under the issuer's brand after a compliance read. FINRA 2210 applies to the content, whoever's logo is on it." />

      <OpsCard>
        <OpsCardTitle title="Awaiting review" hint="1 draft" />
        <div className="rounded-[20px] border border-gold/30 bg-gold/[0.06] p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-semibold">{issuer.name} · &ldquo;Second closing: last call for October&rdquo;</span>
                <DarkBadge tone="gold" dot>Draft</DarkBadge>
              </div>
              <div className="mt-1 text-[13px] text-white/60">Audience: in-progress applicants (signed, unpaid) · 6 recipients · submitted by Priya Natarajan (Marketing)</div>
            </div>
            <div className="flex gap-2">
              <OpsButton tone="gold"><Icon name="check" size={14} /> Approve and schedule</OpsButton>
              <OpsButton>Return with comments</OpsButton>
            </div>
          </div>
          <div className="mt-4 rounded-xl bg-white/[0.04] p-4 text-[13.5px] leading-relaxed text-white/75">
            <p>Hi {"{{first_name}}"}, your subscription for Lumen Robotics is signed and waiting on payment. To be included in the 31 October closing, funds need to clear by 28 October. ACH takes three to five business days; wires clear next day.</p>
            <p className="mt-2 text-white/50">[Payment instructions block · investor dashboard link · required disclosures footer]</p>
          </div>
          <div className="mt-3 flex items-start gap-2 text-[12px] text-[#ffb547]"><Icon name="warning" size={14} className="mt-0.5 shrink-0" /> Reviewer note: remove the word &ldquo;guaranteed&rdquo; from the subject line variant B before approval.</div>
        </div>
      </OpsCard>

      <OpsCard className="mt-5">
        <OpsCardTitle title="Sent" hint="Approved and delivered" />
        <ul className="divide-y divide-white/[0.07]">
          {s.updates.map((u) => (
            <li key={u.id} className="flex flex-wrap items-start justify-between gap-4 py-3.5">
              <div className="min-w-0">
                <div className="text-[14px] font-medium">{u.title}</div>
                <div className="text-[12.5px] text-white/50">{u.audience} · {date(u.publishedAt)}</div>
              </div>
              <div className="flex items-center gap-3 text-[12px] text-white/50">
                <span className="tabular">{number(u.delivery.sent)} sent · {number(u.delivery.opened)} opened · {u.delivery.bounced} bounced</span>
                <DarkBadge tone="green" dot>Approved by Farkas Capital</DarkBadge>
              </div>
            </li>
          ))}
        </ul>
      </OpsCard>
    </>
  );
}
