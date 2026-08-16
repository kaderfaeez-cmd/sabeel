/**
 * Reading preferences, shared between the client and the server.
 *
 * Settings originally wrote only to localStorage — which a server component cannot read,
 * so choosing a translation or a reciter in Settings had no effect on the Quran page at
 * all. The whole page appeared to work and changed nothing.
 *
 * Preferences are now mirrored into a cookie so the server can honour them on the first
 * render, with no flash of the wrong translation and no client-side redirect.
 *
 * Precedence is deliberate:
 *   1. an explicit URL parameter — so a shared link always shows what the sharer saw
 *   2. the saved preference
 *   3. the default
 */

export const PREF_COOKIE = {
  translation: 'sabeel_translation',
  reciter: 'sabeel_reciter',
} as const;

/** Mirrors of the localStorage keys the Settings panel uses. */
export const PREF_STORAGE = {
  translation: 'sabeel:translation',
  reciter: 'sabeel:reciter',
  adhan: 'sabeel:adhan-audio',
  textScale: 'sabeel:text-scale',
} as const;

const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Writes a preference cookie from the browser.
 *
 * `SameSite=Lax` because this is a reading preference, not a credential — it never
 * authenticates anything and carries no personal data.
 */
export function writePreferenceCookie(name: string, value: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${ONE_YEAR}; SameSite=Lax`;
}

/**
 * Resolves a preference from the URL first, then the saved cookie, then the default.
 *
 * `isValid` is required rather than optional: every one of these values reaches an
 * external API, so an unvalidated cookie would be unvalidated input from the user's own
 * machine.
 */
export function resolvePreference(
  urlValue: string | undefined,
  cookieValue: string | undefined,
  isValid: (value: number) => boolean,
  fallback: number,
): number {
  for (const candidate of [urlValue, cookieValue]) {
    if (!candidate) continue;
    const parsed = Number(candidate);
    if (Number.isInteger(parsed) && isValid(parsed)) return parsed;
  }
  return fallback;
}
