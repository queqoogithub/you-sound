import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "icons");
mkdirSync(outDir, { recursive: true });

const svg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fffdf9"/>
      <stop offset="1" stop-color="#f2e6cf"/>
    </linearGradient>
    <linearGradient id="note" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#c9b48f"/>
      <stop offset="1" stop-color="#9c7f50"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  <g fill="url(#note)">
    <path d="M196 120 L356 96 C372 93 384 105 384 121 L384 300
      C384 314 374 326 360 329 L344 332 C319 337 296 320 296 296
      C296 277 310 261 330 257 L348 254 L348 168 L232 186 L232 330
      C232 344 222 356 208 359 L192 362 C167 367 144 350 144 326
      C144 307 158 291 178 287 L196 284 Z"/>
  </g>
</svg>`;

for (const size of [192, 512]) {
  await sharp(Buffer.from(svg(size)))
    .resize(size, size)
    .png()
    .toFile(join(outDir, `icon-${size}.png`));
  console.log(`wrote icon-${size}.png`);
}

// Maskable icon (extra padding handled by the rounded background already)
await sharp(Buffer.from(svg(512)))
  .resize(512, 512)
  .png()
  .toFile(join(outDir, "maskable-512.png"));
console.log("wrote maskable-512.png");
