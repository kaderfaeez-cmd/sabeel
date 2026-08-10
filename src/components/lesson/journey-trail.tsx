import Link from 'next/link';
import { JOURNEY, journeyIndex } from '@/lib/journey';

/**
 * "You are here" — the trail across the top of a lesson.
 *
 * Gives a beginner a sense of progress without turning Islam into a checklist. There is
 * no completion state and nothing to fail; it simply shows where this lesson sits in a
 * suggested order, and lets the reader move along it.
 */
export function JourneyTrail({ stepId }: { stepId: string }) {
  const current = journeyIndex(stepId);
  if (current < 0) return null;

  return (
    <nav aria-label="Your journey" className="mb-10">
      <p className="font-display text-[0.65rem] uppercase tracking-[0.22em] text-gold-ink">
        Your journey · step {current + 1} of {JOURNEY.length}
      </p>

      <ol className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-2">
        {JOURNEY.map((step, index) => {
          const isCurrent = index === current;
          const isPast = index < current;

          return (
            <li key={step.id} className="flex items-center gap-1.5">
              {index > 0 && (
                <span aria-hidden className="text-ink-faint">
                  ›
                </span>
              )}
              {isCurrent ? (
                <span
                  aria-current="step"
                  className="rounded-full border border-emerald bg-[var(--emerald-soft)] px-3 py-1 text-xs font-medium text-emerald"
                >
                  {step.short}
                </span>
              ) : (
                <Link
                  href={step.href}
                  className={`rounded-full px-2.5 py-1 text-xs transition-colors hover:text-ink ${
                    isPast ? 'text-ink-muted' : 'text-ink-faint'
                  }`}
                >
                  {step.short}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
