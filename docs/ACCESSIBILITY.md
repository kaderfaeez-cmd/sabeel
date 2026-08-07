# SABEEL — Accessibility

Governed by [CONSTITUTION.md](./CONSTITUTION.md) §8. Accessibility is verified per phase,
by measurement — never asserted.

## Contrast

All text tokens are measured against every surface level they are used on. Values below
were measured in-browser by rasterising each token and computing the WCAG relative
luminance ratio (2026-08-07, Phase 0).

| Token | Light | Dark | Role |
|---|---|---|---|
| `ink` | 15.08 | 15.88 | Body and headings |
| `ink-muted` | 6.84 | 7.89 | Secondary text |
| `ink-faint` | 5.08 | 5.63 | Tertiary / metadata |
| `gold-ink` | 6.48 | 10.38 | Eyebrow labels, small accented text |
| `emerald` | 6.30 | 9.27 | Links, accents |
| `surface` on `emerald` | 6.30 | 9.27 | Primary button label |

All ≥ 4.5:1 — WCAG AA for **normal-size** text in both themes.

`--gold` (light 3.43:1) is a **decorative-only** role: hairline rules, ornament,
borders, and the large `aria-hidden` Arabic wordmark. It must never be used for text.
Use `--gold-ink` instead. This split exists because the original single gold token failed
AA on small eyebrow labels — the separation makes the mistake unrepeatable.

## Verified in Phase 0

- Semantic landmarks: one `header`, one `main`, one `footer`, labelled `nav`.
- Skip link to `#main`, visible on focus.
- Visible focus ring on every interactive element; never removed.
- Arabic text carries `lang="ar"` and `dir="rtl"`, rendered in Amiri.
- Decorative Arabic is `aria-hidden` so screen readers do not announce ornament.
- Theme toggle has a state-accurate `aria-label` that flips on activation.
- Mobile nav: `role="dialog"`, `aria-modal`, `aria-expanded`/`aria-controls`, focus moves
  to the close button on open, Escape closes, body scroll locks and restores.
- Touch targets ≥ 44×44 px on mobile (header controls and all 19 nav links).
- No horizontal overflow at 375 px.
- `prefers-reduced-motion` honoured globally and inside Framer Motion animations.

## Standing requirements for every later phase

- Adjustable type scale and an opt-in dyslexia-friendly font (Settings, Phase 9).
- Screen-reader review of the Quran reading surface, where mixed-direction text is
  hardest — the Arabic must not be announced as part of the English sentence.
- Keyboard-only walkthrough of every interactive surface before the phase is called done.
- Automated axe pass plus manual review at Phase 12.
- Low-bandwidth mode (Phase 12).

## Known gaps

- No automated a11y test suite yet — added with the test harness in Phase 1.
- Focus is not yet trapped inside the mobile nav dialog (Escape and the close button
  work; Tab can still reach the page behind it). Scheduled with the shared modal
  primitive in Phase 2.
