import { getReview } from '@/data/hadith-review';
import type { EvidenceStatus, ScholarGrading } from '@/lib/content/evidence';
import type { HadithBlock, HadithGrading } from '@/lib/content/types';
import { getCollection } from './collections';
import { checkSubstance, isFlagged, type SubstanceFlag } from './substance';

/**
 * Hadith retrieval and the authenticity gate.
 *
 * The gate never returns a citable block unless authenticity meets the publication
 * policy — but, crucially, it also reports *why* when it does not. An earlier version
 * returned a bare `null`, which was safe but scholarly unfair: it made "our dataset has
 * no grading for this" indistinguishable from "this narration is weak". Those are
 * different claims, and only one of them is Sabeel's to make.
 *
 * See docs/SOURCES.md and lib/content/evidence.ts.
 */

const DATASET_BASE = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions';

export class HadithError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'HadithError';
  }
}

interface ApiGrade {
  name: string;
  grade: string;
}

interface ApiHadith {
  hadithnumber: number;
  text: string;
  grades?: ApiGrade[];
  reference?: { book?: number; hadith?: number };
}

interface ApiResponse {
  hadiths: ApiHadith[];
}

/** What the gate concluded, and everything needed to explain it honestly. */
export type HadithLookup =
  | { readonly status: 'verified'; readonly block: HadithBlock }
  | {
      readonly status: Exclude<EvidenceStatus, 'verified'>;
      readonly reference: string;
      readonly gradings: readonly ScholarGrading[];
      /** Present on `needs-review`: why detection flagged it, for the build warning. */
      readonly reviewFlags?: readonly SubstanceFlag[];
      readonly reviewReasons?: readonly string[];
    };

/**
 * Classifies one grading string.
 *
 * `null` means "not acceptable for publication", which is deliberately distinct from
 * *why* it is unacceptable — that is decided by `classifyGrades` below.
 */
export function normaliseGrading(raw: string): HadithGrading | null {
  const value = raw.trim().toLowerCase();
  if (value === '') return null;

  // Order matters: compound gradings must be tested before the simple ones.
  if (value.includes('mutawatir')) return 'mutawatir';
  if (/sahih li[- ]ghayrihi/.test(value)) return 'sahih-li-ghayrihi';
  if (/hasan li[- ]ghayrihi/.test(value)) return 'hasan-li-ghayrihi';
  if (isFabricated(value) || isWeak(value)) return null;
  if (value.includes('sahih')) return 'sahih';
  if (value.includes('hasan')) return 'hasan';
  return null;
}

