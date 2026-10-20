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

## Phase 4 — cursor glow and interaction refinement (20 October 2026)

Added `public/assets/ambient-interactions.css` and
`public/assets/ambient-interactions.js`, loaded after the existing design and
behavior assets on the actual served page.

- **Ambient light:** a large blue/violet radial glow subtly brightens the
  background beneath the cursor. A single fixed, pointer-events-none element
  follows the pointer through CSS transforms driven by requestAnimationFrame.
  Its animation settles and stops when the pointer does; no timers, tracking
  requests, canvas loops or expensive per-pixel operations are used.
- **Preferences:** the light is mounted only for
  `(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)`.
  Touch pointers do not illuminate it. Media-query changes remove the element,
  and window exit/background-tab events fade it.
- **Navigation:** the sticky desktop links display the active section using
  `aria-current="location"`. The mobile drawer continues to use the existing
  accessible native dialog and focus-return behavior.
- **Visual polish:** refined focus rings and hover transitions on cards and
  buttons, smoother section reveals, native smooth anchor navigation, and
  animation disabled by reduced-motion preference.

## Phase 5 — automated production validation

The CI workflow now runs these steps after installing dependencies:

1. `npm run typecheck`
2. `npm run lint`
3. `node scripts/verify-portfolio.mjs`
4. `node scripts/test-ambient-interactions.mjs`
5. `npm run build`
6. `node scripts/smoke-production.mjs`

The **interaction test** simulates a desktop mouse, unsupported/touch motion
preferences, cursor movement, loss of focus, cleanup, and scroll-aware navigation
in a stubbed DOM. It uses Node's built-in `vm` without new production
dependencies.

The **production smoke test** starts the compiled Next.js server locally,
requests `/` and the actual HTML, then asserts that the stylesheet, script,
screenshots, portrait and downloadable CV are served with HTTP 200.

These automated checks **do not substitute for visual QA in a real browser**.
Use the companion `docs/QA_CHECKLIST.md` for manual acceptance. Pushing to
`main` triggers repository checks and may trigger a Vercel deployment if the
project is connected; a successful commit/CI run does not itself confirm that
the Vercel URL is deployed or publicly reachable.

## Follow-up architecture work (not part of Phases 1–3)

Convert `public/original.html` into typed React components with explicit data arrays for projects, toolkit, notes, and timeline. Port each interaction one at a time before removing the original page redirect. Keep `/original.html` available as a snapshot until the React version achieves feature parity. 
