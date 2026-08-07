/**
 * Bakes the 99 Names of Allah into the repo.
 *
 * The Arabic is retrieved, never transcribed by hand — 99 names is far too much Arabic
 * to write from memory, and Constitution §3 forbids guessing at any of it.
 *
 * Source: AlAdhan (the same provider already verified for prayer times).
 * Run: npm run generate:names
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data/names.json');

const response = await fetch('https://api.aladhan.com/v1/asmaAlHusna');
if (!response.ok) throw new Error(`AlAdhan returned ${response.status}`);

const { data } = await response.json();

if (!Array.isArray(data) || data.length !== 99) {
  throw new Error(`Expected 99 names, received ${data?.length}`);
}

const names = data.map((entry) => {
  if (!entry.name || !entry.transliteration || !entry.en?.meaning) {
    throw new Error(`Name ${entry.number} is missing a field`);
  }
  return {
    number: entry.number,
    arabic: entry.name,
    transliteration: entry.transliteration,
    meaning: entry.en.meaning,
  };
});

// Numbers must be 1..99 with no gaps, or the index is not what it claims to be.
names.forEach((name, index) => {
  if (name.number !== index + 1) {
    throw new Error(`Expected name ${index + 1}, found ${name.number}`);
  }
});

await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, `${JSON.stringify(names, null, 2)}\n`, 'utf8');

console.log(`Wrote ${names.length} names to ${OUT}`);
console.log(`  1. ${names[0].transliteration} — ${names[0].meaning}`);
console.log(` 99. ${names[98].transliteration} — ${names[98].meaning}`);
