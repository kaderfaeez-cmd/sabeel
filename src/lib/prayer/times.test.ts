import { afterEach, describe, expect, test, vi } from 'vitest';
import {
  CALCULATION_METHODS,
  DEFAULT_METHOD_ID,
  fetchPrayerTimes,
  findCurrentAndNext,
  formatCountdown,
  normaliseTime,
  PRAYER_ARABIC,
  PRAYER_NAMES,
  PrayerTimesError,
  resolveMethodId,
  toMinutes,
  type PrayerTime,
} from './times';

const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});

const DAY: readonly PrayerTime[] = [
  { name: 'Fajr', time: '06:08' },
  { name: 'Dhuhr', time: '12:52' },
  { name: 'Asr', time: '15:48' },
  { name: 'Maghrib', time: '18:11' },
  { name: 'Isha', time: '19:31' },
];

describe('the prayer set', () => {
  test('has all five prayers with Arabic names', () => {
    expect(PRAYER_NAMES).toHaveLength(5);
    for (const name of PRAYER_NAMES) {
      expect(PRAYER_ARABIC[name]).toBeTruthy();
    }
  });

  test('offers several calculation methods, since none is the single correct one', () => {
    expect(CALCULATION_METHODS.length).toBeGreaterThan(3);
    const ids = CALCULATION_METHODS.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('normaliseTime', () => {
  test('pads single-digit hours', () => {
    expect(normaliseTime('6:08')).toBe('06:08');
  });

  test('strips a timezone suffix the source sometimes appends', () => {
    expect(normaliseTime('18:11 (SAST)')).toBe('18:11');
  });
});

describe('toMinutes', () => {
  test('converts to minutes since midnight', () => {
    expect(toMinutes('00:00')).toBe(0);
    expect(toMinutes('12:52')).toBe(772);
    expect(toMinutes('23:59')).toBe(1439);
  });
});

describe('findCurrentAndNext', () => {
  test('before Fajr, the next prayer is Fajr and none has begun', () => {
    const result = findCurrentAndNext(DAY, toMinutes('04:00'));

    expect(result.current).toBeNull();
    expect(result.next?.name).toBe('Fajr');
    expect(result.minutesUntilNext).toBe(toMinutes('06:08') - toMinutes('04:00'));
  });

  test('between prayers, reports the one that has begun and the one coming', () => {
    const result = findCurrentAndNext(DAY, toMinutes('13:00'));

    expect(result.current?.name).toBe('Dhuhr');
    expect(result.next?.name).toBe('Asr');
  });

  test('exactly at a prayer time, that prayer has begun', () => {
    const result = findCurrentAndNext(DAY, toMinutes('15:48'));

    expect(result.current?.name).toBe('Asr');
    expect(result.next?.name).toBe('Maghrib');
  });

  test('after Isha, the next prayer is tomorrow Fajr and the countdown wraps midnight', () => {
    // This is the case a naive implementation gets wrong, showing a negative countdown.
    const result = findCurrentAndNext(DAY, toMinutes('22:00'));

    expect(result.current?.name).toBe('Isha');
    expect(result.next?.name).toBe('Fajr');
    expect(result.minutesUntilNext).toBe(24 * 60 - toMinutes('22:00') + toMinutes('06:08'));
    expect(result.minutesUntilNext!).toBeGreaterThan(0);
  });

  test('handles times given out of order', () => {
    const shuffled = [DAY[3]!, DAY[0]!, DAY[4]!, DAY[1]!, DAY[2]!];
    const result = findCurrentAndNext(shuffled, toMinutes('13:00'));

    expect(result.current?.name).toBe('Dhuhr');
    expect(result.next?.name).toBe('Asr');
  });
});

describe('formatCountdown', () => {
  test('reads naturally at each scale', () => {
    expect(formatCountdown(0)).toBe('now');
    expect(formatCountdown(-5)).toBe('now');
    expect(formatCountdown(45)).toBe('in 45 min');
    expect(formatCountdown(120)).toBe('in 2 hr');
    expect(formatCountdown(95)).toBe('in 1 hr 35 min');
  });
});

describe('resolveMethodId', () => {
  test('accepts a method we offer', () => {
    expect(resolveMethodId(2)).toBe(2);
  });

  test('falls back for unknown, absent and hostile input', () => {
    expect(resolveMethodId(undefined)).toBe(DEFAULT_METHOD_ID);
    expect(resolveMethodId(999)).toBe(DEFAULT_METHOD_ID);
    expect(resolveMethodId('../../etc/passwd')).toBe(DEFAULT_METHOD_ID);
  });
});

describe('fetchPrayerTimes', () => {
  test('rejects impossible coordinates before making a request', async () => {
    const spy = vi.fn();
    globalThis.fetch = spy as unknown as typeof fetch;

    await expect(fetchPrayerTimes(91, 0)).rejects.toThrow(PrayerTimesError);
    await expect(fetchPrayerTimes(0, 181)).rejects.toThrow(PrayerTimesError);
    await expect(fetchPrayerTimes(Number.NaN, 0)).rejects.toThrow(PrayerTimesError);
    expect(spy).not.toHaveBeenCalled();
  });

  test('returns all five prayers with the method credited', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          timings: {
            Fajr: '06:08',
            Sunrise: '07:20',
            Dhuhr: '12:52',
            Asr: '15:48',
            Maghrib: '18:11',
            Isha: '19:31',
          },
          date: { readable: '07 Aug 2026', hijri: { day: '23', month: { en: 'Safar' }, year: '1448' } },
          meta: { timezone: 'Africa/Johannesburg', method: { name: 'Muslim World League' } },
        },
      }),
    }) as unknown as typeof fetch;

    const day = await fetchPrayerTimes(-33.9249, 18.4241, 3);

    expect(day.timings).toHaveLength(5);
    expect(day.timings.map((t) => t.name)).toEqual([...PRAYER_NAMES]);
    expect(day.methodName).toBe('Muslim World League');
    expect(day.hijriDate).toContain('Safar');
    // Sunrise is not a prayer and must not appear.
    expect(day.timings.some((t) => (t.name as string) === 'Sunrise')).toBe(false);
  });

  test('raises rather than rendering a partial day when a prayer is missing', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ data: { timings: { Fajr: '06:08' } } }),
    }) as unknown as typeof fetch;

    await expect(fetchPrayerTimes(0, 0)).rejects.toThrow(/did not return a time for/);
  });

  test('raises a typed error on a non-OK response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({}),
    }) as unknown as typeof fetch;

    await expect(fetchPrayerTimes(0, 0)).rejects.toThrow(PrayerTimesError);
  });

  test('raises a typed error when the source is unreachable', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('offline')) as unknown as typeof fetch;

    await expect(fetchPrayerTimes(0, 0)).rejects.toThrow(/Could not reach the prayer times source/);
  });
});
