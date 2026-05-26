// Frame payload pipeline (SPEC.md §11). Reads the source full-res JPG frames in
// assets/frames/full/ and generates the adaptive set the widget serves:
//   • full/<name>.webp   — 1284×716 WebP (desktop, ~30–40% smaller than JPG)
//   • half/<name>.jpg    — 642×358 JPG  (mobile fallback)
//   • half/<name>.webp   — 642×358 WebP (mobile)
// The original full/<name>.jpg is kept as the universal JPG fallback.
//
// Run: npm run frames   (idempotent; re-encodes from the source JPGs)
import sharp from "sharp";
import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";

const FULL_DIR = path.resolve("assets/frames/full");
const HALF_DIR = path.resolve("assets/frames/half");
const HALF_W = 642; // exact half of 1284×716 — preserves aspect ratio
const HALF_H = 358;
const WEBP_QUALITY = 78;
const JPG_QUALITY = 80;

const sources = (await readdir(FULL_DIR))
  .filter((f) => /^frame_\d+\.jpg$/.test(f))
  .sort();

await mkdir(HALF_DIR, { recursive: true });

let done = 0;
for (const file of sources) {
  const base = file.replace(/\.jpg$/, "");
  const src = path.join(FULL_DIR, file);

  await Promise.all([
    // full-res WebP
    sharp(src).webp({ quality: WEBP_QUALITY }).toFile(path.join(FULL_DIR, `${base}.webp`)),
    // half-res JPG
    sharp(src).resize(HALF_W, HALF_H).jpeg({ quality: JPG_QUALITY }).toFile(path.join(HALF_DIR, `${base}.jpg`)),
    // half-res WebP
    sharp(src).resize(HALF_W, HALF_H).webp({ quality: WEBP_QUALITY }).toFile(path.join(HALF_DIR, `${base}.webp`)),
  ]);

  done += 1;
  if (done % 25 === 0 || done === sources.length) {
    process.stdout.write(`  …${done}/${sources.length}\n`);
  }
}

console.log(`Done. Generated full WebP + half JPG/WebP for ${done} frames.`);
