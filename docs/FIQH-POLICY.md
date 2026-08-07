# SABEEL — Fiqh Policy

**Ratified by the project owner, 2026-08-07.** This document has the same authority as
[CONSTITUTION.md](./CONSTITUTION.md) and expands its §5. It governs every topic involving
fiqh — Salah, Wudhu, Ghusl, Marriage, Zakah, Fasting, Hajj, and all other acts of worship.

> Sabeel is an educational platform, not a fatwa service.

---

## 1. Teach broad agreement first

Start with the fundamentals all four Sunni madhahib agree on (ijma' or near-consensus).

For example, in Wudhu: intention, washing the face, washing the arms, wiping the head,
washing the feet. These come first, before any discussion of differences.

## 2. Present legitimate differences respectfully

Where the Hanafi, Maliki, Shafi'i and Hanbali schools differ, say so plainly.

**No school is described as "correct" and the others as "wrong."** Each view is presented
fairly and attributed to the madhhab that holds it.

## 3. Distinguish the weight of every action

Every fiqh action is explicitly labelled as one of:

| Class | Arabic | Meaning |
|---|---|---|
| Pillar | *rukn* | The act is invalid without it |
| Obligatory | *wajib / fard* | Required, where applicable |
| Sunnah | *sunnah* | Established practice of the Prophet ﷺ |
| Recommended | *mustahabb* | Encouraged, not required |

This is what lets a beginner tell what is essential from what varies.

## 4. Default to the simplest beginner-friendly explanation

The **main lesson** teaches one valid, widely accepted method — suitable for someone
learning to pray or perform wudhu for the first time.

Anything beyond that goes into an expandable section titled **"Scholarly Differences"**,
which is optional, clearly labelled, deeper reading.

## 5. Never issue fatwas

Where a question depends on personal circumstances, local custom, or a legal ruling, the
platform advises the user to consult a qualified local scholar or imam. It does not
answer.

## 6. Cite evidence

Wherever possible, include Quran references and authentic hadith references — and mark
explicitly when a position rests on scholarly interpretation rather than direct text.

## 7. Avoid sectarian language

No criticism, ridicule or dismissal of any of the four recognised Sunni madhahib.
Respectful, educational tone throughout.

---

## Engineering enforcement

This policy is not a writing guideline. It is enforced by the type system, so a fiqh page
that violates it does not compile:

- Every fiqh step carries a required `ruling: RulingClass` — there is no default and no
  "unspecified", so classification (§3) cannot be skipped.
- A `FiqhDifference` requires at least one `MadhhabPosition`, and every position requires
  a named `madhhab` — so an unattributed opinion (§2) is unconstructable.
- Differences render only inside the `<ScholarlyDifferences>` disclosure, which supplies
  the mandated heading — so §4's separation of main path from deeper reading is
  structural, not editorial discipline.
- `basis: 'text' | 'interpretation'` is required on every position, enforcing §6's
  distinction between direct evidence and scholarly reasoning.
- Every fiqh surface renders the §5 disclaimer from a shared component; it cannot be
  omitted per-page.
