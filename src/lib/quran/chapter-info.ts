import type { ScholarlyBlock } from '@/lib/content/types';

/**
 * What a surah is about, from a named scholarly source.
 *
 * Quran.com serves chapter introductions from Sayyid Abul A'la Maududi's *Tafhim
 * al-Qur'an*. That is a named author and a named work, so it satisfies Constitution §3.2
 * — it renders as a `scholarly` block with the author credited, never as revelation and
 * never as Sabeel's own voice.
 *
 * Where the source is missing or unreachable, nothing is shown. A surah page without an
 * introduction is fine; an unattributed introduction is not.
 */

const API_BASE = 'https://api.quran.com/api/v4';

interface ApiChapterInfo {
  chapter_info?: {
    text?: string;
    short_text?: string;
    source?: string;
  };
}

/** Strips the HTML the API returns and normalises whitespace. */
export function toPlainText(html: string): string {
  return html
    .replace(/<\/(p|div|h[1-6]|li)>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, '’')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * The introduction is long — several thousand words for some surahs. Take the opening
 * paragraphs, which carry the name and the period of revelation, and stop at a sentence
 * boundary so it never ends mid-thought.
 */
export function condense(text: string, maxChars = 900): string {
  if (text.length <= maxChars) return text;

  const cut = text.slice(0, maxChars);
  const lastStop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('.\n'));
  return lastStop > maxChars * 0.5 ? cut.slice(0, lastStop + 1) : `${cut.trimEnd()}…`;
}

/** Splits the source string into an author and a work where it follows "Author - Work". */
export function splitSource(source: string): { author: string; work: string } {
  const parts = source.split(' - ').map((p) => p.trim());
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return { author: parts[0], work: parts.slice(1).join(' — ') };
  }
  return { author: source.trim(), work: source.trim() };
}

export async function fetchChapterInfo(
  surahNumber: number,
): Promise<ScholarlyBlock | null> {
  if (!Number.isInteger(surahNumber) || surahNumber < 1 || surahNumber > 114) return null;

  let response: Response;
  try {
    response = await fetch(`${API_BASE}/chapters/${surahNumber}/info?language=en`, {
      cache: 'force-cache',
    });
  } catch {
    return null;
  }

  if (!response.ok) return null;

  const data = (await response.json()) as ApiChapterInfo;
  const info = data.chapter_info;
  const raw = info?.text ?? info?.short_text;

  // No source means no attribution, which means it cannot be shown at all.
  if (!raw || !info?.source) return null;

  const text = condense(toPlainText(raw));
  if (text.length < 40) return null;

  const { author, work } = splitSource(info.source);

  return {
    kind: 'scholarly',
    id: `chapter-info-${surahNumber}`,
    text,
    source: { kind: 'scholarly', author, work },
  };
}
