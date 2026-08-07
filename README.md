<div align="center">

# SABEEL

**سَبِيل** — *the path*

An Islamic educational platform where every verse, narration and claim is traceable to its source.

</div>

---

## What this is

A calm, premium place to learn Islam — built for people reverting, people returning,
people going deeper, and people who simply want to understand.

The defining constraint is not visual. It is **provenance**:

> Religious content is **retrieved and attributed**, never authored by a person or a model.

Quran text and translations come from published sources. Hadith carry collection, book,
number and grading so any citation can be checked independently. Revelation, authentic
narration, classical commentary, history, and the platform's own educational framing are
five distinct content kinds — each labelled, never blended.

## Documentation

| Document | Purpose |
|---|---|
| [CONSTITUTION.md](docs/CONSTITUTION.md) | **The supreme authority of this project.** Read first. |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Layers, the content spine, data strategy, security |
| [ROADMAP.md](docs/ROADMAP.md) | The 13 phases and what each delivers |
| [SOURCES.md](docs/SOURCES.md) | Verified data sources and the re-verification log |
| [ACCESSIBILITY.md](docs/ACCESSIBILITY.md) | Measured contrast, verified behaviours, known gaps |
| [DECISIONS.md](docs/DECISIONS.md) | Settled decisions and open questions |

## Status

**Phase 0 — Foundation: complete.** Constitution, architecture, verified sources, design
system, app shell, home page. Build green, contrast measured AA in both themes.

Next: **Phase 1 — the content spine.** After it, nothing renders without a source.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 ·
Framer Motion · Supabase (Phase 9) · PWA (Phase 12)

## Development

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

```bash
npm run build   # production build
npm run lint    # eslint
npx tsc --noEmit  # type check
```

## Design

Direction: **illuminated manuscript**. Warm parchment in light (the default — a newcomer
should feel welcomed, not handed a developer tool), midnight ink in dark. Gold hairlines
and an eight-point *khatam* tessellation provide structure rather than decoration.
Cormorant Garamond for voice, Inter for legibility, Amiri for Arabic.

Per the visual policy, **no Prophet or revered figure is ever depicted**. Immersion comes
from environment — architecture, landscape, calligraphy, geometry, maps.

---

*Sabeel is educational. It does not replace scholars and it does not issue rulings.*
