/**
 * The audio layer.
 *
 * No reciter or narrator is hardcoded anywhere in the platform. An audio source is
 * described by metadata and resolved through a provider, so adding a reciter — or an
 * entirely different kind of audio, such as a spoken dua or a Salah recitation — is a
 * data change rather than a code change.
 *
 * Quran recitations live in lib/quran/recitations.ts and register here.
 */

export type AudioKind = 'quran-recitation' | 'salah-recitation' | 'dua' | 'narration';

export interface AudioSource {
  readonly id: string;
  readonly kind: AudioKind;
  /** Who is reciting or speaking. Always credited in the UI. */
  readonly performer: string;
  /** Recitation style, where it distinguishes two recordings by the same performer. */
  readonly style?: string;
  /** Where the audio comes from, for attribution and for the source log. */
  readonly provider: string;
  readonly language?: string;
  readonly note?: string;
}

/** A resolved, playable track. */
export interface AudioTrack {
  readonly url: string;
  /** Optional label, e.g. an ayah reference or the name of a position. */
  readonly label?: string;
}

/** Display label, disambiguating two recordings by the same performer. */
export function performerLabel(source: AudioSource): string {
  return source.style ? `${source.performer} (${source.style})` : source.performer;
}

export function findSource(
  sources: readonly AudioSource[],
  id: string,
): AudioSource | undefined {
  return sources.find((source) => source.id === id);
}

/**
 * Narrows unvalidated input (a URL search param) to a source we actually offer,
 * falling back to the first available.
 */
export function resolveSourceId(
  sources: readonly AudioSource[],
  raw: string | undefined,
  fallbackId: string,
): string {
  if (raw && findSource(sources, raw)) return raw;
  return findSource(sources, fallbackId) ? fallbackId : (sources[0]?.id ?? fallbackId);
}

/** Resolves a possibly-relative path against a provider's base URL. */
export function resolveTrackUrl(base: string, pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${base.replace(/\/+$/, '')}/${pathOrUrl.replace(/^\/+/, '')}`;
}
