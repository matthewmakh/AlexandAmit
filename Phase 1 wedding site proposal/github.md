repo: amitshushan16-png/timeless-vows-web
branch: main

## Last sync
date: 2026-08-03T21:17:01Z

### Updated in this project
- Read the full site (routes, Nav/Footer/Monogram/HeartButton/DetailCard, i18n, styles.css tokens, RSVP server functions, .lovable/plan.md) to ground the Phase 1 proposal in real code.
- Corrected several Phase 1 assumptions against reality: header is already transparent-over-hero on scroll (Nav.tsx `overHero`); Hebrew copy exists in full in `src/content/copy.ts` (`const he: Copy`); the "A AAA" text-dump artifact was not a real accessible-name bug (Link already carries its own `aria-label`); a real HeartButton CTA component already exists and is more distinctive than a generic pill.
- Added a Gallery-heading removal item to the Phase 2 consolidated Lovable prompt: drop the headline under the "Gallery" eyebrow entirely (previews no longer show "A few of our favourites"/"Moments together").
- No write/commit access to this repo from this tool — read-only. Implementation is prepared as a brief for the user to hand to Lovable (which has commit access) or a developer.

## Screen map
| Project artifact | Repo source |
|---|---|
| Phase 1 Design Proposal.dc.html | src/routes/index.tsx, src/components/site/Nav.tsx, Footer.tsx, Monogram.tsx, HeartButton.tsx, DetailCard.tsx, src/lib/i18n.tsx, src/styles.css, src/content/site.ts, src/lib/rsvp.functions.ts, .lovable/plan.md |
| Preview Gallery.dc.html | gallery route + copy.ts heading string (exact file path not yet re-confirmed against repo) |
