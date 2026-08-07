# SABEEL — Project Constitution

**سَبِيل** — *sabeel*, "the path".

This document is the supreme authority of this project. Every design decision, feature,
page, animation and line of code must comply with it. When any other document, ticket,
convention or instruction conflicts with this one, **this document wins**.

Read this file before starting any phase of work.

---

## 1. Vision

Build one of the world's best Islamic educational platforms — a product that feels like a
premium Apple-quality application, not a traditional educational website.

Audience, in order of design priority:

1. People reverting to Islam
2. Muslims returning to Islam
3. Existing Muslims strengthening their knowledge
4. Non-Muslims seeking to understand Islam

The application must feel welcoming, calming, beautiful and inspiring. It must **never**
make a person feel judged or overwhelmed. Learning Islam should feel exciting.

## 2. Mission

Help people build a relationship with Allah through authentic knowledge, with wisdom,
patience, compassion and sincerity.

This platform is **educational**. It does **not** replace scholars and it does **not**
issue fatwas. Every surface that could be mistaken for a ruling must say so.

## 3. Authenticity — the highest priority

> If making the application more impressive ever conflicts with remaining authentic,
> **authenticity always wins.**

**Never fabricate** Quran verses, hadith, historical events, scholarly opinions, or
Islamic rulings.

If something cannot be verified, say so in the product. Never guess. Never invent.

### 3.1 Engineering consequence (non-negotiable)

Because a language model can fabricate fluently, religious text is **never** authored by
a model in this codebase. It is **retrieved** from a pinned, verifiable dataset.

- Quran text, translations and recitations come from an external verified API/dataset.
- Hadith come from a pinned open dataset that mirrors published collections, and always
  carry collection + book + number so a user can verify independently.
- Any human/AI-written prose (summaries, lesson framing, reflection prompts) is stored in
  a **separate content type** and is always visually and structurally labelled as such.
- Every content record carries a `source` field. **Content without a source does not
  render.** This is enforced at the type level, not by convention.

### 3.2 Source hierarchy

1. Quran
2. Authentic Sunnah
3. Trusted scholarly explanation

The Quran is the foundation. Authentic hadith explain and contextualise it. Scholarly
commentary explains both. **These three are never blurred together** — not in the data
model, not in the UI, not in the AI assistant's output.

## 4. Content classification

Every block of content displayed to a user is exactly one of these, and is always
visibly labelled:

| Kind | Meaning | Requires |
|---|---|---|
| `quran` | Revelation | surah:ayah reference, translation attribution |
| `hadith` | Prophetic narration | collection, book, number, grading |
| `tafsir` | Classical exegesis | named mufassir + work |
| `history` | Historical context | named source |
| `summary` | Educational framing written for this platform | explicit "editorial" label |

The user must **always** know what they are reading.

## 5. Scholarly differences

Where legitimate scholarly difference exists, the platform states that multiple accepted
opinions exist and presents them respectfully. It does not present one interpretation as
absolute unless there is broad scholarly consensus.

No sectarian debate. Maintain a welcoming educational tone throughout.

**For all fiqh topics, [FIQH-POLICY.md](./FIQH-POLICY.md) is binding** and carries the
same authority as this document. In summary: teach broad agreement first; attribute every
differing position to its madhhab and never call one correct and the others wrong; label
every action as pillar, obligatory, sunnah or recommended; keep the main lesson simple and
put differences in an optional "Scholarly Differences" section; never issue fatwas; cite
evidence and mark when a view rests on interpretation; never use sectarian language.

## 6. Visual policy

**Never** generate, commission or display imagery depicting the Prophet Muhammad ﷺ, any
other Prophet, or other revered figures. This is a hard block, enforced in the asset
pipeline and in any AI image prompt used by this project.

Permitted and encouraged artwork: deserts, ancient cities, historic environments,
mosques, Islamic architecture, mountains, night skies, nature, ancient villages,
historical landscapes, maps, calligraphy, Islamic geometric patterns, symbolic
illustration, timeline artwork, environmental storytelling.

Immersion is achieved through **environment**, never through figuration.

## 7. Product principles

- **Prayer times never auto-play the Adhan.** Some users live in households where audible
  religious reminders create difficulty. Default is a quiet, dignified visual reminder:
  "Prayer time has begun." Adhan audio is opt-in from Settings only.
- **No shame mechanics.** Streaks and goals encourage; they never guilt. A broken streak
  is never framed as failure.
- **Nothing is gated behind an account** for reading Quran, duas or lessons. Accounts add
  sync, not access.
- **Offline-first for revelation.** Quran reading must work without a network.

## 8. Engineering standards

Write code as though this will serve millions of users.

- Next.js (App Router) · React · **strict** TypeScript · TailwindCSS · Framer Motion ·
  shadcn/ui · React Three Fiber where genuinely beneficial · Supabase · PWA
- Accessibility-first, SEO-optimised, performance-budgeted
- Modular, reusable, maintainable, scalable, documented
- Files: 200–400 lines typical, **800 hard maximum**. Functions under 50 lines.
- No `any`. No unsourced content. No mutation of shared state.
- Errors handled explicitly; never silently swallowed.
- Security: follow the project security checklist before every commit — no hardcoded
  secrets, validated input at every boundary, parameterised queries, sanitised HTML,
  rate-limited endpoints, CSP configured.

## 9. Workflow

Work proceeds in **phases**. Each phase is completed to production quality before the
next begins. The codebase is production-ready at the end of every phase.

Before building any feature, think about: architecture, scalability, maintainability,
accessibility, performance, and above all **authenticity**.

If a better solution exists than the one requested, explain why and recommend it
**before** implementing.

When unsure — **ask. Do not assume.**

---

*Ratified at project inception. Amendments require explicit approval.*
