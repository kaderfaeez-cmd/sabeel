'use client';

import { MapPin, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocalStorageObject } from '@/lib/hooks/use-local-storage';
import {
  CALCULATION_METHODS,
  DEFAULT_METHOD_ID,
  fetchPrayerTimes,
  findCurrentAndNext,
  formatCountdown,
  PRAYER_ARABIC,
  type PrayerDay,
} from '@/lib/prayer/times';

const STORAGE_KEY = 'sabeel:prayer-location';

interface StoredLocation {
  readonly latitude: number;
  readonly longitude: number;
  readonly label: string;
  readonly methodId: number;
}

/**
 * Prayer times.
 *
 * Location is asked for, never taken silently, and is stored only on this device.
 * There is no audio anywhere in this component — Constitution §7 makes the Adhan
 * opt-in from Settings, and a quiet visual notice the default.
 */
export function PrayerTimesPanel() {
  const [location, setLocation] = useLocalStorageObject<StoredLocation>(STORAGE_KEY);
  const [day, setDay] = useState<PrayerDay | null>(null);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nowMinutes, setNowMinutes] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setNowMinutes(now.getHours() * 60 + now.getMinutes());
    };
    tick();
    const timer = setInterval(tick, 30_000);
    return () => clearInterval(timer);
  }, []);

  /**
   * Fetch on location change. Nothing is set synchronously here — the first state write
   * happens after the network call resolves, so this is a genuine side effect rather
   * than state mirroring.
   */
  useEffect(() => {
    if (!location) return;

    let cancelled = false;
    const { latitude, longitude, methodId } = location;

    fetchPrayerTimes(latitude, longitude, methodId)
      .then((result) => {
        if (cancelled) return;
        setDay(result);
        setError(null);
      })
      .catch((cause: unknown) => {
        if (cancelled) return;
        setDay(null);
        setError(cause instanceof Error ? cause.message : 'Could not load prayer times.');
      });

    return () => {
      cancelled = true;
    };
  }, [location]);

  function persist(next: StoredLocation) {
    setLocation(next);
  }

  function requestLocation() {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setLocating(false);
      setError('This browser cannot provide your location. You can still choose a city below.');
      return;
    }

    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) =>
        persist({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          label: 'Your location',
          methodId: location?.methodId ?? DEFAULT_METHOD_ID,
        }),
      () => {
        setLocating(false);
        setError('Location permission was declined. You can choose a city below instead.');
      },
      { timeout: 15_000 },
    );
  }

  const schedule =
    day && nowMinutes !== null ? findCurrentAndNext(day.timings, nowMinutes) : null;

  return (
    <div className="mt-10">
      {!location && (
        <div className="rounded-2xl border border-line bg-surface-raised p-7">
          <h2 className="font-display text-title text-ink">Where are you?</h2>
          <p className="mt-3 leading-relaxed text-ink-muted">
            Prayer times depend on your location. Sabeel asks rather than taking it, and
            keeps it on this device only — it is never sent anywhere except to look up the
            times.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={requestLocation}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-emerald px-6 py-3 text-sm text-surface"
            >
              {locating ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <MapPin className="size-4" aria-hidden />
              )}
              Use my location
            </button>
          </div>
          <CityPicker onPick={(city) => persist({ ...city, methodId: DEFAULT_METHOD_ID })} />
        </div>
      )}

      {error && (
        <p role="alert" className="mt-6 rounded-lg border border-dashed border-line-strong bg-surface-sunken px-5 py-4 text-sm text-ink-muted">
          {error}
        </p>
      )}

      {location && day && schedule && (
        <>
          <div className="rounded-2xl border-l-2 border-l-emerald border-line bg-surface-raised px-7 py-6">
            <p className="font-display text-xs uppercase tracking-[0.2em] text-gold-ink">
              Next prayer
            </p>
            <p className="mt-3 font-display text-display font-light text-ink">
              {schedule.next?.name}{' '}
              <span lang="ar" dir="rtl" className="text-emerald">
                {schedule.next ? PRAYER_ARABIC[schedule.next.name] : ''}
              </span>
            </p>
            <p className="mt-2 text-lede text-ink-muted">
              {schedule.next?.time}
              {schedule.minutesUntilNext !== null &&
                ` · ${formatCountdown(schedule.minutesUntilNext)}`}
            </p>
            {schedule.current && (
              <p className="mt-4 text-sm text-ink-faint">
                {schedule.current.name} has begun.
              </p>
            )}
          </div>

          <ul className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface-raised">
            {day.timings.map((prayer) => {
              const isNext = schedule.next?.name === prayer.name;
              return (
                <li
                  key={prayer.name}
                  className={`flex items-center justify-between px-6 py-4 ${
                    isNext ? 'bg-[var(--emerald-soft)]' : ''
                  }`}
                >
                  <span className="flex items-baseline gap-3">
                    <span className="font-display text-lg text-ink">{prayer.name}</span>
                    <span lang="ar" dir="rtl" className="text-ink-muted">
                      {PRAYER_ARABIC[prayer.name]}
                    </span>
                  </span>
                  <span className="font-display text-lg tabular-nums text-ink">
                    {prayer.time}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 space-y-3 text-sm text-ink-faint">
            <p>
              {day.gregorianDate}
              {day.hijriDate && ` · ${day.hijriDate}`}
              {day.timezone && ` · ${day.timezone}`}
            </p>
            <label className="flex flex-wrap items-center gap-3 text-ink-muted">
              Calculation method
              <select
                value={location.methodId}
                onChange={(event) =>
                  persist({ ...location, methodId: Number(event.target.value) })
                }
                className="min-h-11 rounded-full border border-line bg-surface-raised px-4 py-2 text-sm text-ink focus:border-emerald focus:outline-none"
              >
                {CALCULATION_METHODS.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </select>
            </label>
            <p>
              Methods differ by region and none is the single correct one. If your local
              mosque uses a different timetable, follow it.
            </p>
            <button
              type="button"
              onClick={() => {
                setLocation(null);
                  setDay(null);
              }}
              className="min-h-11 text-emerald hover:underline"
            >
              Change location
            </button>
          </div>
        </>
      )}

      {location && !day && !error && (
        <p className="mt-6 text-ink-faint">Loading prayer times…</p>
      )}
    </div>
  );
}

/** A short list of cities, so the page is usable without granting location access. */
const CITIES = [
  { label: 'Cape Town', latitude: -33.9249, longitude: 18.4241 },
  { label: 'Johannesburg', latitude: -26.2041, longitude: 28.0473 },
  { label: 'London', latitude: 51.5074, longitude: -0.1278 },
  { label: 'New York', latitude: 40.7128, longitude: -74.006 },
  { label: 'Dubai', latitude: 25.2048, longitude: 55.2708 },
  { label: 'Makkah', latitude: 21.3891, longitude: 39.8579 },
  { label: 'Kuala Lumpur', latitude: 3.139, longitude: 101.6869 },
  { label: 'Karachi', latitude: 24.8607, longitude: 67.0011 },
] as const;

function CityPicker({
  onPick,
}: {
  onPick: (city: { latitude: number; longitude: number; label: string }) => void;
}) {
  return (
    <div className="mt-7 border-t border-line pt-6">
      <p className="text-sm text-ink-muted">Or choose a city</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {CITIES.map((city) => (
          <li key={city.label}>
            <button
              type="button"
              onClick={() => onPick(city)}
              className="min-h-11 rounded-full border border-line px-4 py-2 text-sm text-ink-muted transition-colors hover:border-emerald hover:text-emerald"
            >
              {city.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}


