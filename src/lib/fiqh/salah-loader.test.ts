import { afterEach, describe, expect, test, vi } from 'vitest';
import { resolveSalahPosition } from './salah-loader';
import { SALAH_POSITIONS } from '@/data/fiqh/salah';
import * as hadithApi from '@/lib/hadith/api';
import * as quranApi from '@/lib/quran/api';
import type { HadithBlock, QuranBlock } from '@/lib/content/types';

afterEach(() => vi.restoreAllMocks());

function ayah(number: number): QuranBlock {
  return {
    kind: 'quran',
    id: `quran-1-${number}`,
    arabic: 'x',
    translation: 'y',
    source: {
      kind: 'quran',
      surah: 1,
      ayahFrom: number,
      ayahTo: number,
      translationId: 20,
      translatorName: 'Saheeh International',
    },
  };
}

const hadith: HadithBlock = {
  kind: 'hadith',
  id: 'hadith-bukhari-1117',
  translation: 'Pray while standing, and if you cannot, pray sitting.',
  source: {
    kind: 'hadith',
    collection: 'bukhari',
    collectionName: 'Sahih al-Bukhari',
    hadithNumber: 1117,
    grading: 'sahih',
  },
};

const qiyam = SALAH_POSITIONS.find((p) => p.id === 'qiyam')!;
const takbir = SALAH_POSITIONS.find((p) => p.id === 'takbir')!;

describe('the Salah data itself', () => {
  test('every position declares a ruling and evidence', () => {
    for (const position of SALAH_POSITIONS) {
      expect(position.ruling).toBeTruthy();
      expect(position.evidence).toBeDefined();
    }
  });

  test('every recitation answers "why am I saying this?"', () => {
    // The owner's addition: words get memorised long before they are understood.
    for (const position of SALAH_POSITIONS) {
      for (const recitation of position.recitations) {
        expect(recitation.why.trim().length).toBeGreaterThan(40);
      }
    }
  });

  test('every recitation carries evidence — no orphaned assertions', () => {
    for (const position of SALAH_POSITIONS) {
      for (const recitation of position.recitations) {
        const spec = recitation.evidence;
        const hasReference =
          (spec.quran?.length ?? 0) > 0 || (spec.hadith?.length ?? 0) > 0;
        expect(hasReference).toBe(true);
      }
    }
  });

  test('accessibility guidance making an Islamic claim carries its own evidence', () => {
    // Constitution §3.2. Guidance that appeals to the Sunnah must show what it means.
    for (const position of SALAH_POSITIONS) {
      if (!position.accessibility) continue;
      const appealsToSunnah = /Prophet|Sunnah|narrat/i.test(position.accessibility);
      if (appealsToSunnah) {
        expect(position.accessibilityEvidence).toBeDefined();
      }
    }
  });

  test('Al-Fatihah is fetched, never transcribed by hand', () => {
    const fatihah = qiyam.recitations.find((r) => r.id === 'fatihah')!;

    expect(fatihah.quranReference).toEqual({ surah: 1, ayahFrom: 1, ayahTo: 7 });
    // The hand-written Arabic field is deliberately empty for Quranic recitations.
    expect(fatihah.arabic).toBe('');
  });

  test('non-Quranic recitations carry transliteration and translation', () => {
    for (const position of SALAH_POSITIONS) {
      for (const recitation of position.recitations) {
        if (recitation.quranReference) continue;
        expect(recitation.arabic.trim()).not.toBe('');
        expect(recitation.transliteration.trim()).not.toBe('');
        expect(recitation.translation.trim()).not.toBe('');
      }
    }
  });
});

describe('resolveSalahPosition', () => {
  test('fetches only the referenced ayah range for a Quranic recitation', async () => {
    vi.spyOn(quranApi, 'fetchSurahVerses').mockResolvedValue([
      ayah(1),
      ayah(2),
      ayah(3),
      ayah(4),
      ayah(5),
      ayah(6),
      ayah(7),
    ]);
    vi.spyOn(hadithApi, 'lookupHadith').mockResolvedValue({ status: 'verified', block: hadith });

    const resolved = await resolveSalahPosition(qiyam, 20);

    expect(resolved.quranBlocks.fatihah).toHaveLength(7);
    expect(resolved.quranBlocks.fatihah?.[0]?.source.surah).toBe(1);
  });

  test('resolves accessibility evidence separately from position evidence', async () => {
    vi.spyOn(quranApi, 'fetchSurahVerses').mockResolvedValue([ayah(1)]);
    vi.spyOn(hadithApi, 'lookupHadith').mockResolvedValue({ status: 'verified', block: hadith });

    const resolved = await resolveSalahPosition(qiyam, 20);

    expect(resolved.accessibilityEvidence?.hadith?.[0]?.source.hadithNumber).toBe(1117);
  });

  test('leaves accessibility evidence undefined when the position declares none', async () => {
    vi.spyOn(hadithApi, 'lookupHadith').mockResolvedValue({ status: 'verified', block: hadith });

    const salam = SALAH_POSITIONS.find((p) => p.id === 'salam')!;
    const resolved = await resolveSalahPosition(salam, 20);

    expect(resolved.accessibilityEvidence).toBeUndefined();
  });

  test('a Quran fetch failure leaves the recitation without text, not the page broken', async () => {
    vi.spyOn(quranApi, 'fetchSurahVerses').mockRejectedValue(new Error('offline'));
    vi.spyOn(hadithApi, 'lookupHadith').mockResolvedValue({ status: 'verified', block: hadith });

    const resolved = await resolveSalahPosition(qiyam, 20);

    expect(resolved.quranBlocks.fatihah).toBeUndefined();
    expect(resolved.positionEvidence).toBeDefined();
  });

  test('a disputed narration becomes a notice on the recitation, not a citation', async () => {
    vi.spyOn(hadithApi, 'lookupHadith').mockResolvedValue({
      status: 'disputed',
      reference: 'Sunan Abu Dawud, Hadith 869',
      gradings: [
        { scholar: 'Al-Albani', grade: 'Daif', acceptable: false },
        { scholar: 'Zubair Ali Zai', grade: 'Isnaad Sahih', acceptable: true },
      ],
    });

    const ruku = SALAH_POSITIONS.find((p) => p.id === 'ruku')!;
    const resolved = await resolveSalahPosition(ruku, 20);

    const recitationEvidence = resolved.recitationEvidence[0];
    expect(recitationEvidence?.hadith).toHaveLength(0);
    expect(recitationEvidence?.notices?.some((n) => n.status === 'disputed')).toBe(true);
    // And the practice is still presented as established.
    expect(recitationEvidence?.notices?.some((n) => n.establishedPractice)).toBe(true);
  });

  test('a position with no recitations resolves cleanly', async () => {
    vi.spyOn(hadithApi, 'lookupHadith').mockResolvedValue({ status: 'verified', block: hadith });

    const niyyah = SALAH_POSITIONS.find((p) => p.id === 'niyyah')!;
    const resolved = await resolveSalahPosition(niyyah, 20);

    expect(resolved.recitationEvidence).toHaveLength(0);
    expect(resolved.quranBlocks).toEqual({});
  });

  test('the takbir resolves its establishing narration', async () => {
    vi.spyOn(hadithApi, 'lookupHadith').mockResolvedValue({ status: 'verified', block: hadith });

    const resolved = await resolveSalahPosition(takbir, 20);

    expect(resolved.recitationEvidence[0]?.hadith).toHaveLength(1);
  });
});
