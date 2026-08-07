import type { SalahPosition } from '@/data/fiqh/salah';
import type { ResolvedPosition } from '@/features/salah/position-card';
import type { QuranBlock } from '@/lib/content/types';
import { fetchSurahVerses } from '@/lib/quran/api';
import { resolveEvidence } from './loader';

/**
 * Resolves everything a Salah position needs: its own evidence, each recitation's
 * evidence, and the Quranic text for any recitation that is fetched rather than
 * transcribed.
 *
 * Al-Fatihah is never written by hand anywhere in this codebase. It is fetched from the
 * Quran source and rendered with its translator credited, exactly like any other verse.
 */
export async function resolveSalahPosition(
  position: SalahPosition,
  translationId: number,
): Promise<ResolvedPosition> {
  const [positionEvidence, recitationEvidence, accessibilityEvidence, quranBlocks] =
    await Promise.all([
      resolveEvidence(position.evidence, translationId),
      Promise.all(
        position.recitations.map((recitation) =>
          resolveEvidence(recitation.evidence, translationId),
        ),
      ),
      position.accessibilityEvidence
        ? resolveEvidence(position.accessibilityEvidence, translationId)
        : Promise.resolve(undefined),
      resolveQuranicRecitations(position, translationId),
    ]);

  return { positionEvidence, recitationEvidence, accessibilityEvidence, quranBlocks };
}

async function resolveQuranicRecitations(
  position: SalahPosition,
  translationId: number,
): Promise<Record<string, readonly QuranBlock[]>> {
  type Entry = readonly [string, readonly QuranBlock[]];

  const entries = await Promise.all(
    position.recitations
      .filter((recitation) => recitation.quranReference !== undefined)
      .map(async (recitation): Promise<Entry | null> => {
        const reference = recitation.quranReference;
        if (!reference) return null;

        try {
          const verses = await fetchSurahVerses(reference.surah, translationId);
          const selected = verses.filter(
            (block) =>
              block.source.ayahFrom >= reference.ayahFrom &&
              block.source.ayahFrom <= reference.ayahTo,
          );
          return [recitation.id, selected];
        } catch {
          // A transport failure here means the recitation shows without its text rather
          // than the page failing. The evidence and the "why" still render.
          return null;
        }
      }),
  );

  const resolved: Record<string, readonly QuranBlock[]> = {};
  for (const entry of entries) {
    if (entry !== null) resolved[entry[0]] = entry[1];
  }
  return resolved;
}
