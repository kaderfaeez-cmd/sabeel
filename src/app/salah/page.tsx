import type { Metadata } from 'next';
import { ScholarlyDifferences } from '@/features/fiqh/scholarly-differences';
import { RulingLegend } from '@/features/fiqh/ruling-badge';
import { PositionCard } from '@/features/salah/position-card';
import { SALAH_DIFFERENCES, SALAH_POSITIONS } from '@/data/fiqh/salah';
import { resolveSalahPosition } from '@/lib/fiqh/salah-loader';
import { DEFAULT_TRANSLATION_ID } from '@/lib/quran/translations';

export const metadata: Metadata = {
  title: 'Learn Salah',
  description:
    'Learn to pray, position by position — what to do, what to recite, what it means and why you are saying it, with the evidence for each step and guidance if you cannot stand.',
};

export default async function SalahPage() {
  // Resolved at page level: every client component below must hydrate, and one failing
  // reference must not take the page down.
  const resolved = await Promise.all(
    SALAH_POSITIONS.map((position) =>
      resolveSalahPosition(position, DEFAULT_TRANSLATION_ID),
    ),
  );

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
      <p className="font-display text-xs uppercase tracking-[0.28em] text-gold-ink">Practice</p>
      <h1 className="mt-5 font-display text-display font-light tracking-[-0.015em] text-ink">
        Learn Salah
      </h1>
      <p className="mt-6 text-lede leading-relaxed text-ink-muted">
        This walks through a two-rak‘ah prayer from beginning to end — what your body does,
        what you say, what the words mean, and why you are saying them.
      </p>

      <section
        aria-labelledby="orientation"
        className="mt-10 rounded-xl border-l-2 border-l-emerald border-line bg-surface-raised px-6 py-5"
      >
        <h2 id="orientation" className="font-display text-xs uppercase tracking-[0.2em] text-emerald">
          Before you begin
        </h2>
        <div className="mt-3 space-y-3 leading-relaxed text-ink-muted">
          <p>
            The Quran establishes that prayer is obligatory; the details of how it is
            performed come to us through the Sunnah. That is why most steps below cite a
            narration rather than a verse.
          </p>
          <p>
            You will need to have performed wudhu first, and to face the qiblah. If any
            position is not physically possible for you, look for the
            <span className="text-gold-ink"> “If you cannot do this”</span> note on that
            step — the Sunnah itself provides for it.
          </p>
        </div>
      </section>

      <section aria-labelledby="legend" className="mt-10">
        <h2 id="legend" className="font-display text-xs uppercase tracking-[0.2em] text-ink-faint">
          What the labels mean
        </h2>
        <div className="mt-4">
          <RulingLegend />
        </div>
      </section>

      <ol className="mt-14 space-y-6">
        {SALAH_POSITIONS.map((position, index) => (
          <PositionCard
            key={position.id}
            position={position}
            index={index}
            resolved={
              resolved[index] ?? {
                positionEvidence: {},
                recitationEvidence: [],
                quranBlocks: {},
              }
            }
          />
        ))}
      </ol>

      <section
        aria-labelledby="second-rakah"
        className="mt-14 rounded-xl border border-line bg-surface-raised px-6 py-6"
      >
        <h2 id="second-rakah" className="font-display text-title font-medium text-ink">
          That is one rak‘ah
        </h2>
        <p className="mt-3 leading-relaxed text-ink-muted">
          Steps 3 to 7 — standing, bowing, rising, prostrating, sitting, prostrating again
          — are one rak‘ah. For a two-rak‘ah prayer such as Fajr, stand up after the second
          prostration and repeat them once more. The final sitting and the salam come at the
          end of the last rak‘ah only.
        </p>
      </section>

      <ScholarlyDifferences differences={SALAH_DIFFERENCES} />

      {/* FIQH-POLICY §5 — rendered by the page itself, so it cannot be omitted. */}
      <p className="mt-14 rounded-lg border border-line bg-surface-sunken px-6 py-5 text-sm leading-relaxed text-ink-muted">
        Sabeel is an educational platform, not a fatwa service. Where a question depends on
        your own circumstances, local custom, or a legal ruling, please consult a qualified
        local scholar or imam.
      </p>
    </div>
  );
}
