import type { RulingClass } from '@/lib/content/types';
import type { EvidenceSpec } from './loader';

/**
 * The shape shared by every step-based fiqh guide — wudhu, ghusl, and anything later
 * that teaches an act as an ordered sequence.
 *
 * Salah is deliberately NOT expressed here: a prayer position carries recitations, a
 * "why am I saying this?" and accessibility guidance, which would make this type a
 * lowest-common-denominator with most fields optional. A separate, richer type there is
 * clearer than one type that fits neither well.
 */
export interface FiqhStepData {
  readonly id: string;
  readonly title: string;
  /** FIQH-POLICY §3 — required, with no default, so weight is never left unstated. */
  readonly ruling: RulingClass;
  /** True when all four Sunni schools concur. */
  readonly agreedUpon: boolean;
  /** The beginner-facing instruction: one valid, widely accepted method (§4). */
  readonly instruction: string;
  readonly why?: string;
  readonly evidence: EvidenceSpec;
  readonly commonMistakes?: readonly string[];
}

/** FIQH-POLICY §2 — a position always names the schools holding it, and is never ranked. */
export interface FiqhPositionData {
  readonly schools: readonly string[];
  readonly position: string;
}

export interface FiqhDifferenceData {
  readonly id: string;
  readonly question: string;
  readonly positions: readonly FiqhPositionData[];
}
