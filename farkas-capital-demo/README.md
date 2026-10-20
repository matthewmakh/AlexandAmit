# Farkas Capital platform demo

A working demonstration of the white-label capital-raising platform described in the
*Invest on the company website. Keep it in your Wallet.* scope (4 September 2026).
One fictional issuer, Lumen Robotics, raises a Series A direct offering under Rule 506(c);
every surface in the scope is live with realistic seeded data.

| Surface | URL | What it shows |
|---|---|---|
| Pitch | `/` | Apple-style product page for the proposal, linking into every surface |
| Company website | `/lumen` | The issuer's own site with the **Invest** entry point |
| Offering page | `/lumen/invest` | Terms, price, minimum, risks, fees, documents |
| Checkout | `/lumen/invest/checkout` | Six steps: amount → email code → legal owner → KYC/AML/accreditation → e-sign → pay (ACH, wire, stablecoin) |
| Confirmation | `/lumen/invest/confirmation/:orderId` | Branded confirmation with Add to Apple Wallet / Google Wallet |
| Wallet pass | `/wallet/:passId` | Pixel-faithful pass in an iPhone, add sheet, server-driven update controls |
| Investor dashboard | `/lumen/investors` | Secure login, holdings, transactions, valuation basis, documents, updates |
| Issuer dashboard | `/issuer` | Raise overview, action centre, investor CRM, conversion analytics, offering, money, relations, settings |
| Ops console | `/ops` | Farkas Capital's private console: queues, approvals, exceptions, fees, integrations, audit |
| Build plan | `/build-plan` | Team, milestones, vendor items, risks, decisions |

A floating **Demo** pill at the bottom of every page switches between surfaces.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Node 20.9+ is required. There is no database: a deterministic seed is built on boot and held
in memory (`src/lib/data/`), with a fixed demo clock (20 October 2026) so every number is
stable across reloads and demo runs. Checkout, Add-to-Wallet and the demo controls write to the
same in-memory store, so the dashboards reflect what you do until the server restarts.

### Demo codes and accounts

- Email verification code (checkout and investor sign-in): **482913**
- Demo investor: **jordan.ellis@example.com** (one issued and one pending investment)
- Anyone who completes the checkout can sign in to the investor dashboard with the email they used.

## Deploy on Railway

This app lives in the `farkas-capital-demo/` folder of a repository whose root is a different site.

1. Railway → **New Project → Deploy from GitHub repo** → pick this repo and the `claude/gallant-volta-q3lkph` branch.
2. In the service **Settings → Source**, set **Root Directory** to `farkas-capital-demo`.
3. Railway reads `farkas-capital-demo/railway.json` (build `npm ci && npm run build`, start `npm run start`) and the `PORT` variable automatically.
4. **Settings → Networking → Generate Domain** for the public URL. Open it on a phone to walk the Wallet flow.

No environment variables are required. Optional ones below.

## Apple Wallet: the real `.pkpass` pipeline

`GET /api/passes/:passId` assembles a genuine pass bundle: `pass.json` built from the synchronized
records (`src/lib/wallet/pass-json.ts`), `manifest.json` with SHA-1 hashes, the icon and logo
assets in `public/pass-assets/lumen/`, and a detached PKCS#7 `signature` when certificates are
configured. Without certificates the bundle is complete but unsigned and includes an
`UNSIGNED-README.txt`; iOS will not install it. `?format=json` returns the `pass.json`.

| Variable | Purpose |
|---|---|
| `APPLE_PASS_TYPE_ID` | e.g. `pass.com.farkascapital.investment` |
| `APPLE_TEAM_ID` | 10-character Apple Developer team id |
| `APPLE_PASS_CERT_PEM` | Pass Type ID certificate (PEM; `\n` escapes accepted) |
| `APPLE_PASS_KEY_PEM` | Its private key (PEM) |
| `APPLE_PASS_KEY_PASSPHRASE` | Only if the key is encrypted |
| `APPLE_WWDR_CERT_PEM` | Apple WWDR intermediate certificate (PEM) |

The PassKit web service is implemented in memory under `/api/wallet/v1/*` (device registration,
updated-serials since a date, latest pass with `If-Modified-Since`, logs). The demo controls on a
pass page advance the order the way provider webhooks would and bump the pass version.

Regenerate the pass image assets with `python3 scripts/make-pass-assets.py` (Pillow).

## Imagery

Photographs of the fictional Lumen Robotics fleet, team and sites were generated with Higgsfield
(GPT Image 2.5) and live in `public/images/lumen/`. The lifestyle shot of the pass in Wallet is a
generated photo with the real on-screen pass warped onto the phone. Device mock-ups in
`public/images/screens/` are real captures of this app. The architecture, funds-flow, event-flow
and brand diagrams are SVG components in `src/components/diagrams/`, so their labels stay crisp
and editable. `<ImageSlot>` remains available for any future placeholder.

## What is simulated

Provider integrations (North Capital, Kore, Docusign), the email code, KYC/AML/accreditation
results, e-signature, payment rails and Google Wallet are simulated with the states the real
providers return.

## Structure

```
src/app/                 routes (App Router)
src/components/          ui primitives, brand marks, wallet pass, charts, dashboard, ops, pitch
src/lib/data/            types, seed, in-memory store, derivations, formatters, demo clock
src/lib/wallet/          pass.json builder, .pkpass assembly and signing, QR
public/pass-assets/      icon and logo PNGs for the pass bundle
scripts/                 asset generation
```
