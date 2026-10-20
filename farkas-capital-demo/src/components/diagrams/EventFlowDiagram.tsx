import { Arrow, Box, Frame, Lane, BLUE, GOLD, GREEN, INK3, ORANGE } from "./primitives";

/** Verified provider event → records → reconciliation → pass update. */
export function EventFlowDiagram({ className = "" }: { className?: string }) {
  const steps = [
    ["Verified webhook", ["Signature checked", "Provider: NC · Kore · Docusign"]],
    ["Idempotency", ["Duplicate and out-of-order", "events dropped or held"]],
    ["Update records", ["Order · Payment · Holding", "AuditEvent written"]],
    ["Reconcile", ["Payment vs provider", "Holding vs transfer agent"]],
    ["Queue updates", ["Pass version bump", "Approved notification"]],
    ["Deliver", ["APNs → device fetches pass", "Branded email"]],
  ] as const;
  return (
    <Frame viewBox="0 0 1200 400" label="Event handling and reconciliation flow" className={className}>
      <Lane x={20} y={20} w={1160} h={180} label="Every provider event" />
      <Lane x={20} y={220} w={1160} h={160} label="Side lanes" color="#f7efd6" />
      {steps.map(([t, s], i) => (
        <g key={t}>
          <Box x={40 + i * 190} y={60} w={170} h={90} title={t} sub={[...s]} accent={i === 5 ? GREEN : BLUE} />
          {i < steps.length - 1 ? <Arrow d={`M${210 + i * 190} 105 L${230 + i * 190} 105`} marker="arrow-blue" color={BLUE} /> : null}
        </g>
      ))}
      <text x={40} y={182} fontSize="11" fill={INK3}>Failures retry with backoff and alert operations; nothing is confirmed from a browser success page.</text>

      <Box x={40} y={260} w={330} h={90} title="Daily reconciliation job" sub={["Cleared payments vs escrow ledger", "Issued holdings vs transfer-agent register"]} accent={GOLD} />
      <Box x={410} y={260} w={330} h={90} title="Ops alert on mismatch" sub={["Exception queue in the Farkas console", "Owner, age and next action"]} accent={ORANGE} />
      <Box x={780} y={260} w={380} h={90} title="Sources of truth" sub={["Money: payment provider", "Ownership: transfer agent · Valuation: approved issuer records"]} accent={GREEN} />
      <Arrow d="M370 305 L410 305" />
      <Arrow d="M740 305 L780 305" dashed />
      <Arrow d="M205 260 L205 150" dashed marker="arrow-gold" color={GOLD} />
    </Frame>
  );
}
