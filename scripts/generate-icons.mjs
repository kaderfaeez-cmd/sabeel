/**
 * Builds the full icon set and the social sharing image from the OpenArt source.
 *
 * Run: npm run generate:icons  (expects scripts/.icon-src.png)
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = resolve(ROOT, 'scripts/.icon-src.png');
const PUB = resolve(ROOT, 'public');

const NAVY = '#0d1b33';

await mkdir(PUB, { recursive: true });
const source = await readFile(SRC);

/** Plain square icons. */
const SIZES = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 48, name: 'favicon-48x48.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' },
];

for (const { size, name } of SIZES) {
  await sharp(source).resize(size, size, { fit: 'cover' }).png().toFile(resolve(PUB, name));
  console.log(`  ${name}`);
}

/**
 * Maskable icon: Android crops to a circle, so the artwork must sit inside the safe
 * zone (the middle 80%). Scale the art down and pad with the brand navy.
 */
const inner = Math.round(512 * 0.78);
const art = await sharp(source).resize(inner, inner, { fit: 'cover' }).toBuffer();
await sharp({
  create: { width: 512, height: 512, channels: 4, background: NAVY },
})
  .composite([{ input: art, gravity: 'center' }])
  .png()
  .toFile(resolve(PUB, 'maskable-icon-512x512.png'));
console.log('  maskable-icon-512x512.png');

/**
 * favicon.ico containing 16/32/48. The ICO container can hold PNG payloads directly,
 * which is far simpler than encoding BMP and is supported everywhere that matters.
 */
const icoSizes = [16, 32, 48];
const pngs = await Promise.all(
  icoSizes.map((size) => sharp(source).resize(size, size, { fit: 'cover' }).png().toBuffer()),
);

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(pngs.length, 4);

let offset = 6 + pngs.length * 16;
const entries = [];
for (const [i, png] of pngs.entries()) {
  const size = icoSizes[i];
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
  entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
  entry.writeUInt8(0, 2); // palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // colour planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(offset, 12);
  entries.push(entry);
  offset += png.length;
}

await writeFile(resolve(PUB, 'favicon.ico'), Buffer.concat([header, ...entries, ...pngs]));
console.log('  favicon.ico (16/32/48)');

/**
 * Social sharing image. The night dunes plate, darkened, with the wordmark composited
 * as SVG so the type is crisp rather than model-generated.
 */
const plate = resolve(PUB, 'backgrounds/dunes-night.webp');
const overlay = Buffer.from(`
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0d1b33" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#0d1b33" stop-opacity="0.9"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#fade)"/>
  <text x="80" y="300" font-family="Georgia, 'Times New Roman', serif" font-size="104"
        fill="#f4efe4" letter-spacing="2">Sabeel</text>
  <text x="80" y="366" font-family="Georgia, 'Times New Roman', serif" font-size="34"
        fill="#e0b660" letter-spacing="6">THE PATH</text>
  <text x="80" y="452" font-family="Helvetica, Arial, sans-serif" font-size="30"
        fill="#c9c3b6">Learn Islam from authentic sources.</text>
  <text x="80" y="496" font-family="Helvetica, Arial, sans-serif" font-size="30"
        fill="#c9c3b6">Every word traceable to where it came from.</text>
  <rect x="80" y="540" width="120" height="3" fill="#e0b660"/>
</svg>`);

await sharp(plate)
  .resize(1200, 630, { fit: 'cover' })
  .composite([{ input: overlay }])
  .png()
  .toFile(resolve(PUB, 'og-image.png'));
console.log('  og-image.png (1200x630)');

console.log('\nIcon set complete.');