function isWeak(value: string): boolean {
  return /\b(da'?if|daif|dhaeef|weak|munkar|shadh)\b/.test(value);
}

function isFabricated(value: string): boolean {
  return /\b(mawdu'?|mawdoo'?|fabricated|forged|batil)\b/.test(value);
}

const RANKING: readonly HadithGrading[] = [
  'mutawatir',
  'sahih',
  'sahih-li-ghayrihi',
  'hasan',
  'hasan-li-ghayrihi',
];

export interface GradeAssessment {
  readonly status: EvidenceStatus;
  readonly gradings: readonly ScholarGrading[];
  readonly best: { readonly grading: HadithGrading; readonly gradedBy: string } | null;
}

/**
 * Turns a set of scholar gradings into a status.
 *
 * The four outcomes are kept strictly apart:
 *  - no gradings at all      → `unverified-in-dataset` (a statement about our data)
 *  - some acceptable, some not → `disputed` (a real scholarly difference)
 *  - all acceptable          → `verified`
 *  - none acceptable         → `fabricated` if any says so, otherwise `weak`
 */
export function classifyGrades(grades: readonly ApiGrade[]): GradeAssessment {
  if (grades.length === 0) {
    return { status: 'unverified-in-dataset', gradings: [], best: null };
  }

  const gradings: ScholarGrading[] = [];
  let best: GradeAssessment['best'] = null;
  let anyFabricated = false;

  for (const entry of grades) {
    const normalised = normaliseGrading(entry.grade);
    const acceptable = normalised !== null;
    gradings.push({ scholar: entry.name, grade: entry.grade, acceptable });

    if (isFabricated(entry.grade.toLowerCase())) anyFabricated = true;

    if (normalised && (best === null || RANKING.indexOf(normalised) < RANKING.indexOf(best.grading))) {
      best = { grading: normalised, gradedBy: entry.name };
    }
  }

  const acceptableCount = gradings.filter((g) => g.acceptable).length;

  if (acceptableCount === 0) {
    return { status: anyFabricated ? 'fabricated' : 'weak', gradings, best: null };
  }
  if (acceptableCount < gradings.length) {
    // Recognised scholars reached different conclusions. Not a defect — a difference.
    return { status: 'disputed', gradings, best };
  }
  return { status: 'verified', gradings, best };
}

/** The dataset prefixes many English texts with "Narrated X:". Split it out for display. */
export function splitNarrator(text: string): { narrator?: string; body: string } {
  const match = /^Narrated\s+([^:]{1,80}):\s*/.exec(text);
  if (!match) return { body: text.trim() };
  return { narrator: match[1]?.trim(), body: text.slice(match[0].length).trim() };
}

async function fetchEdition(edition: string, hadithNumber: number): Promise<ApiResponse | null> {
  const url = `${DATASET_BASE}/${edition}/${hadithNumber}.min.json`;

  let response: Response;
  try {
    response = await fetch(url, { cache: 'force-cache' });
  } catch (cause) {
    throw new HadithError(`Could not reach the hadith source: ${String(cause)}`);
  }

  if (response.status === 404) return null;
  if (!response.ok) throw new HadithError(`Hadith source responded ${response.status}`);

  return (await response.json()) as ApiResponse;
}

/**
 * Looks up one hadith and applies the authenticity gate.
 *
 * A `verified` result carries a citable block. Every other result carries the reference
 * and the scholars' assessments, so the caller can tell the reader precisely what is and
 * is not known — never implying a defect Sabeel has not established.
 */
export async function lookupHadith(
  collectionSlug: string,
  hadithNumber: number,
  options: { includeArabic?: boolean } = {},
): Promise<HadithLookup> {
  const collection = getCollection(collectionSlug);
  if (!collection) {
    throw new HadithError(`Sabeel does not cite the collection "${collectionSlug}"`);
  }
  if (!Number.isInteger(hadithNumber) || hadithNumber < 1) {
    throw new HadithError(`"${hadithNumber}" is not a valid hadith number`);
  }

  const reference = `${collection.name}, Hadith ${hadithNumber}`;
  const english = await fetchEdition(`eng-${collection.slug}`, hadithNumber);
  const entry = english?.hadiths[0];

  if (!entry) return { status: 'not-found', reference, gradings: [] };

  const assessment = classifyGrades(entry.grades ?? []);

  // Sahih al-Bukhari and Sahih Muslim are authentic by the collection itself; the
  // dataset ships them with no grades because none is separately required.
  const acceptedByCollection =
    assessment.status === 'unverified-in-dataset' && collection.authenticByCollection;

  if (assessment.status !== 'verified' && !acceptedByCollection) {
    return {
      status: assessment.status as Exclude<EvidenceStatus, 'verified'>,
      reference,
      gradings: assessment.gradings,
    };
  }

  /**
   * Authenticity is settled by this point. Usability is a separate question —
   * passing the authenticity gate is not the same as carrying usable content.
   *
   * Constitution §3.3: detection is automated, judgement is not. A flagged entry with no
   * recorded human decision is held as `needs-review`: not published, not discarded.
   */
  const substance = checkSubstance(entry.text);
  const review = getReview(collection.slug, hadithNumber);

  if (isFlagged(substance) && review?.decision !== 'approved') {
    return {
      status: 'needs-review',
      reference,
      gradings: assessment.gradings,
      reviewFlags: substance.flags,
      reviewReasons:
        review?.decision === 'excluded'
          ? [`Excluded on review (${review.reviewedOn}): ${review.reason}`]
          : substance.reasons,
    };
  }

  let arabic: string | undefined;
  if (options.includeArabic) {
    try {
      const source = await fetchEdition(`ara-${collection.slug}`, hadithNumber);
      arabic = source?.hadiths[0]?.text;
    } catch {
      // Arabic is an enhancement; its absence must not suppress a sourced narration.
    }
  }

  const { narrator, body } = splitNarrator(entry.text);

  return {
    status: 'verified',
    block: {
      kind: 'hadith',
      id: `hadith-${collection.slug}-${hadithNumber}`,
      translation: body,
      narrator,
      arabic,
      source: {
        kind: 'hadith',
        collection: collection.slug,
        collectionName: collection.name,
        bookNumber: entry.reference?.book,
        hadithNumber: entry.hadithnumber ?? hadithNumber,
        grading: assessment.best?.grading ?? 'sahih',
        gradedBy: assessment.best?.gradedBy,
      },
    },
  };
}
