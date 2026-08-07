# SABEEL — Decisions

Governed by [CONSTITUTION.md](./CONSTITUTION.md) §9: *"When unsure — ask. Do not assume."*

## Settled (Phase 0)

| # | Decision | Rationale |
|---|---|---|
| 1 | Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind v4 | Stack mandated by the constitution; latest stable at scaffold time. |
| 2 | Quran.com API v4 as the Quran source | Verified live, no key, 126 translations, word-by-word and audio in one place. |
| 3 | `fawazahmed0/hadith-api` pinned at `@1`, vendored at build time | Verified live, 10 collections. Pinning + vendoring means citations cannot silently change. |
| 4 | Design direction: "illuminated manuscript" — parchment light default, midnight dark | Light default is deliberate: warm parchment reads as welcoming to a newcomer where a dark UI reads as a tech product. Both themes are fully designed. |
| 5 | Type: Cormorant Garamond (display) · Inter (body) · Amiri (Arabic) | Three families exceeds the usual two-family budget; justified because Arabic is primary text, not decoration. Amiri is a Bulaq naskh revival, the form readers recognise from printed mushaf. |
| 6 | Hand-rolled theming instead of `next-themes` | One 15-line inline script and one toggle. A dependency would add more surface than it removes. |
| 7 | Content spine (Phase 1) before any feature | Constitution §3 makes provenance structural. Building features first would mean retrofitting attribution, which is how attribution gets forgotten. |
| 8 | AI assistant last (Phase 10) | It must be retrieval-grounded over a verified corpus. That corpus does not exist until Phases 1–8. |
| 9 | `--gold` split into decorative `--gold` and text-safe `--gold-ink` | The single token failed WCAG AA on small text. Splitting the role makes the failure unrepeatable. |

## Open — awaiting the project owner

| # | Question | Why it matters | Recommendation |
|---|---|---|---|
| A | **Fiqh scope.** Present rulings comparatively across the four Sunni madhahib, or lead with the majority position and note differences? | Determines the shape of every Salah, Wudhu, Ghusl and Marriage page — it is a data-model decision, not a copy decision, so it must be settled before Phase 3. | Lead with the agreed core, then a clearly-labelled "where scholars differ" panel. Honours Constitution §5 without overwhelming a beginner. |
| B | **Supabase now or later?** | Accounts are not needed until Phase 9, and local-first already delivers full functionality without them. | Defer to Phase 9. Build local-first first; sync is then an additive layer rather than a dependency. |
| C | **Artwork budget.** OpenArt generation is credit-metered and Phase 7 needs the most (one environment set per story, ~22 stories). | Affects whether Phase 7 ships with full art or a phased art rollout. | Commission art per phase, not upfront. Phase 0–6 need very little. |
| D | **Domain / deployment target.** | Affects `metadataBase`, OG tags, and canonical URLs (currently a placeholder `sabeel.app`). | Vercel, consistent with your other projects. Confirm the domain when you have one. |
| E | **Recitation reciter default.** Quran.com offers many; a default must be chosen. | Small but user-facing. | Mishary Rashid Alafasy — the most widely recognised, with clear articulation for learners. Selectable in Settings. |
