import { AuthenticityNotices } from '@/components/content/authenticity-notice';
import { ContentBlock } from '@/components/content/content-block';
import type { Recitation } from '@/data/fiqh/salah';
import type { Evidence, QuranBlock } from '@/lib/content/types';
import { RulingBadge } from '@/features/fiqh/ruling-badge';

/**
 * One recitation: Arabic, transliteration, meaning, why you are saying it, and evidence.
 *
 * Two kinds of Arabic appear here, and they are labelled differently on purpose:
 *
 *  - **Quranic** text is fetched live from the Quran source and rendered through
 *    <ContentBlock>, so it carries its translator and reference like any other verse.
 *  - **Liturgical transcriptions** (the takbir, the tasbih, the tashahhud) are labelled
 *    as transcriptions, with the narration that establishes them cited directly beneath.
 *    They are never presented as a quotation of the hadith text itself.
 *
 * Constitution §3.2 — every claim is either linked to evidence or labelled as our own.
 */
export function RecitationCard({
  recitation,
  evidence,
  quranBlocks,
}: {
  recitation: Recitation;
  evidence: Evidence;
  quranBlocks: readonly QuranBlock[];
}) {
  const isQuranic = recitation.quranReference !== undefined;

  return (
    <div className="rounded-xl border border-line bg-surface px-5 py-5 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h5 className="font-display text-lg text-ink">{recitation.label}</h5>
        <RulingBadge ruling={recitation.ruling} />
      </div>

      {isQuranic ? (
        // Fetched, not transcribed — rendered with full attribution.
        <div className="mt-5 space-y-4">
          {quranBlocks.map((block) => (
            <ContentBlock key={block.id} block={block} />
          ))}
        </div>
      ) : (
        <div className="mt-5">
          <p className="font-display text-[0.65rem] uppercase tracking-[0.18em] text-ink-faint">
            Liturgical transcription
          </p>

          <p lang="ar" dir="rtl" className="mt-3 text-2xl leading-loose text-ink sm:text-[1.75rem]">
            {recitation.arabic}
          </p>

          <p className="mt-4 text-sm italic leading-relaxed text-ink-faint">
            {recitation.transliteration}
          </p>

          <p className="mt-3 leading-relaxed text-ink-muted">
            “{recitation.translation}”
          </p>

          <p className="mt-3 text-xs leading-relaxed text-ink-faint">
            Written here as it is recited. The narration establishing it is cited below.
          </p>
        </div>
      )}

      {/* The owner's addition: words are memorised long before they are understood. */}
      <div className="mt-6 rounded-lg border-l-2 border-l-emerald bg-surface-raised px-5 py-4">
        <p className="font-display text-[0.65rem] uppercase tracking-[0.18em] text-emerald">
          Why am I saying this?
        </p>
        <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">{recitation.why}</p>
        <p className="mt-3 text-[0.65rem] uppercase tracking-[0.16em] text-ink-faint">
          Sabeel — educational summary
        </p>
      </div>

      {evidence.hadith && evidence.hadith.length > 0 && (
        <div className="mt-6 space-y-4">
          {evidence.hadith.map((block) => (
            <ContentBlock key={block.id} block={block} />
          ))}
        </div>
      )}

      {evidence.notices && evidence.notices.length > 0 && (
        <AuthenticityNotices notices={evidence.notices} />
      )}
    </div>
  );
}
