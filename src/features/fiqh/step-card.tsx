import { AuthenticityNotices } from '@/components/content/authenticity-notice';
import { ContentBlock } from '@/components/content/content-block';
import type { Evidence } from '@/lib/content/types';
import { hasCitableEvidence } from '@/lib/content/types';
import type { FiqhStepData } from '@/lib/fiqh/step-types';
import { RulingBadge } from './ruling-badge';

/**
 * One step of a fiqh act.
 *
 * Evidence is rendered through <ContentBlock>, so every citation carries its source.
 * Where a reference did not clear the authenticity gate, the notice states precisely
 * what was concluded — it is never silently dropped, and "we could not verify this" is
 * never presented as "this is weak".
 */
export function StepCard({
  step,
  index,
  evidence,
}: {
  step: FiqhStepData;
  index: number;
  evidence: Evidence;
}) {
  const citable = hasCitableEvidence(evidence);

  return (
    <li
      id={step.id}
      className="scroll-mt-24 rounded-2xl border border-line bg-surface-raised p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-baseline gap-4">
          <span
            aria-hidden
            className="font-display text-sm text-ink-faint"
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="font-display text-title font-medium tracking-[-0.01em] text-ink">
            {step.title}
          </h3>
        </div>
        <RulingBadge ruling={step.ruling} />
      </div>

      <p className="mt-5 text-lg leading-relaxed text-ink">{step.instruction}</p>

      {step.why && <p className="mt-3 text-sm leading-relaxed text-ink-muted">{step.why}</p>}

      {step.agreedUpon && (
        <p className="mt-4 text-xs uppercase tracking-[0.16em] text-emerald">
          Agreed upon by all four schools
        </p>
      )}

      {(evidence.quran?.length || evidence.hadith?.length) && (
        <div className="mt-7">
          <h4 className="font-display text-xs uppercase tracking-[0.2em] text-ink-faint">
            Evidence
          </h4>
          <div className="mt-4 space-y-4">
            {evidence.quran?.map((block) => (
              <ContentBlock key={block.id} block={block} />
            ))}
            {evidence.hadith?.map((block) => (
              <ContentBlock key={block.id} block={block} />
            ))}
          </div>
        </div>
      )}

      {evidence.notices && evidence.notices.length > 0 && (
        <AuthenticityNotices notices={evidence.notices} />
      )}

      {!citable && (
        <p className="mt-5 text-sm text-ink-faint">
          No citation is shown for this step yet. Please see the notice above.
        </p>
      )}

      {step.commonMistakes && step.commonMistakes.length > 0 && (
        <div className="mt-7 rounded-lg bg-surface-sunken px-5 py-4">
          <h4 className="font-display text-xs uppercase tracking-[0.2em] text-ink-faint">
            Common mistakes
          </h4>
          <ul className="mt-3 space-y-2">
            {step.commonMistakes.map((mistake) => (
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
