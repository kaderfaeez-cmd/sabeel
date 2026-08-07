/**
 * Bakes the Quran's structure into the repo.
 *
 * The 114 surahs and their ayah counts are immutable, so paying a network round-trip for
 * them at runtime would be indefensible (ARCHITECTURE.md, "Fetching strategy").
 *
 * Run: node scripts/generate-surah-index.mjs
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../src/data/surahs.json',
);

const response = await fetch('https://api.quran.com/api/v4/chapters?language=en');
if (!response.ok) {
  throw new Error(`Quran.com API returned ${response.status} ${response.statusText}`);
}

const { chapters } = await response.json();

if (!Array.isArray(chapters) || chapters.length !== 114) {
  throw new Error(`Expected 114 chapters, received ${chapters?.length}`);
}

const surahs = chapters.map((chapter) => ({
  number: chapter.id,
  name: chapter.name_simple,
  nameArabic: chapter.name_arabic,
  meaning: chapter.translated_name.name,
  ayahCount: chapter.verses_count,
  revelationPlace: chapter.revelation_place,
  revelationOrder: chapter.revelation_order,
  /** Al-Fatihah and At-Tawbah are the two surahs not preceded by Bismillah. */
  hasBismillah: chapter.bismillah_pre,
}));

const totalAyahs = surahs.reduce((sum, s) => sum + s.ayahCount, 0);
if (totalAyahs !== 6236) {
  throw new Error(`Expected 6236 ayahs across the Quran, computed ${totalAyahs}`);
}

await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, `${JSON.stringify(surahs, null, 2)}\n`, 'utf8');

console.log(`Wrote ${surahs.length} surahs (${totalAyahs} ayahs) to ${OUT}`);
