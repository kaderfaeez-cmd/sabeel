import { describe, expect, test } from 'vitest';
import { PREF_COOKIE, PREF_STORAGE, resolvePreference } from './preferences';

const isValid = (value: number) => [20, 85, 84, 22, 19].includes(value);
const FALLBACK = 20;

describe('resolvePreference', () => {
  test('an explicit URL parameter wins, so a shared link shows what the sharer saw', () => {
    expect(resolvePreference('85', '84', isValid, FALLBACK)).toBe(85);
  });

  test('the saved preference is used when there is no URL parameter', () => {
    // This is the case that was broken: Settings saved a choice and the page ignored it.
    expect(resolvePreference(undefined, '85', isValid, FALLBACK)).toBe(85);
  });

  test('falls back to the default when neither is present', () => {
    expect(resolvePreference(undefined, undefined, isValid, FALLBACK)).toBe(FALLBACK);
  });

  test('a cookie is untrusted input and is validated like any other', () => {
    expect(resolvePreference(undefined, '999', isValid, FALLBACK)).toBe(FALLBACK);
    expect(resolvePreference(undefined, 'abc', isValid, FALLBACK)).toBe(FALLBACK);
    expect(resolvePreference(undefined, '../../etc/passwd', isValid, FALLBACK)).toBe(FALLBACK);
    expect(resolvePreference(undefined, '-20', isValid, FALLBACK)).toBe(FALLBACK);
  });

  test('an invalid URL parameter falls through to the cookie rather than to the default', () => {
    expect(resolvePreference('999', '85', isValid, FALLBACK)).toBe(85);
  });

  test('empty strings are ignored', () => {
    expect(resolvePreference('', '', isValid, FALLBACK)).toBe(FALLBACK);
  });
});

describe('key names stay in step', () => {
  test('cookie and storage keys are distinct and non-empty', () => {
    const names = [...Object.values(PREF_COOKIE), ...Object.values(PREF_STORAGE)];
    expect(new Set(names).size).toBe(names.length);
    for (const name of names) expect(name.trim()).not.toBe('');
  });
});
