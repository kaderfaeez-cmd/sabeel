import { afterEach, describe, expect, test, vi } from 'vitest';
import { classifyGrades, HadithError, lookupHadith, normaliseGrading, splitNarrator } from './api';

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
  test('accepts the gradings Sabeel may publish', () => {
    expect(normaliseGrading('Sahih')).toBe('sahih');
    expect(normaliseGrading('Hasan')).toBe('hasan');
    expect(normaliseGrading('Mutawatir')).toBe('mutawatir');
    expect(normaliseGrading('Hasan Sahih')).toBe('sahih');
  });

  test('distinguishes the li-ghayrihi gradings', () => {
    expect(normaliseGrading('Sahih li-ghayrihi')).toBe('sahih-li-ghayrihi');
    expect(normaliseGrading('Hasan li ghayrihi')).toBe('hasan-li-ghayrihi');
  });

  test('rejects weak and fabricated gradings', () => {
    expect(normaliseGrading('Daif')).toBeNull();
    expect(normaliseGrading("Da'if")).toBeNull();
    expect(normaliseGrading('Weak')).toBeNull();
    expect(normaliseGrading('Munkar')).toBeNull();
    expect(normaliseGrading('Mawdu')).toBeNull();
  });

  test('does not let a compound weak grading pass as sahih', () => {
    // "Daif" contains no "sahih", but this guards the ordering of the checks.
    expect(normaliseGrading('Daif, not sahih')).toBeNull();
  });

  test('rejects the unrecognised rather than guessing', () => {
    expect(normaliseGrading('')).toBeNull();
    expect(normaliseGrading('Unknown')).toBeNull();
  });
});

describe('classifyGrades — the distinction that matters', () => {
  test('NO gradings is "unverified-in-dataset", never "weak"', () => {
    // This is the correction the owner asked for: silence in our dataset is a fact about
    // our data, not a claim about the narration.
    const result = classifyGrades([]);

    expect(result.status).toBe('unverified-in-dataset');
    expect(result.status).not.toBe('weak');
  });

  test('all scholars acceptable is "verified"', () => {
    const result = classifyGrades([
      { name: 'Al-Albani', grade: 'Sahih' },
      { name: 'Zubair Ali Zai', grade: 'Hasan' },
    ]);

    expect(result.status).toBe('verified');
    expect(result.best).toEqual({ grading: 'sahih', gradedBy: 'Al-Albani' });
  });

  test('scholars disagreeing is "disputed", never "weak"', () => {
    const result = classifyGrades([
      { name: 'Al-Albani', grade: 'Sahih' },
      { name: 'Zubair Ali Zai', grade: 'Daif' },
    ]);

    expect(result.status).toBe('disputed');
    expect(result.status).not.toBe('weak');
  });

  test('all scholars grading it weak is "weak"', () => {
    const result = classifyGrades([
      { name: 'A', grade: 'Daif' },
      { name: 'B', grade: 'Weak' },
    ]);

    expect(result.status).toBe('weak');
  });

  test('a fabrication grading is "fabricated", never merely "weak"', () => {
    const result = classifyGrades([
      { name: 'A', grade: 'Daif' },
      { name: 'B', grade: 'Mawdu' },
    ]);

    expect(result.status).toBe('fabricated');
  });

  test('records every scholar verbatim, flagged for acceptability', () => {
    const result = classifyGrades([
      { name: 'Al-Albani', grade: 'Sahih' },
      { name: 'Zubair Ali Zai', grade: 'Daif' },
    ]);

    expect(result.gradings).toEqual([
      { scholar: 'Al-Albani', grade: 'Sahih', acceptable: true },
      { scholar: 'Zubair Ali Zai', grade: 'Daif', acceptable: false },
    ]);
  });
});

describe('splitNarrator', () => {
  test('separates the narrator from the body', () => {
    const { narrator, body } = splitNarrator("Narrated 'Umar: I heard the Messenger say...");
    expect(narrator).toBe("'Umar");
    expect(body).toBe('I heard the Messenger say...');
  });

  test('leaves text without a narrator prefix untouched', () => {
    expect(splitNarrator('The reward of deeds...')).toEqual({ body: 'The reward of deeds...' });
  });
});

describe('lookupHadith', () => {
  test('refuses a collection Sabeel does not cite', async () => {
    await expect(lookupHadith('not-a-collection', 1)).rejects.toThrow(HadithError);
  });

  test('refuses an invalid hadith number', async () => {
    await expect(lookupHadith('bukhari', 0)).rejects.toThrow(HadithError);
    await expect(lookupHadith('bukhari', 1.5)).rejects.toThrow(HadithError);
  });

  test('accepts an ungraded Bukhari narration as sahih by collection', async () => {
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

    const result = await lookupHadith('bukhari', 1);

    expect(result.status).toBe('verified');
    if (result.status !== 'verified') throw new Error('expected verified');
    expect(result.block.source.grading).toBe('sahih');
    expect(result.block.source.collectionName).toBe('Sahih al-Bukhari');
  });

  test('an ungraded Sunan narration is "unverified-in-dataset", NOT "weak"', async () => {
    mockHadith({ hadiths: [{ hadithnumber: 5, text: 'Something', grades: [], reference: {} }] });

    const result = await lookupHadith('tirmidhi', 5);

    expect(result.status).toBe('unverified-in-dataset');
    if (result.status === 'verified') throw new Error('should not be citable');
    expect(result.reference).toContain('at-Tirmidhi');
  });

  test('a narration graded weak reports "weak" and is not citable', async () => {
    mockHadith({
      hadiths: [
        { hadithnumber: 9, text: 'x', grades: [{ name: 'Al-Albani', grade: 'Daif' }], reference: {} },
      ],
    });

    const result = await lookupHadith('abudawud', 9);

    expect(result.status).toBe('weak');
  });

  test('a disputed narration reports every scholar assessment', async () => {
    mockHadith({
      hadiths: [
        {
          hadithnumber: 11,
          text: 'x',
          grades: [
            { name: 'Al-Albani', grade: 'Sahih' },
            { name: 'Zubair Ali Zai', grade: 'Daif' },
          ],
          reference: {},
        },
      ],
    });

    const result = await lookupHadith('tirmidhi', 11);

    expect(result.status).toBe('disputed');
    if (result.status === 'verified') throw new Error('should not be citable');
    expect(result.gradings).toHaveLength(2);
    expect(result.gradings.filter((g) => g.acceptable)).toHaveLength(1);
  });

  test('a Bukhari narration that IS graded weak is still refused', async () => {
    // Collection-level acceptance applies only where the dataset gives no grading.
    mockHadith({
      hadiths: [
        { hadithnumber: 3, text: 'x', grades: [{ name: 'A', grade: 'Daif' }], reference: {} },
      ],
    });

    const result = await lookupHadith('bukhari', 3);

    expect(result.status).toBe('weak');
  });

  test('a missing narration reports "not-found"', async () => {
    mockHadith({}, 404);
    await expect(lookupHadith('bukhari', 999_999)).resolves.toMatchObject({
      status: 'not-found',
    });
  });

  test('raises a typed error when the source is unreachable', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('offline')) as unknown as typeof fetch;
    await expect(lookupHadith('bukhari', 1)).rejects.toThrow(/Could not reach the hadith source/);
  });
});
