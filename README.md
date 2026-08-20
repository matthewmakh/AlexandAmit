# Amit & Alex — Wedding Website

Static wedding website for Amit & Alex — Sunday, 11 October 2026, Kochav Hayam, Caesarea, Israel.

Built from the Claude Design project in `Phase 1 wedding site proposal/`. Those design files are kept in the repo as the source of truth for the visual language; the deployable site lives in `public/` and is served by `server.js`.

## Pages

| URL | Page |
|---|---|
| `/` | Home — hero, live countdown, invitation, section cards |
| `/events` | Events — the wedding weekend schedule |
| `/travel` | Travel & Stay — arrival, transfers, and the three hotels |
| `/gallery` | Gallery — engagement photographs |
| `/newlywed-fund` | Newlywed Fund — Zelle details with copy-to-clipboard |
| `/rsvp` | RSVP — the reply form (`noindex`) |
| `/sitemap.xml`, `/robots.txt` | Generated from the request host, so they are correct on any domain |

Anything else renders the styled 404 page.

## Run locally

```bash
node server.js
# → http://localhost:3000
```

No dependencies and no build step — `server.js` is a zero-dependency Node static server (Node 18+).

## Deploy on Railway

1. Create a Railway project → **Deploy from GitHub repo** → pick this repo.
2. Railway detects the Node app and runs `npm start` (also pinned in `railway.json`).
3. The server reads Railway's `PORT` automatically — no variables are required to boot.
4. **Settings → Networking → Generate Domain** for the public URL.

## RSVP replies

The form posts to `POST /api/rsvp`. The server validates the reply and then records it in up to three places:

1. **The deploy log**, always — one `RSVP {...}` line per reply. This is the safety net; nothing is ever silently dropped.
2. **`data/rsvps.jsonl`**, one JSON object per line. Railway's filesystem is ephemeral, so **attach a volume and set `RSVP_DATA_DIR` to its mount path** (e.g. `/data`) if you want replies to survive redeploys.
3. **A webhook**, if `RSVP_WEBHOOK_URL` is set — each reply is POSTed as JSON. Point it at Zapier, Make, or a Google Sheets endpoint to get replies into a spreadsheet or your inbox.

| Variable | Required | Purpose |
|---|---|---|
| `PORT` | set by Railway | Port to listen on (default `3000`) |
| `RSVP_DATA_DIR` | no | Directory for `rsvps.jsonl` (default `./data`) |
| `RSVP_WEBHOOK_URL` | no | Endpoint that receives each reply as JSON |

The form works without JavaScript: it posts normally and returns to `/rsvp?sent=1`, which shows the same thank-you panel. With JavaScript it submits in place and shows inline validation errors.

Fields, per the design brief, in order: name, email, accept/decline, number attending, dietary requirements, note.

## Images

Photographs ship in two formats. `server.js` checks the browser's `Accept` header and serves the `.webp` twin when supported, falling back to the `.jpg`/`.png` the markup names — so the HTML stays simple and every visitor gets the smallest file their browser understands. Every `<img>` carries intrinsic `width`/`height` to prevent layout shift, and everything below the first screen is lazy-loaded.

The originals live in `Phase 1 wedding site proposal/`; `public/assets/` holds the resized and re-encoded versions (7.9 MB of sources → 2.9 MB shipped, both formats included).

## Structure

```
server.js        static server: routes, WebP negotiation, RSVP endpoint, sitemap, 404
railway.json     Railway start command
public/
  home.html  events.html  travel.html  gallery.html  newlywed-fund.html
  rsvp.html  404.html
  styles.css     design tokens, buttons, countdown, form styles
  assets/        images, each as .jpg/.png + .webp
Phase 1 wedding site proposal/   original Claude Design export
```

## Known gaps

These are content decisions, deliberately left rather than invented — the design brief is explicit that times, rates, and links must not be made up:

- **Transfer times** — the wedding-day shuttle and the Nammos buses both read "to be confirmed" on Travel & Stay and Events.
- **Dan Caesarea group rate and booking code** — the card explains rooms are held for immediate family; no rate or code is published.
- **Hebrew version** — the design only calls for Hebrew glyphs on the home invitation card, which are in place. A full bilingual site with a language switcher was scoped but not designed.
