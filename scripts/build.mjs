// Bundles src/freebox-card.js into the single HACS file dist/freebox-card.js,
// inlining the Freebox model pictures and the Free logo so the card needs no extra resource.
// Usage: node scripts/build.mjs  (dist/ is not committed: CI and the release workflow build it)
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const pkg = JSON.parse(readFileSync(`${root}package.json`, "utf8"));
const b64 = (file) => readFileSync(`${root}images/${file}`).toString("base64");

const out = readFileSync(`${root}src/freebox-card.js`, "utf8")
  .replace("__VERSION__", pkg.version)
  // __IMG_BOX_MINI_4K__ -> images/freebox-mini-4k.webp
  .replace(/__IMG_BOX_([A-Z0-9_]+)__/g, (_, m) => `data:image/webp;base64,${b64(`freebox-${m.toLowerCase().replace(/_/g, "-")}.webp`)}`)
  .replace("__IMG_LOGO__", `data:image/webp;base64,${b64("free.webp")}`);

const target = `${root}dist/freebox-card.js`;
mkdirSync(`${root}dist`, { recursive: true });
writeFileSync(target, out);
console.log(`Built dist/freebox-card.js (${(out.length / 1024).toFixed(1)} KB)`);
