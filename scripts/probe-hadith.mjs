/**
 * Probes candidate hadith references against the live dataset and reports what the
 * authenticity gate would conclude for each.
 *
 * Used before writing any fiqh page: references are never asserted from memory, they are
 * checked here first and the page is then built from whatever the gate actually returns.
 *
 * Run: node scripts/probe-hadith.mjs
 */
const BASE = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions';

const AUTHENTIC_BY_COLLECTION = new Set(['bukhari', 'muslim']);

const WEAK = /\b(da'?if|daif|dhaeef|weak|munkar|shadh)\b/i;
const FABRICATED = /\b(mawdu'?|mawdoo'?|fabricated|forged|batil)\b/i;

function acceptable(grade) {
  const v = grade.toLowerCase();
  if (FABRICATED.test(v) || WEAK.test(v)) return false;
  return /sahih|hasan|mutawatir/.test(v);
}

function classify(collection, grades) {
  if (grades.length === 0) {
    return AUTHENTIC_BY_COLLECTION.has(collection) ? 'verified (by collection)' : 'unverified-in-dataset';
  }
  const ok = grades.filter((g) => acceptable(g.grade)).length;
  if (ok === 0) return grades.some((g) => FABRICATED.test(g.grade)) ? 'fabricated' : 'weak';
  if (ok < grades.length) return 'disputed';
  return 'verified';
}

/** Candidate references for the Wudhu and Salah pages. */
const CANDIDATES = [
  ['bukhari', 1, 'Actions are by intentions'],
  ['bukhari', 159, 'Description of wudhu'],
  ['bukhari', 164, 'Rinsing mouth and nose'],
  ['muslim', 226, 'Wudhu and forgiveness'],
  ['abudawud', 101, 'Bismillah before wudhu'],
  ['tirmidhi', 25, 'Bismillah before wudhu'],
  ['tirmidhi', 37, 'Wiping the ears'],
  ['abudawud', 61, 'Key of prayer is purification'],
  ['bukhari', 6251, 'Teaching the man who prayed badly'],
  ['bukhari', 631, 'Pray as you have seen me pray'],
  ['muslim', 397, 'Al-Fatihah is essential'],
  ['bukhari', 756, 'No prayer without Al-Fatihah'],
  ['bukhari', 1117, 'Pray standing; if not able, sitting; if not, on your side'],
  ['bukhari', 831, 'The tashahhud taught by Ibn Masud'],
  ['abudawud', 869, 'Tasbih in ruku and sujud'],
  ['abudawud', 870, 'Tasbih in ruku and sujud'],
  ['muslim', 772, 'The Prophet supplication in prayer'],
  ['bukhari', 793, 'Description of ruku and sujud'],
  ['tirmidhi', 265, 'Tasbih in ruku'],
  ['abudawud', 857, 'The man who prayed badly - full description'],
  ['nasai', 1145, 'Sujud on seven bones'],
  // Ghusl
  ['bukhari', 248, 'Aishah describing the Prophet ghusl from janabah'],
  ['bukhari', 249, 'Aishah describing the ghusl'],
  ['bukhari', 254, 'Ghusl description'],
  ['bukhari', 274, 'Maymunah describing the ghusl'],
  ['bukhari', 276, 'Maymunah describing the ghusl'],
  ['muslim', 316, 'Ghusl from janabah'],
  ['muslim', 317, 'Ghusl from janabah'],
  ['muslim', 330, 'Ghusl and hair for women'],
  ['bukhari', 314, 'Ghusl after menstruation'],
  ['abudawud', 248, 'Ghusl description'],
  ['tirmidhi', 103, 'Ghusl from janabah'],
];

const rows = [];

for (const [collection, number, note] of CANDIDATES) {
  const url = `${BASE}/eng-${collection}/${number}.min.json`;
  let status, snippet = '';

  try {
    const response = await fetch(url);
    if (response.status === 404) {
      status = 'not-found';
    } else if (!response.ok) {
      status = `HTTP ${response.status}`;
    } else {
      const data = await response.json();
      const hadith = data.hadiths?.[0];
      if (!hadith) {
        status = 'not-found';
      } else {
        const grades = hadith.grades ?? [];
        status = classify(collection, grades);
        snippet = (hadith.text ?? '').replace(/\s+/g, ' ').slice(0, 88);
      }
    }
  } catch (error) {
    status = `error: ${error.message}`;
  }

  rows.push({ ref: `${collection}:${number}`, status, note, snippet });
}

const pad = (s, n) => String(s).padEnd(n);
console.log(pad('REFERENCE', 18) + pad('GATE RESULT', 26) + 'NOTE');
console.log('-'.repeat(110));
for (const row of rows) {
  console.log(pad(row.ref, 18) + pad(row.status, 26) + row.note);
  if (row.snippet) console.log(' '.repeat(18) + `  "${row.snippet}…"`);
}
