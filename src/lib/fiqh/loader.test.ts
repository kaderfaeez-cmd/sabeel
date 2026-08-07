import { afterEach, describe, expect, test, vi } from 'vitest';
import { resolveEvidence } from './loader';
import * as hadithApi from '@/lib/hadith/api';
import * as quranApi from '@/lib/quran/api';
import type { HadithBlock, QuranBlock } from '@/lib/content/types';

afterEach(() => vi.restoreAllMocks());

const ayah: QuranBlock = {
  kind: 'quran',
  id: 'quran-5-6',
  arabic: 'x',
  translation: 'O you who have believed, when you rise to prayer, wash your faces…',
  source: {
    kind: 'quran',
    surah: 5,
    ayahFrom: 6,
    ayahTo: 6,
    translationId: 20,
    translatorName: 'Saheeh International',
  },
};

const hadith: HadithBlock = {
  kind: 'hadith',
  id: 'hadith-bukhari-1',
  translation: 'The reward of deeds depends upon the intentions.',
  source: {
    kind: 'hadith',
    collection: 'bukhari',
    collectionName: 'Sahih al-Bukhari',
    hadithNumber: 1,
    grading: 'sahih',
  },
};

describe('resolveEvidence', () => {
  test('returns citable evidence when everything clears the gate', async () => {
    vi.spyOn(quranApi, 'fetchAyah').mockResolvedValue(ayah);
    vi.spyOn(hadithApi, 'lookupHadith').mockResolvedValue({ status: 'verified', block: hadith });

    const evidence = await resolveEvidence(
      { quran: [{ surah: 5, ayah: 6 }], hadith: [{ collection: 'bukhari', number: 1 }] },
      20,
    );

    expect(evidence.quran).toHaveLength(1);
    expect(evidence.hadith).toHaveLength(1);
    expect(evidence.notices).toHaveLength(0);
  });

  test('a reference that fails the gate becomes a notice — never a silent omission', async () => {
    vi.spyOn(hadithApi, 'lookupHadith').mockResolvedValue({
      status: 'unverified-in-dataset',
      reference: "Jami' at-Tirmidhi, Hadith 99",
      gradings: [],
    });

    const evidence = await resolveEvidence(
      { hadith: [{ collection: 'tirmidhi', number: 99 }] },
      20,
    );

    expect(evidence.hadith).toHaveLength(0);
    expect(evidence.notices).toHaveLength(1);
    expect(evidence.notices?.[0]?.status).toBe('unverified-in-dataset');
    expect(evidence.notices?.[0]?.reference).toContain('at-Tirmidhi');
  });

  test('preserves the precise status — a weak narration is not reported as unverified', async () => {
    vi.spyOn(hadithApi, 'lookupHadith').mockResolvedValue({
      status: 'weak',
      reference: 'Sunan Abu Dawud, Hadith 5',
      gradings: [{ scholar: 'Al-Albani', grade: 'Daif', acceptable: false }],
    });

    const evidence = await resolveEvidence({ hadith: [{ collection: 'abudawud', number: 5 }] }, 20);

    expect(evidence.notices?.[0]?.status).toBe('weak');
  });

  test('carries every scholar assessment through for a disputed narration', async () => {
    vi.spyOn(hadithApi, 'lookupHadith').mockResolvedValue({
      status: 'disputed',
      reference: "Jami' at-Tirmidhi, Hadith 11",
      gradings: [
        { scholar: 'Al-Albani', grade: 'Sahih', acceptable: true },
        { scholar: 'Zubair Ali Zai', grade: 'Daif', acceptable: false },
      ],
    });

    const evidence = await resolveEvidence({ hadith: [{ collection: 'tirmidhi', number: 11 }] }, 20);

    expect(evidence.notices?.[0]?.status).toBe('disputed');
    expect(evidence.notices?.[0]?.gradings).toHaveLength(2);
  });

  test('an established practice with no clearing citation says so explicitly', async () => {
    // The owner's rule: such a page must never read as "there is no evidence".
    vi.spyOn(hadithApi, 'lookupHadith').mockResolvedValue({
      status: 'unverified-in-dataset',
      reference: 'X, Hadith 1',
      gradings: [],
    });

    const evidence = await resolveEvidence(
      { hadith: [{ collection: 'tirmidhi', number: 1 }], establishedPractice: true },
      20,
    );

    const establishedNotice = evidence.notices?.find((n) => n.establishedPractice);

    expect(establishedNotice).toBeDefined();
  });

  test('does NOT add the established-practice notice when a citation did clear', async () => {
    vi.spyOn(hadithApi, 'lookupHadith').mockResolvedValue({ status: 'verified', block: hadith });

    const evidence = await resolveEvidence(
      { hadith: [{ collection: 'bukhari', number: 1 }], establishedPractice: true },
      20,
    );

    expect(evidence.notices?.some((n) => n.establishedPractice)).toBe(false);
  });

  test('a Quran fetch failure does not take down the step', async () => {
    vi.spyOn(quranApi, 'fetchAyah').mockRejectedValue(new Error('offline'));

    const evidence = await resolveEvidence({ quran: [{ surah: 5, ayah: 6 }] }, 20);

    expect(evidence.quran).toHaveLength(0);
  });

  test('a gate error does not take down the step', async () => {
    vi.spyOn(hadithApi, 'lookupHadith').mockRejectedValue(new Error('offline'));

    const evidence = await resolveEvidence({ hadith: [{ collection: 'bukhari', number: 1 }] }, 20);

    expect(evidence.hadith).toHaveLength(0);
  });
});
