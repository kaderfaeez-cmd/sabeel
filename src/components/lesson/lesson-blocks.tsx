import Link from 'next/link';

/**
 * The pieces every lesson closes with.
 *
 * The reading order these enforce is the whole point: context, then the Quran, then a
 * plain explanation, then reflection, then one small thing to do. A reader should never
 * meet revelation without knowing why they are reading it, and should never leave a
 * lesson without something they can actually act on.
 */

/** Sabeel's framing before a passage. Visually quiet, and always labelled as ours. */
export function Narrative({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l-2 border-l-line-strong pl-5 sm:pl-6">
      <p className="text-lede leading-relaxed text-ink">{children}</p>
      <p className="mt-3 text-[0.65rem] uppercase tracking-[0.16em] text-ink-faint">
        Sabeel — setting the scene
      </p>
    </div>
  );
}

/** Plain-English explanation after a passage. */
export function Explanation({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-surface-sunken px-6 py-5">
      <h3 className="font-display text-xs uppercase tracking-[0.2em] text-gold-ink">
        What this is saying
      </h3>
      <p className="mt-3 leading-relaxed text-ink-muted">{children}</p>
      <p className="mt-3 text-[0.65rem] uppercase tracking-[0.16em] text-ink-faint">
        Sabeel — educational summary
      </p>
    </div>
  );
}

export function AboutAllah({ children }: { children: React.ReactNode }) {
  return (
    <section
      aria-labelledby="about-allah"
      className="rounded-2xl border-l-2 border-l-emerald border-line bg-surface-raised p-7"
    >
      <h2
        id="about-allah"
        className="font-display text-xs uppercase tracking-[0.2em] text-emerald"
      >
        What this teaches me about Allah
      </h2>
      <p className="mt-4 text-lede leading-relaxed text-ink-muted">{children}</p>
      <p className="mt-4 text-[0.65rem] uppercase tracking-[0.16em] text-ink-faint">
        Sabeel — educational summary
      </p>
    </section>
  );
}

export function TakeAways({
  points,
  character,
}: {
  points: readonly string[];
  character: readonly string[];
}) {
  return (
    <section aria-labelledby="takeaways" className="mt-6">
      <h2
        id="takeaways"
        className="font-display text-title font-medium tracking-[-0.01em] text-ink"
      >
        What can we learn?
      </h2>

      <ul className="mt-6 space-y-3">
        {points.map((point) => (
          <li
            key={point}
            className="rounded-xl border-l-2 border-l-gold border-line bg-surface-raised px-6 py-4 leading-relaxed text-ink-muted"
          >
            {point}
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-xl border border-line bg-surface-raised px-6 py-5">
        <h3 className="font-display text-xs uppercase tracking-[0.2em] text-ink-faint">
          Character to develop
        </h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {character.map((trait) => (
            <li
              key={trait}
              className="rounded-full border border-line-strong px-4 py-1.5 text-sm text-ink-muted"
            >
              {trait}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 text-[0.65rem] uppercase tracking-[0.16em] text-ink-faint">
        Sabeel — educational summary
      </p>
    </section>
  );
}

export function Reflections({ questions }: { questions: readonly string[] }) {
  return (
    <section aria-labelledby="reflect" className="mt-14">
      <h2 id="reflect" className="font-display text-title font-medium tracking-[-0.01em] text-ink">
        Sit with this
      </h2>
      <p className="mt-3 max-w-xl text-sm text-ink-faint">
        No right answers. These are for you, not for anyone else.
      </p>
      <ul className="mt-7 space-y-5">
        {questions.map((question) => (
          <li
            key={question}
            className="border-l-2 border-l-gold pl-5 text-lede leading-relaxed text-ink sm:pl-6"
          >
            {question}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ActionToday({
  action,
  duaHref,
  duaLabel,
}: {
  action: string;
  duaHref?: string;
  duaLabel?: string;
}) {
  return (
    <section
      aria-labelledby="action"
      className="mt-14 rounded-2xl border border-emerald/40 bg-[var(--emerald-soft)] p-7"
    >
      <h2 id="action" className="font-display text-xs uppercase tracking-[0.2em] text-emerald">
        One thing you can do today
      </h2>
      <p className="mt-4 text-lede leading-relaxed text-ink">{action}</p>

      {duaHref && (
        <Link
          href={duaHref}
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-emerald/50 px-5 py-2.5 text-sm text-emerald transition-colors hover:bg-surface-raised"
        >
          {duaLabel ?? 'A dua that fits this'}
          <span aria-hidden>→</span>
        </Link>
      )}
    </section>
  );
}
