# Build plan

These are recommendations, not settled decisions. Confirm the items marked **Decide** with Matthew at the start of the new thread before writing much code.

## Principles that come straight from the scope

- **Sources of truth.** Money status comes from the payment provider. Registered ownership comes from the transfer agent. Valuation comes from approved issuer records. Our database stores synchronized records and history. Wallet is a display layer only.
- **Payment is not ownership.** A pass shows "Pending issuance" until funds clear, the subscription is accepted, the offering closes and the transfer agent confirms issuance. Never "Shares owned" before that.
- **Never confirm a payment from a browser success page.** Only verified provider events move money states.
- **Every record and request is scoped to an issuer.** An investor's access to one company never reveals another's data.
- **The platform never holds investor money, crypto or credentials.**

## Architecture (recommended)

A small pnpm + Turborepo monorepo:

```
apps/
  web/        Next.js 16 app, multi-tenant by host name
              - hosted investor checkout and investor dashboard (invest.<issuer-domain>)
              - issuer dashboard (separate host, e.g. app.<platform-domain>)
              - Farkas operations console (separate host, staff only, MFA)
              - route handlers: provider webhooks, PassKit web service, Google Wallet callbacks
  worker/     Node process for background jobs: webhook processing, reconciliation,
              pass updates and APNs pushes, email
  embed/      tiny framework-free script for the issuer's existing site
              (opens the hosted checkout; no secrets, no PII)
  landing/    the basic landing page (contract 3.6; early completion only)
packages/
  domain/     pure TypeScript: order state machine, money (integer cents), raise math,
              pass field rules, eligibility rules. No I/O. Heavily unit-tested.
  db/         schema, migrations, tenancy policies
  integrations/  one interface per provider with a sandbox implementation and an
              in-memory fake for tests: rails (North Capital), transfer agent (Kore),
              e-signature, Apple Wallet, Google Wallet, email
  ui/         design system (see 03-design-language.md)
```

