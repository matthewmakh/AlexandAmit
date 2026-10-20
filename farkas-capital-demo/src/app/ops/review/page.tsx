import Link from "next/link";
import { getStore } from "@/lib/data/store";
import { actionItems } from "@/lib/data/derive";
import { ago, money, date } from "@/lib/data/format";
import { OpsHeader, OpsCard, OpsCardTitle, DarkBadge, OpsButton } from "@/components/ops/ui";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export default function OpsReview() {
  const s = getStore();
  const queue = actionItems().filter((a) => a.type === "failed_check");
  const first = queue[0];
  const inv = first ? s.investors.find((i) => i.id === first.investorId)! : null;
  const order = first?.orderId ? s.orders.find((o) => o.id === first.orderId) : undefined;

  const checkTone = (v: string): "green" | "red" | "orange" | "neutral" => (v === "clear" ? "green" : v === "failed" ? "red" : v === "review" ? "orange" : "neutral");

  return (
    <>
      <OpsHeader eyebrow="Investor review" title="Verification decisions" lede="Failed identity, sanctions and accreditation checks stop the investor before signing. Only Farkas Capital staff can clear, request documents or reject." />

      <div className="grid gap-5 lg:grid-cols-[1fr_1.15fr]">
        <OpsCard padded={false}>
          <div className="border-b border-white/[0.07] px-5 py-4">
            <OpsCardTitle title={`Queue · ${queue.length}`} hint="Sanctions matches first" />
          </div>
          <ul className="divide-y divide-white/[0.07]">
            {queue.map((a, i) => {
              const investor = s.investors.find((x) => x.id === a.investorId)!;
              return (
                <li key={a.id} className={`px-5 py-4 ${i === 0 ? "bg-white/[0.05]" : ""}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-[14px] font-medium">{investor.owner.registeredName}</div>
                      <div className="truncate text-[12.5px] text-white/50">{a.detail}</div>
                      <div className="mt-1 text-[11.5px] text-white/35">Opened {ago(a.openedAt)} · owner {a.owner} · {investor.verification.providerRef}</div>
                    </div>
                    <DarkBadge tone={a.severity === "high" ? "red" : "orange"}>{a.severity}</DarkBadge>
                  </div>
                </li>
              );
            })}
          </ul>
        </OpsCard>

        {inv && first ? (
          <OpsCard>
            <OpsCardTitle
              title={inv.owner.registeredName}
              hint={`${inv.owner.ownerType} · ${inv.email} · ${inv.owner.region}, ${inv.owner.country}`}
              action={<Link href={`/issuer/investors/${inv.id}`} className="text-[12.5px] font-medium text-gold hover:underline">Issuer view</Link>}
            />
            <div className="flex flex-wrap gap-2">
              <DarkBadge tone={checkTone(inv.verification.kyc)}>KYC · {inv.verification.kyc}</DarkBadge>
              <DarkBadge tone={checkTone(inv.verification.aml)}>Sanctions/AML · {inv.verification.aml}</DarkBadge>
              <DarkBadge tone={checkTone(inv.verification.accreditation)}>Accreditation · {inv.verification.accreditation}</DarkBadge>
            </div>
            <div className="mt-5 rounded-2xl bg-[#ff3b30]/10 p-4 text-[13.5px] text-[#ffb3ad]">
              <div className="mb-1 flex items-center gap-1.5 font-semibold"><Icon name="warning" size={15} /> Provider result</div>
              {first.detail}. Provider reference {inv.verification.providerRef}.
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-[13px]">
              <div><dt className="text-white/40">Order</dt><dd className="tabular">{order ? `${money(order.amount)} · ${order.id}` : "None"}</dd></div>
              <div><dt className="text-white/40">Accreditation method</dt><dd>{inv.verification.accreditationMethod}</dd></div>
              <div><dt className="text-white/40">Applied</dt><dd>{date(inv.createdAt)}</dd></div>
              <div><dt className="text-white/40">Source</dt><dd>{inv.source.utmSource} · {inv.source.device}</dd></div>
            </dl>
            <div className="mt-6 rounded-[20px] border border-white/[0.1] p-4">
              <div className="text-[13px] font-semibold">Decision</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <OpsButton tone="gold"><Icon name="check" size={14} /> Clear</OpsButton>
                <OpsButton><Icon name="doc" size={14} /> Request documents</OpsButton>
                <OpsButton tone="red"><Icon name="x" size={14} /> Reject</OpsButton>
              </div>
              <textarea className="mt-3 w-full rounded-xl border border-white/[0.1] bg-white/[0.04] p-3 text-[13px] text-white placeholder:text-white/30 focus:outline-none" rows={2} placeholder="Reason for the decision (required, written to the audit log)" />
              <p className="mt-2 text-[11.5px] text-white/40">Every decision is logged with actor, time and reason. The issuer sees the outcome and next action in its Action center; it cannot change it. Identity documents stay with the provider and never enter this console&rsquo;s logs.</p>
            </div>
          </OpsCard>
        ) : null}
      </div>
    </>
  );
}
