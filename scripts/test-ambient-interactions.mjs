import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { Script } from "node:vm";

const jsPath = "public/assets/ambient-interactions.js";
const js = readFileSync(jsPath, "utf8");
const css = readFileSync("public/assets/ambient-interactions.css", "utf8");
const html = readFileSync("public/original.html", "utf8");

new Script(js, { filename: jsPath });
assert.ok(html.includes('src="/assets/ambient-interactions.js" defer'), "Motion script not linked");
assert.ok(html.includes('href="/assets/ambient-interactions.css"'), "Motion CSS not linked");
assert.ok(
  html.indexOf("codesistency-redesign.css") < html.indexOf("ambient-interactions.css"),
  "Interaction styles must load after the design system"
);
for (const part of ["#cw-pointer-glow", "pointer-events: none", "prefers-reduced-motion:reduce",
                    "pointer:coarse", "aria-current", "aria-hidden", "requestAnimationFrame"]) {
  assert.ok((js + css).includes(part), "Missing interaction safeguard: " + part);
}

function simulate(finePointer) {
  const listeners = new Map();
  const emitted = new Map();
  const tasks = new Map();
  let nextFrame = 1;

  function add(target, type, handler) {
    const key = target + ":" + type;
    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key).add(handler);
  }
  function remove(target, type, handler) {
    listeners.get(target + ":" + type)?.delete(handler);
  }
  function emit(target, type, event = {}) {
    for (const handler of listeners.get(target + ":" + type) ?? []) handler(event);
  }
  function classList() {
    const values = new Set();
    return {
      add(value) { values.add(value); },
      remove(value) { values.delete(value); },
      contains(value) { return values.has(value); },
      toggle(value, on) { if (on) values.add(value); else values.delete(value); },
    };
  }
  function node() {
    const attributes = new Map();
    return {
      classList: classList(),
      style: {},
      removed: false,
      setAttribute(name, value) { attributes.set(name, value); },
      getAttribute(name) { return attributes.get(name) ?? null; },
      removeAttribute(name) { attributes.delete(name); },
      remove() { this.removed = true; },
    };
  }
  const first = node();
  const second = node();
  first.setAttribute("href", "#work");
  second.setAttribute("href", "#about");
  const positions = { work: 750, about: 1550 };
  const sections = {
    work: { getBoundingClientRect: () => ({ top: positions.work }) },
    about: { getBoundingClientRect: () => ({ top: positions.about }) },
  };
  let glow = null;
  const document = {
    hidden: false,
    body: { prepend(el) { glow = el; } },
    createElement(tag) { assert.equal(tag, "div"); return node(); },
    querySelectorAll(selector) {
      assert.equal(selector, 'nav .links a[href^="#"]');
      return [first, second];
    },
    getElementById(id) { return sections[id] ?? null; },
    addEventListener(type, handler) { add("document", type, handler); },
    removeEventListener(type, handler) { remove("document", type, handler); },
  };
  const pointerMode = {
    matches: finePointer,
    addEventListener(type, handler) { add("media", type, handler); },
  };
  const window = {
    innerHeight: 900,
    matchMedia(query) {
      assert.ok(query.includes("prefers-reduced-motion: no-preference"));
      return pointerMode;
    },
    requestAnimationFrame(cb) { const id = nextFrame++; tasks.set(id, cb); return id; },
    cancelAnimationFrame(id) { tasks.delete(id); },
    addEventListener(type, handler) { add("window", type, handler); },
    removeEventListener(type, handler) { remove("window", type, handler); },
  };
  function flush() {
    let rounds = 0;
    while (tasks.size && rounds++ < 140) {
      const callbacks = [...tasks.values()];
      tasks.clear();
      callbacks.forEach(cb => cb());
    }
    assert.ok(rounds < 140, "Animation must settle rather than run forever");
  }

  new Script(js).runInNewContext({ window, document, Number, Math });
  assert.equal(first.getAttribute("aria-current"), null, "No section active on initial hero");

  if (finePointer) {
    assert.ok(glow, "Fine pointer must mount background glow");
    assert.equal(glow.getAttribute("aria-hidden"), "true");
    assert.equal(listeners.get("window:pointermove")?.size, 1);

    emit("window", "pointermove", { clientX: 320, clientY: 260, pointerType: "mouse" });
    flush();
    assert.ok(glow.classList.contains("is-visible"), "Glow should appear with pointer");
    assert.ok(glow.style.transform.includes("320.0px,260.0px"), "Glow must reach pointer");

    emit("window", "pointermove", { clientX: 520, clientY: 480, pointerType: "mouse" });
    flush();
    const coordinates = glow.style.transform.match(/translate3d\\(([-\\d.]+)px,([-\\d.]+)px,0\\)/);
    assert.ok(coordinates, "Glow must use a transformed compositor layer");
    assert.ok(Math.abs(Number(coordinates[1]) - 520) < 1 && Math.abs(Number(coordinates[2]) - 480) < 1,
      "Glow should settle within one pixel of pointer");

    emit("window", "pointerout", { relatedTarget: null });
    assert.equal(glow.classList.contains("is-visible"), false, "Glow must fade when leaving window");

    emit("window", "pointermove", { clientX: 200, clientY: 200, pointerType: "touch" });
    assert.equal(glow.classList.contains("is-visible"), false, "Touch input must not activate glow");

    emit("window", "pointermove", { clientX: 240, clientY: 240, pointerType: "mouse" });
    document.hidden = true;
    emit("document", "visibilitychange");
    assert.equal(glow.classList.contains("is-visible"), false, "Hide glow in background tabs");

    pointerMode.matches = false;
    emit("media", "change");
    assert.equal(glow.removed, true, "Preference changes must unmount glow");
    assert.equal(listeners.get("window:pointermove")?.size, 0, "Pointer listener must be removed");
  } else {
    assert.equal(glow, null, "Coarse pointer or reduced-motion must never mount glow");
    assert.equal(listeners.get("window:pointermove")?.size ?? 0, 0);
  }

  positions.work = 110;
  emit("window", "scroll");
  flush();
  assert.equal(first.getAttribute("aria-current"), "location", "Work should highlight when visible");
  assert.equal(second.getAttribute("aria-current"), null);

  positions.work = -650;
  positions.about = 125;
  emit("window", "scroll");
  flush();
  assert.equal(first.getAttribute("aria-current"), null);
  assert.equal(second.getAttribute("aria-current"), "location", "About should become active");
}

simulate(true);
simulate(false);
console.log("Cursor spotlight: pointer tracking, hide, touch/reduced motion, cleanup and nav updates passed.");
