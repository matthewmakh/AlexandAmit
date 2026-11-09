Statement of work · SOW FC-2026-01

# Farkas Capital white-label capital-raising platform

Design and build of the platform described in Farkas Capital’s technical scope of work dated 4 September 2026: investment checkout and a private investor dashboard on each issuer’s website, an issuer dashboard, a private operations console, and a branded Apple Wallet or Google Wallet pass for every investment.

- Client: **Farkas Capital**

- Provider: **TyeNY LLC**

- Issued: **November 9, 2026**

- Offer valid until: **November 23, 2026**

## 1. Summary

The provider will lead architecture and delivery and build the first release of the platform for U.S. direct share offerings under Rule 506(c). The engagement takes the platform from the working demonstration already delivered to a production-ready build for one issuer, running end to end against provider sandboxes and ready for a monitored pilot once provider onboarding and counsel approvals are in place.

The engagement is priced on a **three-month term at \$10,000**, paid in three monthly instalments. If the final delivery is submitted within two months, as discussed, the **total becomes \$14,000**, which includes a basic landing page. After acceptance, 45 days of bug fixes are included, followed by an optional **Ongoing Support Plan at \$500 a month** that the client can decline at signing. Sections 6 and 10 have the details.

## 2. Already delivered

Before this engagement the provider built and deployed a clickable demonstration of the whole product with realistic data for a sample issuer. It covers the investor journey from the Invest button to a pass in Wallet, a pixel-faithful pass with server-driven updates, a real `.pkpass` generation and signing pipeline, the investor dashboard, the issuer dashboard, the operations console and a build plan. It serves as the agreed visual and interaction baseline for this work.

## 3. Deliverables

### 3.1 Investor checkout and investor dashboard (issuer website)

- Offering page with terms, price, minimum, risks, fees and documents; email-verified access with no password.
- Legal owner capture for individuals, entities and trusts; KYC, sanctions/AML and accreditation through the rails provider. Failed checks block progress.
- Embedded e-signature of subscription documents; payment by ACH and wire into escrow through the rails provider.
- Branded confirmation with Add to Apple Wallet and Add to Google Wallet.
- Private investor dashboard after secure login: holdings and share rights, transaction history, valuation basis and history, signed agreements, issuer updates and documents, pass re-download and profile correction requests. Only that issuer’s investments are shown.
- Delivered as a small JavaScript embed for the issuer’s existing site plus a hosted company-domain route, such as invest.company.com.

### 3.2 Wallet passes

- One signed Apple Wallet pass per completed order, reused on reinstall or update, never duplicated. Passes are issued under TyeNY’s Apple Developer account.
- Pass shows status, confirmed shares and class, registered owner, approved valuation and indicative value under the scope’s labelling rules; Pending issuance until the transfer agent confirms.
- Pass web service with device registration and push updates through APNs.
- Google Wallet Generic Private pass, subject to Google’s approval of the use case. Until then the branded dashboard and email link serve as the fallback.

### 3.3 Issuer dashboard

- Raise overview with committed, received, cleared, refunded and released funds shown separately, fees and net proceeds, daily trend and filters. Every headline number opens its records.
- Action centre, investor CRM with saved views, tags, notes, full timeline and permitted export, and conversion analytics by step, source and device.
- Offering controls with versioned terms and approval before material changes; money and ownership reporting; investor relations updates; team roles, branding, domain and audit history.

### 3.4 Farkas Capital operations console

- Issuer onboarding, offering approval, investor review, exception queues, communications review, fees, integration health and audit exports. Company users cannot bypass compliance decisions or edit confirmed ownership.

### 3.5 Platform and integrations

- Next.js and TypeScript application, PostgreSQL, encrypted document storage and a background job queue, with separate development, staging and production environments.
- Integrations with North Capital TransactAPI and the Kore transfer agent, or equivalents the client contracts, each behind an adapter, plus an embedded e-signature service that TyeNY sets up.
- Verified webhooks with idempotent handling of duplicate and out-of-order events, retries with alerts, and a daily reconciliation job. Payments are never confirmed from a browser success page.
- Issuer-level access enforced on every record and request; role-based access, staff MFA, audit of sensitive changes, and identity files kept out of logs.

### 3.6 Basic landing page (with early completion)

- One responsive marketing page for the platform: hero, product overview, how it works, and a contact call to action, deployed on a client-provided domain. Delivered as part of early completion; otherwise available as a \$500 add-on.

### 3.7 Handover

- Source code in the client’s repository, deployment scripts, API and data documentation, an operating runbook, and one training session.

## 4. Acceptance

Delivery is accepted when one sandbox issuer runs end to end, checks to documents to payment to issuance to wallet to portal, including failures, refunds and reconciliation, and the checks below pass. The client has ten business days from submission to review, and the provider fixes anything that falls short of these checks before acceptance.

**When the clock stops.** The two-month and three-month windows are measured to the date the provider submits the final delivery for review. The review period, and any fixes made during it, do not count toward either window.

- **Investor.** The flow completes on mobile; failed checks block progress; pending payments never appear as issued shares; confirmed holdings match the transfer agent.
- **Wallet.** Each investment has one unique pass; updates do not duplicate it; long names and values stay readable; its link opens the correct investment after login.
- **Issuer.** Dashboard totals reconcile with payment records; filters, exports and action queues work; roles prevent unauthorised changes.
- **Operations.** Duplicate events do not double-charge or double-issue; failed integrations are recoverable; one issuer cannot access another issuer’s records.

## 5. Timeline

