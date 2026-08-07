import type { QuranBlock } from '@/lib/content/types';
import { getSurah, isValidReference } from './surahs';
import {
  DEFAULT_TRANSLATION_ID,
  getTranslation,
  TRANSLITERATION_ID,
} from './translations';

/**
 * Quran.com API v4 client.
 *
 * Every function here returns fully-attributed `QuranBlock`s rather than raw API shapes,
 * so downstream code cannot accidentally render a verse without its source
 * (Constitution §3.1).
 */

const API_BASE = 'https://api.quran.com/api/v4';

/** Revelation is immutable, so a fetched ayah never needs revalidating. */
const IMMUTABLE_CACHE: RequestInit = { cache: 'force-cache' };

export class QuranApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'QuranApiError';
  }
}

interface ApiVerse {
  id: number;
  verse_key: string;
  verse_number: number;
  text_uthmani?: string;
  translations?: { resource_id: number; text: string }[];
}

/** The API returns translations containing footnote markup; strip it for plain rendering. */
export function stripFootnotes(html: string): string {
  return html
    // [\s\S] rather than the `s` flag, which needs an ES2018 target.
    .replace(/<sup[^>]*foot_note[^>]*>[\s\S]*?<\/sup>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function request<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = new URL(`${API_BASE}${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  let response: Response;
  try {
    response = await fetch(url, IMMUTABLE_CACHE);
  } catch (cause) {
    // Never swallow: the caller decides whether to fall back to cached/offline data.
    throw new QuranApiError(`Could not reach the Quran source: ${String(cause)}`);
  }

  if (!response.ok) {
    throw new QuranApiError(
      `Quran source responded ${response.status}`,
      response.status,
    );
  }

  return (await response.json()) as T;
}

/**
 * Fetches a whole surah as attributed content blocks.
 *
 * @param surahNumber 1–114
 * @param translationId a curated translation id; unknown ids fall back to the default
 */
export async function fetchSurahVerses(
  surahNumber: number,
  translationId: number = DEFAULT_TRANSLATION_ID,
  options: { includeTransliteration?: boolean } = {},
): Promise<readonly QuranBlock[]> {
  const surah = getSurah(surahNumber);
  if (!surah) {
    throw new QuranApiError(`Surah ${surahNumber} does not exist`);
  }

  const translation = getTranslation(translationId) ?? getTranslation(DEFAULT_TRANSLATION_ID);
  if (!translation) {
    throw new QuranApiError('No translation is configured');
  }

  const resources = options.includeTransliteration
    ? `${translation.id},${TRANSLITERATION_ID}`
    : `${translation.id}`;

  const data = await request<{ verses: ApiVerse[] }>(`/verses/by_chapter/${surahNumber}`, {
    fields: 'text_uthmani',
    translations: resources,
    per_page: String(surah.ayahCount),
    words: 'false',
  });

  return data.verses.map((verse) => toBlock(verse, surahNumber, translation.id, translation.translator));
}

/** Fetches a single ayah — used for citations embedded in lessons and stories. */
export async function fetchAyah(
  surahNumber: number,
  ayahNumber: number,
  translationId: number = DEFAULT_TRANSLATION_ID,
): Promise<QuranBlock> {
  if (!isValidReference(surahNumber, ayahNumber)) {
    throw new QuranApiError(`Quran ${surahNumber}:${ayahNumber} is not a valid reference`);
  }

  const translation = getTranslation(translationId) ?? getTranslation(DEFAULT_TRANSLATION_ID);
  if (!translation) {
    throw new QuranApiError('No translation is configured');
  }

  const data = await request<{ verse: ApiVerse }>(
    `/verses/by_key/${surahNumber}:${ayahNumber}`,
    { fields: 'text_uthmani', translations: String(translation.id) },
  );

  return toBlock(data.verse, surahNumber, translation.id, translation.translator);
}

function toBlock(
  verse: ApiVerse,
  surahNumber: number,
  translationId: number,
  translatorName: string,
): QuranBlock {
  const main = verse.translations?.find((t) => t.resource_id === translationId);
  const translit = verse.translations?.find((t) => t.resource_id === TRANSLITERATION_ID);

  return {
    kind: 'quran',
    id: `quran-${surahNumber}-${verse.verse_number}`,
    arabic: verse.text_uthmani ?? '',
    transliteration: translit ? stripFootnotes(translit.text) : undefined,
    translation: main ? stripFootnotes(main.text) : '',
    source: {
      kind: 'quran',
      surah: surahNumber,
      ayahFrom: verse.verse_number,
      ayahTo: verse.verse_number,
      translationId,
      translatorName,
    },
  };
}
