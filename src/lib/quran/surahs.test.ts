import { describe, expect, test } from 'vitest';
import {
  getSurah,
  isValidReference,
  searchSurahs,
  SURAHS,
  TOTAL_AYAHS,
  TOTAL_SURAHS,
} from './surahs';

describe('the baked Quran index', () => {
  test('contains exactly 114 surahs', () => {
    expect(SURAHS).toHaveLength(TOTAL_SURAHS);
  });

  test('contains exactly 6236 ayahs in total', () => {
    const total = SURAHS.reduce((sum, surah) => sum + surah.ayahCount, 0);
    expect(total).toBe(TOTAL_AYAHS);
  });

  test('is ordered by surah number with no gaps', () => {
    SURAHS.forEach((surah, index) => {
      expect(surah.number).toBe(index + 1);
    });
  });

  test('opens with Al-Fatihah and closes with An-Nas', () => {
    expect(getSurah(1)?.name).toBe('Al-Fatihah');
    expect(getSurah(114)?.name).toBe('An-Nas');
  });

  test('records the two surahs not preceded by Bismillah', () => {
    // Al-Fatihah contains it as an ayah; At-Tawbah has none.
    expect(getSurah(1)?.hasBismillah).toBe(false);
    expect(getSurah(9)?.hasBismillah).toBe(false);
    expect(getSurah(2)?.hasBismillah).toBe(true);
  });

  test('every surah carries a name, Arabic name and meaning', () => {
    for (const surah of SURAHS) {
      expect(surah.name).toBeTruthy();
      expect(surah.nameArabic).toBeTruthy();
      expect(surah.meaning).toBeTruthy();
      expect(surah.ayahCount).toBeGreaterThan(0);
    }
  });

  test('returns undefined outside 1..114', () => {
    expect(getSurah(0)).toBeUndefined();
    expect(getSurah(115)).toBeUndefined();
  });
});

describe('isValidReference', () => {
  test('accepts the last ayah of a surah', () => {
    expect(isValidReference(2, 286)).toBe(true);
  });

  test('rejects one past the last ayah', () => {
    expect(isValidReference(2, 287)).toBe(false);
  });

  test('rejects ayah zero, negatives and fractions', () => {
    expect(isValidReference(2, 0)).toBe(false);
    expect(isValidReference(2, -1)).toBe(false);
    expect(isValidReference(2, 1.5)).toBe(false);
  });

  test('rejects a surah that does not exist', () => {
    expect(isValidReference(115, 1)).toBe(false);
  });
});

describe('searchSurahs', () => {
  test('returns everything for an empty query', () => {
    expect(searchSurahs('   ')).toHaveLength(TOTAL_SURAHS);
  });

  test('jumps straight to a surah when given its number', () => {
    const results = searchSurahs('36');
    expect(results).toHaveLength(1);
    expect(results[0]?.name).toBe('Ya-Sin');
  });

  test('matches on name, case-insensitively', () => {
    expect(searchSurahs('baqarah')[0]?.number).toBe(2);
  });

  test('matches on the English meaning', () => {
    const results = searchSurahs('The Cave');
    expect(results.some((surah) => surah.number === 18)).toBe(true);
  });

  test('returns nothing for a query that matches nothing', () => {
    expect(searchSurahs('zzzzzz')).toHaveLength(0);
  });

  test('treats an out-of-range number as text, not a lookup', () => {
    expect(searchSurahs('999')).toHaveLength(0);
  });
});
