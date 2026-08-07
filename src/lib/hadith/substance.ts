/**
 * Detects narrations whose text is unlikely to be usable on a teaching page — typically
 * chain-only entries such as "This hadith has been narrated by another chain of
 * transmitters", which pass the authenticity gate while carrying no substantive content.
 *
 * Constitution §3.3 — **automate detection, do not automate judgement.** Nothing here
 * excludes anything. It flags, with a reason, and the item stays unpublished until a
 * person records a decision in `data/hadith-review.ts`.
 *
 * The heuristic is deliberately allowed to be imperfect in both directions, because a
 * human decides either way. What it must never do is silently discard a valid short
 * narration.
 */

export type SubstanceFlag = 'chain-only' | 'too-short';

/**
 * REMOVED after empirical testing: a "text does not end with terminal punctuation"
 * check. Run against the five narrations actually cited by the Wudhu page, it flagged
 * all five — the dataset simply omits closing full stops. Missing punctuation is a
 * typographic property, not a substantive one, so it detected nothing about whether a
 * narration carries usable content and would have held the entire page for review.
 *
 * Recorded rather than quietly deleted: a detector that flags everything is worse than
 * no detector, because it trains a reviewer to dismiss the warnings.
 */

export interface SubstanceCheck {
  readonly flags: readonly SubstanceFlag[];
  /** Human-readable explanation, used in the build warning. */
  readonly reasons: readonly string[];
}

/** Phrases that mark an entry as a pointer to another narration rather than a narration. */
const CHAIN_ONLY_PATTERNS: readonly { pattern: RegExp; reason: string }[] = [
  {
    pattern: /narrated (?:to us )?(?:by|through) another chain/i,
    reason: 'Refers to another chain of transmitters rather than giving the narration.',
  },
  {
    pattern: /this hadith has been (?:narrated|reported|transmitted)/i,
    reason: 'Describes the transmission of a narration rather than stating it.',
  },
  {
    pattern: /narrated (?:it )?like the (?:hadith|tradition)/i,
    reason: 'Points at another narration ("narrated like the hadith…") without its text.',
  },
  {
    pattern: /(?:a|the) similar (?:hadith|tradition|narration) (?:has been )?(?:narrated|reported)/i,
    reason: 'Refers to a similar narration rather than carrying one.',
  },
  {
    pattern: /with the same chain of (?:transmitters|narrators)/i,
    reason: 'Records an alternate chain for a narration given elsewhere.',
  },
];

/**
 * Below this, an English narration is short enough to be worth a human glance. Genuine
 * short narrations exist, which is exactly why this flags rather than excludes.
 */
const SHORT_TEXT_THRESHOLD = 60;

export function checkSubstance(text: string): SubstanceCheck {
  const trimmed = text.trim();
  const flags: SubstanceFlag[] = [];
  const reasons: string[] = [];

  for (const { pattern, reason } of CHAIN_ONLY_PATTERNS) {
    if (pattern.test(trimmed)) {
      if (!flags.includes('chain-only')) flags.push('chain-only');
      reasons.push(reason);
    }
  }

  if (trimmed.length > 0 && trimmed.length < SHORT_TEXT_THRESHOLD) {
    flags.push('too-short');
    reasons.push(
      `Text is only ${trimmed.length} characters. Genuine short narrations exist, so this needs a look rather than a rule.`,
    );
  }

  if (trimmed.length === 0) {
    flags.push('too-short');
    reasons.push('The entry has no text at all.');
  }

  return { flags, reasons };
}

export function isFlagged(check: SubstanceCheck): boolean {
  return check.flags.length > 0;
}
