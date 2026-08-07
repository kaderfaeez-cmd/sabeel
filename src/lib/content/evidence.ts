/**
 * Evidence status — what Sabeel knows about a narration, stated precisely.
 *
 * The distinction this file exists to protect (owner ruling, 2026-08-07):
 *
 *   "Weak (da'if)" is not the same as "no grading available."
 *   "No grading available" is not the same as "fabricated."
 *   "Two scholars differed" is not the same as "weak."
 *
 * An earlier version of the gate collapsed all of these into a single `null`. That was
 * technically safe but scholarly unfair: it implied a defect in narrations whose grading
 * simply is not present in the dataset Sabeel happens to use. The UI must never blur
 * these together, so the type system does not let it.
 */

export const EVIDENCE_STATUS = [
  /** Meets the publication policy. This alone may be cited as proof. */
  'verified',
  /** Our dataset carries no grading. This says nothing about the narration itself. */
  'unverified-in-dataset',
  /** Recognised scholars reached different conclusions. A real difference, not a defect. */
  'disputed',
  /** Explicitly graded weak (da'if) by the scholars who assessed it. */
  'weak',
  /** Explicitly graded fabricated (mawdu'). Never cited, and never quoted as if genuine. */
  'fabricated',
  /**
   * Authentic, but the dataset entry was flagged as possibly unusable (chain-only,
   * truncated, or unusually short) and no person has yet decided. Constitution §3.3:
   * detection is automated, judgement is not. Unpublished until reviewed — neither
   * shown nor discarded.
   */
  'needs-review',
  /** No such narration at the given reference. */
  'not-found',
] as const;

export type EvidenceStatus = (typeof EVIDENCE_STATUS)[number];

/** Only this status may be presented to a reader as established evidence. */
export function isCitableAsProof(status: EvidenceStatus): boolean {
  return status === 'verified';
}

/**
 * Whether the narration may be *shown* at all, with appropriate framing.
 *
 * A disputed narration is shown, because concealing a genuine scholarly difference would
 * itself be a distortion (FIQH-POLICY §2). Weak and fabricated narrations are not shown
 * as evidence; a fabricated one is never reproduced as though it were a hadith.
 */
export function isDisplayable(status: EvidenceStatus): boolean {
  return status === 'verified' || status === 'disputed';
}

/**
 * Whether a human still needs to decide. `needs-review` is the only status that is not
 * a conclusion — it is an open question, and the item is neither published nor discarded
 * while it stands (Constitution §3.3).
 */
export function awaitsHumanReview(status: EvidenceStatus): boolean {
  return status === 'needs-review';
}

/**
 * Reader-facing copy for each status.
 *
 * Wording matters more than usual here. `unverified-in-dataset` deliberately does not
 * suggest the narration is defective — it describes a limit of *our* checking, not of
 * the hadith.
 */
export const EVIDENCE_STATUS_COPY: Record<
  Exclude<EvidenceStatus, 'verified'>,
  { readonly heading: string; readonly body: string }
> = {
  'unverified-in-dataset': {
    heading: 'Authenticity notice',
    body:
      'Sabeel could not confidently verify a supporting hadith for this point using its ' +
      'authenticity policy. This does not necessarily mean the narration is weak or ' +
      'false; it means we cannot confidently present it as evidence. The lesson ' +
      'therefore relies on the Quran and verified sources only.',
  },
  disputed: {
    heading: 'Scholars differed on this narration',
    body:
      'Recognised scholars reached different conclusions about this narration. Sabeel ' +
      'shows their assessments rather than choosing between them, and does not present ' +
      'the narration as settled proof.',
  },
  weak: {
    heading: 'Not cited',
    body:
      'A narration commonly quoted for this point was graded weak (da‘if) by the ' +
      'scholars who assessed it, so Sabeel does not cite it as evidence.',
  },
  fabricated: {
    heading: 'Not cited',
    body:
      'A narration sometimes attributed to this point was graded fabricated ' +
      '(mawdu‘). Sabeel does not reproduce it.',
  },
  'needs-review': {
    heading: 'Awaiting review',
    body:
      'A narration for this point is authentic, but the entry in Sabeel’s source could ' +
      'not be automatically confirmed to carry usable text. It is held back pending human ' +
      'review rather than published or discarded automatically. This says nothing about ' +
      'the narration itself.',
  },
  'not-found': {
    heading: 'Reference not found',
    body: 'Sabeel could not locate a narration at this reference in its hadith source.',
  },
};

/**
 * Framing for a practice that mainstream Sunni scholarship establishes, but for which
 * Sabeel has not yet verified a citation meeting its publication policy.
 *
 * Owner ruling: the Quran establishes the obligation of Salah while many details of its
 * performance come through the Sunnah, so a page must never read as "there is no
 * evidence" merely because our gate has not yet cleared a specific narration.
 */
export const ESTABLISHED_PRACTICE_NOTICE = {
  heading: 'Established practice, citation pending',
  body:
    'This practice is established within mainstream Sunni scholarship. Sabeel has not ' +
    'yet verified a citation for it that satisfies its publication policy, so none is ' +
    'shown here. Additional authenticated references may be added in future updates.',
} as const;

/** A grading as given by one named scholar, shown verbatim rather than summarised. */
export interface ScholarGrading {
  readonly scholar: string;
  /** The grading exactly as the source records it. */
  readonly grade: string;
  /** Whether this particular grading meets the publication policy. */
  readonly acceptable: boolean;
}
