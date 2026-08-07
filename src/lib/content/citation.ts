import type { ContentKind, ContentSource, HadithGrading } from './types';

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
  history: 'Historical context',
  summary: 'Sabeel — educational summary',
};

/** e.g. "2:255" or "18:60–82". */
export function formatAyahRange(surah: number, from: number, to: number): string {
  return from === to ? `${surah}:${from}` : `${surah}:${from}–${to}`;
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
 */
export function isPrimarySource(kind: ContentKind): boolean {
  return kind === 'quran' || kind === 'hadith';
}
