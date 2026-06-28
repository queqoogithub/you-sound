// Copies the prebuilt transformers.js browser bundle + onnxruntime-web wasm
// from node_modules into /public so the model worker can load them from the
// same origin (no CDN, works offline, avoids webpack worker bundling issues).
import { copyFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const srcDir = join(root, "node_modules", "@huggingface", "transformers", "dist");
const outDir = join(root, "public", "transformers");

mkdirSync(outDir, { recursive: true });

const files = [
  "transformers.js",
  "ort-wasm-simd-threaded.jsep.mjs",
  "ort-wasm-simd-threaded.jsep.wasm",
];

for (const f of files) {
  const src = join(srcDir, f);
  if (!existsSync(src)) {
    console.error(`Missing ${src}. Did you run npm install?`);
    process.exit(1);
  }
  copyFileSync(src, join(outDir, f));
  console.log(`copied ${f}`);
}
