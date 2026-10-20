# codeWande portfolio — release QA

## Automated checks (GitHub Actions on main)

These checks are now configured in `.github/workflows/ci.yml`.
For evidence, open the most recent **Portfolio checks** run and verify its
green status. Do not mark a check passed based only on its presence in CI.

- [ ] TypeScript typecheck
- [ ] ESLint
- [ ] Static portfolio verification (project images, sections, design assets)
- [ ] Cursor interaction simulation (mouse, touch, reduced motion, cleanup, active nav)
- [ ] Next.js production build
- [ ] Running production server HTTP smoke test (HTML, CSS, JS, images, CV)

## Manual browser acceptance (must be performed on published URL)

- [ ] Desktop: blue-black grid and cyan/violet ambient lighting remain legible.
- [ ] Desktop: move the mouse. The glow follows smoothly and appears **behind** content.
- [ ] Desktop: stop moving. The glow stops animating. Leave the window: light fades.
- [ ] Mobile/touch: no cursor light is generated; nav drawer opens/closes, returns focus.
- [ ] Small screens at 320–375px: headings, projects, footer do not overflow.
- [ ] Tablet/desktop: work, story, timeline, skills, GitHub and contact render correctly.
- [ ] Scroll: active desktop navbar item matches section; reveal animations do not hide content.
- [ ] Filters: All/Web/HealthTech/Mobile categories toggle matching project cards.
- [ ] Images: project covers load; lightbox opens, navigates, and closes with Escape.
- [ ] Terminal: help, projects, clear and unknown commands work safely.
- [ ] Download CV opens actual PDF; email links and copy button work.
- [ ] Keyboard: skip link, visible focus states, modal focus and buttons usable.
- [ ] Reduced motion: scroll/reveal/hero animations are disabled, content visible.
- [ ] Browser with remote fonts blocked: system fallbacks keep content readable.
- [ ] 200% zoom: no clipped controls; long text and card descriptions wrap.
- [ ] No actionable browser console errors or broken local requests.
- [ ] Live published domain is reachable and displays the newest GitHub commit.

## Release notes

- The current entry point is still `/original.html`; `/` redirects to it.
- Interactive cursor effects depend on JavaScript; the content works without them.
- GitHub activity relies on third-party services and must retain its fallback.
- The additional spotlight is a **decorative enhancement**; it must never block links,
  capture pointer events, reduce text contrast, or follow touch pointers.
- A green CI workflow verifies the repository build and local server, **not** the
  actual public Vercel deployment or visual quality in every browser.
