# codeWande portfolio redesign — Phases 1–3

Implemented: 20 October 2026  
Reference: Codesistency visual direction (black canvas, cool-blue accents, dark cards, grid background, monospace labels). The portfolio remains codeWande's own composition and content.

## Phase 1 — audit of the actual repository

- **Serving path:** `src/app/page.tsx` redirects to `/original.html`. The currently displayed website is `public/original.html`, not a JSX component tree.
- **Styling:** large inline CSS block plus assets under `public/assets/`.
- **Existing functional features to preserve:** responsive native-dialog navigation, working project filter buttons, project descriptions/details, image gallery/lightbox, GitHub activity/repository panels, accessible terminal, scroll-reveal animations, timeline, toolkit, engineering notes, contact/copy-email, and CV download.
- **Media:** local portrait and four project cover images are present in `public/images/`, with optional gallery image fallback logic.
- **Risk identified:** an immediate JSX rewrite would require reimplementing multiple mature behaviors. Changing the actual served page with a clean, last-loaded design layer minimizes regression risk; component migration can be a separate milestone.
- **Known limits:** GitHub panels depend on third-party data; font loading depends on Google Fonts, with system/monospace fallbacks. Neither is a prerequisite for core content.

## Phase 2 — design system implemented

Last-loaded stylesheet: `public/assets/codesistency-redesign.css`.

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#05070d` | Near-black page |
| `--panel` | `#0c111d` | Dark surface |
| `--ink` | `#f1f6ff` | Primary text |
| `--muted` | `#9bacbf` | Secondary text |
| `--accent` | `#45c8ff` | Primary blue |
| `--cw-blue` | `#2778ff` | Button and ambient accents |
| `--cw-violet` | `#967cff` | Secondary glow |
| `--line` | `#243348` | Card and divider borders |

Typography uses **Geist** for UI and display text, and **Geist Mono** for developer labels, supplemented by safe fallbacks. The background has a subtle fixed grid and low-opacity radial lighting. Cards use glassy dark surfaces and high-contrast borders. Focus-visible treatment and `prefers-reduced-motion` support are preserved.

## Phase 3 — redesigned sections

- Header: codeWande wordmark, sticky translucent top navigation, responsive drawer
- Hero: larger editorial typography, blue gradient emphasis, role badges, atmospheric portrait panel, two clear calls to action
- Work: project filters, richer screenshot cards, category tags, case-study disclosures and galleries
- GitHub activity: coordinated dark panels, link palette and repository cards
- About/journey/process: cleaner layout, facts, timeline cards and more readable hierarchy
- Skills/toolkit: luminous blue ring visuals and interactive skill cards
- Engineering notes and terminal: consistent contrast, card surfaces and text colors
- Contact/footer: gradient contact call to action, blue accents and responsive footer

## Safety and continuity

The previous markup, project copy and event handlers are retained. The visual changes are applied by appending a new stylesheet **after** the existing CSS assets. The legacy CSS and public media are left in place, making the redesign easy to compare or roll back. Do not remove the old behavior scripts merely because visual styles are relocated.

## Verification checklist

- `npm run typecheck`
- `npm run lint`
- `node scripts/verify-portfolio.mjs`
- `npm run build`
- Browser pass at desktop, tablet, 375px mobile: navigation/drawer, project filters, expand/collapse, image lightbox, Github fallback, terminal, contact copy, CV and keyboard focus
- Browser pass with reduced motion enabled and with remote fonts blocked
- Check contrast on blue controls, particularly under hovered and selected states

## Follow-up architecture work (not part of Phases 1–3)

Convert `public/original.html` into typed React components with explicit data arrays for projects, toolkit, notes, and timeline. Port each interaction one at a time before removing the original page redirect. Keep `/original.html` available as a snapshot until the React version achieves feature parity. 
