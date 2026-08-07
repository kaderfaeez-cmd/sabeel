/**
 * Verifies the authenticity gate against the live dataset.
 *
 * This is not a unit test — it deliberately hits the real pinned dataset, because the
 * thing being checked is whether the real data behaves the way SOURCES.md assumes.
 *
 * Run: node scripts/verify-hadith.mjs
 */
const BASE = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions';

const CASES = [
  { collection: 'bukhari', number: 1, expect: 'sahih by collection' },
  { collection: 'muslim', number: 1, expect: 'sahih by collection' },
  { collection: 'tirmidhi', number: 2516, expect: 'graded' },
  { collection: 'abudawud', number: 61, expect: 'graded' },
  { collection: 'nasai', number: 1, expect: 'graded' },
];

let failures = 0;

for (const testCase of CASES) {
  const url = `${BASE}/eng-${testCase.collection}/${testCase.number}.min.json`;
  const response = await fetch(url);

  if (!response.ok) {
    console.error(`FAIL ${testCase.collection}:${testCase.number} -> HTTP ${response.status}`);
    failures += 1;
    continue;
  }

  const data = await response.json();
  const hadith = data.hadiths?.[0];
  const grades = hadith?.grades ?? [];
  const summary = grades.map((g) => `${g.name}=${g.grade}`).join(' | ') || '(none)';

  console.log(
    `OK   ${testCase.collection}:${testCase.number}  book=${hadith?.reference?.book ?? '?'}  grades=${summary}`,
  );

  if (testCase.expect === 'graded' && grades.length === 0) {
    console.error(
      `     ^ expected a grading here; SOURCES.md would exclude this narration`,
    );
    failures += 1;
  }
}

if (failures > 0) {
  console.error(`\n${failures} case(s) did not match the source policy.`);
  process.exit(1);
}

console.log('\nAll cases match the source policy in docs/SOURCES.md.');
