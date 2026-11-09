# Lessons from the demo

The demo proved the product and the look. It also cut every corner a production build must not. Use this page to know what to keep as an idea and what to rebuild.

## Ideas worth carrying forward (rebuild, don't copy)

- **Pass content derived from records.** Front: status, primary (shares and class once issued; "Pending issuance" plus the amount before), registered owner (the transfer agent's name once issued), indicative value only when an approved reference price exists for that class, purchase date and company valuation with its date. Back: dashboard link, holding status, issuance date and reference, valuation basis and source, how the indicative value is computed, last updated and pass version, support, disclosures.
- **Raise buckets.** Committed = orders from awaiting payment through issued. Received = payment pending onward. Cleared = payment cleared onward. Refunded and released shown separately. Fees and net computed on cleared funds.
- **Action centre types.** Failed check, missing document, signed-but-unpaid after three days, ACH return, transfer-agent name mismatch. Each with owner, age, next action and severity, linking to the investor in one click.
- **Every headline number opens its records** through one "orders behind this metric" view.
- **Funnel steps.** Visited, started, passed verification, signed, submitted payment, issued; plus by source and by device; cost per funded investor from entered ad spend.
- **Entitlement on the investor dashboard.** Opening another investor's order shows a clear "this belongs to another investor" screen rather than the data.
- **A demo navigator** pill for walking a room through every surface. Useful for client reviews, behind a staging-only flag.

## Shortcuts that must not survive

- **In-memory store** seeded at boot on `globalThis`, with a fixed demo clock. Production needs PostgreSQL, migrations and real time.
- **Fake auth.** A cookie holding the investor ID, and a hardcoded email code. There are no sessions, MFA or roles.
- **No tenancy.** One hardcoded issuer. Server actions trusted IDs sent from the browser (notes, tags), and the CSV export had no authorization.
- **Simulated providers.** Demo buttons moved orders forward directly. In production only verified webhooks change money and ownership states.
- **Money as floating-point dollars.** Use integer cents.
- **PassKit web service registrations in a `Map`**, no APNs pushes, token compared without constant-time checks. The PKCS#7 signing code was never run against a real Apple certificate.
- **Many buttons were visual only** in the issuer dashboard and ops console.
- **The imagery is AI-generated** for a fictional issuer, Lumen Robotics. Real issuers bring their own.

## Gotchas we hit, so you don't

- **Next.js 16 is not the Next you know.** Read `node_modules/next/dist/docs/` before writing code (the generated `AGENTS.md` says so too). `params`, `searchParams` and `cookies()` are async. `PageProps`, `LayoutProps` and `RouteContext` are global type helpers from `next typegen`. `middleware.ts` is now `proxy.ts`. `next lint` is gone; run ESLint directly. Turbopack is the default. `create-next-app` turns on `cacheComponents`; decide deliberately whether you want it.
- **The React compiler lint rule** rejects `setState` called directly in an effect. Derive state instead (for example, store the path a menu was opened on).
- **A function exported from a `"use client"` file cannot be called on the server.** Keep pure helpers in plain modules.
- **Tailwind v4:** global CSS outside a layer beats utility classes. Put resets in `@layer base`, or `text-white` silently loses to `color: inherit`.
- **`.gitignore` patterns bite.** A `data/` rule silently excluded `src/lib/data/` from two commits, and the deploy could never build. After the first commit, compare `git ls-files` against the source tree.
- **Railway builds from the repository root** unless Root Directory is set, and it serves whatever `railway.json` sits there. `next start` reads `PORT`. Next 16 needs Node 20.9 or newer.
- **Hydration mismatches** come from anything nondeterministic in render (dates, random IDs, locale formatting). Format dates in UTC, and keep demo data deterministic.
- **Visual QA works well here.** Chromium is at `/opt/pw-browsers/chromium` for Playwright. Screenshot every page at 1440px and 390px. Scroll-triggered animations leave full-page screenshots blank below the fold, so scroll and capture in sections.
- **Apple pass assets.** `icon.png` at 29/58/87px is required. Keep `logo.png` to the mark and let `logoText` carry the name. Use `changeMessage` on fields that update so the lock screen announces them. Set `sharingProhibited`. `webServiceURL` must be HTTPS in production.
