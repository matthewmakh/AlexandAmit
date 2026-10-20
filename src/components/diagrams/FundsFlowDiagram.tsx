import { Arrow, Box, Frame, Lane, BLUE, GOLD, GREEN, INK3, LUMEN, RED } from "./primitives";

/** Where money goes: investor → rail → escrow → closing → issuer, with fees and refunds. */
export function FundsFlowDiagram({ className = "" }: { className?: string }) {
  return (
    <Frame viewBox="0 0 1200 420" label="Funds flow from investor to issuer with fees and refunds" className={className}>
      <Lane x={20} y={20} w={1160} h={250} label="Investment funds" />
      <Lane x={20} y={290} w={1160} h={110} label="Exceptions" color="#fff4e0" />

      <Box x={40} y={60} w={180} h={80} title="Investor" sub={["Signed subscription", "USD-priced order"]} accent={LUMEN} />
      <Box x={260} y={60} w={220} h={80} title="Payment rail" sub={["ACH $1.50 · wire $25", "Stablecoin → USD (1%)"]} accent={BLUE} />
      <Box x={520} y={60} w={220} h={80} title="Escrow (North Capital)" sub={["Held per offering instructions", "Pending → cleared"]} accent={GOLD} />
      <Box x={780} y={60} w={180} h={80} title="Closing" sub={["Subscription accepted", "Transfer agent issues"]} accent={GREEN} />
      <Box x={1000} y={60} w={160} h={80} title="Issuer account" sub={["Net proceeds", "released"]} accent={GREEN} />

      <Arrow d="M220 100 L260 100" />
      <Arrow d="M480 100 L520 100" label="verified submission" lx={500} ly={126} />
      <Arrow d="M740 100 L780 100" label="funds cleared" lx={760} ly={126} />
      <Arrow d="M960 100 L1000 100" color={GREEN} label="release" lx={980} ly={126} />

      <Box x={520} y={170} w={220} h={70} title="Fees at closing" sub={["Placement 3.5% · platform 1.0%", "to Farkas Capital"]} accent={GOLD} />
      <Arrow d="M870 140 C870 205 760 205 740 205" marker="arrow-gold" color={GOLD} />

      <Box x={40} y={320} w={260} h={60} title="ACH return (R01, R03)" sub="Order back to awaiting payment; action item" accent={RED} />
      <Box x={330} y={320} w={260} h={60} title="Refund before closing" sub="Escrow returns funds; pass marked refunded" accent={RED} />
      <Box x={620} y={320} w={260} h={60} title="Amount variance" sub="Provider vs internal; reconciliation exception" accent={RED} />
      <Box x={910} y={320} w={250} h={60} title="Daily reconciliation" sub="Payments, holdings, passes" accent={BLUE} />

      <Arrow d="M370 140 C370 250 200 250 170 320" marker="arrow-red" color={RED} dashed />
      <Arrow d="M630 140 C630 250 480 250 460 320" marker="arrow-red" color={RED} dashed />
      <Arrow d="M700 140 C700 250 740 250 750 320" marker="arrow-red" color={RED} dashed />

      <text x={40} y={262} fontSize="11" fill={INK3}>The platform never holds investor money in its own operating account. Payment is not yet ownership; shares issue only after acceptance, closing and transfer-agent confirmation.</text>
    </Frame>
  );
}
