/**
 * Build-time review warning.
 *
 * Walks every hadith reference cited by the fiqh data, fetches the dataset entry, and
 * warns about any whose text detection flags as possibly unusable and which has no
 * recorded human decision.
 *
 * Constitution §3.3 — this never excludes anything. It tells a person what to look at.
 * Exit code is 0 by design: a flagged narration is a review task, not a broken build.
 *
 * Run: npm run check:hadith
 */
import { readdirSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions';

/** Mirrors lib/hadith/substance.ts. Kept in sync by the unit tests on that module. */
const CHAIN_ONLY = [
  [/narrated (?:to us )?(?:by|through) another chain/i, 'Refers to another chain of transmitters.'],
  [/this hadith has been (?:narrated|reported|transmitted)/i, 'Describes transmission rather than stating the narration.'],
  [/narrated (?:it )?like the (?:hadith|tradition)/i, 'Points at another narration without its text.'],
  [/(?:a|the) similar (?:hadith|tradition|narration) (?:has been )?(?:narrated|reported)/i, 'Refers to a similar narration.'],
  [/with the same chain of (?:transmitters|narrators)/i, 'Records an alternate chain only.'],
];
const SHORT_TEXT_THRESHOLD = 60;

function checkSubstance(text) {
  const trimmed = text.trim();
  const reasons = [];
  for (const [pattern, reason] of CHAIN_ONLY) {
    if (pattern.test(trimmed)) reasons.push(reason);
  }
  if (trimmed.length === 0) reasons.push('The entry has no text at all.');
  else if (trimmed.length < SHORT_TEXT_THRESHOLD) {
    reasons.push(`Only ${trimmed.length} characters — genuine short narrations exist, so this needs a look.`);
  }
  // No terminal-punctuation check: see the note in src/lib/hadith/substance.ts. It
  // flagged every cited narration, because the dataset omits closing full stops.
  return reasons;
}

/**
 * Extracts { collection, number } pairs from every fiqh data file.
 *
 * Reads the directory rather than a hardcoded list — an earlier version listed the files
 * by hand and silently skipped a newly added page, reporting "no narrations awaiting
 * review" for content it had never looked at. A check that quietly covers less than you
 * think is worse than no check.
 */
function collectReferences() {
  const dir = resolve(ROOT, 'src/data/fiqh');
  let files;
  try {
    files = readdirSync(dir)
      .filter((name) => name.endsWith('.ts') && !name.endsWith('.test.ts'))
      .map((name) => `src/data/fiqh/${name}`);
  } catch {
    return [];
  }

  const found = new Map();

  for (const file of files) {
    let source;
    try {
      source = readFileSync(resolve(ROOT, file), 'utf8');
    } catch {
      continue;
    }
    const pattern = /collection:\s*'([a-z]+)'\s*,\s*number:\s*(\d+)/g;
    let match;
    while ((match = pattern.exec(source)) !== null) {
      found.set(`${match[1]}:${match[2]}`, { collection: match[1], number: Number(match[2]) });
    }
  }
  return [...found.values()];
}

function loadReviewKeys() {
  try {
    const source = readFileSync(resolve(ROOT, 'src/data/hadith-review.ts'), 'utf8');
    const keys = new Map();
    const pattern = /'([a-z]+:\d+)':\s*\{[\s\S]*?decision:\s*'(approved|excluded)'/g;
    let match;
    while ((match = pattern.exec(source)) !== null) keys.set(match[1], match[2]);
    return keys;
  } catch {
    return new Map();
  }
}

const references = collectReferences();
const reviews = loadReviewKeys();

if (references.length === 0) {
  console.log('No hadith references found in the fiqh data.');
  process.exit(0);
}

const flagged = [];
const held = [];

for (const { collection, number } of references) {
  const key = `${collection}:${number}`;
  const response = await fetch(`${BASE}/eng-${collection}/${number}.min.json`);
  if (!response.ok) {
    flagged.push({ key, reasons: [`Source responded ${response.status}.`] });
    continue;
  }

  const data = await response.json();
  const text = data.hadiths?.[0]?.text ?? '';
  const reasons = checkSubstance(text);
  if (reasons.length === 0) continue;

  const decision = reviews.get(key);
  if (decision === 'approved') continue;
  if (decision === 'excluded') {
    held.push({ key, reasons: ['Excluded by review; not published.'] });
    continue;
  }
  flagged.push({ key, reasons });
}

console.log(`Checked ${references.length} cited hadith reference(s).`);

if (held.length > 0) {
  console.log(`\n${held.length} held by an existing review decision:`);
  for (const item of held) console.log(`  - ${item.key}: ${item.reasons.join(' ')}`);
}

if (flagged.length > 0) {
  console.warn(`\n⚠  ${flagged.length} narration(s) FLAGGED FOR REVIEW and held back from publication:\n`);
  for (const item of flagged) {
    console.warn(`  ${item.key}`);
    for (const reason of item.reasons) console.warn(`     · ${reason}`);
  }
  console.warn(
    '\n  These are NOT excluded automatically. Record a decision in src/data/hadith-review.ts\n' +
      '  (approved or excluded, with a reason) and they will publish or stay held accordingly.\n' +
      '  Constitution §3.3: automate detection, do not automate judgement.\n',
  );
} else {
  console.log('\nNo narrations are awaiting review.');
}
