import { AuthenticityNotices } from '@/components/content/authenticity-notice';
import { ContentBlock } from '@/components/content/content-block';
import type { SalahPosition } from '@/data/fiqh/salah';
import { RulingBadge } from '@/features/fiqh/ruling-badge';
import type { Evidence, QuranBlock } from '@/lib/content/types';
import { RecitationCard } from './recitation-card';

export interface ResolvedPosition {
  readonly positionEvidence: Evidence;
  readonly recitationEvidence: readonly Evidence[];
  /** Evidence for the accessibility guidance, where it makes an Islamic claim. */
  readonly accessibilityEvidence?: Evidence;
  /** Quranic text for any recitation that is fetched rather than transcribed. */
  readonly quranBlocks: Readonly<Record<string, readonly QuranBlock[]>>;
}

/**
 * One position of the prayer: what to do physically, what to recite, why, the evidence,
 * the common mistakes, and how to perform it if the usual form is not possible.
 *
 * Accessibility guidance sits inline with each position rather than in a separate
 * "special cases" page. Someone who cannot stand needs it while they are learning to
 * pray, not after.
 */
export function PositionCard({
  position,
  index,
  resolved,
}: {
  position: SalahPosition;
  index: number;
  resolved: ResolvedPosition;
}) {
  return (
    <li
      id={position.id}
      className="scroll-mt-24 rounded-2xl border border-line bg-surface-raised p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-baseline gap-4">
          <span aria-hidden className="font-display text-sm text-ink-faint">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
            <h3 className="font-display text-title font-medium tracking-[-0.01em] text-ink">
              {position.name}
            </h3>
            <p lang="ar" dir="rtl" className="mt-1 text-lg text-ink-muted">
              {position.nameArabic}
            </p>
          </div>
        </div>
        <RulingBadge ruling={position.ruling} />
      </div>

      <div className="mt-6">
        <h4 className="font-display text-xs uppercase tracking-[0.2em] text-ink-faint">
          What to do
        </h4>
        <p className="mt-3 text-lg leading-relaxed text-ink">{position.physical}</p>
      </div>

      {position.agreedUpon && (
        <p className="mt-4 text-xs uppercase tracking-[0.16em] text-emerald">
          Agreed upon by all four schools
        </p>
      )}

      {position.recitations.length > 0 && (
        <div className="mt-8">
          <h4 className="font-display text-xs uppercase tracking-[0.2em] text-ink-faint">
            What to recite
          </h4>
          <div className="mt-4 space-y-5">
            {position.recitations.map((recitation, recitationIndex) => (
              <RecitationCard
                key={recitation.id}
                recitation={recitation}
                evidence={resolved.recitationEvidence[recitationIndex] ?? {}}
                quranBlocks={resolved.quranBlocks[recitation.id] ?? []}
              />
            ))}
          </div>
        </div>
      )}

      {position.accessibility && (
        <div className="mt-8 rounded-lg border-l-2 border-l-gold bg-surface px-5 py-4">
          <h4 className="font-display text-xs uppercase tracking-[0.2em] text-gold-ink">
            If you cannot do this
          </h4>
          <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
            {position.accessibility}
          </p>

          {/* Constitution §3.2 — this guidance makes an Islamic claim, so it carries
              its evidence rather than standing alone. */}
          {resolved.accessibilityEvidence?.hadith?.map((block) => (
            <div key={block.id} className="mt-4">
              <ContentBlock block={block} />
            </div>
          ))}

          {resolved.accessibilityEvidence?.notices &&
            resolved.accessibilityEvidence.notices.length > 0 && (
              <AuthenticityNotices notices={resolved.accessibilityEvidence.notices} />
            )}
        </div>
      )}

      {(resolved.positionEvidence.quran?.length ||
        resolved.positionEvidence.hadith?.length) && (
        <div className="mt-8">
          <h4 className="font-display text-xs uppercase tracking-[0.2em] text-ink-faint">
            Evidence for this position
          </h4>
          <div className="mt-4 space-y-4">
            {resolved.positionEvidence.quran?.map((block) => (
              <ContentBlock key={block.id} block={block} />
            ))}
            {resolved.positionEvidence.hadith?.map((block) => (
              <ContentBlock key={block.id} block={block} />
            ))}
          </div>
        </div>
      )}

      {resolved.positionEvidence.notices &&
        resolved.positionEvidence.notices.length > 0 && (
          <AuthenticityNotices notices={resolved.positionEvidence.notices} />
        )}

      {position.commonMistakes && position.commonMistakes.length > 0 && (
        <div className="mt-8 rounded-lg bg-surface-sunken px-5 py-4">
          <h4 className="font-display text-xs uppercase tracking-[0.2em] text-ink-faint">
            Common mistakes
          </h4>
          <ul className="mt-3 space-y-2">
            {position.commonMistakes.map((mistake) => (
              <li key={mistake} className="text-sm leading-relaxed text-ink-muted">
                {mistake}
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}
