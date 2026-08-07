import { describe, expect, test } from 'vitest';
import { getName, NAMES, searchNames, TOTAL_NAMES } from './names';

describe('the baked list of names', () => {
  test('contains exactly 99', () => {
    expect(NAMES).toHaveLength(TOTAL_NAMES);
  });

  test('is numbered 1 to 99 with no gaps', () => {
    NAMES.forEach((name, index) => {
      expect(name.number).toBe(index + 1);
    });
  });

  test('every name has Arabic, a transliteration and a meaning', () => {
    for (const name of NAMES) {
      expect(name.arabic.trim(), `#${name.number}`).not.toBe('');
      expect(name.transliteration.trim(), `#${name.number}`).not.toBe('');
      expect(name.meaning.trim(), `#${name.number}`).not.toBe('');
    }
  });

  test('every Arabic field actually contains Arabic', () => {
    // Guards against a placeholder or a mojibake round-trip slipping into the data.
    for (const name of NAMES) {
      expect(/[؀-ۿ]/.test(name.arabic), `#${name.number}: ${name.arabic}`).toBe(true);
    }
  });

  test('opens with Ar-Rahmaan', () => {
    expect(getName(1)?.transliteration).toBe('Ar Rahmaan');
  });

  test('returns undefined outside 1..99', () => {
    expect(getName(0)).toBeUndefined();
    expect(getName(100)).toBeUndefined();
  });
});

describe('searchNames', () => {
  test('returns everything for an empty query', () => {
    expect(searchNames('   ')).toHaveLength(TOTAL_NAMES);
  });

  test('jumps straight to a name given its number', () => {
    const results = searchNames('55');
    expect(results).toHaveLength(1);
    expect(results[0]?.number).toBe(55);
  });

  test('matches on meaning, case-insensitively', () => {
    expect(searchNames('merciful').length).toBeGreaterThan(0);
  });

  test('matches on transliteration', () => {
    expect(searchNames('rahmaan').some((n) => n.number === 1)).toBe(true);
  });

  test('returns nothing for a query that matches nothing', () => {
    expect(searchNames('zzzzzz')).toHaveLength(0);
  });

  test('treats an out-of-range number as text, not a lookup', () => {
    expect(searchNames('999')).toHaveLength(0);
  });
});
