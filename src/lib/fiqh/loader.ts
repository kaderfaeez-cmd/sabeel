import type { Evidence, EvidenceNotice, QuranBlock } from '@/lib/content/types';
import { lookupHadith } from '@/lib/hadith/api';
import { fetchAyah } from '@/lib/quran/api';

/**
 * Resolves a teaching point's declared references into actual evidence.
 *
 * Nothing here decides what is authentic — the gate in lib/hadith/api.ts does. This
 * layer's only job is to turn whatever the gate concluded into either citable evidence
 * or an honest notice, so a page can never quietly omit a reference that failed.
 */

export interface QuranReference {
  readonly surah: number;
  readonly ayah: number;
}

export interface HadithReference {
  readonly collection: string;
  readonly number: number;
}

export interface EvidenceSpec {
  readonly quran?: readonly QuranReference[];
  readonly hadith?: readonly HadithReference[];
  /**
   * Set when the practice is established within mainstream Sunni scholarship. If no
   * hadith clears the gate, the notice says so *and* says the practice is established —
   * rather than leaving a page that reads as though there were no evidence at all.
   */
  readonly establishedPractice?: boolean;
}

export async function resolveEvidence(
  spec: EvidenceSpec,
  translationId: number,
): Promise<Evidence> {
  const [quran, hadithOutcome] = await Promise.all([
    resolveQuran(spec.quran ?? [], translationId),
    resolveHadith(spec.hadith ?? []),
  ]);

  const notices = [...hadithOutcome.notices];

  // The owner's rule: a step whose supporting narration did not clear the gate must not
  // read as "there is no evidence". If the practice is established and nothing cleared,
  // say exactly that.
  if (spec.establishedPractice && hadithOutcome.blocks.length === 0) {
    notices.push({
      id: 'established-practice',
      status: 'unverified-in-dataset',
      establishedPractice: true,
    });
  }

  return {
    quran,
    hadith: hadithOutcome.blocks,
    notices,
  };
}

async function resolveQuran(
  references: readonly QuranReference[],
  translationId: number,
): Promise<readonly QuranBlock[]> {
  const results = await Promise.all(
    references.map(async (reference) => {
      try {
        return await fetchAyah(reference.surah, reference.ayah, translationId);
      } catch {
        // A Quran fetch failure is a transport problem, not an authenticity one.
        // The step still renders; it simply shows fewer sources this time.
        return null;
      }
    }),
  );

  return results.filter((block): block is QuranBlock => block !== null);
}

async function resolveHadith(references: readonly HadithReference[]) {
  const blocks = [];
  const notices: EvidenceNotice[] = [];

  const results = await Promise.all(
    references.map(async (reference) => {
      try {
        return await lookupHadith(reference.collection, reference.number, {
          includeArabic: true,
        });
      } catch {
        return null;
      }
    }),
  );

  for (const [index, result] of results.entries()) {
    const reference = references[index];
    if (!result || !reference) continue;

    if (result.status === 'verified') {
      blocks.push(result.block);
      continue;
    }

    // Every non-verified outcome becomes a visible notice carrying its precise status.
    // A reference that failed the gate is never silently dropped.
    notices.push({
      id: `${reference.collection}-${reference.number}`,
      status: result.status,
      reference: result.reference,
      gradings: result.gradings,
    });
  }

  return { blocks, notices };
}