- **Database: PostgreSQL.** Money as integer cents (`bigint`), never floats. Every tenant table carries `issuer_id`. Enforce it in the data-access layer, and add Postgres row-level security as a second line of defence. **Decide:** ORM (Drizzle recommended for SQL-first control and RLS) and host (Railway Postgres, Neon or Supabase).
- **Jobs: pg-boss** on the same Postgres, to avoid running Redis. **Decide** if you prefer something else.
- **Webhooks:** verify the signature, insert into `provider_events` with a unique `(provider, event_id)`, enqueue, return 200 quickly. The worker applies events with version checks so duplicates and out-of-order events are harmless.
- **Outbox:** state changes write an outbox row in the same transaction; the worker turns those into pass updates, APNs pushes and emails.
- **Audit:** an append-only `audit_events` table written by the service layer for every sensitive change and approval.
- **Auth.** Investors: passwordless email codes, sessions scoped to the issuer's host (custom domains mean cookies cannot be shared across issuers, which is a feature). Issuer users and Farkas staff: email plus mandatory MFA, with roles (company admin, finance, marketing, read-only; staff roles for ops). **Decide** the library or service (Better Auth, WorkOS or similar); it must handle many custom domains.
- **Custom domains.** Resolve the tenant from the `Host` header in `proxy.ts` (Next 16's replacement for middleware). Hosting must support many custom domains with automatic TLS.
- **Documents.** Store references to provider-held documents where possible. Anything we must store goes in encrypted object storage with short-lived signed URLs, never in logs.
- **Environments.** Local, staging (sandbox providers), production. Secrets live in the host's secret manager, never in the repository.

## Core records (from the scope)

Issuer, Offering (with versioned TermsVersion and approval), SecurityClass, Investor, LegalOwner, Verification, Order, Signature, Payment, Allocation, Holding, Valuation (approved, with reference price per class), WalletPass (serial, auth token, version, device registrations), AuditEvent. Plus ProviderEvent, Outbox, Document, TeamMember/Role, CommunicationUpdate.

Order states worth starting from (validated in the demo, re-derive them properly):
`started → verifying → (check_failed) → awaiting_signature → awaiting_payment → payment_pending → payment_cleared → accepted → issued`, with `refunded` and `cancelled` as exits. Write it as an explicit transition table in `packages/domain` with tests for every allowed and forbidden transition.

## Integrations: what to confirm first

| Provider | Confirm before building against it |
|---|---|
| North Capital TransactAPI (rails) | Sandbox access, Farkas as broker-dealer and each party's role, KYC/AML and accreditation flows, ACH and wire, escrow and funds release, refunds, webhook signing, branding, and whether its built-in e-signature is enough. Read their sandbox docs; do not guess endpoints. |
| Kore (transfer agent) | Contracted legal transfer agent, issuance and holdings endpoints, registered names, share classes, webhooks, exports, reconciliation. Keep an adapter so an issuer's existing agent can be supported. |
| E-signature (TyeNY sets up) | **Decide** the provider. Requirements: embedded signing, templates, envelope status webhooks, completion certificate, signed PDF retrieval, branding. Check first whether the rails provider's integration covers it, to avoid a duplicate contract. |
| Apple Wallet (TyeNY account) | Create the Pass Type ID and signing certificate in TyeNY's Apple Developer account. Prove a signed pass installs on a real iPhone in week one, including web distribution, details link and a server-driven update. |
| Google Wallet | The client applies for the issuer account and the Generic Private pass use case in week one. Until approved, investors use the branded dashboard and email link. |
| Email | **Decide** the transactional provider. Issuer-branded sending domains need DKIM and SPF per issuer. |

## Schedule against the 8-week early window

Weeks count from kickoff. The aim is to **submit the final delivery by the end of week 8** (see 01-agreement.md for why). Build one thin vertical slice end to end before widening anything.

| Week | Work | Output |
|---|---|---|
| 0, before kickoff | Get the SOW signed. Request rails and transfer-agent sandboxes, start the Google Wallet application, create the Apple Pass Type ID, choose the e-signature provider, pick the sample issuer. Log every request date. | Dependencies in motion |
| 1 | Repository, CI, environments, schema v1, tenancy, auth skeleton, adapter interfaces with fakes. A signed Apple pass installed on a real device. | Foundation and a real pass |
| 2–4 | Investor flow on real sandboxes: offering page, email code, legal owner, checks, e-signature, ACH and wire, confirmation, pending pass, investor dashboard. | One investor end to end to "payment pending" |
| 4–5 | Ownership and wallet: acceptance, closing, transfer-agent issuance, pass updates over APNs, refunds and returns, daily reconciliation. | "Issued" end to end, passes update themselves |
| 5–7 | Issuer dashboard, operations console, roles and approvals, audit, JS embed, landing page. | All screens on real records |
| 8 | Run every acceptance check, security review, tenancy and idempotency tests, documentation, runbook, training. **Submit the final delivery and log the date.** | Final delivery submitted |

## Testing

- `packages/domain`: unit tests for the state machine, money math, raise buckets and pass field rules.
- Integration tests against the in-memory fakes, including webhook replays (same event twice, events out of order) proving no double charge or double issue.
- Tenancy tests: a user of issuer A gets nothing from issuer B by ID guessing, on every route.
- Playwright end-to-end tests of the investor flow at phone width (390px) and desktop.
- A checklist that maps each contract section 4 item to a test or a manual check, kept current in `docs/acceptance.md`.

## Open decisions to raise with Matthew on day one

1. Repository visibility. The code lives on the `farkas-platform` branch of `matthewmakh/AlexandAmit`, which is **public**, so the contract and the client's confidential scope are publicly readable. Recommend making the repository private (or moving to a new private repository) before the client relationship deepens.
2. Hosting (Railway was used for the demo), database host and ORM.
3. Auth library or service.
4. E-signature provider.
5. Email provider.
6. The sample issuer for acceptance and the pilot.
7. Who else is on the team, if anyone, and how work is split.
