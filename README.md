# codeWande — Software Engineer Portfolio

The personal portfolio of **Ojewande Abdulfatai Ayoye (codeWande)**, showcasing full-stack, mobile, productivity and HealthTech work.

## Visual direction

The site now uses a black-and-blue visual system with Geist and Geist Mono typography, a subtle grid background, atmospheric cyan/violet glows, glassy project cards, clear navigation and responsive layouts. Codesistency influenced the overall mood, but the content and layout are written for codeWande.

See [the redesign audit and implementation guide](docs/CODEWANDE_REDESIGN.md).

## Where the actual homepage lives

- `public/original.html` — current served portfolio; project case studies, filters, responsive drawer, downloadable CV, GitHub activity, developer terminal, timeline, toolkit, notes and contact.
- `public/assets/codesistency-redesign.css` — **design system and Phase 3 visual overrides**; loaded last to preserve all working legacy features.
- `public/assets/` — original feature-level CSS/JavaScript; keep these until their behavior is replaced.
- `public/images/` — profile and project screenshots.
- `src/app/page.tsx` — redirects the root URL to `/original.html`. A React component migration remains a separate follow-up; do not mistake the redirect page for the complete implementation.
- `scripts/verify-portfolio.mjs` — content, image, JavaScript and design checks.
- `docs/` — portfolio features, audit and QA notes.

## Run locally

```bash
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000). For production validation:

```bash
npm run typecheck
npm run lint
node scripts/verify-portfolio.mjs
npm run build
```

## Deployment

Deploy the repository as a Next.js app. Changes committed to `main` are picked up by the connected deployment provider according to its own configuration. A successful GitHub commit alone is **not** confirmation that a deployment has finished.

## Editing safely

1. Keep real project descriptions and screenshots; do not invent performance claims or links.
2. For design changes, update `public/assets/codesistency-redesign.css` first. The old green palette remains in the legacy styles for recovery and is overridden by the new layer.
3. Preserve keyboard navigation, reduced-motion behavior, project filtering, gallery/lightbox, terminal and CV download.
4. Re-run the portfolio checks and test both desktop and mobile after changing navigation or section layouts.

The portfolio's previous CSS and markup are intentionally preserved for safe rollback and eventual React extraction.
