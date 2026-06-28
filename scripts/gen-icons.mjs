import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, "..", "public", "icons");
mkdirSync(iconsDir, { recursive: true });

const source = join(iconsDir, "yousound-icon.png");

// Standard "any" icons: just resize the source artwork.
for (const size of [192, 512]) {
  await sharp(source)
    .resize(size, size, { fit: "cover" })
    .png()
    .toFile(join(iconsDir, `icon-${size}.png`));
  console.log(`wrote icon-${size}.png`);
}

// Apple touch icon.
await sharp(source)
  .resize(180, 180, { fit: "cover" })
  .png()
  .toFile(join(iconsDir, "apple-touch-icon.png"));
console.log("wrote apple-touch-icon.png");

// Maskable icon: place the artwork inside a safe zone (~80%) on a soft pastel
// background so platform masks never clip the logo.
const maskSize = 512;
const inner = Math.round(maskSize * 0.78);
const resized = await sharp(source)
  .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();

await sharp({
  create: {
    width: maskSize,
    height: maskSize,
    channels: 4,
    background: { r: 233, g: 226, b: 248, alpha: 1 }, // pastel lavender
  },
})
  .composite([{ input: resized, gravity: "center" }])
  .png()
  .toFile(join(iconsDir, "maskable-512.png"));
console.log("wrote maskable-512.png");
