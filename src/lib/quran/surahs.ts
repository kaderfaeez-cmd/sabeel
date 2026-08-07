import surahData from '@/data/surahs.json';

/**
 * The Quran's structure, baked into the bundle by scripts/generate-surah-index.mjs.
 * It never changes, so it is never fetched.
 */

export interface Surah {
  readonly number: number;
  readonly name: string;
  readonly nameArabic: string;
  readonly meaning: string;
  readonly ayahCount: number;
  readonly revelationPlace: 'makkah' | 'madinah';
  readonly revelationOrder: number;
  readonly hasBismillah: boolean;
}

export const SURAHS: readonly Surah[] = surahData as readonly Surah[];

export const TOTAL_SURAHS = 114;
export const TOTAL_AYAHS = 6236;

export function getSurah(number: number): Surah | undefined {
  return SURAHS[number - 1];
}

/** Whether a surah:ayah pair actually exists. Used to reject bad input at the boundary. */
export function isValidReference(surah: number, ayah: number): boolean {
  const found = getSurah(surah);
  return found !== undefined && Number.isInteger(ayah) && ayah >= 1 && ayah <= found.ayahCount;
}

export function searchSurahs(query: string): readonly Surah[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return SURAHS;

  // A bare number is almost always someone jumping to a surah by index.
  const asNumber = Number(trimmed);
  if (Number.isInteger(asNumber) && asNumber >= 1 && asNumber <= TOTAL_SURAHS) {
    const surah = getSurah(asNumber);
    return surah ? [surah] : [];
  }

  return SURAHS.filter(
    (surah) =>
      surah.name.toLowerCase().includes(trimmed) ||
      surah.meaning.toLowerCase().includes(trimmed) ||
      surah.nameArabic.includes(trimmed),
  );
}
