# SABEEL — Source Policy

Governed by [CONSTITUTION.md](./CONSTITUTION.md) §3.

## Rules

1. **No religious text is ever written by hand or by a model in this repository.** It is
   retrieved from a source listed below and attributed in the UI.
2. Every source in this file must be **verified reachable** before being depended on, and
   re-verified at the start of each phase that uses it.
3. Every citation shown to a user must be **independently checkable** — surah:ayah for
   Quran, collection + book + number for hadith.
4. Hadith are shown with their **grading** where the dataset provides it. A hadith whose
   grading cannot be established is not presented as evidence.
5. Platform-authored prose is `kind: 'summary'` and is always visually distinct.

## Verified sources

### Quran — Quran.com API v4
- Base: `https://api.quran.com/api/v4`
- Verified 2026-08-07: 114 chapters returned; 126 translations available; no API key.
- English translations selected for the platform (all widely published, attribution shown):
  Saheeh International (20), M.A.S. Abdel Haleem (85), Mufti Taqi Usmani (84),
  Pickthall (19), Yusuf Ali (22). Transliteration resource (57).
- Also provides word-by-word data and recitation audio.

### Hadith — pinned open dataset
- `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/…`
- Verified 2026-08-07: 10 editions available — bukhari, muslim, abudawud, tirmidhi,
  nasai, ibnmajah, malik, nawawi (40 Hadith), qudsi, dehlawi.
- **Pinned at `@1`.** Cited hadith are additionally vendored into `data/hadith/` at build
  time so citations survive upstream changes.
- This dataset mirrors published collections. It is a convenience layer, **not** an
  authority: the collection/book/number shown to the user is what makes the citation
  verifiable against the printed work.

### Prayer times — to verify (Phase 4)
AlAdhan API, with user-selectable calculation method. No auto-play audio.

## Rejected / not used

- Any model-generated hadith, verse or ruling. Non-negotiable.
- Any hadith source that does not carry collection + number.
- Any image generation prompt that could produce a figurative depiction of a Prophet or
  revered figure. The asset pipeline blocks these at prompt level.

## Re-verification log

| Date | Source | Result |
|---|---|---|
| 2026-08-07 | Quran.com API v4 | ✅ 114 chapters, 126 translations |
| 2026-08-07 | hadith-api @1 | ✅ 10 editions |
| 2026-08-07 | Recitation audio (verses.quran.com) | ✅ 12 reciters, per-ayah audio reachable |
| 2026-08-07 | Hadith authenticity gate | ✅ `npm run verify:hadith` — all cases match this policy |

## The authenticity policy

**Owner ruling, 2026-08-07 — binding:**

> The platform should never present uncertain evidence as established evidence. If a
> hadith cannot be confidently authenticated according to the platform's policy, do not
> cite it as proof.

Where supporting hadith cannot be verified, the platform:

1. Continues teaching anything clearly established by the **Quran**.
2. Includes **authentic hadith** where available.
3. Shows an **Authenticity Notice** stating precisely what is and is not known.

> Never lower the evidentiary standard simply because another Islamic website includes a
> narration. Our goal is trust, not volume.

## The authenticity gate

Implemented in `src/lib/hadith/api.ts` as `lookupHadith`. Only a `verified` result
carries a citable block; every other result carries the reference and each scholar's
assessment so the reader can be told the truth about what was checked.

### The five states are never blurred together

This is the point of the design. These are different claims, and only some of them are
Sabeel's to make:

| Status | Means | Sabeel's claim |
|---|---|---|
| `verified` | Meets the publication policy | May be cited as proof |
| `unverified-in-dataset` | Our dataset carries no grading | **A statement about our checking, not about the narration** |
| `disputed` | Recognised scholars reached different conclusions | A real difference; shown with each assessment, not presented as settled |
| `weak` | Explicitly graded da'if by those who assessed it | Not cited as evidence |
| `fabricated` | Explicitly graded mawdu' | Never cited, never reproduced |
| `not-found` | No narration at that reference | Nothing to show |

"Weak" is **not** "no grading available". "No grading available" is **not** "fabricated".
"Two scholars differed" is **not** "weak". The UI gives each its own wording and its own
visual treatment, and `EVIDENCE_STATUS_COPY` is unit-tested to keep them distinct.

### Rules

1. **Sahih al-Bukhari and Sahih Muslim** are accepted as authentic by the collection
   itself — but only where the dataset gives no grading. A narration in either that *is*
   graded weak is still refused.
2. **Every other collection** requires an explicit grading from a named scholar.
3. Gradings weaker than *hasan* are refused.
4. Where several scholars graded a narration, the strongest acceptable grading is used
   and **that scholar is credited by name**.
5. An unrecognised grading string is refused rather than guessed at.

### Established practice, citation pending

The Quran establishes the obligation of Salah, while many details of its performance come
through the Sunnah. A page must therefore **never read as "there is no evidence"** merely
because the gate has not yet cleared a specific narration. Where a practice is established
within mainstream Sunni scholarship but no citation has yet passed the gate, the page says
exactly that, and that further authenticated references may be added in future updates.

`npm run verify:hadith` checks these rules against the live dataset rather than mocks,
because the thing being verified is whether the real data still behaves as assumed.
