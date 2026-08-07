/**
 * Recitation sources.
 *
 * Reciter ids are Quran.com recitation resource ids. Per-ayah audio paths returned by
 * the API are relative, so they are resolved against AUDIO_BASE (verified reachable
 * 2026-08-07 — see docs/SOURCES.md).
 */

export interface Reciter {
  readonly id: number;
  readonly name: string;
  readonly style?: string;
  readonly note: string;
}

export const RECITERS: readonly Reciter[] = [
  {
    id: 7,
    name: 'Mishari Rashid al-Afasy',
    note: 'Clear and measured. The most widely recognised recitation.',
  },
  {
    id: 6,
    name: 'Mahmoud Khalil Al-Husary',
    note: 'Deliberate and precise — often recommended for learning tajweed.',
  },
  {
    id: 12,
    name: 'Mahmoud Khalil Al-Husary',
    style: 'Muallim',
    note: 'The teaching recitation: slower, with each phrase given space.',
  },
  {
    id: 2,
    name: 'AbdulBaset AbdulSamad',
    style: 'Murattal',
    note: 'Steady, classical delivery.',
  },
  {
    id: 3,
    name: 'Abdur-Rahman as-Sudais',
    note: 'The Imam of the Haram in Makkah.',
  },
] as const;

export const DEFAULT_RECITER_ID = 7;

const AUDIO_BASE = 'https://verses.quran.com/';

export function getReciter(id: number): Reciter | undefined {
  return RECITERS.find((reciter) => reciter.id === id);
}

/** Narrows unvalidated input (a URL search param) to a reciter we actually offer. */
export function resolveReciterId(raw: string | undefined): number {
  if (!raw) return DEFAULT_RECITER_ID;
  const parsed = Number(raw);
  return getReciter(parsed) ? parsed : DEFAULT_RECITER_ID;
}

/** Display label, disambiguating the two Husary entries by style. */
export function reciterLabel(reciter: Reciter): string {
  return reciter.style ? `${reciter.name} (${reciter.style})` : reciter.name;
}

export function resolveAudioUrl(relativeOrAbsolute: string): string {
  if (/^https?:\/\//.test(relativeOrAbsolute)) return relativeOrAbsolute;
  return `${AUDIO_BASE}${relativeOrAbsolute.replace(/^\/+/, '')}`;
}

interface ApiAudioFile {
  verse_key: string;
  url: string;
}

/** One playable audio URL per ayah, indexed by ayah number. */
export async function fetchSurahAudio(
  surahNumber: number,
  reciterId: number = DEFAULT_RECITER_ID,
): Promise<readonly string[]> {
  const id = getReciter(reciterId) ? reciterId : DEFAULT_RECITER_ID;
  const url = `https://api.quran.com/api/v4/recitations/${id}/by_chapter/${surahNumber}?per_page=300`;

  const response = await fetch(url, { cache: 'force-cache' });
  if (!response.ok) {
    throw new Error(`Recitation source responded ${response.status}`);
  }

  const data = (await response.json()) as { audio_files: ApiAudioFile[] };

  return data.audio_files
    .slice()
    .sort((a, b) => ayahOf(a.verse_key) - ayahOf(b.verse_key))
    .map((file) => resolveAudioUrl(file.url));
}

function ayahOf(verseKey: string): number {
  return Number(verseKey.split(':')[1] ?? 0);
}
