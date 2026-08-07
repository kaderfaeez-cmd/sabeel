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
