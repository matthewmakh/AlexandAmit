# Farkas Capital: technical scope of work (client document)

> Transcribed from `Farkas_Capital_Technical_Scope_2026-09-04.pdf` (6 pages, "Private working scope", dated 4 September 2026). The PDF is authoritative; this copy exists so it can be searched and quoted. Formatting is adjusted, wording is not.

## 01 · Product: Invest on the company website. Keep it in your Wallet.

**The idea.** Build a white-label capital-raising platform. Each company raises money on its own website, manages the raise in an excellent dashboard, and gives each investor a company-branded Apple Wallet or Google Wallet pass. The company is the brand throughout the experience.

**Project lead role.** Lead architecture, choose providers, organize the development team, review the work, and manage delivery. The project lead is not expected to build everything personally.

### 1. Three connected products

| Product | Description |
|---|---|
| Company website + investor dashboard | Investment checkout and a private investor dashboard on the issuer's website. Investors open it from their Wallet pass for detailed shareholder information. |
| Issuer dashboard | The company's control center for its raise, investors, payments, marketing results, and shareholder communications. |
| Wallet investment passes | A separate branded pass for each investment. Wallet is the familiar place where an investor can keep passes from different companies. |

### 2. The investor journey

1. Click "Invest" on the company website. Read the offering terms, price, minimum investment, risks, and fees.
2. Create access using email verification. Enter legal owner details, investment amount, and required information.
3. Complete identity checks (KYC), sanctions/AML checks, and accreditation verification when required.
4. Sign subscription documents electronically and pay through the approved payment provider. Stablecoin payments may be offered where the issuer enables the optional integration described in Section 05.
5. See a branded confirmation with "Add to Apple Wallet" or "Add to Google Wallet." The investor confirms the add action.
6. Open the pass for a summary. Tap "View investor dashboard" to open the private dashboard on the issuer's website. No separate mobile app is required.

### 3. Brand and launch rules

Use the issuer's logo, colors, domain, support identity, and email branding. No "Powered by Farkas Capital" marketing badge or shared investor marketplace. However, required broker-dealer identification and legal disclosures must remain where counsel requires them. Farkas Capital is the registered broker-dealer; the interface cannot remove its actual legal role. FINRA 2210.

**Proposed first release:** U.S. direct share offerings under Rule 506(c), subject to business and counsel approval. This permits public promotion with verified accredited purchasers. Build configurable eligibility rules; add Reg A and Reg CF as separate approved workflows later. SEC guidance.

## 02 · Wallet: One investment. One pass.

*Product requirements and platform limits*

**Pass identity:** one pass per completed investment order / allocation. A second purchase creates a separate pass, including in the same company. Reinstalling or updating that investment must reuse its pass ID, without creating duplicates. Wallet controls its own ordering and visual grouping.

| Information | Display and source |
|---|---|
| Company branding | Issuer logo, name, and colors. Use the approved wallet template. |
| Shares and class | Confirmed quantity and security class from the transfer agent. Before issuance, show "Pending issuance"; never "Shares owned." |
| Registered owner | Exact name in the transfer-agent record, including an entity or trust name. Reconcile it with the investor's submitted legal details. |
| Company valuation | Latest approved reported valuation, date, source, and basis (for example, post-money equity valuation). Do not imply a live market price. |
| Value of this investment | Confirmed shares × approved reference price for the same share class. Label "Indicative value," show its date, and explain that it is not a sale or redemption price. |
| Dates and status | Purchase date from the accepted investment record; issuance date separately in details. Include holding status and last update time. |
| Portal access | "View investor dashboard" link in the supported pass details area. Opens the private dashboard on the issuer's website, such as company.com/investors, after secure login. |

If no defensible reference price exists, show "Value unavailable" and the original investment amount. Do not calculate share value from company valuation alone. Keep the approved valuation history and supporting documents.

### Payment is not yet ownership

After verified payment submission, the investor may add a **pending** pass showing the order amount and status. Change it to confirmed shares only after funds clear, the subscription is accepted, the offering closes as required, and the transfer agent confirms issuance. Rejections, refunds, transfers, and corrections must update the record and pass status.

### Build and validate this first

**Apple:** prototype a signed generic .pkpass, web distribution, company branding, a details link, and server-driven updates. Apple controls fields and layout; do not promise a custom front-of-pass button or full dashboard. Put essential holdings on the front and other requested fields in pass details. (Pass design / Update service.)

**Google:** confirm eligibility for this financial-data use case and the required Generic Private pass route before committing to the full data display. Sensitive passes require pre-approval. Test the actual permitted fields and update behavior. (Google Wallet guidance.)

**Privacy and fallback:** get consent to display name and holdings in Wallet. Never place identity documents, tax IDs, bank data, or login credentials in a pass. A copied pass grants no account access or ownership. If wallet approval or device support is unavailable, use the same branded portal and email link. Pass updates may be delayed or offline; the portal shows the authoritative current status.

