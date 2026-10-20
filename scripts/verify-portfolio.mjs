import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { Script } from "node:vm";

const html = readFileSync("public/original.html", "utf8");
const inline = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(inline, "Missing inline portfolio JavaScript");
new Script(inline, { filename: "public/original.html:inline.js" });

for (const asset of ["showcase-effects.js", "showcase-effects.css"]) {
  assert.ok(html.includes(`/assets/${asset}`), `Asset is not linked in HTML: ${asset}`);
  assert.ok(existsSync(`public/assets/${asset}`), `Missing asset file: ${asset}`);
}
new Script(readFileSync("public/assets/showcase-effects.js", "utf8"), {filename: "showcase-effects.js"});

const requiredImages = [
  "/images/profile/my%20picture.png",
  "/images/projects/dovia-cover.png.png",
  ...["afyapulse", "somamap", "campuscare"].map(name => `/images/projects/${name}-cover.png`),
  ...["dovia", "afyapulse", "campuscare"].flatMap(name => [
    `/images/projects/${name}-01.png`, `/images/projects/${name}-02.png`,
  ]),
];
for (const path of requiredImages) {
  assert.ok(html.includes(path), `Missing image reference: ${path}`);
  assert.ok(existsSync("public" + decodeURIComponent(path)), `Missing uploaded file: ${path}`);
}
for (const optional of ["somamap-01.png", "somamap-02.png"]) {
  assert.ok(html.includes(optional), `Missing optional Somamap gallery slot: ${optional}`);
}
assert.equal((html.match(/class="project-gallery"/g) ?? []).length, 4);
assert.equal((html.match(/data-portfolio-photo="cover"/g) ?? []).length, 4);
assert.equal((html.match(/data-portfolio-photo="portrait"/g) ?? []).length, 1);
assert.ok(html.includes("has-real-image"), "Image fallback styling disappeared");
assert.ok(html.includes("ABDULFATAI"), "Brand signature disappeared");
assert.ok(!html.includes("__CF$cv"), "Archived challenge script should not ship");
console.log(`Verified ${requiredImages.length} uploaded images, 2 optional slots, viewer and inline JavaScript.`);


// Codesistency-inspired codeWande visual system must be applied LAST.
const redesignedStylesheet = "/assets/codesistency-redesign.css";
assert.ok(html.includes(`href="${redesignedStylesheet}"`), "The redesign CSS is not linked from the served homepage");
assert.ok(existsSync(`public${redesignedStylesheet}`), "Redesign CSS asset is missing");
assert.ok(
  html.indexOf('href="/assets/showcase-effects.css"') < html.indexOf(`href="${redesignedStylesheet}"`),
  "Load the redesign last to override legacy styling",
);
const redesignCSS = readFileSync(`public${redesignedStylesheet}`, "utf8");
for (const token of ["--bg: #05070d", "--accent: #45c8ff", "--cw-violet:", "--showcase-lime:", ".hero-roles", ".contact", ".tool-card", ".note-card", ".project", "@media(max-width:760px)", "prefers-reduced-motion"]) {
  assert.ok(redesignCSS.includes(token), `Missing visual-system feature: ${token}`);
}
for (const element of ['class="hero-roles"', "codeWande", 'id="work"', 'id="about"', 'id="journey"', 'id="skills"', 'id="engineering-notes"', 'id="contact"', 'id="developer-terminal"', 'id="github-activity"']) {
  assert.ok(html.includes(element), `Missing redesigned portfolio content: ${element}`);
}
console.log("Verified blue-black design system, responsive styles and all portfolio landmarks.");
