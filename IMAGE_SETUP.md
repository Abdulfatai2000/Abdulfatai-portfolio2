# Abdulfatai portfolio — images and animation guide

The restored lime-and-charcoal website displays your uploaded images automatically.

## Images currently in the repository

```text
public/
  images/
    profile/
      my picture.png
    projects/
      dovia-cover.png.png
      dovia-01.png
      dovia-02.png
      afyapulse-cover.png
      afyapulse-01.png
      afyapulse-02.png
      somamap-cover.png
      campuscare-cover.png
      campuscare-01.png
      campuscare-02.png
```

Your Dovia cover has a **double .png** extension and your portrait has a **space** in its filename. The site has been adjusted to load these exact names. If you rename them in the future, also update `public/original.html` and `scripts/verify-portfolio.mjs`.

## Where they appear

- **Your portrait**: the hero's illustration frame; its background, lime accents, and typography remain.
- **Project cover images**: the four main project cards, replacing abstract UI previews when images finish loading.
- **Project gallery**: expand **Behind the build** to see screenshot 01 and screenshot 02. If a file is missing the gallery skips it rather than showing a broken image.
- **Full-size image viewer**: click **View** on a project cover or click a screenshot. Use arrow keys/buttons to navigate, Esc or X to close.

## Test locally

```bash
git pull origin main
npm install
npm run dev
```

Open http://localhost:3000 and check the homepage hero, project covers, galleries, mobile layout, and keyboard navigation.

The original illustration stays as a fallback for any missing/failed cover image. Respect reduced-motion settings; the page reduces animations automatically.

## Performance and content

Your PNG illustrations are relatively large (roughly 1.5–1.9 MB each), so consider optimizing screenshots once you're satisfied with the visual result. Photos of real people should only be used with permission, and any personal/health data must be redacted before publishing.

The current product visuals were generated as conceptual mockups, not captured from your live applications. If used publicly, consider labeling them **Concept mockup**, or replace them with genuine application screenshots when available.

The CV is a separate asset: `public/assets/Abdulfatai-Ayoye-CV.pdf`. This is not currently in the repo, so the download link will work only after that file is added.
