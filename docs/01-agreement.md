# What we agreed to (SOW FC-2026-01)

The full contract is in [`contract/sow-body.md`](contract/sow-body.md), and the PDF sent to the client is [`contract/SOW_FC-2026-01_Farkas_Capital.pdf`](contract/SOW_FC-2026-01_Farkas_Capital.pdf). If this page and the contract ever disagree, the contract wins. The invoice is deliberately not stored in the repository because it contains bank details.

## Parties and status

| | |
|---|---|
| Client | Farkas Capital, the registered broker-dealer |
| Provider | TyeNY LLC (Matthew Makh) |
| Issued | November 9, 2026. Offer valid until November 23, 2026 |
| Status at handoff | Sent for signature, not yet signed. Kickoff starts within a few business days of signature, and every timeline below counts from kickoff. |

## What we deliver

A production-ready first release for **one issuer**, running end to end against provider sandboxes and ready for a monitored pilot once provider onboarding and counsel approvals are in place. U.S. direct share offerings under Rule 506(c) only.

1. **Investor checkout and investor dashboard** on the issuer's website: offering page, email-code access, legal owner capture (individual, entity, trust), KYC, sanctions/AML and accreditation through the rails provider, embedded e-signature, ACH and wire into escrow, branded confirmation with Add to Apple Wallet and Add to Google Wallet, and a private investor dashboard. Delivered as a JavaScript embed plus a hosted company-domain route.
2. **Wallet passes**: one signed Apple Wallet pass per order, reused and never duplicated, issued under **TyeNY's Apple Developer account**; pass web service with APNs updates; Google Wallet Generic Private pass subject to Google's approval.
3. **Issuer dashboard**: raise overview, action centre, investor CRM, conversion analytics, offering controls with versioned terms and approval, money and ownership, investor relations, team, branding, domain and audit.
4. **Farkas Capital operations console**: onboarding, offering approval, investor review, exception queues, communications review, fees, integration health, audit exports.
5. **Platform and integrations**: Next.js and TypeScript, PostgreSQL, encrypted document storage, background jobs, dev/staging/production. North Capital TransactAPI and Kore, or equivalents the client contracts, behind adapters. An embedded **e-signature service that TyeNY sets up**. Verified, idempotent webhooks and daily reconciliation. Issuer-level access on every record and request, roles, staff MFA, audit, identity files kept out of logs.
6. **Basic landing page**: one responsive marketing page. Delivered only as part of early completion; otherwise a $500 add-on.
7. **Handover**: source in the client's repository, deployment scripts, API and data documentation, runbook, one training session.

## Definition of done (contract section 4)

One sandbox issuer runs end to end: checks, documents, payment, issuance, wallet, portal, including failures, refunds and reconciliation. And:

- **Investor.** The flow completes on mobile. Failed checks block progress. Pending payments never appear as issued shares. Confirmed holdings match the transfer agent.
- **Wallet.** Each investment has one unique pass. Updates do not duplicate it. Long names and values stay readable. Its link opens the correct investment after login.
- **Issuer.** Dashboard totals reconcile with payment records. Filters, exports and action queues work. Roles prevent unauthorised changes.
- **Operations.** Duplicate events do not double-charge or double-issue. Failed integrations are recoverable. One issuer cannot access another issuer's records.

The client has ten business days from submission to review; TyeNY fixes anything short of these checks before acceptance.

## Money and the clock

| | |
|---|---|
| Base fee | $10,000 for final delivery within **3 months (12 weeks)** of kickoff, in three instalments: $3,333.33 at signing, $3,333.33 one month after kickoff, $3,333.34 two months after kickoff. Each payable within 30 days. |
| Early completion | If the final delivery is **submitted within 2 months (8 weeks)**, the total becomes **$14,000** ($13,500 platform + $500 landing page). The rest falls due on acceptance. |
| If it takes longer than 2 months | Nothing more is owed. $10,000 is the full fee. No penalty. |
| When the clock stops | On the date TyeNY **submits the final delivery** for review. The review period and fixes during it do not count. |
| Delays outside our control | If a client dependency (below) takes longer than planned, both windows move by the same amount. |
| Bug fixes | Free for **45 days** after acceptance. |
| Ongoing Support Plan | **$500 a month**, on by default, starting the day after the 45 days end. The client can tick an opt-out box at signing or email to decline before it starts. Cancel any time with 30 days' notice, no minimum. Covers ongoing fixes and tweaks, keeping provider and Wallet integrations current, security updates, Apple certificate renewal, and a monthly check-in. Larger features are quoted separately. |
| Third-party costs | Paid by the client directly whether or not they keep the plan: rails provider, transfer agent, e-signature usage, Google Wallet, hosting, domains, email. TyeNY provides the Apple Developer account. |

**Operational consequences for the build:**
- Keep a dated log of every dependency request and when it was fulfilled (`docs/dependencies-log.md`). That log is what moves the windows.
- Record the exact date and contents of the final delivery submission (`docs/delivery-log.md`). That date decides $10,000 versus $14,000.
- Plan the work so a complete, acceptable delivery can be submitted by **week 8**.

## What the client provides (contract section 7)

- Sandbox credentials and documentation for the rails provider and transfer agent, then production access.
- A Google Wallet issuer account. Approval of the private pass use case has a long lead time; apply in week one.
- Counsel and compliance review of regulated workflows, disclosures and pass labelling.
- Domains, DNS access and brand assets for the sample issuer and the landing page.
- A named point of contact for product decisions.

## Out of scope (contract section 8)

Stablecoin payments; Reg A and Reg CF workflows; licensed-representative referral attribution; secondary trading; native mobile apps; broader CRM and advertising integrations; legal, regulatory or compliance advice; provider contract negotiation; content writing beyond placeholder copy; support after the 45 days unless the client keeps the plan. **Preserve integration points for these so they can be added later, but do not build them.**

## Other terms

- Changes beyond section 3 during the build are quoted in writing first; nothing extra is billed without written approval.
- The client owns the delivered source code and documentation. TyeNY may reuse general know-how and open-source components.
- Mutual confidentiality. TyeNY never handles investor money or holds investor credentials.
