import type { Metadata } from 'next';
import Link from 'next/link';
import { ScholarlyDifferences } from '@/features/fiqh/scholarly-differences';
import { RulingLegend } from '@/features/fiqh/ruling-badge';
import { StepCard } from '@/features/fiqh/step-card';
import { WUDHU_DIFFERENCES, WUDHU_STEPS } from '@/data/fiqh/wudhu';
import { resolveEvidence } from '@/lib/fiqh/loader';
import { DEFAULT_TRANSLATION_ID } from '@/lib/quran/translations';

export const metadata: Metadata = {
  title: 'Learn Wudhu',
  description:
    'A step-by-step guide to wudhu with the evidence for each step, the common mistakes, and the accepted differences between the schools — all traceable to their sources.',
};

export default async function WudhuPage() {
  // Evidence is resolved at page level so every client component below hydrates, and so
  // one failing reference cannot take down the page.
  const evidence = await Promise.all(
    WUDHU_STEPS.map((step) => resolveEvidence(step.evidence, DEFAULT_TRANSLATION_ID)),
  );

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
      <p className="font-display text-xs uppercase tracking-[0.28em] text-gold-ink">Practice</p>
      <h1 className="mt-5 font-display text-display font-light tracking-[-0.015em] text-ink">
        Learn Wudhu
      </h1>
      <p className="mt-6 text-lede leading-relaxed text-ink-muted">
        Wudhu is the washing performed before prayer. The four acts at its core are named
        directly in the Quran, so they need no other evidence to be established.
      </p>

      <section
        aria-labelledby="quran-basis"
        className="mt-10 rounded-xl border-l-2 border-l-emerald border-line bg-surface-raised px-6 py-5"
      >
        <h2 id="quran-basis" className="font-display text-xs uppercase tracking-[0.2em] text-emerald">
          The Quranic basis
        </h2>
        <p className="mt-3 leading-relaxed text-ink-muted">
          Quran 5:6 names washing the face, washing the arms to the elbows, wiping the
          head, and washing the feet to the ankles. Those four are obligatory by consensus.
          The remaining steps below are the established practice of the Prophet ﷺ.
        </p>
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
        {WUDHU_STEPS.map((step, index) => (
          <StepCard
            key={step.id}
            step={step}
            index={index}
            evidence={evidence[index] ?? {}}
          />
        ))}
      </ol>

      <Link
        href="/wudhu/nullifiers"
        className="group mt-14 flex items-center gap-4 rounded-xl border border-line bg-surface-raised p-6 transition-colors duration-300 hover:border-line-strong"
      >
        <span className="min-w-0 flex-1">
          <span className="block font-display text-xl text-ink">What breaks wudhu</span>
          <span className="mt-1.5 block text-sm leading-relaxed text-ink-muted">
            What needs a fresh wudhu, what does not, and the points where the schools
            differ.
          </span>
        </span>
        <span
          aria-hidden
          className="text-emerald transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      </Link>

      <ScholarlyDifferences differences={WUDHU_DIFFERENCES} />

      {/* FIQH-POLICY §5 — never omitted, because it is rendered from the page itself. */}
      <p className="mt-14 rounded-lg border border-line bg-surface-sunken px-6 py-5 text-sm leading-relaxed text-ink-muted">
        Sabeel is an educational platform, not a fatwa service. Where a question depends on
        your own circumstances, local custom, or a legal ruling, please consult a qualified
        local scholar or imam.
      </p>
    </div>
  );
}
