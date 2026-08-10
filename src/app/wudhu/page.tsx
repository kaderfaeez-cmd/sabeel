import type { Metadata } from 'next';
import Link from 'next/link';
import { JourneyTrail } from '@/components/lesson/journey-trail';
import { LessonHero } from '@/components/lesson/lesson-hero';
import { NextStep } from '@/components/lesson/next-step';
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
      <JourneyTrail stepId="wudhu" />

      <LessonHero
        eyebrow="Practice"
        title="Learn Wudhu"
        arabicTitle="الوضوء"
        subtitle="The short washing performed before prayer. Once you have done it a couple of times it takes about a minute."
        hook="This is the thing that stands between most new Muslims and actually praying — not because it is difficult, but because nobody wants to get it wrong. It is genuinely simple. Four parts of the body, in order, and you are ready to pray."
        whyItMatters="You cannot pray without it, so learning this first removes the main obstacle to starting. It is also a small reset built into your day: before you stand in front of Allah, you stop and wash."
        whatYoullLearn={[
          'The four acts named directly in the Quran',
          'The full sequence, in order, with the sunnah steps',
          'The mistakes almost everyone makes at first',
          'What breaks wudhu — and the many things that do not',
        ]}
        readingMinutes={8}
        difficulty="gentle"
      />

      <section
        aria-labelledby="quran-basis"
        className="mt-12 rounded-xl border-l-2 border-l-emerald border-line bg-surface-raised px-6 py-5"
      >
        <h2 id="quran-basis" className="font-display text-xs uppercase tracking-[0.2em] text-emerald">
          Where this comes from
        </h2>
        <p className="mt-3 leading-relaxed text-ink-muted">
          Four acts are named directly in the Quran: washing the face, washing the arms to
          the elbows, wiping the head, and washing the feet to the ankles. All four schools
          agree these are obligatory. Everything else below is the established practice of
          the Prophet ﷺ — recommended, and worth learning, but the four above are what make
          it valid.
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

      <NextStep stepId="wudhu" />

      {/* FIQH-POLICY §5 — never omitted, because it is rendered from the page itself. */}
      <p className="mt-14 rounded-lg border border-line bg-surface-sunken px-6 py-5 text-sm leading-relaxed text-ink-muted">
        Sabeel is an educational platform, not a fatwa service. Where a question depends on
        your own circumstances, local custom, or a legal ruling, please consult a qualified
        local scholar or imam.
      </p>
    </div>
  );
}
