import { getStore } from "@/lib/data/store";
import { ago } from "@/lib/data/format";
import { OpsHeader, OpsCard, OpsCardTitle, DarkBadge, OpsButton } from "@/components/ops/ui";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

const TONE = { ok: "green", degraded: "orange", pending_approval: "gold", error: "red" } as const;
const LABEL = { ok: "Healthy", degraded: "Degraded", pending_approval: "Pending approval", error: "Error" } as const;

export default function OpsIntegrations() {
  const s = getStore();
  const failed = [
    { id: "evt_8812", provider: "North Capital TransactAPI", event: "payment.cleared", ref: "NC-ACH-2C9E51B0A4", attempts: 3, at: s.integrations[0].lastEventAt!, reason: "Signature header missing on retry; original delivery verified" },
  ];

  return (
    <>
      <OpsHeader eyebrow="Integrations" title="Integration health" lede="Every provider event is signature-verified, de-duplicated and replayable. A daily reconciliation job compares our records to the money and ownership sources of truth." />

      <div className="grid gap-3 md:grid-cols-2">
        {s.integrations.map((i) => (
          <OpsCard key={i.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[15px] font-semibold">{i.name}</div>
                <div className="text-[12.5px] text-white/45">{i.purpose}</div>
              </div>
              <DarkBadge tone={TONE[i.status]} dot>{LABEL[i.status]}</DarkBadge>
            </div>
            <div className="mt-3 text-[13px] text-white/70">{i.detail}</div>
            <div className="mt-3 flex items-center gap-3 text-[12px] text-white/40">
              <span className="rounded-full bg-white/[0.06] px-2 py-0.5 uppercase tracking-wider">{i.environment}</span>
              {i.lastEventAt ? <span>Last event {ago(i.lastEventAt)}</span> : <span>No events yet</span>}
            </div>
            {i.status === "pending_approval" ? (
              <p className="mt-3 rounded-xl bg-gold/[0.08] p-3 text-[12.5px] text-gold">Google requires pre-approval for a Generic Private pass carrying financial data. Until approved, Android investors get the same branded portal link and email; the pass is a display layer, not the source of truth.</p>
            ) : null}
          </OpsCard>
        ))}
      </div>

      <OpsCard className="mt-5">
        <OpsCardTitle title="Failed deliveries" hint="Retried with backoff; alert after the third failure" />
        <ul className="divide-y divide-white/[0.07]">
          {failed.map((f) => (
            <li key={f.id} className="flex flex-wrap items-center justify-between gap-4 py-3">
              <div>
                <div className="text-[14px] font-medium">{f.provider} · <span className="font-mono text-[12.5px]">{f.event}</span></div>
                <div className="text-[12.5px] text-white/50">{f.ref} · {f.attempts} attempts · {ago(f.at)} · {f.reason}</div>
              </div>
              <OpsButton><Icon name="refresh" size={14} /> Replay failed webhook</OpsButton>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[12px] text-white/40">Replays are idempotent: a duplicate event can never double-charge or double-issue.</p>
      </OpsCard>
    </>
  );
}
