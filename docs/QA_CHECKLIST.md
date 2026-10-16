# Portfolio QA checklist

## Functional
- [ ] Homepage serves /original.html at /.
- [ ] Mobile drawer opens, closes and returns focus.
- [ ] Project filters show matching cards.
- [ ] Project case studies expand and lightbox works when images exist.
- [ ] Terminal accepts help, projects, clear and unknown commands safely.
- [ ] Contact email links open a mail app.
- [ ] GitHub cards show public data or a helpful fallback.

## Accessibility
- [ ] Tab through all links and controls; skip link targets main.
- [ ] Reduced-motion mode shows content without animation.
- [ ] Test narrow viewport and 200% zoom.

## Quality
- [ ] npm run lint
- [ ] npm run typecheck
- [ ] npm run build
- [ ] Verify deployment and no broken screenshots or CV links.

Checklist is not evidence of passing tests; complete it when tests are run.
