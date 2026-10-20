import Link from "next/link";
import { getStore } from "@/lib/data/store";
import { actionItems, reconciliation, transferAgentSync } from "@/lib/data/derive";
import { ago, money, ageDays } from "@/lib/data/format";
import { OpsHeader, OpsCard, OpsCardTitle, OpsTable, Td, DarkBadge, OpsStat } from "@/components/ops/ui";

export const dynamic = "force-dynamic";

export default function OpsExceptions() {
  const s = getStore();
  const recon = reconciliation().filter((r) => r.state === "exception" || r.state === "returned");
  const ta = transferAgentSync();
  const mismatches = actionItems().filter((a) => a.type === "ta_mismatch");

  return (
    <>
      <OpsHeader eyebrow="Exceptions" title="Exception queues" lede="Money and ownership never confirm from a browser success page. Anything the providers report that does not reconcile lands here with an owner and an age." />

      <div className="grid gap-3 sm:grid-cols-3">
        <OpsStat label="Payment returns" value={recon.filter((r) => r.state === "returned").length} hint="ACH returned by the bank" tone="red" />
        <OpsStat label="Amount variances" value={recon.filter((r) => r.state === "exception").length} hint="provider amount ≠ order amount" tone="gold" />
        <OpsStat label="Register mismatches" value={ta.mismatched} hint="transfer-agent name ≠ submitted name" tone="gold" />
      </div>

      <OpsCard className="mt-5">
        <OpsCardTitle title="Payment exceptions" hint="From North Capital settlement records" />
        <OpsTable head={["Investor", "Provider ref", "Order amount", "Provider amount", "State", "Age", "Owner"]}>
          {recon.map((r) => (
            <tr key={r.payment.id}>
              <Td>
                <Link href={`/issuer/investors/${r.investor.id}`} className="font-medium hover:underline">{r.investor.owner.registeredName}</Link>
                <div className="text-[12px] text-white/40">{r.order.id}</div>
              </Td>
              <Td muted><span className="font-mono text-[12px]">{r.payment.providerRef}</span></Td>
              <Td className="tabular">{money(r.payment.amount)}</Td>
              <Td className="tabular">{money(r.payment.providerAmount)}{r.variance ? <span className="ml-1 text-gold">({r.variance > 0 ? "+" : ""}{money(r.variance)})</span> : null}</Td>
              <Td>
                <DarkBadge tone={r.state === "returned" ? "red" : "orange"} dot>{r.state === "returned" ? r.payment.returnCode : "Variance"}</DarkBadge>
              </Td>
              <Td muted>{ageDays(r.payment.returnedAt ?? r.payment.initiatedAt)}d</Td>
              <Td muted>{r.investor.accountManager}</Td>
            </tr>
          ))}
        </OpsTable>
        <p className="mt-3 text-[12px] text-white/40">Wire variances are usually intermediary-bank fees; the shortfall is collected or the share count adjusted before acceptance, never silently rounded.</p>
      </OpsCard>

      <OpsCard className="mt-5">
        <OpsCardTitle title="Transfer-agent mismatches" hint={`Nightly reconciliation with Kore · last run ${ago(ta.lastRun)} · ${ta.matched} matched, ${ta.pending} pending`} />
        <OpsTable head={["Investor", "Submitted name", "Transfer-agent record", "Age", "Owner", "Next action"]}>
          {mismatches.map((a) => {
            const inv = s.investors.find((i) => i.id === a.investorId)!;
            return (
              <tr key={a.id}>
                <Td><Link href={`/issuer/investors/${inv.id}`} className="font-medium hover:underline">{inv.firstName} {inv.lastName}</Link></Td>
                <Td>{inv.owner.registeredName}</Td>
                <Td className="text-gold">{inv.owner.transferAgentName}</Td>
                <Td muted>{ageDays(a.openedAt)}d</Td>
                <Td muted>{a.owner}</Td>
                <Td muted>{a.nextAction}</Td>
              </tr>
            );
          })}
        </OpsTable>
        <p className="mt-3 text-[12px] text-white/40">The pass shows the exact transfer-agent name once issued. A correction updates the register first, then the record, then the pass.</p>
      </OpsCard>
    </>
  );
}
