import type { Metadata } from 'next';
import { ContentBlock } from '@/components/content/content-block';
import { AuthenticityNotices } from '@/components/content/authenticity-notice';
import { JourneyTrail } from '@/components/lesson/journey-trail';
import { LessonHero } from '@/components/lesson/lesson-hero';
import { NextStep } from '@/components/lesson/next-step';
import { RulingLegend } from '@/features/fiqh/ruling-badge';
import { ScholarlyDifferences } from '@/features/fiqh/scholarly-differences';
import { StepCard } from '@/features/fiqh/step-card';
import { GHUSL_DIFFERENCES, GHUSL_OCCASIONS, GHUSL_STEPS } from '@/data/fiqh/ghusl';
import { resolveEvidence } from '@/lib/fiqh/loader';
import { DEFAULT_TRANSLATION_ID } from '@/lib/quran/translations';

export const metadata: Metadata = {
  title: 'Learn Ghusl',
  description:
    'When ghusl is required and how to perform it, step by step, with the evidence for each step and the accepted differences between the schools.',
};

export default async function GhuslPage() {
  // Resolved at page level so nothing depends on a nested async boundary.
  const [stepEvidence, occasionEvidence] = await Promise.all([
    Promise.all(
      GHUSL_STEPS.map((step) => resolveEvidence(step.evidence, DEFAULT_TRANSLATION_ID)),
    ),
    Promise.all(
      GHUSL_OCCASIONS.map((occasion) =>
        resolveEvidence(occasion.evidence, DEFAULT_TRANSLATION_ID),
      ),
    ),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
      <JourneyTrail stepId="ghusl" />

      <LessonHero
        eyebrow="Practice"
        title="Learn Ghusl"
        arabicTitle="الغسل"
        subtitle="The full washing of the body. Required at a few specific times, and straightforward once you have done it once."
        hook="This is a topic people are often too embarrassed to ask about, so they end up guessing. There is nothing shameful here — it is a wash, it takes a few minutes, and the requirement is simply that water reaches all of you. This page says it plainly so you do not have to ask anyone."
        whyItMatters="Prayer and fasting resume once ghusl is done, so knowing when it is needed and how to perform it removes real uncertainty. Getting this clear once means never having to wonder again."
        whatYoullLearn={[
          'The three situations where ghusl becomes required',
          'The full sequence, and which part is actually essential',
          'The spots people commonly leave dry',
          'Whether you need a separate wudhu afterwards',
        ]}
        readingMinutes={7}
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
          The same verse that establishes wudhu also establishes ghusl — it instructs that
          those in a state of janābah purify themselves. Janābah is the state following
          sexual intimacy or a wet dream; the word simply names it, and carries no shame.
          How the washing is performed comes through the Sunnah, and two of the Prophet’s ﷺ
          wives described it in detail.
        </p>
      </section>

      <section aria-labelledby="when" className="mt-14">
        <h2
          id="when"
          className="font-display text-title font-medium tracking-[-0.01em] text-ink"
        >
          When is ghusl required?
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">
          Only in the situations below. Outside of these, wudhu is what is needed before
          prayer.
        </p>

        <ul className="mt-8 space-y-5">
          {GHUSL_OCCASIONS.map((occasion, index) => (
            <li
              key={occasion.id}
              className="rounded-2xl border border-line bg-surface-raised p-6 sm:p-7"
            >
              <h3 className="font-display text-lg font-medium text-ink">{occasion.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-muted">{occasion.description}</p>

              {(occasionEvidence[index]?.quran?.length ||
                occasionEvidence[index]?.hadith?.length) && (
                <div className="mt-5 space-y-4">
                  {occasionEvidence[index]?.quran?.map((block) => (
                    <ContentBlock key={block.id} block={block} />
                  ))}
                  {occasionEvidence[index]?.hadith?.map((block) => (
                    <ContentBlock key={block.id} block={block} />
                  ))}
                </div>
              )}

              {occasionEvidence[index]?.notices &&
                occasionEvidence[index]!.notices!.length > 0 && (
                  <AuthenticityNotices notices={occasionEvidence[index]!.notices!} />
                )}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="legend" className="mt-14">
        <h2 id="legend" className="font-display text-xs uppercase tracking-[0.2em] text-ink-faint">
          What the labels mean
        </h2>
        <div className="mt-4">
          <RulingLegend />
        </div>
      </section>

      <section aria-labelledby="how" className="mt-14">
        <h2 id="how" className="font-display text-title font-medium tracking-[-0.01em] text-ink">
          How to perform it
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">
          The essential requirement is that water reaches every part of the body. The steps
          below follow the way the Prophet ﷺ performed it, as described by ‘Aisha and by
          Maymunah.
        </p>

        <ol className="mt-8 space-y-6">
          {GHUSL_STEPS.map((step, index) => (
            <StepCard
              key={step.id}
              step={step}
              index={index}
              evidence={stepEvidence[index] ?? {}}
            />
          ))}
        </ol>
      </section>

      <ScholarlyDifferences differences={GHUSL_DIFFERENCES} />

      <NextStep stepId="ghusl" />

      {/* FIQH-POLICY §5 — rendered by the page itself, so it cannot be omitted. */}
      <p className="mt-14 rounded-lg border border-line bg-surface-sunken px-6 py-5 text-sm leading-relaxed text-ink-muted">
        Sabeel is an educational platform, not a fatwa service. Questions about purity often
        depend on personal circumstances. For anything specific to your situation, please
        ask a qualified local scholar or imam.
      </p>
    </div>
  );
}
