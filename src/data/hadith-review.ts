/**
 * The human review register.
 *
 * Constitution §3.3: a heuristic may flag a narration, but only a person decides. Until
 * a decision appears here, a flagged narration stays **unpublished** — it is neither
 * shown nor quietly discarded, and the build warns about it.
 *
 * Adding an entry is a deliberate editorial act. Record who decided and when, so the
 * reasoning survives the person.
 */

export type ReviewDecision = 'approved' | 'excluded';

export interface ReviewRecord {
  readonly decision: ReviewDecision;
  /** Why. Written for someone reading this in two years. */
  readonly reason: string;
  /** ISO date. */
  readonly reviewedOn: string;
  readonly reviewedBy: string;
}

/** Keyed `${collection}:${hadithNumber}`. */
export const HADITH_REVIEW: Readonly<Record<string, ReviewRecord>> = {
  'muslim:226': {
    decision: 'excluded',
    reason:
      'The English entry is a chain-only fragment — "Harmala b. Yahya… narrated like the ' +
      'hadith…" — recording an alternate chain for a narration given elsewhere. It carries ' +
      'no substantive text, so it cannot teach anything. This is a statement about this ' +
      'dataset entry, not about the narration in Sahih Muslim.',
    reviewedOn: '2026-08-07',
    reviewedBy: 'Faeez',
  },
  'muslim:397': {
    decision: 'excluded',
    reason:
      'Same as muslim:226 — "This hadith has been narrated by another chain of ' +
      'transmitters". A pointer to a narration rather than the narration itself.',
    reviewedOn: '2026-08-07',
    reviewedBy: 'Faeez',
  },
};

export function getReview(collection: string, hadithNumber: number): ReviewRecord | undefined {
  return HADITH_REVIEW[`${collection}:${hadithNumber}`];
}
