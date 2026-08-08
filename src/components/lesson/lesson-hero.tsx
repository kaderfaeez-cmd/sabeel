import { Clock, Signal, Sparkles } from 'lucide-react';

/**
 * The opening of every lesson page.
 *
 * Built after feedback from a recent revert that Sabeel was "complicated" and "not
 * something she can just access and understand". The cause was structural: pages opened
 * with translated scripture and expected the reader to supply their own reason to care.
 *
 * This component makes the reverse the default. Before any Arabic or any citation, the
 * reader is told what they will learn, why it matters, roughly how long it takes, and
 * whether it assumes any prior knowledge.
 */

export interface LessonHeroProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly arabicTitle?: string;
  readonly subtitle: string;
  /** The human entry point. No Arabic, no references — just the situation. */
  readonly hook?: string;
  readonly whyItMatters: string;
  readonly whatYoullLearn: readonly string[];
  readonly readingMinutes: number;
  readonly difficulty: 'gentle' | 'moderate';
}

const DIFFICULTY_LABEL: Record<LessonHeroProps['difficulty'], string> = {
  gentle: 'No prior knowledge needed',
  moderate: 'Builds on the basics',
};

export function LessonHero({
  eyebrow,
  title,
  arabicTitle,
  subtitle,
  hook,
  whyItMatters,
  whatYoullLearn,
  readingMinutes,
  difficulty,
}: LessonHeroProps) {
  return (
    <header>
      <p className="font-display text-xs uppercase tracking-[0.28em] text-gold-ink">{eyebrow}</p>

      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="font-display text-hero font-light tracking-[-0.02em] text-ink">{title}</h1>
        {arabicTitle && (
          <p lang="ar" dir="rtl" className="text-4xl text-emerald sm:text-5xl">
            {arabicTitle}
          </p>
        )}
      </div>

      <p className="mt-5 max-w-2xl text-lede leading-relaxed text-ink-muted">{subtitle}</p>

      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-faint">
        <span className="inline-flex items-center gap-2">
          <Clock className="size-4" aria-hidden />
          About {readingMinutes} min
        </span>
        <span className="inline-flex items-center gap-2">
          <Signal className="size-4" aria-hidden />
          {DIFFICULTY_LABEL[difficulty]}
        </span>
      </div>

      {/* The hook is deliberately the largest text on the page after the title. */}
      {hook && (
        <div className="mt-12 border-l-2 border-l-gold pl-6 sm:pl-8">
          <p className="font-display text-title font-light leading-[1.5] tracking-[-0.01em] text-ink sm:text-[1.75rem]">
            {hook}
          </p>
        </div>
      )}

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        <section
          aria-labelledby="why-matters"
          className="rounded-2xl border-l-2 border-l-emerald border-line bg-surface-raised p-6"
        >
          <h2
            id="why-matters"
            className="flex items-center gap-2 font-display text-xs uppercase tracking-[0.2em] text-emerald"
          >
            <Sparkles className="size-3.5" aria-hidden />
            Why this matters
          </h2>
          <p className="mt-4 leading-relaxed text-ink-muted">{whyItMatters}</p>
        </section>

        <section
          aria-labelledby="what-learn"
          className="rounded-2xl border border-line bg-surface-raised p-6"
        >
          <h2
            id="what-learn"
            className="font-display text-xs uppercase tracking-[0.2em] text-ink-faint"
          >
            What you’ll learn
          </h2>
          <ul className="mt-4 space-y-2.5">
            {whatYoullLearn.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <p className="mt-5 text-[0.65rem] uppercase tracking-[0.16em] text-ink-faint">
        Sabeel — educational summary
      </p>
    </header>
  );
}
