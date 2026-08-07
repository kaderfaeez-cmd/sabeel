'use client';

import { useEffect } from 'react';
import type { QuranBlock } from '@/lib/content/types';
import { saveReadingPosition } from '@/lib/store/reading';
import { cacheSurah } from '@/lib/store/surah-cache';

/**
 * Records where the reader is, and keeps the surah readable offline.
 *
 * Renders nothing. Two jobs:
 *  1. Cache the surah's blocks once, so a surah opened on wifi still reads on a train.
 *  2. Track the furthest ayah scrolled past, so "continue reading" is accurate.
 *
 * Both are best-effort: a storage failure must never interrupt reading, so failures are
 * ignored here by design rather than by oversight.
 */
export function ReadingTracker({
  surah,
  translationId,
  blocks,
}: {
  surah: number;
  translationId: number;
  blocks: readonly QuranBlock[];
}) {
  useEffect(() => {
    void cacheSurah(surah, translationId, blocks).catch(() => {});
  }, [surah, translationId, blocks]);

  // Opening a surah is itself a reading position. Recorded immediately so "continue
  // reading" works even if the reader never scrolls far enough to trip the observer —
  // or if IntersectionObserver is unavailable entirely.
  useEffect(() => {
    void saveReadingPosition(surah, 1).catch(() => {});
  }, [surah]);

  useEffect(() => {
    const rows = document.querySelectorAll<HTMLElement>('[data-ayah]');
    if (rows.length === 0) return;

    let furthest = 0;
    let pending: number | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const ayah = Number(entry.target.getAttribute('data-ayah'));
          if (Number.isInteger(ayah) && ayah > furthest) {
            furthest = ayah;
            pending = ayah;
          }
        }
      },
      { rootMargin: '0px 0px -60% 0px' },
    );

    for (const row of rows) observer.observe(row);

    // Written on an interval rather than per-ayah so scrolling never triggers a
    // write storm.
    const timer = setInterval(() => {
      if (pending === null) return;
      const ayah = pending;
      pending = null;
      void saveReadingPosition(surah, ayah).catch(() => {});
    }, 3000);

    return () => {
      observer.disconnect();
      clearInterval(timer);
      if (pending !== null) void saveReadingPosition(surah, pending).catch(() => {});
    };
  }, [surah]);

  return null;
}