## 03 · Experience: An issuer dashboard worth using.

*A custom product experience, not a reskinned vendor portal*

**Design goal:** clear, beautiful, fast, and useful every day. Use strong typography, generous spacing, clear charts, and consistent controls. Design for desktop and mobile. Every headline number should open the records behind it.

| Area | Required functions |
|---|---|
| Raise overview | Target and progress; committed, received, cleared, refunded, and released funds shown separately; fees and net proceeds; daily trend; date and offering filters. |
| Action center | Show what needs attention: failed checks, missing documents, unpaid orders, returns, and transfer-agent mismatches. Each item has an owner, age, and next action. |
| Investor CRM | Searchable investor table; filters and saved views; tags and internal notes; owner/entity details; full timeline of checks, signatures, payments, issuance, and support. Export permitted data. |
| Conversion analytics | Track visit → started application → verification → signature → payment → issuance. Show drop-off by step, campaign links/UTM source, and device. Report cost per funded investor when spend data is provided. |
| Offering controls | Configure price, class, minimum/maximum, target, dates, documents, and eligible investors. Preview website and wallet branding. Version terms; require approval before publishing material changes. |
| Money and ownership | Payment reconciliation, refunds and exceptions, gross-to-net fee reports, escrow/release status, and transfer-agent sync. Export closing and shareholder reports. Separate request and approval permissions. |
| Investor relations | Publish company updates and documents; send approved, branded emails to selected investor groups; see delivery results. Publish approved holding/value updates to affected passes. |
| Team and settings | Roles for company admin, finance, marketing, and read-only users. Branding, domain, email setup, integration health, wallet status, and audit history. |

### Investor dashboard on the issuer's website

**Wallet pass → "View investor dashboard" link → secure login → that investment's detail page.** Host this private dashboard on the issuer's website or subdomain, with its branding and a website login. Keep it separate from the issuer's management dashboard.

**Beyond the pass:** holdings and share rights; transaction history; valuation basis and history; signed agreements and ownership records; issuer-provided financial statements, reports, and shareholder updates; distributions and tax documents when applicable; meeting notices, voting/consent materials when applicable; and support.

Show only that company's investments, including repeat purchases. Restrict private documents to entitled investors. Support wallet re-download and profile correction requests. No combined cross-company portfolio page.

### Private operations console

Provide a separate internal console for Farkas Capital: issuer onboarding, offering approval, investor review, exception queues, communications review, fees, integration failures, and audit exports. Company users cannot bypass compliance decisions or edit confirmed ownership. Restrict sensitive documents to authorized staff.

**Design acceptance:** deliver a clickable prototype with realistic data, empty/loading/error states, and mobile screens. The issuer must be able to identify an issue and reach the affected investor in two clicks. Agree the visual standard before full development.

## 04 · Build: Build the experience. Connect the rails.

*Suggested architecture and provider shortlist; commercial access is not yet confirmed*

**Suggested stack:** React/Next.js + TypeScript for checkout, portals, and dashboards; TypeScript backend; PostgreSQL; encrypted document storage; background job queue. Deploy in a managed cloud with separate development, staging, and production environments. The project lead may propose an equivalent stack.

**Website integration:** deliver a small JavaScript embed for the existing company website, plus a company-domain hosted route such as invest.company.com where needed. Test mobile sizing, cookies, authentication, and provider redirects. Disclose any unavoidable external verification/signing screens before selecting vendors.

| Function / where to start | What the project lead must confirm |
|---|---|
| **North Capital TransactAPI**: KYC/AML, accreditation, securities payment and escrow infrastructure | Request sandbox/docs and pricing. Confirm support for Farkas Capital acting as broker-dealer, each party's role, ACH/wire flows, webhooks, refunds, branding, and funds release. Use its APIs with our own UI. |
| **Kore / KoreBuilders**: transfer-agent API candidate | Confirm contracted legal transfer agent, issuance and holdings endpoints, registered names, share classes, corporate actions, webhooks, export rights, and reconciliation. Support an issuer's existing agent through an adapter if needed. |
| **Docusign eSignature API**: embedded document signing | Confirm embedded signing, templates, envelope status, completion certificate, signed PDF retrieval, and branding. Use the rails provider's integration if sufficient; avoid duplicate contracts. |
| **Apple Wallet developer docs**: direct pass integration | Apple Developer account, Pass Type IDs, certificates, signing keys, brand authorization, pass hosting, registration/update endpoints, and APNs. Validate financial-summary use and visible identity. |
| **Google Wallet developer docs**: direct pass integration | Issuer account, service credentials, use-case approval, permitted private pass type, add-to-wallet flow, updates, branding, and production publishing access. |

### Data and event design

Core records: Issuer, Offering, SecurityClass, Investor, LegalOwner, Verification, Order, Signature, Payment, Allocation, Holding, Valuation, WalletPass, and AuditEvent. Every record and API request must enforce issuer-level access. An investor's access to one company must never reveal another company's data.

