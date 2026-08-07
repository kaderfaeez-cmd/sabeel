# SABEEL — Architecture

Governed by [CONSTITUTION.md](./CONSTITUTION.md). Read that first.

## Guiding constraint

The hardest requirement in this project is not visual — it is **provenance**. Every
religious statement must be traceable to a verified source. The architecture is therefore
organised around a single idea:

> **Content is retrieved and attributed, never authored by a model.**

Everything else (design system, animation, gamification) is layered on top of that spine.

## Layers

```
┌─────────────────────────────────────────────────────────────┐
│  app/          Next.js App Router — routes, layouts, metadata│
├─────────────────────────────────────────────────────────────┤
│  features/     Vertical slices: quran, salah, duas, stories… │
│                Each owns its components, hooks, and schema.  │
├─────────────────────────────────────────────────────────────┤
│  components/   Cross-feature UI. ui/ = primitives,           │
│                content/ = the labelled content blocks,       │
│                layout/ = shell, nav, footer.                 │
├─────────────────────────────────────────────────────────────┤
│  lib/          Pure logic: content types, source registry,   │
│                fetchers, caching, formatting, utils.         │
├─────────────────────────────────────────────────────────────┤
│  data/         Pinned, versioned local datasets + manifests. │
└─────────────────────────────────────────────────────────────┘
```

Rule: `features/*` may import from `components`, `lib`, `data`. They must **not** import
from each other. Shared logic moves down into `lib/`.

## The content spine

`lib/content/types.ts` defines a discriminated union. There is no way to construct a
renderable content block without a source.

```ts
type SourcedContent =
  | { kind: 'quran';   source: QuranRef;   … }
  | { kind: 'hadith';  source: HadithRef;  … }
  | { kind: 'tafsir';  source: TafsirRef;  … }
  | { kind: 'history'; source: HistoryRef; … }
  | { kind: 'summary'; source: EditorialRef; … }
```

A single renderer, `<ContentBlock>`, switches on `kind` and applies the correct visual
treatment **and** the correct attribution footer. Feature code never renders religious
text directly — it always goes through `<ContentBlock>`. This makes the labelling
requirement in Constitution §4 structurally impossible to forget.

`summary` blocks (platform-authored educational framing) render in a visually distinct
"editorial" treatment so a reader can never mistake them for revelation.

## Data sources (verified 2026-08-07)

| Domain | Source | Status |
|---|---|---|
| Quran text + 126 translations + audio | Quran.com API v4 (`api.quran.com/api/v4`) | ✅ live, no key |
| Hadith (bukhari, muslim, abudawud, tirmidhi, nasai, ibnmajah, malik, nawawi, qudsi, dehlawi) | `fawazahmed0/hadith-api` pinned dataset via jsDelivr | ✅ live |
| Prayer times | AlAdhan API + client-side geolocation | to verify in Phase 4 |
| Duas | Curated, each with explicit hadith reference | Phase 5 |

Full source policy and pinning strategy: [SOURCES.md](./SOURCES.md).

### Fetching strategy

- Quran **structure** (114 surahs, ayah counts, metadata) is baked into the repo at build
  time — it never changes, so it must never cost a network round-trip.
- Quran **text and translations** are fetched server-side, cached aggressively
  (`revalidate: false` — revelation is immutable), and persisted to IndexedDB on the
  client for offline reading (Constitution §7).
- Hadith are fetched at build time into `data/hadith/` for the subset the platform cites,
  so citations cannot break if an upstream CDN disappears.
- No user-facing feature ever depends on a live third-party call at request time.

## Rendering & performance

> **Rule learned in Phase 2, and binding from here on:** a client component must be
> referenced from a component the router renders **directly**. Placed behind a *nested*
> async server component, it server-renders but never hydrates, and a Suspense boundary
> around such a component is not reliably finalised on the client — leaving a permanent
> loading state. Resolve the data at page level and render the client component there.
> This cost real debugging time three separate times (recitation player, reading tracker,
> search results) before being written down.

- Server Components by default. `'use client'` only for interaction, animation, audio.
- Route-level code splitting; Framer Motion and any R3F work dynamically imported.
- Budgets: landing < 150 kB JS gzipped; reading surfaces < 200 kB. LCP < 2.5 s, CLS < 0.1.
- Animation restricted to `transform` / `opacity` / `clip-path`. Every motion respects
  `prefers-reduced-motion`.

## Accessibility

Non-negotiable, tested per phase: semantic landmarks, full keyboard navigation, visible
focus, WCAG AA contrast in both themes, screen-reader labels on all Arabic text with
correct `lang="ar"` + `dir="rtl"`, adjustable type scale, opt-in dyslexia-friendly font,
and a low-bandwidth mode.

## State

| Concern | Mechanism |
|---|---|
| Reading position, bookmarks, notes | IndexedDB (local-first), synced to Supabase when signed in |
| Preferences (theme, translation, font size) | `localStorage` + cookie for SSR-correct first paint |
| Server data | React Server Components + `fetch` cache |
| URL state | Search params (surah, ayah, translation) — every reading position is shareable |

Local-first is deliberate: the platform must be fully usable with no account and no
network (Constitution §7).

## Security

Follows the mandatory web security standard: strict CSP with per-request nonce, no
`dangerouslySetInnerHTML` on untrusted input, all Supabase access behind Row Level
Security, rate limiting on the AI assistant endpoint, secrets only in environment
variables, and Zod validation at every boundary.

## AI assistant (Phase 9 — deliberately last)

The assistant is built **after** the content spine exists, because it must be a
retrieval-grounded assistant, not a free-generation one:

1. Retrieve from the verified Quran/hadith corpus.
2. Answer **only** from retrieved passages, with citations rendered as `<ContentBlock>`.
3. Explicitly separate revelation from scholarly explanation.
4. State when scholarly differences exist.
5. Refuse to issue rulings; direct the user to a qualified scholar.
6. If retrieval returns nothing sufficient, say "I could not verify this" — never
   improvise.

Building it earlier would violate Constitution §3.
