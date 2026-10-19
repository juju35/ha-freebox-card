// Bundles src/freebox-card.js into the single HACS file dist/freebox-card.js,
// inlining the Freebox picture and the Free logo so the card needs no extra resource.
// Usage: node scripts/build.mjs [--check]
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const pkg = JSON.parse(readFileSync(`${root}package.json`, "utf8"));
const b64 = (file) => readFileSync(`${root}images/${file}`).toString("base64");

const out = readFileSync(`${root}src/freebox-card.js`, "utf8")
  .replace("__VERSION__", pkg.version)
  .replace("__IMG_BOX__", `data:image/webp;base64,${b64("freebox.webp")}`)
  .replace("__IMG_LOGO__", `data:image/webp;base64,${b64("free.webp")}`);

const target = `${root}dist/freebox-card.js`;
if (process.argv.includes("--check")) {
  if (!existsSync(target) || readFileSync(target, "utf8") !== out) {
    console.error("dist/freebox-card.js is out of date: run `npm run build` and commit the result.");
    process.exit(1);
  }
  console.log("dist/freebox-card.js is up to date.");
} else {
  writeFileSync(target, out);
  console.log(`Built dist/freebox-card.js (${(out.length / 1024).toFixed(1)} KB)`);
}
