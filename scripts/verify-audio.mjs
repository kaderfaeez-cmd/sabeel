/**
 * Checks that every reciter Sabeel offers actually plays.
 *
 * Written after two of the five reciters were found to be silently broken in production:
 * the Quran.com API returns protocol-relative URLs for some recitations, which the URL
 * resolver mangled into a 404. Nothing surfaced the failure — the page rendered, the
 * player appeared, and the audio simply never loaded.
 *
 * Run: npm run verify:audio
 */
const RECITERS = [
  { id: 7, name: 'Mishari Rashid al-Afasy' },
  { id: 6, name: 'Mahmoud Khalil Al-Husary' },
  { id: 12, name: 'Al-Husary (Muallim)' },
  { id: 2, name: 'AbdulBaset (Murattal)' },
  { id: 3, name: 'Abdur-Rahman as-Sudais' },
];

/** Mirrors resolveTrackUrl in src/lib/audio/providers.ts. */
function resolveTrackUrl(base, pathOrUrl) {
  const value = pathOrUrl.trim();
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('//')) return `https:${value}`;
  return `${base.replace(/\/+$/, '')}/${value.replace(/^\/+/, '')}`;
}

const BASE = 'https://verses.quran.com/';
/** A short surah and a long one, to catch paging problems as well as URL shapes. */
const SURAHS = [1, 112, 18];

let failures = 0;

for (const reciter of RECITERS) {
  for (const surah of SURAHS) {
    const api = `https://api.quran.com/api/v4/recitations/${reciter.id}/by_chapter/${surah}?per_page=300`;

    let files;
    try {
      const response = await fetch(api);
      if (!response.ok) throw new Error(`API ${response.status}`);
      files = (await response.json()).audio_files ?? [];
    } catch (error) {
      console.error(`FAIL  ${reciter.name} / surah ${surah}: ${error.message}`);
      failures += 1;
      continue;
    }

    if (files.length === 0) {
      console.error(`FAIL  ${reciter.name} / surah ${surah}: no audio files returned`);
      failures += 1;
      continue;
    }

    // Check the first and last track — a wrong base breaks all of them identically,
    // and a paging bug shows up at the end.
    const toCheck = [files[0], files[files.length - 1]];
    let ok = true;

    for (const file of toCheck) {
      const url = resolveTrackUrl(BASE, file.url);
      try {
        const head = await fetch(url, { method: 'HEAD' });
        if (!head.ok) {
          console.error(`FAIL  ${reciter.name} / surah ${surah}: ${head.status} ${url}`);
          ok = false;
        }
      } catch (error) {
        console.error(`FAIL  ${reciter.name} / surah ${surah}: ${error.message} ${url}`);
        ok = false;
      }
    }

    if (!ok) failures += 1;
    else console.log(`ok    ${reciter.name} / surah ${surah} (${files.length} ayahs)`);
  }
}

if (failures > 0) {
  console.error(`\n${failures} reciter/surah combination(s) failed.`);
  process.exit(1);
}
console.log('\nEvery reciter plays for every surah checked.');