| Phase                      | Early (2 months) | Term (3 months) | Output                                                                              |
|----------------------------|------------------|-----------------|-------------------------------------------------------------------------------------|
| **Feasibility and setup**  | Week 1           | Weeks 1–2       | Sandbox access confirmed, environments, data model, signed Apple pass on device     |
| **Investor flow**          | Weeks 2–4        | Weeks 3–6       | Checkout with live sandbox checks, signing and payments; investor dashboard         |
| **Ownership and wallet**   | Weeks 4–5        | Weeks 6–8       | Transfer-agent sync, pass updates, reconciliation, refunds                          |
| **Issuer and operations**  | Weeks 5–7        | Weeks 8–11      | Issuer dashboard, operations console, roles, audit, landing page (early completion) |
| **Hardening and handover** | Week 8           | Week 12         | Acceptance testing, security checks, documentation, training                        |

Weeks run from kickoff, which starts within a few business days of signature, to submission of the final delivery. If a dependency in section 7 takes longer than planned, both windows move by the same amount.

## 6. Fees and payment

Three-month term

\$10,000

Final delivery within 3 months (12 weeks)

|                                        |          |
|----------------------------------------|----------|
| Platform build (sections 3.1–3.5, 3.7) | \$10,000 |
| Total fee                              | \$10,000 |

Early completion

\$14,000

If final delivery is within 2 months (8 weeks)

|                                  |          |
|----------------------------------|----------|
| Platform build, early delivery   | \$13,500 |
| Basic landing page (section 3.6) | \$500    |
| Total fee                        | \$14,000 |

### Payment schedule

| Instalment                 | Invoiced                                                                  | Amount     |
|----------------------------|---------------------------------------------------------------------------|------------|
| 1 of 3                     | At signing (attached)                                                     | \$3,333.33 |
| 2 of 3                     | One month after kickoff                                                   | \$3,333.33 |
| 3 of 3                     | Two months after kickoff                                                  | \$3,333.34 |
| **Early-completion bonus** | On acceptance, only if the final delivery was submitted within two months | \$4,000.00 |

- Each invoice is payable within 30 days.
- **Early completion.** If the final delivery is submitted within two months of kickoff, the rest of the \$14,000 total falls due on acceptance: any instalments not yet invoiced plus the \$4,000 bonus, payable within 30 days.
- If the final delivery takes longer than two months, nothing more is owed for the build: the three instalments totalling \$10,000 are the full fee, on their normal schedule.
- Third-party costs are paid by the client directly, whether or not the client keeps the Ongoing Support Plan: rails provider, transfer agent, e-signature usage, Google Wallet, hosting, domains and email.

## 7. Client responsibilities and dependencies

Provider onboarding and legal approvals are launch dependencies, and the provider will help the client line them up. The build moves fastest with these in place early:

- Sandbox credentials and documentation for the rails provider and transfer agent, and their production access when ready.
- A Google Wallet issuer account. TyeNY provides the Apple Developer account and sets up the e-signature service.
- Counsel and compliance review of regulated workflows, disclosures and pass labelling.
- Domains, DNS access and brand assets for the sample issuer and the landing page.
- A named point of contact for product decisions.

## 8. Out of scope

Happy to quote any of these separately. Integration points are preserved so they can be added later without rework:

- Stablecoin payments; Reg A and Reg CF workflows; licensed-representative referral attribution; secondary trading; native mobile apps; broader CRM and advertising integrations.
- Legal, regulatory or compliance advice; provider contract negotiation; content writing beyond placeholder copy.
- Support and changes after the 45-day bug-fix period, unless the client keeps the Ongoing Support Plan in section 10.

## 9. Terms

- **What the build fee covers.** Delivery of section 3 and 45 days of bug fixes after acceptance.
- **Changes during the build.** Additions beyond section 3 are quoted in writing first, and nothing extra is billed without the client’s written approval.
- **Bug fixes.** Defects against section 4 reported within 45 days of acceptance are fixed at no charge.
- **Ownership.** The client owns the delivered source code and documentation. The provider may reuse general know-how and open-source components.
- **Confidentiality.** Each party keeps the other’s non-public information confidential. The provider will not handle investor money or hold investor credentials.

## 10. Ongoing Support Plan

Included by default · easy to decline

\$500 a month

Starts the day after the 45-day bug-fix period ends. Billed monthly. Cancel any time with 30 days’ written notice, including by email. No minimum term.

**Why keep it.** A capital-raising platform depends on outside services that keep changing. The plan keeps it working and improving after launch without a new contract for each request:

- **Ongoing fixes and tweaks.** Bug fixes after the first 45 days, plus small changes and refinements as the client’s needs evolve. Larger new features are quoted separately.
- **Keeping the rails current.** Updates when the rails provider, transfer agent, e-signature service, Apple Wallet or Google Wallet change their APIs or rules.
- **Security and upkeep.** Dependency and security updates, and renewal of the Apple pass signing certificate before it expires.
- **A monthly check-in** on what to improve next.

**If the client declines.** Nothing is charged after the 45-day bug-fix period. Later support or changes are quoted per request. Hosting and third-party costs remain the client’s either way.

**How to decline.** Tick the box in section 11 before signing, or email the provider at any time before the plan starts.

## 11. Acceptance of this statement of work

**Opt out of the Ongoing Support Plan**  
Tick this box to decline the \$500-a-month plan in section 10. If it is left blank, the plan starts the day after the 45-day bug-fix period ends and can be cancelled any time with 30 days’ notice.

Farkas Capital

Name and titleDate

TyeNY LLC

Matthew MakhDate
