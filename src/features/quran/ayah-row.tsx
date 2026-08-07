import type { QuranBlock } from '@/lib/content/types';
import { formatAyahRange } from '@/lib/content/citation';

/**
 * A single ayah in the reading surface.
 *
 * ARCHITECTURE NOTE — why this is not `<ContentBlock>`:
 * `<ContentBlock>` renders a full citation footer per block, which is correct when a
 * verse is quoted inside a lesson or story. On a reading surface that would repeat the
 * same translator credit up to 286 times in one page, which harms both reading and
 * screen-reader use.
 *
 * The attribution requirement is still met, and still structurally: this component only
 * accepts a `QuranBlock` (which cannot exist without a source), it renders that block's
 * own surah:ayah reference on every row, and the surah header above states the
 * translation and translator once for the page. No verse is ever shown without a
 * reference a reader can check.
 */
export function AyahRow({ block }: { block: QuranBlock }) {
  const reference = formatAyahRange(
    block.source.surah,
    block.source.ayahFrom,
    block.source.ayahTo,
  );

  return (
    <article
      id={`ayah-${block.source.ayahFrom}`}
      data-ayah={block.source.ayahFrom}
      aria-label={`Ayah ${reference}`}
      // `data-active` is set by the recitation player as it advances; the highlight
      // itself lives in globals.css (see the [data-ayah][data-active] rule).
      className="scroll-mt-24 border-b border-line px-4 py-9 transition-colors duration-500 last:border-b-0"
    >
      <div className="flex items-baseline justify-between gap-6">
        <span className="font-display text-xs tracking-[0.14em] text-gold-ink">
          {reference}
        </span>
      </div>

      <p
        lang="ar"
        dir="rtl"
        className="mt-5 text-[1.75rem] leading-[2.4] text-ink sm:text-[2.1rem]"
      >
        {block.arabic}
      </p>

      {block.transliteration && (
        <p className="mt-5 text-sm italic leading-relaxed text-ink-faint">
          {block.transliteration}
        </p>
      )}

      <p className="mt-5 text-lg leading-relaxed text-ink-muted">{block.translation}</p>
    </article>
  );
}
