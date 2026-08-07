import namesData from '@/data/names.json';

/**
 * The 99 Names of Allah — al-Asmāʼ al-Ḥusnā.
 *
 * Baked into the bundle by scripts/generate-names.mjs from AlAdhan, so no Arabic here
 * was written by hand. The script asserts there are exactly 99 and that they are
 * numbered 1–99 without gaps.
 */

export interface DivineName {
  readonly number: number;
  readonly arabic: string;
  readonly transliteration: string;
  readonly meaning: string;
}

export const NAMES: readonly DivineName[] = namesData as readonly DivineName[];

export const TOTAL_NAMES = 99;

export function getName(number: number): DivineName | undefined {
  return NAMES[number - 1];
}

export function searchNames(query: string): readonly DivineName[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return NAMES;

  const asNumber = Number(trimmed);
  if (Number.isInteger(asNumber) && asNumber >= 1 && asNumber <= TOTAL_NAMES) {
    const found = getName(asNumber);
    return found ? [found] : [];
  }

  return NAMES.filter(
    (name) =>
      name.transliteration.toLowerCase().includes(trimmed) ||
      name.meaning.toLowerCase().includes(trimmed) ||
      name.arabic.includes(trimmed),
  );
}
