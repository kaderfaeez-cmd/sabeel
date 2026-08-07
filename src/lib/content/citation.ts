import { MADHHAB_LABEL, type ContentKind, type ContentSource, type HadithGrading } from './types';

/**
 * Turns a source into the citation a reader can actually verify against the printed
 * work. Constitution §3.1: "every citation shown to a user must be independently
 * checkable".
 */

/** Compile-time guarantee that every source kind is handled. */
function assertNever(value: never): never {
  throw new Error(`Unhandled content source: ${JSON.stringify(value)}`);
}

export const GRADING_LABEL: Record<HadithGrading, string> = {
  sahih: 'Sahih',
  hasan: 'Hasan',
  'sahih-li-ghayrihi': 'Sahih li-ghayrihi',
  'hasan-li-ghayrihi': 'Hasan li-ghayrihi',
  mutawatir: 'Mutawatir',
};

/** The label shown on the block itself, so the reader always knows what kind it is (§4). */
export const KIND_LABEL: Record<ContentKind, string> = {
  quran: 'Quran',
  hadith: 'Hadith',
  tafsir: 'Tafsir',
  athar: 'Statement of a Companion',
  ijma: 'Reported scholarly consensus',
  scholarly: 'Scholarly explanation',
  history: 'Historical context',
  summary: 'Sabeel — educational summary',
};

/** e.g. "2:255" or "18:60–82". */
export function formatAyahRange(surah: number, from: number, to: number): string {
  return from === to ? `${surah}:${from}` : `${surah}:${from}–${to}`;
}

/**
 * The locator alone, without the grading.
 *
 * Used where authenticity is displayed as its own field, so the grading is not stated
 * twice. `formatCitation` remains the complete one-line citation, used when a reference
 * travels on its own — copied text, share targets, exports.
 */
export function formatReference(source: ContentSource): string {
  if (source.kind !== 'hadith') return formatCitation(source);

  const book = source.bookName
    ? `, Book ${source.bookNumber ?? '?'}: ${source.bookName}`
    : '';
  return `${source.collectionName}${book}, Hadith ${source.hadithNumber}`;
}

export function formatCitation(source: ContentSource): string {
  switch (source.kind) {
    case 'quran': {
      const ref = formatAyahRange(source.surah, source.ayahFrom, source.ayahTo);
      return `Quran ${ref} — translation by ${source.translatorName}`;
    }

    case 'hadith': {
      const book = source.bookName
        ? `, Book ${source.bookNumber ?? '?'}: ${source.bookName}`
        : '';
      const grading = GRADING_LABEL[source.grading];
      const gradedBy = source.gradedBy ? ` (graded by ${source.gradedBy})` : '';
      return `${source.collectionName}${book}, Hadith ${source.hadithNumber} — ${grading}${gradedBy}`;
    }

    case 'tafsir':
      return `${source.work} by ${source.author}, on Quran ${source.onAyah.surah}:${source.onAyah.ayah}`;

    case 'athar':
      return `Statement of ${source.companion} — ${source.work}, ${source.locator}`;

    case 'ijma':
      return `Consensus reported by ${source.reportedBy} — ${source.work}${
        source.locator ? `, ${source.locator}` : ''
      }`;

    case 'scholarly':
      return `${source.author}, ${source.work}${source.locator ? `, ${source.locator}` : ''}${
        source.madhhab ? ` (${MADHHAB_LABEL[source.madhhab]} school)` : ''
      }`;

    case 'history':
      return `${source.work} by ${source.author}`;

    case 'editorial':
      return `Written by Sabeel for this platform · reviewed ${source.reviewedOn}`;

    default:
      return assertNever(source);
  }
}

/**
 * True when the block is revelation or narration rather than commentary or our own
 * words. Used to give the two highest tiers of the source hierarchy (Constitution §3.2)
 * a visually weightier treatment.
 *
 * A Companion's statement is deliberately NOT primary: it is evidence of a different
 * weight and must never be presented as a Prophetic narration.
 */
export function isPrimarySource(kind: ContentKind): boolean {
  return kind === 'quran' || kind === 'hadith';
}
