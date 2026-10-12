import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { Script } from "node:vm";

const html = readFileSync("public/original.html", "utf8");
const source = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(source, "Missing inline portfolio JavaScript");
new Script(source, { filename: "public/original.html:inline.js" });

const expected = [
  "/images/profile/portrait.jpg",
  ...["dovia", "afyapulse", "somamap", "campuscare"].flatMap(name => [
    `/images/projects/${name}-cover.png`,
    `/images/projects/${name}-01.png`,
    `/images/projects/${name}-02.png`,
  ]),
];
for (const path of expected) {
  assert.ok(html.includes(path), `Missing image slot: ${path}`);
}
assert.equal((html.match(/class="project-gallery"/g) ?? []).length, 4);
assert.equal((html.match(/data-portfolio-photo="cover"/g) ?? []).length, 4);
assert.ok(html.includes("has-real-image"), "Missing image fallback logic");
assert.ok(html.includes("ABDULFATAI"), "Signature brand disappeared");
console.log(`Portfolio structure and JavaScript verified; ${expected.length} image slots ready.`);
