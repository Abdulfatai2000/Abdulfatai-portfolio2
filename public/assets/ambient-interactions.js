/*
 * codeWande cursor ambience and active-section navigation.
 * No libraries, no network requests, no layout-changing pointer effects.
 */
(() => {
  "use strict";

  const pointerMode = window.matchMedia(
    "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
  );
  let glow = null;
  let pointerFrame = 0;
  let positioned = false;
  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;

  function hideGlow() {
    if (glow) glow.classList.remove("is-visible");
  }

  function animateGlow() {
    pointerFrame = 0;
    if (!glow || !positioned || document.hidden) return;

    // Smooth tracking; animations stop when the light reaches the pointer.
    currentX += (targetX - currentX) * 0.22;
    currentY += (targetY - currentY) * 0.22;
    glow.style.transform =
      "translate3d(" + currentX.toFixed(1) + "px," +
      currentY.toFixed(1) + "px,0) translate(-50%,-50%)";

    if (Math.abs(targetX - currentX) > 0.65 ||
        Math.abs(targetY - currentY) > 0.65) {
      pointerFrame = window.requestAnimationFrame(animateGlow);
    }
  }

  function onPointerMove(event) {
    if (!glow || document.hidden || (event.pointerType && event.pointerType !== "mouse")) return;
    targetX = event.clientX;
    targetY = event.clientY;
    if (!Number.isFinite(targetX) || !Number.isFinite(targetY)) return;

    if (!positioned) {
      currentX = targetX;
      currentY = targetY;
      positioned = true;
    }
    glow.classList.add("is-visible");
    if (!pointerFrame) pointerFrame = window.requestAnimationFrame(animateGlow);
  }

  function onPointerOut(event) {
    if (!event.relatedTarget) hideGlow();
  }

  function onVisibilityChange() {
    if (document.hidden) hideGlow();
  }

  function enableGlow() {
    if (glow || !pointerMode.matches) return;
    glow = document.createElement("div");
    glow.id = "cw-pointer-glow";
    glow.setAttribute("aria-hidden", "true");
    document.body.prepend(glow);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerout", onPointerOut, { passive: true });
    window.addEventListener("blur", hideGlow);
    document.addEventListener("visibilitychange", onVisibilityChange);
  }

  function disableGlow() {
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerout", onPointerOut);
    window.removeEventListener("blur", hideGlow);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    positioned = false;
    if (glow) glow.remove();
    glow = null;
  }

  function syncPointerPreference() {
    if (pointerMode.matches) enableGlow();
    else disableGlow();
  }

  if (pointerMode.addEventListener) {
    pointerMode.addEventListener("change", syncPointerPreference);
  } else if (pointerMode.addListener) {
    pointerMode.addListener(syncPointerPreference);
  }
  syncPointerPreference();

  // Highlight navigation in sync with the section actually on screen.
  // Works independently from smooth scrolling and IntersectionObserver.
  const links = Array.from(document.querySelectorAll('nav .links a[href^="#"]'));
  const tracked = links.map(link => {
    const id = link.getAttribute("href").slice(1);
    return { link, section: document.getElementById(id) };
  }).filter(item => item.section);
  let scrollFrame = 0;
  let activeLink = null;

  function updateNavigation() {
    scrollFrame = 0;
    const threshold = Math.min(window.innerHeight * 0.34, 300);
    let next = null;

    for (const item of tracked) {
      if (item.section.getBoundingClientRect().top <= threshold) next = item.link;
    }
    if (next === activeLink) return;

    for (const item of tracked) {
      item.link.classList.toggle("is-active", item.link === next);
      if (item.link === next) item.link.setAttribute("aria-current", "location");
      else item.link.removeAttribute("aria-current");
    }
    activeLink = next;
  }

  function scheduleNavigation() {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateNavigation);
  }

  if (tracked.length) {
    window.addEventListener("scroll", scheduleNavigation, { passive: true });
    window.addEventListener("resize", scheduleNavigation, { passive: true });
    updateNavigation();
  }
})();
