/**
 * Renders the self-drawn study-object illustrations (src/lib/thumbnails.ts) into
 * 1200×630 OG PNGs at public/assets/og/<motif>.png.
 *
 * Uses `sharp`, which already ships with Next.js (no extra dependency). Images
 * contain no text, so no font files are needed. Re-run after editing a motif:
 *   npx tsx scripts/generate-og-images.ts
 * src/lib/metadata.ts only references a PNG that actually exists on disk.
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { THUMB_H, THUMB_W, thumbnailMarkup, thumbnailMotifs } from "../src/lib/thumbnails";

const OUT_DIR = path.join(process.cwd(), "public", "assets", "og");
const W = 1200;
const H = 630;

// 브랜드 심볼(public/assets/brand/logo-symbol.svg의 도형)을 좌상단에 작게 얹는다.
const BRAND_MARK = `<g transform="translate(40 36) scale(1.5)"><rect x="-6" y="-6" width="60" height="60" rx="12" fill="#FFFFFF" opacity="0.9"/><polygon points="26,6 42,6 42,22 36,22 36,12 26,12" fill="#142B52"/><polygon points="22,42 6,42 6,26 12,26 12,36 22,36" fill="#2563EB"/></g>`;

function ogSvg(inner: string): string {
  const sx = W / THUMB_W;
  const sy = H / THUMB_H;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><g transform="scale(${sx} ${sy})">${inner}</g>${BRAND_MARK}</svg>`;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const motif of thumbnailMotifs) {
    const out = path.join(OUT_DIR, `${motif}.png`);
    await sharp(Buffer.from(ogSvg(thumbnailMarkup(motif)))).png({ compressionLevel: 9 }).toFile(out);
  }
  console.log(`OG images: ${thumbnailMotifs.length} → public/assets/og/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
