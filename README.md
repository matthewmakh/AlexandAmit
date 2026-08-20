# Amit & Alex — Wedding Website

Static wedding website for Amit & Alex — Sunday, 11 October 2026, Kochav Hayam, Caesarea.

Built from the Claude Design project in `Phase 1 wedding site proposal/` (the design source files are kept there for reference; the deployable site lives in `public/`).

## Pages

| URL | Page |
|---|---|
| `/` | Travel & Stay (landing page for now, until the Home page is built) |
| `/travel` | Travel & Stay |
| `/events` | Events — wedding weekend schedule |
| `/gallery` | Gallery — engagement photos |
| `/newlywed-fund` | Newlywed Fund — Zelle details with copy-to-clipboard |

The RSVP buttons are placeholders (`href="#"`) until an RSVP page/flow exists.

## Run locally

```bash
node server.js
# → http://localhost:3000
```

No dependencies — `server.js` is a zero-dependency Node static file server (Node 18+).

## Deploy on Railway

1. Create a new Railway project → **Deploy from GitHub repo** → pick this repo.
2. Railway detects the Node app automatically and runs `node server.js` (also pinned in `railway.json`).
3. The server binds to Railway's `PORT` environment variable automatically — no variables to configure.
4. Add a domain under **Settings → Networking → Generate Domain**.

## Structure

```
server.js        zero-dependency static server (routes, 404, caching headers)
public/          the deployable site
  travel.html    Travel & Stay
  events.html    Events
  gallery.html   Gallery
  newlywed-fund.html
  404.html
  styles.css     shared global styles + pill button
  assets/        images (hotels, monogram, Zelle QR, gallery photos)
Phase 1 wedding site proposal/   original Claude Design export (source of truth for design)
```
