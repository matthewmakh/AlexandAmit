# Amit & Alex — Wedding Website

Static wedding website for Amit & Alex — Sunday, 11 October 2026, Kochav Hayam, Caesarea, Israel.

Built from the Claude Design project in `Phase 1 wedding site proposal/`. Those design files are kept in the repo as the source of truth for the visual language; the deployable site lives in `public/` and is served by `server.js`.

## Pages

| URL | Page |
|---|---|
| `/` | Home — hero, live countdown, invitation, section cards |
| `/events` | Events — the wedding weekend schedule |
| `/travel` | Travel & Stay — arrival, transfers, and the three hotels |
| `/gallery` | Gallery — 20 engagement photographs |
| `/newlywed-fund` | Newlywed Fund — Zelle details with copy-to-clipboard |
| `/rsvp` | Redirects to the Paperless Post invitation (`noindex`) |
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

## RSVP

RSVP is handled entirely by **Paperless Post**. Every RSVP control on the site — the header pill, the hero button, the footer link — points straight at the invitation, and replies are collected and tracked there rather than by this app.

`/rsvp` is kept as a `302` redirect to the same destination, so any link already shared with guests still lands in the right place.

| Variable | Required | Purpose |
|---|---|---|
| `PORT` | set by Railway | Port to listen on (default `3000`) |
| `RSVP_URL` | no | Invitation to forward to (default `https://pp.events/b4nMxdj7`) |

The RSVP controls link to the invitation directly and open in a new tab, so guests keep the site behind them. `RSVP_URL` governs the `/rsvp` redirect only; to move to a different invitation, update the `href` in the five pages under `public/` as well.

## Images

Photographs ship in two formats. `server.js` checks the browser's `Accept` header and serves the `.webp` twin when supported, falling back to the `.jpg`/`.png` the markup names — so the HTML stays simple and every visitor gets the smallest file their browser understands. Every `<img>` carries intrinsic `width`/`height` to prevent layout shift, and everything below the first screen is lazy-loaded.

The originals live in `Phase 1 wedding site proposal/`; `public/assets/` holds the resized and re-encoded versions, both formats included.

## Structure

```
server.js        static server: routes, WebP negotiation, RSVP redirect, sitemap, 404
railway.json     Railway start command
public/
  home.html  events.html  travel.html  gallery.html  newlywed-fund.html
  404.html
  styles.css     design tokens, buttons, countdown
  assets/        images, each as .jpg/.png + .webp
Phase 1 wedding site proposal/   original Claude Design export
```

## Known gaps

These are content decisions, deliberately left rather than invented — the design brief is explicit that times, rates, and links must not be made up:

- **Transfer times** — the wedding-day shuttle and the Nammos buses both read "to be confirmed" on Travel & Stay and Events.
- **Dan Caesarea group rate and booking code** — the card explains rooms are held for immediate family; no rate or code is published.
- **Hebrew version** — the design only calls for Hebrew glyphs on the home invitation card, which are in place. A full bilingual site with a language switcher was scoped but not designed.
