import type { FiqhDifferenceData } from '@/lib/fiqh/step-types';

/**
 * FIQH-POLICY §4: differences live in a clearly-labelled optional section, outside the
 * main lesson, so a beginner learning to perform wudhu for the first time is not
 * overwhelmed by every scholarly position.
 *
 * §2 governs the contents: each position is attributed to the schools that hold it, and
 * no school is described as correct and the others wrong. There is deliberately no
 * "preferred" or "strongest" marker anywhere in this component.
 */
export function ScholarlyDifferences({
  differences,
}: {
  differences: readonly FiqhDifferenceData[];
}) {
  if (differences.length === 0) return null;

  return (
    <section aria-labelledby="differences-heading" className="mt-16">
      <h2
        id="differences-heading"
        className="font-display text-title font-medium tracking-[-0.01em] text-ink"
      >
        Scholarly differences
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">
        The steps above follow one valid, widely accepted method. On some points the four
        Sunni schools reached different conclusions. All are accepted positions within
        mainstream Sunni scholarship — none is presented here as correct and the others
        wrong. This section is optional reading.
      </p>

      <div className="mt-8 space-y-4">
        {differences.map((difference) => (
          <details
            key={difference.id}
            className="group rounded-xl border border-line bg-surface-raised px-6 py-5"
          >
            <summary className="cursor-pointer list-none font-display text-lg text-ink marker:content-none">
              <span className="flex items-center justify-between gap-4">
                {difference.question}
                <span
                  aria-hidden
                  className="shrink-0 text-ink-faint transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </span>
            </summary>

            <ul className="mt-5 space-y-4 border-t border-line pt-5">
              {difference.positions.map((position) => (
                <li key={position.schools.join('-')}>
                  <p className="font-display text-xs uppercase tracking-[0.18em] text-gold-ink">
                    {position.schools.join(' · ')}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {position.position}
                  </p>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>

      <p className="mt-8 rounded-lg border border-dashed border-line-strong bg-surface-sunken px-5 py-4 text-sm leading-relaxed text-ink-muted">
        These positions are widely reported in the standard fiqh literature. Sabeel has
        not yet cleared a primary citation for each one through its publication policy, so
        they are presented as a summary of accepted scholarly positions rather than as
        directly cited evidence. For anything depending on your own circumstances, please
        ask a qualified local scholar or imam.
      </p>
    </section>
  );
}
