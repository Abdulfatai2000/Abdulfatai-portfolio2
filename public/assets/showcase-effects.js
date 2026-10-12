/* Progressive project image enhancements. Real screenshots remain visible without this file. */
(() => {
  const projects = Array.from(document.querySelectorAll(".project"));
  const galleryImages = ".project-gallery img";
  const available = (img) => img && img.complete && img.naturalWidth > 0;

  const viewer = document.createElement("dialog");
  viewer.className = "portfolio-lightbox";
  viewer.setAttribute("aria-label", "Project image viewer");
  viewer.innerHTML = `
    <div class="portfolio-lightbox-layout">
      <header class="portfolio-lightbox-top">
        <span class="portfolio-lightbox-heading"></span>
        <button type="button" class="lightbox-close" aria-label="Close image viewer">×</button>
      </header>
      <div class="portfolio-lightbox-media">
        <button type="button" class="lightbox-prev" aria-label="Previous screenshot">‹</button>
        <img alt="" />
        <button type="button" class="lightbox-next" aria-label="Next screenshot">›</button>
      </div>
      <footer class="portfolio-lightbox-bottom">
        <span class="lightbox-description">PROJECT SCREENSHOT</span>
        <span class="portfolio-lightbox-counter" aria-live="polite"></span>
      </footer>
    </div>`;
  document.body.append(viewer);

  const heading = viewer.querySelector(".portfolio-lightbox-heading");
  const fullImage = viewer.querySelector(".portfolio-lightbox-media img");
  const counter = viewer.querySelector(".portfolio-lightbox-counter");
  const previous = viewer.querySelector(".lightbox-prev");
  const next = viewer.querySelector(".lightbox-next");
  let pictures = [];
  let current = 0;
  let focusReturn = null;
  let activeProjectName = "";

  function renderViewer() {
    const img = pictures[current];
    if (!img) return;
    fullImage.src = img.currentSrc || img.src;
    fullImage.alt = img.alt || (activeProjectName + " screenshot");
    heading.textContent = activeProjectName.toUpperCase() + " / SHOWCASE";
    counter.textContent = (current + 1) + " / " + pictures.length;
    previous.disabled = pictures.length < 2;
    next.disabled = pictures.length < 2;
  }

  function openViewer(project, selected) {
    pictures = Array.from(project.querySelectorAll(".project-photo, " + galleryImages)).filter(available);
    if (!pictures.length || !viewer.showModal) return;
    current = Math.max(0, pictures.indexOf(selected));
    activeProjectName = project.querySelector(".projectheading h3")?.textContent?.trim() || "Project";
    focusReturn = document.activeElement;
    renderViewer();
    viewer.showModal();
    viewer.querySelector(".lightbox-close").focus();
  }

  function shift(delta) {
    if (pictures.length < 2) return;
    current = (current + delta + pictures.length) % pictures.length;
    renderViewer();
  }

  viewer.querySelector(".lightbox-close").addEventListener("click", () => viewer.close());
  previous.addEventListener("click", () => shift(-1));
  next.addEventListener("click", () => shift(1));
  viewer.addEventListener("click", e => { if (e.target === viewer) viewer.close(); });
  viewer.addEventListener("close", () => { focusReturn?.focus?.(); });
  viewer.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") { e.preventDefault(); shift(-1); }
    if (e.key === "ArrowRight") { e.preventDefault(); shift(1); }
  });

  function attachImageControls(project) {
    const name = project.querySelector(".projectheading h3")?.textContent?.trim() || "project";
    const cover = project.querySelector(".project-photo");

    if (cover) {
      const setupCover = () => {
        if (!available(cover) || project.querySelector(".project-image-open")) return;
        const open = document.createElement("button");
        open.type = "button";
        open.className = "project-image-open";
        open.setAttribute("aria-label", "View " + name + " project images");
        open.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/><path d="m9 15 6-6m-4 0h4v4"/></svg><span>VIEW</span>`;
        open.addEventListener("click", () => openViewer(project, cover));
        project.querySelector(".visual")?.append(open);
      };
      cover.addEventListener("load", setupCover);
      if (available(cover)) setupCover();
    }

    project.querySelectorAll(galleryImages).forEach(img => {
      const setupGallery = () => {
        if (!available(img) || img.parentElement?.classList.contains("gallery-image-button")) return;
        const wrapper = document.createElement("button");
        wrapper.type = "button";
        wrapper.className = "gallery-image-button";
        wrapper.setAttribute("aria-label", "View " + img.alt);
        img.before(wrapper);
        wrapper.append(img);
        wrapper.addEventListener("click", () => openViewer(project, img));
      };
      img.addEventListener("load", setupGallery);
      if (available(img)) setupGallery();
    });
  }

  projects.forEach(attachImageControls);

  // Cursor-following light on project cards, only for precise pointers.
  if (window.matchMedia("(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)").matches) {
    projects.forEach(card => {
      let frame = 0;
      card.addEventListener("pointermove", event => {
        if (frame) return;
        const x = event.clientX;
        const y = event.clientY;
        frame = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty("--glow-x", (((x - rect.left) / rect.width) * 100).toFixed(1) + "%");
          card.style.setProperty("--glow-y", (((y - rect.top) / rect.height) * 100).toFixed(1) + "%");
          frame = 0;
        });
      }, {passive:true});
    });
  }
})();
