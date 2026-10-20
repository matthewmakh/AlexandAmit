import { getStore } from "@/lib/data/store";
import { dateTime } from "@/lib/data/format";
import { OpsHeader, OpsCard, OpsTable, Td, DarkBadge } from "@/components/ops/ui";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export default function OpsAudit() {
  const s = getStore();
  return (
    <>
      <OpsHeader
        eyebrow="Audit"
        title="Audit history"
        lede="Sensitive changes and approvals across every issuer, with actor and role. Exports are themselves logged."
        action={
          <a href="/ops/audit/export" className="inline-flex h-9 items-center gap-1.5 rounded-full bg-gold px-4 text-[13px] font-medium text-ink hover:brightness-105">
            <Icon name="download" size={14} /> Export audit (CSV)
          </a>
        }
      />
      <OpsCard>
        <OpsTable head={["When", "Actor", "Action", "Subject", "Detail"]}>
          {s.audit.map((a) => (
            <tr key={a.id}>
              <Td muted className="whitespace-nowrap">{dateTime(a.at)}</Td>
              <Td>
                <div>{a.actor}</div>
                <DarkBadge tone={a.role === "Broker-dealer" ? "gold" : a.role === "Provider" ? "blue" : "neutral"}>{a.role}</DarkBadge>
              </Td>
              <Td className="font-medium">{a.action}</Td>
              <Td>{a.subject}</Td>
              <Td muted>{a.detail}</Td>
            </tr>
          ))}
        </OpsTable>
      </OpsCard>
    </>
  );
}
