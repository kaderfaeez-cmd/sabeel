import { afterEach, describe, expect, test, vi } from 'vitest';
import { fetchHadith, HadithError, normaliseGrading, selectGrading, splitNarrator } from './api';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});

function mockHadith(body: unknown, status = 200) {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  }) as unknown as typeof fetch;
}

describe('normaliseGrading', () => {
  test('accepts the gradings Sabeel is willing to present', () => {
    expect(normaliseGrading('Sahih')).toBe('sahih');
    expect(normaliseGrading('Hasan')).toBe('hasan');
    expect(normaliseGrading('Mutawatir')).toBe('mutawatir');
  });

  test('treats "Hasan Sahih" as sahih', () => {
    expect(normaliseGrading('Hasan Sahih')).toBe('sahih');
  });

  test('distinguishes the li-ghayrihi gradings from the plain ones', () => {
    expect(normaliseGrading('Sahih li-ghayrihi')).toBe('sahih-li-ghayrihi');
    expect(normaliseGrading('Hasan li ghayrihi')).toBe('hasan-li-ghayrihi');
  });

  test('rejects weak gradings — Sabeel does not cite them as evidence', () => {
    expect(normaliseGrading('Daif')).toBeNull();
    expect(normaliseGrading("Da'if")).toBeNull();
    expect(normaliseGrading('Weak')).toBeNull();
    expect(normaliseGrading('Daif Jiddan')).toBeNull();
  });

  test('rejects anything it does not recognise rather than guessing', () => {
    expect(normaliseGrading('')).toBeNull();
    expect(normaliseGrading('Unknown')).toBeNull();
    expect(normaliseGrading('Mawdu')).toBeNull();
  });
});

describe('selectGrading', () => {
  test('picks the strongest acceptable grading and credits the grader', () => {
    const result = selectGrading([
      { name: 'Zubair Ali Zai', grade: 'Hasan' },
      { name: 'Al-Albani', grade: 'Sahih' },
    ]);

    expect(result).toEqual({ grading: 'sahih', gradedBy: 'Al-Albani' });
  });

  test('ignores weak gradings when a strong one exists', () => {
    const result = selectGrading([
      { name: 'A', grade: 'Daif' },
      { name: 'B', grade: 'Hasan' },
    ]);

    expect(result?.grading).toBe('hasan');
    expect(result?.gradedBy).toBe('B');
  });

  test('returns null when every grading is weak', () => {
    expect(selectGrading([{ name: 'A', grade: 'Daif' }])).toBeNull();
  });

  test('returns null for no gradings at all', () => {
    expect(selectGrading([])).toBeNull();
  });
});

describe('splitNarrator', () => {
  test('separates the narrator from the body', () => {
    const { narrator, body } = splitNarrator(
      "Narrated 'Umar bin Al-Khattab: I heard Allah's Messenger saying...",
    );

    expect(narrator).toBe("'Umar bin Al-Khattab");
    expect(body).toBe("I heard Allah's Messenger saying...");
  });

  test('leaves text without a narrator prefix untouched', () => {
    expect(splitNarrator('The reward of deeds...')).toEqual({
      body: 'The reward of deeds...',
    });
  });
});

describe('fetchHadith', () => {
  test('refuses a collection Sabeel does not cite', async () => {
    await expect(fetchHadith('not-a-collection', 1)).rejects.toThrow(HadithError);
  });

  test('refuses an invalid hadith number', async () => {
    await expect(fetchHadith('bukhari', 0)).rejects.toThrow(HadithError);
    await expect(fetchHadith('bukhari', 1.5)).rejects.toThrow(HadithError);
  });

  test('accepts an ungraded Bukhari hadith as sahih by collection', async () => {
    mockHadith({
      hadiths: [
        {
          hadithnumber: 1,
          text: "Narrated 'Umar: The reward of deeds depends upon the intentions.",
          grades: [],
          reference: { book: 1, hadith: 1 },
        },
      ],
    });

    const block = await fetchHadith('bukhari', 1);

    expect(block?.source.grading).toBe('sahih');
    expect(block?.source.gradedBy).toBeUndefined();
    expect(block?.source.collectionName).toBe('Sahih al-Bukhari');
    expect(block?.narrator).toBe("'Umar");
  });

  test('REFUSES an ungraded hadith from a collection that requires grading', async () => {
    // This is the core authenticity gate: Sunan collections are not authentic wholesale,
    // so an ungraded narration from one is not returned at all.
    mockHadith({
      hadiths: [{ hadithnumber: 5, text: 'Something', grades: [], reference: {} }],
    });

    await expect(fetchHadith('tirmidhi', 5)).resolves.toBeNull();
  });

  test('REFUSES a hadith graded weak', async () => {
    mockHadith({
      hadiths: [
        {
          hadithnumber: 9,
          text: 'Something',
          grades: [{ name: 'Al-Albani', grade: 'Daif' }],
          reference: {},
        },
      ],
    });

    await expect(fetchHadith('abudawud', 9)).resolves.toBeNull();
  });

  test('accepts a graded Sunan hadith and credits the grader', async () => {
    mockHadith({
      hadiths: [
        {
          hadithnumber: 61,
          text: 'Narrated Abu Hurairah: The Prophet said...',
          grades: [{ name: 'Al-Albani', grade: 'Hasan Sahih' }],
          reference: { book: 1, hadith: 61 },
        },
      ],
    });

    const block = await fetchHadith('abudawud', 61);

    expect(block?.source.grading).toBe('sahih');
    expect(block?.source.gradedBy).toBe('Al-Albani');
    expect(block?.source.hadithNumber).toBe(61);
  });

  test('returns null when the hadith does not exist', async () => {
    mockHadith({}, 404);
    await expect(fetchHadith('bukhari', 999_999)).resolves.toBeNull();
  });

  test('raises a typed error when the source is unreachable', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('offline')) as unknown as typeof fetch;

    await expect(fetchHadith('bukhari', 1)).rejects.toThrow(/Could not reach the hadith source/);
  });
});
