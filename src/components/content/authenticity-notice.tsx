import { Info, ScrollText, ShieldAlert } from 'lucide-react';
import {
  ESTABLISHED_PRACTICE_NOTICE,
  EVIDENCE_STATUS_COPY,
  type EvidenceStatus,
} from '@/lib/content/evidence';
import type { EvidenceNotice } from '@/lib/content/types';

/**
 * Explains, precisely, why a supporting narration is not being cited.
 *
 * The whole point of this component is that it does NOT say the same thing in every
 * case. "Our dataset carries no grading" is a statement about Sabeel's checking;
 * "graded weak" is a statement about the narration. Presenting them identically would
 * misrepresent scholarship, so each status gets its own wording and its own treatment.
 */

const TONE: Record<
  Exclude<EvidenceStatus, 'verified'>,
  { icon: typeof Info; frame: string; label: string }
> = {
  // Neutral: this is about us, not about the hadith.
  'unverified-in-dataset': {
    icon: Info,
    frame: 'border-line-strong bg-surface-sunken',
    label: 'text-ink-faint',
  },
  // Informative: a real scholarly difference, presented respectfully.
  disputed: {
    icon: ScrollText,
    frame: 'border-l-2 border-l-gold border-line bg-surface-raised',
    label: 'text-gold-ink',
  },
  weak: { icon: ShieldAlert, frame: 'border-line-strong bg-surface-sunken', label: 'text-ink-faint' },
  fabricated: {
    icon: ShieldAlert,
    frame: 'border-line-strong bg-surface-sunken',
    label: 'text-ink-faint',
  },
  'not-found': {
    icon: Info,
    frame: 'border-line-strong bg-surface-sunken',
    label: 'text-ink-faint',
  },
};

export function AuthenticityNotice({ notice }: { notice: EvidenceNotice }) {
  const copy = notice.establishedPractice
    ? ESTABLISHED_PRACTICE_NOTICE
    : EVIDENCE_STATUS_COPY[notice.status];
  const tone = TONE[notice.status];
  const Icon = tone.icon;

  return (
    <aside
      className={`rounded-lg border border-dashed px-5 py-4 ${tone.frame}`}
      aria-label={copy.heading}
    >
      <p className={`flex items-center gap-2 font-display text-[0.7rem] uppercase tracking-[0.18em] ${tone.label}`}>
        <Icon className="size-3.5" aria-hidden />
        {copy.heading}
      </p>

      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{copy.body}</p>

      {/* When scholars differed, show each assessment verbatim rather than summarising. */}
      {notice.status === 'disputed' && notice.gradings && notice.gradings.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {notice.gradings.map((grading) => (
            <li key={grading.scholar} className="text-sm text-ink-muted">
              <span className="text-ink">{grading.scholar}</span>
              <span className="text-ink-faint"> — {grading.grade}</span>
            </li>
          ))}
        </ul>
      )}

      {notice.reference && (
        <p className="mt-3 text-xs text-ink-faint">Reference checked: {notice.reference}</p>
      )}
    </aside>
  );
}

export function AuthenticityNotices({ notices }: { notices: readonly EvidenceNotice[] }) {
  if (notices.length === 0) return null;

  return (
    <div className="mt-5 space-y-3">
      {notices.map((notice) => (
        <AuthenticityNotice key={notice.id} notice={notice} />
      ))}
    </div>
  );
}
