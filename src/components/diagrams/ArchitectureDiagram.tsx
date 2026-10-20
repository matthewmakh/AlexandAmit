import { Arrow, Box, Frame, Lane, BLUE, GOLD, GREEN, INK3, LUMEN } from "./primitives";

/** Architecture and funds flow: our interface on top of regulated rails. */
export function ArchitectureDiagram({ className = "" }: { className?: string }) {
  return (
    <Frame viewBox="0 0 1260 540" label="Architecture: investor, issuer website, platform, providers, wallet" className={className}>
      <Lane x={20} y={20} w={300} h={500} label="Issuer's website" />
      <Lane x={340} y={20} w={340} h={500} label="Platform (TypeScript, PostgreSQL, job queue)" />
      <Lane x={700} y={20} w={540} h={500} label="Contracted providers" />

      {/* Investor and issuer surfaces */}
      <Box x={40} y={60} w={260} h={70} title="Investor" sub={["Company website → Invest", "Email code · no app"]} accent={LUMEN} />
      <Box x={40} y={160} w={260} h={92} title="Checkout + investor dashboard" sub={["invest.company.com or JS embed", "Checks · sign · pay · Add to Wallet", "Private dashboard after login"]} accent={LUMEN} />
      <Box x={40} y={282} w={260} h={70} title="Issuer dashboard" sub={["Raise, action centre, CRM, analytics", "Roles: admin, finance, marketing, read-only"]} accent={LUMEN} />
      <Box x={40} y={382} w={260} h={70} title="Wallet pass (display layer)" sub={["Apple Wallet · Google Wallet", "Deep link → investment detail page"]} accent={LUMEN} />

      {/* Platform */}
      <Box x={360} y={60} w={300} h={110} title="API + web app" sub={["Next.js / TypeScript", "Issuer-level access on every request", "Encrypted document storage"]} accent={BLUE} />
      <Box x={360} y={200} w={300} h={110} title="Records (PostgreSQL)" sub={["Issuer, Offering, SecurityClass, Investor", "Order, Signature, Payment, Allocation", "Holding, Valuation, WalletPass, AuditEvent"]} accent={BLUE} />
      <Box x={360} y={340} w={300} h={92} title="Webhook intake + job queue" sub={["Signature verified · idempotent · ordered", "Retries with alerts · daily reconciliation"]} accent={BLUE} />
      <Box x={360} y={456} w={300} h={56} title="Pass service + APNs push" sub="Registration, updated serials, latest pass" accent={BLUE} />

      {/* Providers */}
      <Box x={720} y={60} w={240} h={92} title="North Capital" sub={["KYC / AML · accreditation", "Escrow · ACH / wire · refunds"]} accent={GOLD} />
      <Box x={980} y={60} w={240} h={92} title="Stablecoin settlement" sub={["Optional per issuer", "Screening · USD conversion"]} accent={GOLD} />
      <Box x={720} y={176} w={240} h={76} title="Docusign" sub={["Embedded signing", "Completion certificate · PDFs"]} accent={GOLD} />
      <Box x={980} y={176} w={240} h={76} title="Kore (transfer agent)" sub={["Issuance · holdings", "Registered names · classes"]} accent={GOLD} />
      <Box x={720} y={276} w={500} h={70} title="Escrow account → release to issuer at closing" sub={["Funds never touch the platform's operating account", "Fees to broker-dealer per approved offering instructions"]} accent={GREEN} />
      <Box x={720} y={370} w={240} h={76} title="Apple Wallet" sub={["Pass Type ID · certificates", "APNs for updates"]} accent={GOLD} />
      <Box x={980} y={370} w={240} h={76} title="Google Wallet" sub={["Generic Private pass", "Use-case approval required"]} accent={GOLD} />
      <Box x={720} y={466} w={500} h={46} title="Farkas Capital operations console" sub="Approvals · exception queues · audit exports" accent={GOLD} fill="#111" dark />

      {/* Arrows */}
      <Arrow d="M300 206 L360 130" marker="arrow-blue" color={BLUE} />
      <Arrow d="M300 317 L360 250" marker="arrow-blue" color={BLUE} />
      <Arrow d="M510 170 L510 200" marker="arrow-blue" color={BLUE} />
      <Arrow d="M510 310 L510 340" marker="arrow-blue" color={BLUE} />
      <Arrow d="M510 432 L510 456" marker="arrow-blue" color={BLUE} />
      <Arrow d="M660 100 L720 100" label="checks · escrow" lx={690} ly={84} />
      <Arrow d="M660 214 L720 214" label="sign" lx={690} ly={198} />
      <Arrow d="M960 214 L980 214" />
      <Arrow d="M720 400 L660 400" dashed label="webhooks" lx={690} ly={384} />
      <Arrow d="M720 130 C690 160 690 330 660 380" dashed />
      <Arrow d="M980 110 L960 110" dashed />
      <Arrow d="M840 152 L840 276" color={GREEN} marker="arrow" label="cleared funds" lx={880} ly={214} />
      <Arrow d="M1100 252 L1100 276" dashed />
      <Arrow d="M660 484 L720 489" marker="arrow-gold" color={GOLD} />
      <Arrow d="M660 484 C700 484 700 408 720 408" marker="arrow-gold" color={GOLD} />
      <Arrow d="M660 484 C760 484 900 460 980 408" marker="arrow-gold" color={GOLD} dashed />
      <Arrow d="M300 417 C330 417 330 484 360 484" dashed label="deep link" lx={316} ly={458} />

      <text x={40} y={508} fontSize="11" fill={INK3}>Source of truth: payment provider for money · transfer agent for ownership · approved issuer records for valuation.</text>
    </Frame>
  );
}
