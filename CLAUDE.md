# Farkas Capital platform: project rules

Read this first in every session. It overrides habits from other projects.

## What this is

A white-label capital-raising platform for **Farkas Capital** (registered broker-dealer), built by **TyeNY LLC** (Matthew Makh) under contract SOW FC-2026-01. Companies raise money on their own websites under Rule 506(c); investors get a branded Apple or Google Wallet pass per investment; issuers run the raise from a dashboard; Farkas runs compliance from an operations console.

## Read before building

1. `docs/01-agreement.md`: what we owe, the definition of done, money and deadlines. The contract itself is `docs/contract/sow-body.md`; it wins any disagreement.
2. `docs/client/technical-scope.md`: the client's requirements.
3. `docs/02-build-plan.md`: architecture, schedule, open decisions.
4. `docs/03-design-language.md`: the look and feel to keep.
5. `docs/04-lessons-from-the-demo.md`: what the demo got right and the shortcuts to avoid.

## Rules

- **The demo is a reference, not source code.** It lives on branch `claude/gallant-volta-q3lkph` of this repository. Use it for design, flows and ideas. Do not copy its code into this project; it is built on an in-memory store, fake auth and simulated providers.
- **Stay inside the contract.** Build what sections 3 and 4 of the SOW describe. Out-of-scope items (stablecoin, Reg A/CF, native apps, referral attribution, secondary trading, broader CRM/ad integrations) get integration points only. Anything else new goes to Matthew as a quote before any work.
- **Sources of truth:** the payment provider for money, the transfer agent for ownership, approved issuer records for valuation. Only verified provider events change money or ownership states. Never confirm a payment from a browser success page.
- **Tenancy on everything.** Every record carries an issuer, and every query and request is checked against it.
- **Money is integer cents.** Never floating point.
- **Never commit secrets, bank details, certificates or real investor data.** This repository is public. Secrets live in the hosting provider's secret manager.
- **Keep the logs current.** `docs/dependencies-log.md` (every request to the client and when it was fulfilled) and `docs/delivery-log.md` (the final delivery submission date). Both change what TyeNY is paid.
- **Next.js 16 differs from your training data.** Read `node_modules/next/dist/docs/` for the APIs you use before writing them.
- **Check your work visually.** Chromium for Playwright is at `/opt/pw-browsers/chromium`. Screenshot new screens at 1440px and 390px and look at them.

## Branches

`main` in this repository is an unrelated wedding website. **Base all work on `farkas-platform`, never on `main`.** If a session gives you a working branch, create it from `origin/farkas-platform`.
