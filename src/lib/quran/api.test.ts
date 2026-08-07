import { afterEach, describe, expect, test, vi } from 'vitest';
import { fetchAyah, fetchSurahVerses, QuranApiError, stripFootnotes } from './api';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});

function mockJson(body: unknown, ok = true, status = 200) {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok,
    status,
    statusText: 'x',
    json: async () => body,
  }) as unknown as typeof fetch;
}

describe('stripFootnotes', () => {
  test('removes footnote superscripts the API embeds in translations', () => {
    const input = 'All praise is due to Allah<sup foot_note=123>1</sup>, Lord of the worlds.';
    expect(stripFootnotes(input)).toBe('All praise is due to Allah, Lord of the worlds.');
  });

  test('removes any remaining markup and collapses whitespace', () => {
    expect(stripFootnotes('<i>Guide  us</i>\n to the   path')).toBe('Guide us to the path');
  });

  test('leaves plain text untouched', () => {
    expect(stripFootnotes('Read in the name of your Lord')).toBe(
      'Read in the name of your Lord',
    );
  });
});

describe('fetchAyah', () => {
  test('rejects an invalid reference before making a request', async () => {
    const spy = vi.fn();
    globalThis.fetch = spy as unknown as typeof fetch;

    await expect(fetchAyah(2, 287)).rejects.toThrow(QuranApiError);
    expect(spy).not.toHaveBeenCalled();
  });

  test('attaches a verifiable source to the returned block', async () => {
    mockJson({
      verse: {
        id: 1,
        verse_key: '1:1',
        verse_number: 1,
        text_uthmani: 'بِسْمِ اللَّهِ',
        translations: [{ resource_id: 20, text: 'In the name of Allah' }],
      },
    });

    const block = await fetchAyah(1, 1, 20);

    expect(block.kind).toBe('quran');
    expect(block.source.surah).toBe(1);
    expect(block.source.ayahFrom).toBe(1);
    expect(block.source.translatorName).toBe('Saheeh International');
    expect(block.arabic).toBe('بِسْمِ اللَّهِ');
    expect(block.translation).toBe('In the name of Allah');
  });

  test('falls back to the default translation for an id we do not offer', async () => {
    mockJson({
      verse: { id: 1, verse_key: '1:1', verse_number: 1, text_uthmani: 'x', translations: [] },
    });

    const block = await fetchAyah(1, 1, 999_999);

    expect(block.source.translationId).toBe(20);
  });
});

describe('fetchSurahVerses', () => {
  test('rejects a surah outside 1..114', async () => {
    await expect(fetchSurahVerses(115)).rejects.toThrow(/does not exist/);
  });

  test('maps every returned verse to an attributed block', async () => {
    mockJson({
      verses: [
        {
          id: 1,
          verse_key: '112:1',
          verse_number: 1,
          text_uthmani: 'قُلْ',
          translations: [{ resource_id: 20, text: 'Say' }],
        },
        {
          id: 2,
          verse_key: '112:2',
          verse_number: 2,
          text_uthmani: 'اللَّهُ',
          translations: [{ resource_id: 20, text: 'Allah' }],
        },
      ],
    });

    const blocks = await fetchSurahVerses(112, 20);

    expect(blocks).toHaveLength(2);
    expect(blocks.every((block) => block.source.kind === 'quran')).toBe(true);
    expect(blocks[1]?.id).toBe('quran-112-2');
    expect(blocks[1]?.source.ayahFrom).toBe(2);
  });

  test('surfaces a transliteration line when asked for one', async () => {
    mockJson({
      verses: [
        {
          id: 1,
          verse_key: '112:1',
          verse_number: 1,
          text_uthmani: 'قُلْ',
          translations: [
            { resource_id: 20, text: 'Say' },
            { resource_id: 57, text: 'Qul' },
          ],
        },
      ],
    });

    const [block] = await fetchSurahVerses(112, 20, { includeTransliteration: true });

    expect(block?.transliteration).toBe('Qul');
  });

  test('raises a typed error on a non-OK response rather than returning empty text', async () => {
    mockJson({}, false, 503);

    await expect(fetchSurahVerses(1)).rejects.toThrow(QuranApiError);
  });

  test('raises a typed error when the source is unreachable', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('offline')) as unknown as typeof fetch;

    await expect(fetchSurahVerses(1)).rejects.toThrow(/Could not reach the Quran source/);
  });
});
