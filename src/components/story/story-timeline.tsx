import { getPlace } from '@/data/stories/places';
import type { StoryPassage } from '@/data/stories';

/**
 * The shape of a story at a glance, before reading it.
 *
 * Beginners get lost in long narratives because they cannot see how far through they
 * are or where a moment sits relative to the rest. This gives the whole arc in one
 * view, and every entry jumps to that part of the page.
 *
 * The `when` labels are deliberately relative — "years later", "before he was born" —
 * never dates. The Quran does not date these events, and a confident chronology would
 * be exactly the invented detail this platform refuses to add.
 */
export function StoryTimeline({
  passages,
  storyName,
}: {
  passages: readonly StoryPassage[];
  storyName: string;
}) {
  return (
    <nav aria-labelledby="timeline-heading">
      <h2
        id="timeline-heading"
        className="font-display text-title font-medium tracking-[-0.01em] text-ink"
      >
        How the story unfolds
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
        The whole arc of {storyName} at a glance. Jump to any part, or just read straight
        through.
      </p>

      <ol className="mt-7">
        {passages.map((passage, index) => {
          const place = passage.placeId ? getPlace(passage.placeId) : undefined;
          const isLast = index === passages.length - 1;

          return (
            <li key={passage.id} className="relative flex gap-5 pb-6 last:pb-0">
              {/* The spine, drawn behind the markers and stopped at the last one. */}
              {!isLast && (
                <span
                  aria-hidden
                  className="absolute left-[15px] top-9 h-full w-px bg-line"
                />
              )}

              <span
                aria-hidden
                className="relative z-10 mt-1 grid size-8 shrink-0 place-items-center rounded-full border border-line bg-surface-raised font-display text-xs text-ink-muted"
              >
                {index + 1}
              </span>

              <a
                href={`#${passage.id}`}
                className="group min-w-0 flex-1 rounded-lg py-1 transition-colors"
              >
                {passage.when && (
                  <span className="block font-display text-[0.65rem] uppercase tracking-[0.18em] text-gold-ink">
                    {passage.when}
                  </span>
                )}
                <span className="mt-1 block font-display text-lg text-ink group-hover:text-emerald">
                  {passage.heading}
                </span>
                {place && (
                  <span className="mt-0.5 block text-xs text-ink-faint">{place.name}</span>
                )}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
