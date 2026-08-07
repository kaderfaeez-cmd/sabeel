import { describe, expect, test } from 'vitest';
import {
  DEFAULT_TRANSLATION_ID,
  getTranslation,
  resolveTranslationId,
  TRANSLATIONS,
} from './translations';

describe('the curated translation set', () => {
  test('every translation credits a named translator (Constitution §3.1)', () => {
    for (const translation of TRANSLATIONS) {
      expect(translation.translator.trim()).not.toBe('');
      expect(translation.name.trim()).not.toBe('');
      expect(translation.note.trim()).not.toBe('');
    }
  });

  test('translation ids are unique', () => {
    const ids = TRANSLATIONS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('the default is one we actually offer', () => {
    expect(getTranslation(DEFAULT_TRANSLATION_ID)).toBeDefined();
  });

  test('returns undefined for an id we do not offer', () => {
    expect(getTranslation(999_999)).toBeUndefined();
  });
});

describe('resolveTranslationId', () => {
  // This is a trust boundary: the raw value comes from a URL search param.
  test('falls back to the default when absent', () => {
    expect(resolveTranslationId(undefined)).toBe(DEFAULT_TRANSLATION_ID);
  });

  test('falls back to the default for an empty string', () => {
    expect(resolveTranslationId('')).toBe(DEFAULT_TRANSLATION_ID);
  });

  test('accepts an id we offer', () => {
    expect(resolveTranslationId('85')).toBe(85);
  });

  test('rejects an id that exists upstream but is not curated', () => {
    // 95 is a real Quran.com resource, but not one Sabeel offers.
    expect(resolveTranslationId('95')).toBe(DEFAULT_TRANSLATION_ID);
  });

  test('rejects non-numeric and injected input', () => {
    expect(resolveTranslationId('abc')).toBe(DEFAULT_TRANSLATION_ID);
    expect(resolveTranslationId('20; DROP TABLE')).toBe(DEFAULT_TRANSLATION_ID);
    expect(resolveTranslationId('../../etc/passwd')).toBe(DEFAULT_TRANSLATION_ID);
  });

  test('rejects NaN-producing and negative values', () => {
    expect(resolveTranslationId('-20')).toBe(DEFAULT_TRANSLATION_ID);
    expect(resolveTranslationId('NaN')).toBe(DEFAULT_TRANSLATION_ID);
  });
});
