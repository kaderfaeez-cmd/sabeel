import { DEFAULT_TRANSLATION_ID, getTranslation } from './translations';

/**
 * Quran search, backed by Quran.com's index.
 *
 * Results carry the match highlighting the API returns. That markup is NOT rendered as
 * HTML — it is parsed into plain segments here, so no third-party string is ever passed
 * to dangerouslySetInnerHTML.
 */

export interface SearchSegment {
  readonly text: string;
  readonly match: boolean;
}

export interface SearchResult {
  readonly surah: number;
  readonly ayah: number;
  readonly arabic: string;
  /** Translation split into plain segments, with matched runs flagged. */
  readonly segments: readonly SearchSegment[];
  readonly translatorName: string;
}

export interface SearchResponse {
  readonly query: string;
  readonly totalResults: number;
  readonly results: readonly SearchResult[];
}

export const MAX_QUERY_LENGTH = 100;
const PAGE_SIZE = 20;

/**
 * Splits the API's `<em>`-marked translation into safe segments.
 *
 * Any tag other than `<em>`/`</em>` is stripped rather than trusted, and no markup is
 * ever reconstructed for rendering.
 */
export function parseHighlighted(html: string): readonly SearchSegment[] {
  const segments: SearchSegment[] = [];
  const pattern = /<em>([\s\S]*?)<\/em>/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  const strip = (value: string) => value.replace(/<[^>]*>/g, '');

  while ((match = pattern.exec(html)) !== null) {
    if (match.index > lastIndex) {
      const plain = strip(html.slice(lastIndex, match.index));
      if (plain) segments.push({ text: plain, match: false });
    }
    const inner = strip(match[1] ?? '');
    if (inner) segments.push({ text: inner, match: true });
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < html.length) {
    const plain = strip(html.slice(lastIndex));
    if (plain) segments.push({ text: plain, match: false });
  }

  return segments;
}

function parseVerseKey(key: string): { surah: number; ayah: number } | null {
  const [surahRaw, ayahRaw] = key.split(':');
  const surah = Number(surahRaw);
  const ayah = Number(ayahRaw);
  if (!Number.isInteger(surah) || !Number.isInteger(ayah)) return null;
  return { surah, ayah };
}

interface ApiSearchResult {
  verse_key: string;
  text: string;
  translations?: { text: string; resource_id: number; name: string }[];
}

export async function searchQuran(
  rawQuery: string,
  translationId: number = DEFAULT_TRANSLATION_ID,
): Promise<SearchResponse> {
  const query = rawQuery.trim().slice(0, MAX_QUERY_LENGTH);
  if (query === '') {
    return { query: '', totalResults: 0, results: [] };
  }

  const translation = getTranslation(translationId) ?? getTranslation(DEFAULT_TRANSLATION_ID);
  const url = new URL('https://api.quran.com/api/v4/search');
  url.searchParams.set('q', query);
  url.searchParams.set('size', String(PAGE_SIZE));
  url.searchParams.set('language', 'en');
  if (translation) url.searchParams.set('translations', String(translation.id));

  const response = await fetch(url, { next: { revalidate: 3600 } });
  if (!response.ok) {
    throw new Error(`Search is unavailable (${response.status})`);
  }

  const data = (await response.json()) as {
    search: { total_results: number; results: ApiSearchResult[] };
  };

  const results = data.search.results.flatMap((item): SearchResult[] => {
    const reference = parseVerseKey(item.verse_key);
    if (!reference) return [];

    const rendered = item.translations?.[0];

    return [
      {
        surah: reference.surah,
        ayah: reference.ayah,
        arabic: item.text,
        segments: parseHighlighted(rendered?.text ?? ''),
        translatorName: rendered?.name ?? translation?.translator ?? 'Unknown',
      },
    ];
  });

  return { query, totalResults: data.search.total_results, results };
}
