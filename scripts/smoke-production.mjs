import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const port = 32079;
const origin = "http://127.0.0.1:" + port;
const child = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "-p", String(port), "-H", "127.0.0.1"],
  { stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, NODE_ENV: "production" } }
);
let output = "";
for (const stream of [child.stdout, child.stderr]) {
  stream.on("data", chunk => { output = (output + chunk.toString()).slice(-5000); });
}

async function get(path, method = "GET") {
  const response = await fetch(origin + path, {
    method,
    redirect: "follow",
    signal: AbortSignal.timeout(7000),
  });
  assert.equal(response.status, 200, path + " returned " + response.status);
  return response;
}

try {
  let ready = false;
  for (let attempt = 0; attempt < 50; attempt++) {
    if (child.exitCode !== null) throw Error("Server exited early. " + output);
    try {
      const response = await fetch(origin + "/", { signal: AbortSignal.timeout(1000) });
      if ([200, 307, 308].includes(response.status)) { ready = true; break; }
    } catch { /* Starting up. */ }
    await sleep(350);
  }
  assert.ok(ready, "Production server failed to start. " + output);

  const home = await get("/");
  const html = await home.text();
  for (const expected of [
    "codeWande", "hero-roles", 'id="work"', 'id="skills"', 'id="contact"',
    'id="mobile-menu"', "/assets/ambient-interactions.js", "/assets/ambient-interactions.css",
  ]) assert.ok(html.includes(expected), "Homepage is missing " + expected);

  const css = await (await get("/assets/ambient-interactions.css")).text();
  assert.ok(css.includes("#cw-pointer-glow"), "Pointer light stylesheet was not served");
  const js = await (await get("/assets/ambient-interactions.js")).text();
  assert.ok(js.includes("enableGlow"), "Pointer motion JavaScript was not served");

  for (const path of [
    "/assets/codesistency-redesign.css",
    "/assets/showcase-effects.js",
    "/assets/github-activity.js",
    "/assets/terminal.js",
    "/images/profile/my%20picture.png",
    "/images/projects/dovia-cover.png.png",
    "/images/projects/afyapulse-cover.png",
    "/images/projects/somamap-cover.png",
    "/images/projects/campuscare-cover.png",
    "/assets/Abdulfatai-Ayoye-CV.pdf",
  ]) await get(path, "HEAD");

  console.log("Production smoke test passed: homepage, new motion assets, project media and CV.");
} finally {
  child.kill("SIGTERM");
}
