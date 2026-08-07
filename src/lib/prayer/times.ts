/**
 * Prayer times.
 *
 * Constitution §7: the Adhan NEVER plays on its own. Some users live in households where
 * an audible religious reminder creates real difficulty. The default is a quiet visual
 * notice; audio is opt-in from Settings only. Nothing in this module can produce sound.
 */

export const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
export type PrayerName = (typeof PRAYER_NAMES)[number];

export const PRAYER_ARABIC: Record<PrayerName, string> = {
  Fajr: 'الفجر',
  Dhuhr: 'الظهر',
  Asr: 'العصر',
  Maghrib: 'المغرب',
  Isha: 'العشاء',
};

/** Calculation methods differ by region; there is no single correct one. */
export interface CalculationMethod {
  readonly id: number;
  readonly name: string;
  readonly note: string;
}

export const CALCULATION_METHODS: readonly CalculationMethod[] = [
  { id: 3, name: 'Muslim World League', note: 'Widely used across Europe and much of the world.' },
  { id: 2, name: 'ISNA', note: 'Common in North America.' },
  { id: 5, name: 'Egyptian General Authority', note: 'Common in Africa and the Levant.' },
  { id: 4, name: 'Umm al-Qura, Makkah', note: 'Used in Saudi Arabia.' },
  { id: 1, name: 'University of Islamic Sciences, Karachi', note: 'Common in South Asia.' },
  { id: 8, name: 'Gulf Region', note: 'Used across the Gulf states.' },
  { id: 12, name: 'Union des Organisations Islamiques de France', note: 'Used in France.' },
  { id: 13, name: 'Diyanet, Turkey', note: 'Used in Turkey.' },
] as const;

export const DEFAULT_METHOD_ID = 3;

export interface PrayerTime {
  readonly name: PrayerName;
  /** 24-hour "HH:MM" as returned by the source. */
  readonly time: string;
}

export interface PrayerDay {
  readonly timings: readonly PrayerTime[];
  readonly gregorianDate: string;
  readonly hijriDate: string;
  readonly timezone: string;
  readonly methodName: string;
}

export class PrayerTimesError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PrayerTimesError';
  }
}

interface ApiResponse {
  data?: {
    timings?: Record<string, string>;
    date?: {
      readable?: string;
      hijri?: { date?: string; month?: { en?: string }; year?: string; day?: string };
    };
    meta?: { timezone?: string; method?: { name?: string } };
  };
}

/** The API returns times with a timezone suffix on some endpoints; strip it. */
export function normaliseTime(raw: string): string {
  const match = /^(\d{1,2}):(\d{2})/.exec(raw.trim());
  if (!match) return raw.trim();
  return `${match[1]!.padStart(2, '0')}:${match[2]}`;
}

/** Minutes since midnight, for ordering and countdown maths. */
export function toMinutes(time: string): number {
  const [h, m] = normaliseTime(time).split(':').map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

/**
 * Which prayer is next, given the current time in minutes since midnight.
 * Returns `null` for `current` when the day's prayers have not yet begun.
 */
export function findCurrentAndNext(
  timings: readonly PrayerTime[],
  nowMinutes: number,
): { current: PrayerTime | null; next: PrayerTime | null; minutesUntilNext: number | null } {
  const sorted = [...timings].sort((a, b) => toMinutes(a.time) - toMinutes(b.time));

  let current: PrayerTime | null = null;
  let next: PrayerTime | null = null;

  for (const prayer of sorted) {
    if (toMinutes(prayer.time) <= nowMinutes) current = prayer;
    else if (next === null) next = prayer;
  }

  // After Isha, the next prayer is tomorrow's Fajr.
  const minutesUntilNext =
    next !== null
      ? toMinutes(next.time) - nowMinutes
      : sorted[0]
        ? 24 * 60 - nowMinutes + toMinutes(sorted[0].time)
        : null;

  return { current, next: next ?? sorted[0] ?? null, minutesUntilNext };
}

export function formatCountdown(minutes: number): string {
  if (minutes <= 0) return 'now';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `in ${mins} min`;
  if (mins === 0) return `in ${hours} hr`;
  return `in ${hours} hr ${mins} min`;
}

export function resolveMethodId(raw: string | number | undefined): number {
  const parsed = Number(raw);
  return CALCULATION_METHODS.some((m) => m.id === parsed) ? parsed : DEFAULT_METHOD_ID;
}

export async function fetchPrayerTimes(
  latitude: number,
  longitude: number,
  methodId: number = DEFAULT_METHOD_ID,
): Promise<PrayerDay> {
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw new PrayerTimesError('That latitude is not valid.');
  }
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new PrayerTimesError('That longitude is not valid.');
  }

  const method = resolveMethodId(methodId);
  const url = new URL('https://api.aladhan.com/v1/timings');
  url.searchParams.set('latitude', String(latitude));
  url.searchParams.set('longitude', String(longitude));
  url.searchParams.set('method', String(method));

  let response: Response;
  try {
    response = await fetch(url);
  } catch (cause) {
    throw new PrayerTimesError(`Could not reach the prayer times source: ${String(cause)}`);
  }

  if (!response.ok) {
    throw new PrayerTimesError(`Prayer times source responded ${response.status}`);
  }

  const body = (await response.json()) as ApiResponse;
  const timings = body.data?.timings;
  if (!timings) throw new PrayerTimesError('The prayer times source returned no timings.');

  const parsed: PrayerTime[] = [];
  for (const name of PRAYER_NAMES) {
    const raw = timings[name];
    if (!raw) throw new PrayerTimesError(`The source did not return a time for ${name}.`);
    parsed.push({ name, time: normaliseTime(raw) });
  }

  const hijri = body.data?.date?.hijri;

  return {
    timings: parsed,
    gregorianDate: body.data?.date?.readable ?? '',
    hijriDate: hijri ? `${hijri.day} ${hijri.month?.en ?? ''} ${hijri.year}` .trim() : '',
    timezone: body.data?.meta?.timezone ?? '',
    methodName:
      body.data?.meta?.method?.name ??
      CALCULATION_METHODS.find((m) => m.id === method)?.name ??
      'Unknown method',
  };
}
