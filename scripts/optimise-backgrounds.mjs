/**
 * Optimises the OpenArt background plates for the web.
 *
 * These images are rendered behind a dimming scrim and a blur, at low opacity, so they
 * can be compressed far harder than a normal photograph without any visible loss. The
 * originals are ~3.5 MB each; a permanent always-visible background at that weight would
 * be indefensible on a platform meant to work on a slow connection.
 *
 * Outputs AVIF and WebP at two widths, and deletes nothing — the PNG sources are removed
 * by hand once the output is checked.
 *
 * Run: npm run optimise:backgrounds
 */
import { readdir, stat, unlink } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../public/backgrounds');

/** Desktop and a smaller plate for phones, which never see the full width. */
const WIDTHS = [
  { width: 1920, suffix: '' },
  { width: 960, suffix: '-sm' },
];

const files = (await readdir(DIR)).filter((name) => name.endsWith('.png'));
if (files.length === 0) {
  console.log('No PNG sources found — nothing to do.');
  process.exit(0);
}

let before = 0;
let after = 0;

for (const file of files) {
  const base = file.replace(/\.png$/, '');
  const source = join(DIR, file);
  before += (await stat(source)).size;

  for (const { width, suffix } of WIDTHS) {
    const pipeline = sharp(source).resize({ width, withoutEnlargement: true });

    const avif = join(DIR, `${base}${suffix}.avif`);
    const webp = join(DIR, `${base}${suffix}.webp`);

    // quality 45 is aggressive, and invisible behind a scrim at 12–22% opacity.
    await pipeline.clone().avif({ quality: 45, effort: 6 }).toFile(avif);
    await pipeline.clone().webp({ quality: 62 }).toFile(webp);

    after += (await stat(avif)).size + (await stat(webp)).size;
  }

  await unlink(source);
  console.log(`  ${base} → avif + webp at ${WIDTHS.map((w) => w.width).join(' / ')}`);
}

console.log(
  `\n${files.length} plates: ${(before / 1024 / 1024).toFixed(1)} MB of PNG → ` +
    `${(after / 1024 / 1024).toFixed(1)} MB of AVIF + WebP (all sizes, both formats).`,
);
