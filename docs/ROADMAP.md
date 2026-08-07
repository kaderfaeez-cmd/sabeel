# SABEEL — Phase Roadmap

Governed by [CONSTITUTION.md](./CONSTITUTION.md). One phase at a time. The codebase is
production-ready at the end of every phase.

Ordering rationale: the **content spine** (Phase 1) comes before every feature, because
Constitution §3 makes provenance a structural requirement rather than a later polish
step. The AI assistant comes last because it can only be built safely on top of a
verified corpus.

---

### Phase 0 — Foundation ✅ *complete*
Constitution, architecture, source verification, Next.js 16 + React 19 + Tailwind v4
scaffold, design system (tokens, typography, theming), app shell, home page.

### Phase 1 — Content spine ✅ *complete*
The `SourcedContent` discriminated union, the `<ContentBlock>` renderer with per-kind
attribution, citation formatting, the fiqh types enforcing FIQH-POLICY.md, and the
Quran fetch layer. 49 tests, 91% line coverage on `src/lib`.
**Nothing renders without a source after this phase.**

### Phase 2 — The Quran ✅ *complete*
- ✅ Baked 114-surah index (6,236 ayahs) — offline, zero network cost
- ✅ Surah index with instant search by name, meaning or number
- ✅ Reading surface: Uthmani Arabic, 5 translations, transliteration, per-ayah references
- ✅ URL-held reading state, so every position is shareable
- ✅ Source-failure state that shows nothing rather than something unverified
- ✅ Recitation with per-ayah sync, 5 reciters, active-ayah highlight, never autoplaying
- ✅ Bookmarks, notes and reading progress — local-first in IndexedDB, no account needed
- ✅ Copy an ayah with its reference and translator attached
- ✅ Search with match highlighting, parsed into safe segments (never raw API markup)
- ✅ Offline persistence: an opened surah is cached with its attribution intact
- ✅ "Continue reading" and bookmark chips on the surah index

Deferred to later phases (they depend on work not yet done): highlights spanning
multiple ayahs, topic-based browsing, and cross-device sync (Phase 9, on Supabase).

### Phase 3 — Learn Salah + Learn Wudhu + Learn Ghusl 🔨 *in progress*
- ✅ Authenticity gate distinguishing all five evidence states
- ✅ Evidence model future-proofed for Quran, hadith, athar, ijma and scholarly explanation
- ✅ `scripts/probe-hadith.mjs` — candidate references are checked against the live
  dataset before any page cites them; none is ever asserted from memory
- ✅ **Learn Wudhu** — 9 steps, each classified by weight, all citations verified through
  the gate, common mistakes, and a closed-by-default "Scholarly differences" section
- ✅ **Learn Salah** — 9 positions as a mini-application: physical action, recitations
  with Arabic/transliteration/meaning, "Why am I saying this?", evidence, common
  mistakes, and evidence-backed accessibility guidance on each position
- ⬜ Salah audio (the audio layer is built; recordings still to be sourced)
- ⬜ The remaining prayers' rak'ah counts and timings
- ✅ **Learn Ghusl** — 3 occasions requiring it and 8 steps, each with evidence, plus
  4 scholarly differences
- ✅ **What breaks wudhu** — agreed nullifiers, contested ones marked as contested, and
  a "what does *not* break wudhu" section for the anxiety that causes needless repetition
- ⬜ Practice checklists
- ⬜ Wudhu step illustrations (environment/diagram only — no figurative depiction)

### Phase 4 — Prayer times
Geolocation + manual city, calculation-method selection, next-prayer countdown, quiet
visual reminder. **Adhan audio opt-in only** (Constitution §7).

### Phase 5 — Dua library + 99 Names of Allah
Categorised duas (morning, evening, travel, eating, sleep, anxiety, parents, marriage,
health, protection, forgiveness, work, exams). Each: Arabic, transliteration, translation,
meaning, audio, authentic reference. Asma ul-Husna with meaning and Quranic occurrence.

### Phase 6 — Beginner Roadmap + Learn Islam
The guided path for reverts and returners. Pillars, aqeedah basics, first-week practical
guide, quizzes, progress. Warm and unhurried; zero judgement.

### Phase 7 — Stories of the Quran
Immersive story engine: timeline, map, environmental artwork, Quranic passages, supporting
authentic hadith, lessons, reflection questions, modern application, narration, progress.
Adam, Nuh, Hud, Salih, Ibrahim, Lut, Ismail, Ishaq, Yaqub, Yusuf, Musa, Harun, Dawud,
Sulaiman, Yunus, Isa, Maryam, Dhul-Qarnayn, People of the Cave, Talut & Jalut, Fir'awn,
Qarun. **No Prophet is ever depicted.**

### Phase 8 — Women in Islam + Marriage in Islam
Extensive, source-backed sections covering spiritual equality, education, financial
independence, property, inheritance, marriage rights before/during/after, mahr,
motherhood, female companions, women named in the Quran, misconceptions, and the
culture-vs-Islam distinction. Every claim carries a Quran or hadith citation.

### Phase 9 — Accounts, sync, journal, progress dashboard
Supabase auth with Row Level Security, cross-device sync of the local-first store,
reflection journal, streaks and achievements framed encouragingly, certificates.

### Phase 10 — AI assistant
Retrieval-grounded assistant over the verified corpus. Citations mandatory. Refuses
rulings. Says "I could not verify this" rather than improvising.

### Phase 11 — Hadith library · Arabic learning · Islamic history
Browsable collections with grading shown, Arabic alphabet → Quranic vocabulary path,
and a sourced historical timeline.

### Phase 12 — PWA, offline, performance, accessibility audit, launch
Service worker, installability, low-bandwidth mode, Lighthouse and axe audits across all
surfaces, CSP hardening, SEO and structured data, deploy.

---

## Open decisions
Tracked in [DECISIONS.md](./DECISIONS.md) — items awaiting the project owner's ruling.
