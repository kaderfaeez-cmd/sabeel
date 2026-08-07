import type { HadithBlock, HadithGrading } from '@/lib/content/types';
import { getCollection } from './collections';

/**
 * Hadith retrieval from the pinned dataset.
 *
 * The hard rule this file exists to enforce (SOURCES.md §4, Constitution §3):
 * **a narration whose authenticity cannot be established is never returned as evidence.**
 * `fetchHadith` returns `null` in that case rather than handing back an unusable block,
 * so a caller cannot accidentally present it.
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
  metadata?: { name?: string };
  hadiths: ApiHadith[];
}

/**
 * Maps a dataset grade string onto the gradings Sabeel is willing to present.
 *
 * Anything weaker than hasan — da'if, munkar, mawdu' and the rest — deliberately returns
 * `null`. Sabeel does not cite weak narrations as evidence.
 */
export function normaliseGrading(raw: string): HadithGrading | null {
  const value = raw.trim().toLowerCase();

  // Order matters: the compound gradings must be tested before the simple ones.
  if (value.includes('mutawatir')) return 'mutawatir';
  if (value.includes('sahih li-ghayrihi') || value.includes('sahih li ghayrihi')) {
    return 'sahih-li-ghayrihi';
  }
  if (value.includes('hasan li-ghayrihi') || value.includes('hasan li ghayrihi')) {
    return 'hasan-li-ghayrihi';
  }
  if (value.includes('daif') || value.includes("da'if") || value.includes('weak')) {
    return null;
  }
  if (value.includes('hasan sahih') || value.includes('sahih')) return 'sahih';
  if (value.includes('hasan')) return 'hasan';

  return null;
}

/** Picks the strongest acceptable grading, and the scholar who gave it. */
export function selectGrading(
  grades: readonly ApiGrade[],
): { grading: HadithGrading; gradedBy: string } | null {
  const ranking: readonly HadithGrading[] = [
    'mutawatir',
    'sahih',
    'sahih-li-ghayrihi',
    'hasan',
    'hasan-li-ghayrihi',
  ];

  let best: { grading: HadithGrading; gradedBy: string } | null = null;

  for (const entry of grades) {
    const grading = normaliseGrading(entry.grade);
    if (grading === null) continue;
    if (best === null || ranking.indexOf(grading) < ranking.indexOf(best.grading)) {
      best = { grading, gradedBy: entry.name };
    }
  }

  return best;
}

/** The dataset prefixes many English texts with "Narrated X:". Split it out for display. */
export function splitNarrator(text: string): { narrator?: string; body: string } {
  const match = /^Narrated\s+([^:]{1,80}):\s*/.exec(text);
  if (!match) return { body: text.trim() };
  return { narrator: match[1]?.trim(), body: text.slice(match[0].length).trim() };
}

async function fetchEdition(
  edition: string,
  hadithNumber: number,
): Promise<ApiResponse | null> {
  const url = `${DATASET_BASE}/${edition}/${hadithNumber}.min.json`;

  let response: Response;
  try {
    response = await fetch(url, { cache: 'force-cache' });
  } catch (cause) {
    throw new HadithError(`Could not reach the hadith source: ${String(cause)}`);
  }

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new HadithError(`Hadith source responded ${response.status}`);
  }

  return (await response.json()) as ApiResponse;
}

/**
 * Fetches one hadith as a fully attributed block.
 *
 * Returns `null` when the hadith does not exist, or when its authenticity cannot be
 * established — the caller must treat that as "no evidence available", never as an
 * empty quotation.
 */
export async function fetchHadith(
  collectionSlug: string,
  hadithNumber: number,
  options: { includeArabic?: boolean } = {},
): Promise<HadithBlock | null> {
  const collection = getCollection(collectionSlug);
  if (!collection) {
    throw new HadithError(`Sabeel does not cite the collection "${collectionSlug}"`);
  }
  if (!Number.isInteger(hadithNumber) || hadithNumber < 1) {
    throw new HadithError(`"${hadithNumber}" is not a valid hadith number`);
  }

  const english = await fetchEdition(`eng-${collection.slug}`, hadithNumber);
  const entry = english?.hadiths[0];
  if (!entry) return null;

  const grades = entry.grades ?? [];
  const selected = selectGrading(grades);

  // The authenticity gate.
  let grading: HadithGrading;
  let gradedBy: string | undefined;

  if (selected) {
    grading = selected.grading;
    gradedBy = selected.gradedBy;
  } else if (collection.authenticByCollection && grades.length === 0) {
    // Sahih al-Bukhari and Sahih Muslim: authentic by the collection itself.
    grading = 'sahih';
  } else {
    // Either graded below hasan, or ungraded in a collection that requires a grading.
    return null;
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
      grading,
      gradedBy,
    },
  };
}
