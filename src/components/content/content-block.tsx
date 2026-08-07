import { formatCitation, KIND_LABEL } from '@/lib/content/citation';
import type { SourcedContent } from '@/lib/content/types';
import { cn } from '@/lib/utils';

/**
 * The single renderer for every piece of religious or educational content.
 *
 * Feature code never renders scripture directly — it always goes through here. That is
 * what makes Constitution §4's labelling requirement structural rather than a thing an
 * author has to remember: there is no code path that displays a verse without also
 * displaying what it is and where it came from.
 */

const KIND_STYLE: Record<SourcedContent['kind'], string> = {
  // Revelation gets the most weight: raised surface, emerald spine.
  quran: 'border-l-2 border-l-emerald bg-surface-raised',
  // Narration sits just below it.
  hadith: 'border-l-2 border-l-gold bg-surface-raised',
  // A Companion's statement sits below narration and is visibly distinct from it.
  athar: 'border-l-2 border-l-line-strong bg-surface',
  // Commentary, consensus and context are visibly secondary.
  tafsir: 'border-l border-l-line-strong bg-surface',
  ijma: 'border-l border-l-line-strong bg-surface',
  scholarly: 'border-l border-l-line-strong bg-surface',
  history: 'border-l border-l-line-strong bg-surface',
  // Our own words are visually the quietest, and say so on the label.
  summary: 'border border-dashed border-line-strong bg-surface-sunken',
};

const LABEL_STYLE: Record<SourcedContent['kind'], string> = {
  quran: 'text-emerald',
  hadith: 'text-gold-ink',
  athar: 'text-ink-muted',
  tafsir: 'text-ink-faint',
  ijma: 'text-ink-faint',
  scholarly: 'text-ink-faint',
  history: 'text-ink-faint',
  summary: 'text-ink-faint',
};

function ArabicLine({ text }: { text: string }) {
  return (
    <p lang="ar" dir="rtl" className="text-2xl leading-loose text-ink sm:text-3xl">
      {text}
    </p>
  );
}

export function ContentBlock({
  block,
  className,
}: {
  block: SourcedContent;
  className?: string;
}) {
  return (
    <figure
      className={cn('rounded-r-lg px-6 py-5', KIND_STYLE[block.kind], className)}
    >
      <p
        className={cn(
          'font-display text-[0.7rem] uppercase tracking-[0.2em]',
          LABEL_STYLE[block.kind],
        )}
      >
        {KIND_LABEL[block.kind]}
      </p>

      <div className="mt-4 space-y-3">
        {block.kind === 'quran' && (
          <>
            <ArabicLine text={block.arabic} />
            {block.transliteration && (
              <p className="text-sm italic text-ink-faint">{block.transliteration}</p>
            )}
            <p className="text-lg leading-relaxed text-ink">{block.translation}</p>
          </>
        )}

        {block.kind === 'hadith' && (
          <>
            {block.arabic && <ArabicLine text={block.arabic} />}
            {block.narrator && (
              <p className="text-sm text-ink-faint">Narrated by {block.narrator}</p>
            )}
            <p className="leading-relaxed text-ink">{block.translation}</p>
          </>
        )}

        {block.kind === 'athar' && (
          <>
            {block.arabic && <ArabicLine text={block.arabic} />}
            <p className="leading-relaxed text-ink">{block.translation}</p>
          </>
        )}

        {(block.kind === 'tafsir' ||
          block.kind === 'ijma' ||
          block.kind === 'scholarly' ||
          block.kind === 'history') && (
          <p className="leading-relaxed text-ink-muted">{block.text}</p>
        )}

        {block.kind === 'summary' && (
          <p className="leading-relaxed text-ink-muted">{block.text}</p>
        )}
      </div>

      {/* The citation already states the grading in its visible text, so there is no
          screen-reader-only duplicate here — that announced it twice. */}
      <figcaption className="mt-5 border-t border-line pt-3 text-xs leading-relaxed text-ink-faint">
        {formatCitation(block.source)}
      </figcaption>
    </figure>
  );
}

/** Renders a list of blocks with consistent spacing. */
export function ContentBlocks({
  blocks,
  className,
}: {
  blocks: readonly SourcedContent[];
  className?: string;
}) {
  return (
    <div className={cn('space-y-4', className)}>
      {blocks.map((block) => (
        <ContentBlock key={block.id} block={block} />
      ))}
    </div>
  );
}
