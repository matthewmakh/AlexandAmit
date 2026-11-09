# Design language

Matthew loves the demo's look and feel. Carry the **design, vibe and product ideas** forward. Rebuild the components properly; don't copy the demo's code.

The direction in one line: **intensely Apple.** Product-page typography, generous whitespace, one blue accent, glass surfaces, a floating pill navigation bar, soft shadows, big confident numbers, restrained motion.

## Tokens

**Type.** System font stack first, with Inter as the fallback: `-apple-system, BlinkMacSystemFont, "Inter", "SF Pro Display/Text", "Helvetica Neue"`. Tabular numbers everywhere money or counts appear.

| Style | Size | Line height | Tracking | Weight |
|---|---|---|---|---|
| Display XL (hero) | clamp(2.75rem, 7vw, 5.5rem) | 1.02 | -0.035em | 700 |
| Display LG | clamp(2.25rem, 5vw, 3.75rem) | 1.06 | -0.03em | 700 |
| Display MD (section titles) | clamp(1.75rem, 3.4vw, 2.5rem) | 1.1 | -0.025em | 700 |
| Display SM (headline numbers) | clamp(1.375rem, 2.2vw, 1.75rem) | 1.18 | -0.02em | 600 |
| Lede | clamp(1.125rem, 1.6vw, 1.375rem) | 1.45 | -0.01em | 400 |
| Eyebrow | 12px uppercase | 1 | 0.08em | 600 |

**Colour.**
- Neutrals: ink `#1d1d1f`, `#424245`, `#6e6e73`, `#86868b`, `#a1a1a6`; canvas `#f5f5f7` / `#ededf0`; paper `#ffffff`; lines `#d2d2d7` / `#e8e8ed`; night `#000`, `#161617`, `#1d1d1f`, `#2c2c2e`.
- System: blue `#0071e3` (deep `#0058b9`, soft `#e8f1fd`), green `#34c759`, orange `#ff9f0a`, red `#ff3b30`, purple `#af52de`, teal `#30b0c7`, indigo `#5e5ce6`, each with a soft tint for badges.
- Farkas (ops console): near-black `#0f0f10` with gold `#c9a227` (soft `#f7efd6`).
- Issuer brand colours are **data**, not tokens: every issuer surface and pass takes its primary, deep and on-primary colours from the issuer record. The demo issuer used `#2b5cff` / `#0b2a8a`.

**Shape and depth.** Radii 20 / 28 / 36px; cards at 28px. Shadows: card `0 1px 2px rgba(0,0,0,.03), 0 8px 24px -8px rgba(0,0,0,.08)`; lift `0 2px 6px rgba(0,0,0,.05), 0 20px 50px -16px rgba(0,0,0,.18)`; float `0 1px 1px rgba(0,0,0,.04), 0 10px 40px -6px rgba(0,0,0,.16)`.

**Glass.** `rgba(255,255,255,.72)` with `backdrop-filter: saturate(180%) blur(20px)` and a hairline border; a dark variant at `rgba(22,22,23,.72)`.

**Backdrops.** "Aurora" = soft radial gradients of blue, purple and teal over canvas (and a dark version over black) for hero sections.

**Motion.** Easing `cubic-bezier(0.25, 0.1, 0.25, 1)`; springy sheets `cubic-bezier(0.34, 1.3, 0.64, 1)`. Sections fade and rise 22px with a slight blur as they scroll in. Buttons scale to 0.98 when pressed. Respect `prefers-reduced-motion`.

## Patterns worth keeping

- **Floating pill nav**: a glass capsule floating 12–16px from the top, shrinking slightly on scroll, collapsing into a menu on phones. Issuer sites use it with the issuer's logo; the platform marketing site uses it with Farkas's.
- **Apple-style links**: "Learn more ›" text links; pill buttons in blue, dark, white and secondary variants.
- **Cards and tiles**: big headline number, small label above, muted hint below, a chevron when it opens records.
- **Badges**: rounded pills with a soft tint and a coloured dot, one colour per order state.
- **Issuer dashboard**: macOS System Settings feel. Grouped left sidebar with icons, canvas background, white cards, segmented controls for ranges, and every headline number opening its records.
- **Ops console**: dark theme, gold accent, slim icon rail, the same card grammar.
- **Checkout**: one step per screen, a step rail on the left, an order summary on the right, a horizontal step strip on phones, the six-digit code input as separate boxes, signature adoption in a script face.
- **Wallet pass on screen**: rendered faithfully to Apple's generic pass layout (logo and logo text, header field, primary field, secondary and auxiliary rows, barcode, an ⓘ flip to the details side) inside an iPhone frame. Great for the confirmation page, the dashboard and marketing.
- **Image placeholders**: a labelled dashed frame stating what image belongs there, so layouts can ship before photography.

## Reference screens

The demo is deployed from `matthewmakh/AlexandAmit`, branch `claude/gallant-volta-q3lkph`. Look at it for feel, not structure:

- Pitch page `/`, issuer site `/lumen`, offering `/lumen/invest`, checkout `/lumen/invest/checkout`
- Wallet pass `/wallet/pass_jordan_1` and `/wallet/pass_jordan_2`
- Investor dashboard `/lumen/investors` (demo code 482913, demo investor jordan.ellis@example.com)
- Issuer dashboard `/issuer`, operations console `/ops`, build plan `/build-plan`
- Tokens live in `src/app/globals.css`; the pass rendering in `src/components/wallet/`.

Every screen must work at 390px wide, with empty, loading and error states (the scope asks for them explicitly).
