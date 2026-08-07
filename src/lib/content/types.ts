/**
 * The content spine.
 *
 * Constitution §3 forbids fabricating religious content, and §4 requires that a reader
 * always knows what kind of content they are looking at. Neither can be left to editorial
 * discipline, so both are encoded here: every content block is a member of a discriminated
 * union, and every member requires a source. There is no way to construct a renderable
 * block without attribution.
 *
 * Nothing in this file describes presentation. See components/content/ for that.
 */

// ---------------------------------------------------------------------------
// References — the "where did this come from" half of every block
// ---------------------------------------------------------------------------

/** A Quran reference. `ayah` may span a range, e.g. 2:255 or 18:60–82. */
export interface QuranRef {
  readonly kind: 'quran';
  readonly surah: number;
  readonly ayahFrom: number;
  readonly ayahTo: number;
  /** Quran.com translation resource id, so the translator is always creditable. */
  readonly translationId: number;
  readonly translatorName: string;
}

/**
 * Hadith grading. Constitution §3 and SOURCES.md §4: a narration whose grading cannot
 * be established is never presented as evidence, so there is no "unknown" member.
 */
export type HadithGrading =
  | 'sahih'
  | 'hasan'
  | 'sahih-li-ghayrihi'
  | 'hasan-li-ghayrihi'
  | 'mutawatir';

export interface HadithRef {
  readonly kind: 'hadith';
  /** e.g. 'bukhari', 'muslim' — matches the pinned dataset's edition slugs. */
  readonly collection: string;
  /** Human-readable collection name for display, e.g. 'Sahih al-Bukhari'. */
  readonly collectionName: string;
  readonly bookNumber?: number;
  readonly bookName?: string;
  /** The number a reader would use to look this up in the printed work. */
  readonly hadithNumber: number;
  readonly grading: HadithGrading;
  /** Who graded it, when the grading is not the collector's own. */
  readonly gradedBy?: string;
}

export interface TafsirRef {
  readonly kind: 'tafsir';
  /** The work, e.g. 'Tafsir Ibn Kathir'. */
  readonly work: string;
  /** The mufassir, e.g. 'Ibn Kathir'. */
  readonly author: string;
  /** The ayah being explained. */
  readonly onAyah: { readonly surah: number; readonly ayah: number };
}

export interface HistoryRef {
  readonly kind: 'history';
  /** Named source — never "historians say". */
  readonly work: string;
  readonly author: string;
}

/**
 * Platform-authored educational framing. This is the ONLY kind that Sabeel writes
 * itself, and it is always rendered in a visually distinct editorial treatment so it
 * can never be mistaken for revelation (Constitution §4).
 */
export interface EditorialRef {
  readonly kind: 'editorial';
  /** ISO date, so a reader can see how current the framing is. */
  readonly reviewedOn: string;
}

export type ContentSource =
  | QuranRef
  | HadithRef
  | TafsirRef
  | HistoryRef
  | EditorialRef;

// ---------------------------------------------------------------------------
// Content blocks
// ---------------------------------------------------------------------------

/** Arabic text always travels with its transliteration and translation. */
export interface ArabicPassage {
  readonly arabic: string;
  readonly transliteration?: string;
  readonly translation: string;
}

interface BlockBase {
  readonly id: string;
}

export interface QuranBlock extends BlockBase, ArabicPassage {
  readonly kind: 'quran';
  readonly source: QuranRef;
}

export interface HadithBlock extends BlockBase {
  readonly kind: 'hadith';
  readonly source: HadithRef;
  readonly arabic?: string;
  readonly translation: string;
  /** The companion who narrated it, where the dataset provides it. */
  readonly narrator?: string;
}

export interface TafsirBlock extends BlockBase {
  readonly kind: 'tafsir';
  readonly source: TafsirRef;
  readonly text: string;
}

export interface HistoryBlock extends BlockBase {
  readonly kind: 'history';
  readonly source: HistoryRef;
  readonly text: string;
}

export interface SummaryBlock extends BlockBase {
  readonly kind: 'summary';
  readonly source: EditorialRef;
  readonly text: string;
}

/**
 * Every piece of content the platform can render. Adding a member here forces every
 * `switch` over the union to handle it — including the attribution renderer — which is
 * how §4's labelling requirement stays enforced as the platform grows.
 */
export type SourcedContent =
  | QuranBlock
  | HadithBlock
  | TafsirBlock
  | HistoryBlock
  | SummaryBlock;

export type ContentKind = SourcedContent['kind'];

// ---------------------------------------------------------------------------
// Fiqh — enforcing FIQH-POLICY.md at the type level
// ---------------------------------------------------------------------------

/**
 * FIQH-POLICY §3. Required on every fiqh step, with no default and no "unspecified",
 * so a step's weight can never be left unstated.
 */
export type RulingClass = 'pillar' | 'obligatory' | 'sunnah' | 'recommended';

export const RULING_LABEL: Record<RulingClass, { en: string; ar: string }> = {
  pillar: { en: 'Pillar', ar: 'ركن' },
  obligatory: { en: 'Obligatory', ar: 'واجب' },
  sunnah: { en: 'Sunnah', ar: 'سنة' },
  recommended: { en: 'Recommended', ar: 'مستحب' },
};

export const MADHAHIB = ['hanafi', 'maliki', 'shafii', 'hanbali'] as const;
export type Madhhab = (typeof MADHAHIB)[number];

export const MADHHAB_LABEL: Record<Madhhab, string> = {
  hanafi: 'Hanafi',
  maliki: 'Maliki',
  shafii: "Shafi'i",
  hanbali: 'Hanbali',
};

/**
 * FIQH-POLICY §2 and §6. A position must name the school that holds it, and must state
 * whether it rests on direct text or on scholarly interpretation.
 *
 * Note there is deliberately no `isCorrect` or `isPreferred` field: the policy forbids
 * presenting one school as right and the others as wrong, so the type offers no way
 * to express it.
 */
export interface MadhhabPosition {
  /** Schools holding this position. Several may share one. */
  readonly madhahib: readonly [Madhhab, ...Madhhab[]];
  readonly position: string;
  readonly basis: 'text' | 'interpretation';
  /** Supporting evidence, rendered through the same attributed content blocks. */
  readonly evidence?: readonly SourcedContent[];
}

/** FIQH-POLICY §2/§4. At least one position is required — an empty difference is meaningless. */
export interface FiqhDifference {
  readonly id: string;
  readonly question: string;
  readonly positions: readonly [MadhhabPosition, ...MadhhabPosition[]];
}

/**
 * A single step of a fiqh act (a wudhu washing, a salah position).
 *
 * `ruling` and `agreedUpon` are both required. `agreedUpon: true` means all four schools
 * concur — which is what FIQH-POLICY §1 says to teach first — and anything with
 * `differences` renders those only inside the "Scholarly Differences" disclosure (§4).
 */
export interface FiqhStep {
  readonly id: string;
  readonly title: string;
  readonly ruling: RulingClass;
  readonly agreedUpon: boolean;
  /** The beginner-facing instruction — one valid, widely accepted method (§4). */
  readonly instruction: string;
  readonly passage?: ArabicPassage;
  /** Quran and hadith evidence for this step (§6). */
  readonly evidence: readonly SourcedContent[];
  readonly differences?: readonly FiqhDifference[];
  readonly commonMistakes?: readonly string[];
}
