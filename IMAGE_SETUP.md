# Add real images to the Abdulfatai portfolio

The original lime-and-charcoal portfolio remains intact. The hero and project cards switch from their original illustrations to **your real uploaded images** automatically.

## Folder structure

```text
public/
  images/
    profile/
      portrait.jpg               <-- your portrait
    projects/
      dovia-cover.png            <-- main Dovia card
      dovia-01.png               <-- optional expanded gallery
      dovia-02.png
      afyapulse-cover.png
      afyapulse-01.png
      afyapulse-02.png
      somamap-cover.png
      somamap-01.png
      somamap-02.png
      campuscare-cover.png
      campuscare-01.png
      campuscare-02.png
```

These are reserved **file paths**, not preloaded photographs. You supply the real images.

## How to add your photos

1. Pull recent changes: `git pull origin main`.
2. Open the `public/images/profile` and `public/images/projects` folders in VS Code.
3. Copy your actual photographs/screenshots there, using the filenames above **including the extensions**. Screenshot/convert as PNG, portrait as JPG.
4. Preview locally: `npm install`, then `npm run dev`. Open http://localhost:3000.
5. The main portrait appears in the hero. The project cover appears on its card. The two optional screenshots appear within **Behind the build** when expanded.
6. Push your photos:
   ```bash
   git add public/images/
   git commit -m "assets: add real portfolio portrait and project screenshots"
   git push origin main
   ```
7. If connected, Vercel redeploys from GitHub.

### Notes
- If a file is missing, the original visual remains in place. No broken image icon.
- Don't use other people's private information in screenshots. Blur or redact names, phone numbers, health data, login details, API keys and tokens.
- Recommended image size: portrait 1200×1500 JPG; desktop screenshots 1600×1000 PNG; mobile shots at original device resolution.
- Optimize sizes where possible so the page loads quickly. `public/` files are accessible from the site root.
- A filename mismatch (including uppercase/lowercase) stops the image from appearing.
- The real CV PDF is a **separate outstanding asset**, expected at `public/assets/Abdulfatai-Ayoye-CV.pdf`. Only add that file if you want the download link to work.