Flow: verified provider event → update internal records → reconcile payment/transfer-agent data → queue wallet update and approved notification. Verify webhook signatures; handle duplicate and out-of-order events; retry failures and alert operations. Keep a daily reconciliation job. Never confirm a payment from a browser success page alone.

**Source of truth:** payment provider for money status; transfer agent for registered ownership; approved issuer records for valuation. Our database stores synchronized records and history. Wallet is a display layer, not custody, a tradable token, or the official shareholder register.

## 05 · Optional payments: Optional stablecoin payments.

*An additional way to invest, without delaying the initial release*

Allow each issuer to offer stablecoin payments alongside traditional payment methods. The goal is to reach investors who hold capital in stablecoins and give them another convenient way to invest. This feature is optional and must not delay the platform's initial release.

**Investor experience.** After completing the required identity checks, accreditation verification when applicable, and investment documents, the investor selects "Pay with stablecoins." Checkout shows supported coins and networks, the exact amount, fees, and payment instructions through a connected wallet or QR code. The investment remains priced in USD.

**Payment infrastructure.** Integrate a third-party provider approved for securities-related payments. The provider should support wallet screening, transaction monitoring, payment confirmation, and conversion into USD for settlement to the designated escrow or issuer account. The platform should not hold investor crypto or private keys. Provider selection must confirm supported jurisdictions, coins, networks, conversion costs, settlement timing, and refund procedures.

**Dashboard and ownership.** Show stablecoin payments in the same issuer dashboard as other payments, including transaction reference, payment status, fees, and USD settlement amount. Handle failed, incorrect, late, or incomplete payments through an exception process. Issue confirmed shares only after payment settlement and the existing investment approval and transfer-agent process. Investors receive the same branded Wallet pass and access to the same private investor dashboard on the issuer's website.

**Release approach.** Build this as a separate payment integration that can be enabled per issuer after testing and approval. Stablecoin payments do not change investor eligibility requirements or make an offering automatically available worldwide.

## 06 · Delivery: Project delivery plan.

*A practical sequence with clear acceptance checks*

### 1. Validate before estimating the full build

Confirm launch scope with the product owner and counsel. Obtain vendor proposals, sandbox access, API coverage, branding limits, service levels, and costs. Test Apple passes and Google eligibility. Assign account ownership and certificate renewal responsibility.

### 2. Design, build, then pilot

| Milestone | Required output |
|---|---|
| A. Feasibility | Working wallet demonstration; provider comparison; funds-flow diagram; unresolved dependencies; proposed team, budget, and schedule. |
| B. Product design | Approved clickable checkout, website investor dashboard, issuer dashboard, operations screens, and pass-to-dashboard journey. |
| C. End-to-end build | One sandbox issuer: checks → documents → payment → issuance → wallet → portal. Include failures, refunds, and provider reconciliation. |
| D. Pilot and handover | One approved live issuer with limited users; monitored launch; source code, deployment scripts, API/data documentation, operating runbooks, and team training. |

### 3. Security and operating requirements

Require encryption, managed secrets, role-based access, staff MFA, and secure investor sessions. Keep identity files out of logs. Audit sensitive changes and approvals. Archive documents, consents, communications, and pass versions under counsel-approved retention rules. Test backup restoration, tenant isolation, and incident alerts.

Funds move through contracted financial providers to the designated escrow or issuer account under approved offering instructions. The platform must not hold investor money in its own operating account. Provider onboarding and legal approvals are launch dependencies, not developer assumptions.

### 4. Definition of done

- **Investor:** completes the flow on mobile; failed checks block progress; pending payments never appear as issued shares; confirmed holdings match the transfer agent.
- **Wallet:** each investment has one unique pass; updates do not duplicate it; long names and values remain readable; its link opens the correct issuer-website investment after login. Test refunds, reinstalls, and delayed updates.
- **Issuer:** dashboard totals reconcile with payment records; investor filters, exports, and action queues work; roles prevent unauthorized changes.
- **Operations:** duplicate events do not double-charge or double-issue; failed integrations are recoverable; one issuer cannot access another issuer's records.

### 5. Boundaries and initial response

**Optional scope, priced separately:** stablecoin payments as specified in Section 05; licensed-representative referral attribution and approved compensation; Reg A/CF workflows; secondary trading; native apps; broader CRM/ad integrations. Preserve integration points for these features, but do not let them delay the wallet-led first release.

**Project lead's first deliverable:** a build plan covering the team (design, frontend, backend/integrations, QA, deployment), milestone estimates, vendor costs, risks, and decisions for the product owner. The product owner approves product and design; counsel/compliance approves regulated workflows. The project lead owns technical delivery.

*Provider and platform references were checked on 4 September 2026. Availability, commercial terms, and approval of this exact use case must be confirmed during feasibility.*
