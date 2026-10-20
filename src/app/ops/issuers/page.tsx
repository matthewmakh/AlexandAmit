import { getStore } from "@/lib/data/store";
import { raiseSummary } from "@/lib/data/derive";
import { moneyCompact, date } from "@/lib/data/format";
import { OpsHeader, OpsCard, OpsTable, Td, DarkBadge, OpsButton } from "@/components/ops/ui";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export default function OpsIssuers() {
  const s = getStore();
  const r = raiseSummary();
  const lumen = s.issuers[0];
  const rows = [
    { name: lumen.legalName, domain: lumen.domain, stage: "Live", tone: "green" as const, kyb: "Cleared", counsel: "Approved", offering: `${s.offerings[0].name} · ${moneyCompact(r.committed)} committed`, since: date(s.offerings[0].opensAt), next: "Second closing 31 Oct" },
    { name: "Harbor Coffee Roasters, Inc.", domain: "harborcoffee.com", stage: "KYB in progress", tone: "gold" as const, kyb: "Beneficial owners pending", counsel: "Not started", offering: "None drafted", since: date(s.now), next: "Collect UBO identification for two shareholders" },
    { name: "Verdant Grid, Inc.", domain: "verdantgrid.energy", stage: "Draft offering", tone: "neutral" as const, kyb: "Cleared", counsel: "In review", offering: "Reg D 506(c) · terms v1 draft", since: date(s.updates[2].publishedAt), next: "Counsel comments on PPM due Friday" },
  ];
  const steps = ["Agreement signed", "KYB and beneficial owners", "Bank and escrow instructions", "Branding and domain", "Offering terms", "Counsel approval", "Compliance approval", "Live"];

  return (
    <>
      <OpsHeader eyebrow="Issuers" title="Issuer onboarding" lede="Each company moves through the same gates before anything is published on its website. Only Farkas Capital can mark an issuer live." action={<OpsButton tone="gold"><Icon name="plus" size={14} /> New issuer</OpsButton>} />

      <OpsCard>
        <OpsTable head={["Issuer", "Stage", "KYB", "Counsel", "Offering", "Since", "Next step"]}>
          {rows.map((x) => (
            <tr key={x.name}>
              <Td>
                <div className="font-medium">{x.name}</div>
                <div className="text-[12px] text-white/40">{x.domain}</div>
              </Td>
              <Td><DarkBadge tone={x.tone} dot>{x.stage}</DarkBadge></Td>
              <Td muted>{x.kyb}</Td>
              <Td muted>{x.counsel}</Td>
              <Td muted>{x.offering}</Td>
              <Td muted>{x.since}</Td>
              <Td muted>{x.next}</Td>
            </tr>
          ))}
        </OpsTable>
      </OpsCard>

      <OpsCard className="mt-5">
        <div className="mb-4 text-[15px] font-semibold">Onboarding gates</div>
        <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((st, i) => (
            <li key={st} className="flex items-center gap-3 rounded-2xl bg-white/[0.04] px-3 py-2.5 text-[13px]">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-[11px] font-semibold text-gold">{i + 1}</span>
              {st}
            </li>
          ))}
        </ol>
        <p className="mt-4 text-[12px] text-white/40">Provider onboarding and legal approvals are launch dependencies, not developer assumptions.</p>
      </OpsCard>
    </>
  );
}
