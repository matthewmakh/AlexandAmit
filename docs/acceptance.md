# Acceptance checklist (SOW section 4)

Each line must point to an automated test or a written manual check before final delivery is submitted.

**End to end:** one sandbox issuer runs checks → documents → payment → issuance → wallet → portal, including failures, refunds and reconciliation.

| Area | Check | How it is proven | Status |
|---|---|---|---|
| Investor | The flow completes on mobile | | Not started |
| Investor | Failed checks block progress | | Not started |
| Investor | Pending payments never appear as issued shares | | Not started |
| Investor | Confirmed holdings match the transfer agent | | Not started |
| Wallet | Each investment has one unique pass | | Not started |
| Wallet | Updates do not duplicate it | | Not started |
| Wallet | Long names and values stay readable | | Not started |
| Wallet | Its link opens the correct investment after login | | Not started |
| Issuer | Dashboard totals reconcile with payment records | | Not started |
| Issuer | Filters, exports and action queues work | | Not started |
| Issuer | Roles prevent unauthorised changes | | Not started |
| Operations | Duplicate events do not double-charge or double-issue | | Not started |
| Operations | Failed integrations are recoverable | | Not started |
| Operations | One issuer cannot access another issuer's records | | Not started |
