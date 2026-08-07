import type { Metadata } from 'next';
import { AuthenticityNotices } from '@/components/content/authenticity-notice';
import { ContentBlock } from '@/components/content/content-block';
import { DUA_CATEGORIES, DUAS, type Dua } from '@/data/duas';
import type { Evidence } from '@/lib/content/types';
import { resolveEvidence } from '@/lib/fiqh/loader';
import { DEFAULT_TRANSLATION_ID } from '@/lib/quran/translations';

export const metadata: Metadata = {
  title: 'Dua Library',
  description:
    'Duas for the morning and evening, for worry, protection, forgiveness and family — each with Arabic, transliteration, meaning and its authentic reference.',
};

export default async function DuasPage() {
  const evidence = await Promise.all(
    DUAS.map((dua) => resolveEvidence(dua.evidence, DEFAULT_TRANSLATION_ID)),
  );

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
      <p className="font-display text-xs uppercase tracking-[0.28em] text-gold-ink">
        Remembrance
      </p>
      <h1 className="mt-5 font-display text-display font-light tracking-[-0.015em] text-ink">
        Dua Library
      </h1>
      <p className="mt-6 text-lede leading-relaxed text-ink-muted">
        Dua is simply asking. You can ask in any language, in your own words, at any time —
        these are the ones the Prophet ﷺ taught, or that the Quran itself gives you.
      </p>

      <nav aria-label="Categories" className="mt-9 flex flex-wrap gap-2">
        {DUA_CATEGORIES.map((category) => (
          <a
            key={category.id}
            href={`#${category.id}`}
            className="inline-flex min-h-11 items-center rounded-full border border-line px-4 py-2 text-sm text-ink-muted transition-colors hover:border-emerald hover:text-emerald"
          >
            {category.title}
          </a>
        ))}
      </nav>

      <div className="mt-14 space-y-16">
        {DUA_CATEGORIES.map((category) => {
          const items = DUAS.map((dua, index) => ({ dua, evidence: evidence[index] ?? {} }))
            .filter((entry) => entry.dua.category === category.id);

          if (items.length === 0) return null;

          return (
            <section key={category.id} id={category.id} aria-labelledby={`${category.id}-h`} className="scroll-mt-24">
              <div className="flex items-center gap-5">
                <h2
                  id={`${category.id}-h`}
                  className="font-display text-title font-medium tracking-[-0.01em] text-ink"
                >
                  {category.title}
                </h2>
                <span className="h-px flex-1 bg-line" aria-hidden />
              </div>
              <p className="mt-2 text-sm text-ink-faint">{category.blurb}</p>

              <div className="mt-7 space-y-5">
                {items.map(({ dua, evidence: duaEvidence }) => (
                  <DuaCard key={dua.id} dua={dua} evidence={duaEvidence} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <p className="mt-16 rounded-lg border border-line bg-surface-sunken px-6 py-5 text-sm leading-relaxed text-ink-muted">
        Dua is not restricted to set forms. Asking Allah in your own language, in your own
        words, is dua — and the Quran describes Him as near, and answering.
      </p>
    </div>
  );
}

function DuaCard({ dua, evidence }: { dua: Dua; evidence: Evidence }) {
  const isQuranic = (evidence.quran?.length ?? 0) > 0;

  return (
    <article id={dua.id} className="scroll-mt-24 rounded-2xl border border-line bg-surface-raised p-6 sm:p-8">
      <h3 className="font-display text-xl font-medium text-ink">{dua.title}</h3>
      <p className="mt-1.5 text-sm text-ink-faint">{dua.when}</p>

      <div className="mt-6">
        {!isQuranic && (
          <p className="font-display text-[0.65rem] uppercase tracking-[0.18em] text-ink-faint">
            Liturgical transcription
          </p>
        )}
        <p lang="ar" dir="rtl" className="mt-3 text-2xl leading-loose text-ink sm:text-[1.75rem]">
          {dua.arabic}
        </p>
        <p className="mt-4 text-sm italic leading-relaxed text-ink-faint">
          {dua.transliteration}
        </p>
        <p className="mt-3 leading-relaxed text-ink-muted">“{dua.translation}”</p>
        {!isQuranic && (
          <p className="mt-3 text-xs leading-relaxed text-ink-faint">
            Written here as it is recited. The narration establishing it is cited below.
          </p>
        )}
      </div>

      <div className="mt-6 rounded-lg border-l-2 border-l-emerald bg-surface px-5 py-4">
        <p className="font-display text-[0.65rem] uppercase tracking-[0.18em] text-emerald">
          Why this dua says what it says
        </p>
        <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">{dua.why}</p>
        <p className="mt-3 text-[0.65rem] uppercase tracking-[0.16em] text-ink-faint">
          Sabeel — educational summary
        </p>
      </div>

      {(evidence.quran?.length || evidence.hadith?.length) && (
        <div className="mt-6 space-y-4">
          {evidence.quran?.map((block) => (
            <ContentBlock key={block.id} block={block} />
          ))}
          {evidence.hadith?.map((block) => (
            <ContentBlock key={block.id} block={block} />
          ))}
        </div>
      )}

      {evidence.notices && evidence.notices.length > 0 && (
        <AuthenticityNotices notices={evidence.notices} />
      )}
    </article>
  );
}
