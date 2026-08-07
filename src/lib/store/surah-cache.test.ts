import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, test } from 'vitest';
import type { QuranBlock } from '@/lib/content/types';
import { clear, STORE } from './db';
import {
  cacheKey,
  cacheSurah,
  getCachedSurah,
  listCachedSurahs,
  removeCachedSurah,
} from './surah-cache';

function block(surah: number, ayah: number): QuranBlock {
  return {
    kind: 'quran',
    id: `quran-${surah}-${ayah}`,
    arabic: 'قُلْ',
    translation: 'Say',
    source: {
      kind: 'quran',
      surah,
      ayahFrom: ayah,
      ayahTo: ayah,
      translationId: 20,
      translatorName: 'Saheeh International',
    },
  };
}

beforeEach(async () => {
  await clear(STORE.surahCache);
});

describe('cacheKey', () => {
  test('separates the same surah cached under different translations', () => {
    expect(cacheKey(112, 20)).not.toBe(cacheKey(112, 85));
  });
});

describe('the offline surah cache', () => {
  test('stores and returns a surah with its blocks intact', async () => {
    await cacheSurah(112, 20, [block(112, 1), block(112, 2)]);

    const cached = await getCachedSurah(112, 20);

    expect(cached?.blocks).toHaveLength(2);
    expect(cached?.surah).toBe(112);
  });

  test('keeps attribution with the cached text, so an offline read is still sourced', async () => {
    await cacheSurah(112, 20, [block(112, 1)]);

    const cached = await getCachedSurah(112, 20);

    expect(cached?.blocks[0]?.source.translatorName).toBe('Saheeh International');
    expect(cached?.blocks[0]?.source.surah).toBe(112);
  });

  test('refuses to cache an empty result rather than storing a hollow surah', async () => {
    await cacheSurah(112, 20, []);

    await expect(getCachedSurah(112, 20)).resolves.toBeUndefined();
  });

  test('caches the same surah separately per translation', async () => {
    await cacheSurah(112, 20, [block(112, 1)]);
    await cacheSurah(112, 85, [block(112, 1)]);

    await expect(listCachedSurahs()).resolves.toHaveLength(2);
  });

  test('re-caching replaces rather than duplicating', async () => {
    await cacheSurah(112, 20, [block(112, 1)]);
    await cacheSurah(112, 20, [block(112, 1), block(112, 2)]);

    const all = await listCachedSurahs();

    expect(all).toHaveLength(1);
    expect(all[0]?.blocks).toHaveLength(2);
  });

  test('removes a cached surah', async () => {
    await cacheSurah(112, 20, [block(112, 1)]);
    await removeCachedSurah(112, 20);

    await expect(getCachedSurah(112, 20)).resolves.toBeUndefined();
  });

  test('lists most recently cached first', async () => {
    await cacheSurah(1, 20, [block(1, 1)]);
    await new Promise((r) => setTimeout(r, 2));
    await cacheSurah(112, 20, [block(112, 1)]);

    const all = await listCachedSurahs();

    expect(all.map((c) => c.surah)).toEqual([112, 1]);
  });
});
