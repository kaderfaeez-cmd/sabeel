import type { QuranBlock } from '@/lib/content/types';
import { get, getAll, put, remove, STORE } from './db';

/**
 * Offline persistence for surahs the user has actually opened.
 *
 * Constitution §7: "Offline-first for revelation." A surah that has been read once must
 * remain readable with no network. Cached entries keep their full `QuranBlock`s, so the
 * source and translator travel with the text — an offline read is never an unattributed
 * read.
 */

export interface CachedSurah {
  readonly id: string;
  readonly surah: number;
  readonly translationId: number;
  readonly blocks: readonly QuranBlock[];
  readonly cachedAt: number;
}

export function cacheKey(surah: number, translationId: number): string {
  return `${surah}:${translationId}`;
}

export async function cacheSurah(
  surah: number,
  translationId: number,
  blocks: readonly QuranBlock[],
): Promise<void> {
  // Never cache an empty or partial result — an incomplete surah served offline would
  // look authoritative while being wrong.
  if (blocks.length === 0) return;

  await put<CachedSurah>(STORE.surahCache, {
    id: cacheKey(surah, translationId),
    surah,
    translationId,
    blocks,
    cachedAt: Date.now(),
  });
}

export async function getCachedSurah(
  surah: number,
  translationId: number,
): Promise<CachedSurah | undefined> {
  return get<CachedSurah>(STORE.surahCache, cacheKey(surah, translationId));
}

export async function listCachedSurahs(): Promise<readonly CachedSurah[]> {
  const all = await getAll<CachedSurah>(STORE.surahCache);
  return all.sort((a, b) => b.cachedAt - a.cachedAt);
}

export async function removeCachedSurah(
  surah: number,
  translationId: number,
): Promise<void> {
  await remove(STORE.surahCache, cacheKey(surah, translationId));
}
