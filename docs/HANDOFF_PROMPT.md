You're taking over as build lead for the **Farkas Capital platform**. I'm Matthew Makh of TyeNY LLC. In a previous thread we pitched this to Farkas Capital with a clickable demo and wrote the contract. Now we build the real product.

## Where everything is

- Repository `matthewmakh/AlexandAmit`, branch **`farkas-platform`**. That branch holds only this project: rules, contract, client scope, plan, design notes and trackers. No app code yet.
- `main` in this repository is an **unrelated wedding website**. Never base work on it. Fetch `farkas-platform` and create your working branch from `origin/farkas-platform`.
- Read these before anything else, in order:
  1. `CLAUDE.md`: project rules
  2. `docs/01-agreement.md`: what we owe and how I get paid (full contract in `docs/contract/sow-body.md`; the contract wins any disagreement)
  3. `docs/client/technical-scope.md`: Farkas's requirements
  4. `docs/02-build-plan.md`: recommended architecture, 8-week schedule, open decisions
  5. `docs/03-design-language.md`: the look and feel
  6. `docs/04-lessons-from-the-demo.md`: what to keep and what to avoid
- The demo is on branch `claude/gallant-volta-q3lkph` of the same repository. **I love its design, vibe and ideas, so match them. But it is not source code.** It runs on an in-memory store, fake auth and simulated providers. Rebuild everything properly; don't copy it over.

## The deal in one paragraph

A production-ready first release for one issuer: Rule 506(c) offerings, investor checkout and dashboard on the issuer's site, signed Apple Wallet passes (on **my** Apple Developer account) plus Google Wallet once approved, an issuer dashboard, a Farkas operations console, and real sandbox integrations (North Capital for checks, escrow and payments; Kore as transfer agent; an e-signature provider **I set up**). $10,000 for final delivery within 3 months of kickoff, paid monthly. **$14,000 if I submit the final delivery within 8 weeks**, and the clock stops the day I submit. Client-side delays extend both windows. Then 45 days of free bug fixes, and a $500-a-month support plan unless they opt out. Stablecoin, Reg A/CF, native apps and the other exclusions get integration points only.

## Status

The contract was sent November 9 and isn't signed yet; the offer is open until November 23. Kickoff follows signature. Until then, do the week-0 work that doesn't depend on Farkas.

## How I want you to work

1. **Start by asking me the open decisions** in `docs/02-build-plan.md`, all in one batch, each with your recommendation. After that, work autonomously and only stop for things that are truly mine to decide.
2. **Aim to submit the final delivery by the end of week 8.** Build one thin slice end to end on real sandboxes first (one investor from Invest button to issued pass), then widen.
3. **Design is intensely Apple**, per `docs/03-design-language.md`. Every screen works at desktop and 390px wide, with empty, loading and error states. Screenshot your screens and look at them before calling anything done.
4. **Correctness rules from the contract:** money and ownership change only on verified provider events; every query is scoped to an issuer; money is integer cents; duplicate and out-of-order webhooks are harmless; nothing confirms a payment from a browser page.
5. **Verify before you report.** Types, lint, tests and screenshots pass before you tell me something works. Map each item of contract section 4 to a test in `docs/acceptance.md`.
6. **Keep `docs/dependencies-log.md` and `docs/delivery-log.md` current.** They decide whether I earn $10,000 or $14,000.
7. **The repository is public.** Never commit secrets, certificates, bank details or real investor data. When you need my Apple pass certificate or provider keys, ask me to add them as environment secrets, never in chat.
8. **Next.js 16 differs from what you know.** Read `node_modules/next/dist/docs/` before using an API.
9. Explain things to me in plain language, and tell me when something in the scope or contract looks risky.

## First deliverables in this thread

1. The open decisions, confirmed with me.
2. The repository scaffold from the build plan, with CI running type checks, lint and tests.
3. Database schema v1 and the domain package (order state machine, money, pass field rules) with tests.
4. A signed Apple Wallet pass installed on my iPhone from a staging URL, with a server-driven update.
5. A short email I can send Farkas asking for every client dependency in `docs/01-agreement.md`, with the requests logged in `docs/dependencies-log.md`.
