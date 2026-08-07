import { afterEach, describe, expect, test, vi } from 'vitest';
import {
  DEFAULT_RECITER_ID,
  fetchSurahAudio,
  getReciter,
  RECITERS,
  reciterLabel,
  resolveAudioUrl,
  resolveReciterId,
} from './recitations';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe('the curated reciter set', () => {
  test('reciter ids are unique', () => {
    const ids = RECITERS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('the default reciter is one we offer', () => {
    expect(getReciter(DEFAULT_RECITER_ID)).toBeDefined();
  });

  test('disambiguates two recitations by the same reciter using style', () => {
    // Both Husary entries share a name, so the label must distinguish them.
    const husary = RECITERS.filter((r) => r.name.includes('Husary'));
    expect(husary.length).toBeGreaterThan(1);
    const labels = husary.map(reciterLabel);
    expect(new Set(labels).size).toBe(labels.length);
  });

  test('omits the style suffix when there is none', () => {
    expect(reciterLabel({ id: 7, name: 'Mishari', note: '' })).toBe('Mishari');
  });
});

describe('resolveReciterId', () => {
  test('falls back to the default for absent, unknown and hostile input', () => {
    expect(resolveReciterId(undefined)).toBe(DEFAULT_RECITER_ID);
    expect(resolveReciterId('')).toBe(DEFAULT_RECITER_ID);
    expect(resolveReciterId('999')).toBe(DEFAULT_RECITER_ID);
    expect(resolveReciterId('../../etc/passwd')).toBe(DEFAULT_RECITER_ID);
  });

  test('accepts a reciter we offer', () => {
    expect(resolveReciterId('6')).toBe(6);
  });
});

describe('resolveAudioUrl', () => {
  test('resolves a relative path against the verified audio host', () => {
    expect(resolveAudioUrl('Alafasy/mp3/112001.mp3')).toBe(
      'https://verses.quran.com/Alafasy/mp3/112001.mp3',
    );
  });

  test('does not double the slash on a leading-slash path', () => {
    expect(resolveAudioUrl('/Alafasy/mp3/112001.mp3')).toBe(
      'https://verses.quran.com/Alafasy/mp3/112001.mp3',
    );
  });

  test('passes an absolute URL through unchanged', () => {
    const absolute = 'https://download.quranicaudio.com/qdc/x/112.mp3';
    expect(resolveAudioUrl(absolute)).toBe(absolute);
  });
});

describe('fetchSurahAudio', () => {
  test('returns one resolved URL per ayah, ordered by ayah number', async () => {
    // Deliberately out of order — the API does not guarantee ordering.
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        audio_files: [
          { verse_key: '112:3', url: 'Alafasy/mp3/112003.mp3' },
          { verse_key: '112:1', url: 'Alafasy/mp3/112001.mp3' },
          { verse_key: '112:2', url: 'Alafasy/mp3/112002.mp3' },
        ],
      }),
    }) as unknown as typeof fetch;

    const urls = await fetchSurahAudio(112, 7);

    expect(urls).toEqual([
      'https://verses.quran.com/Alafasy/mp3/112001.mp3',
      'https://verses.quran.com/Alafasy/mp3/112002.mp3',
      'https://verses.quran.com/Alafasy/mp3/112003.mp3',
    ]);
  });

  test('throws on a non-OK response rather than returning a silent empty list', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 502,
      json: async () => ({}),
    }) as unknown as typeof fetch;

    await expect(fetchSurahAudio(112)).rejects.toThrow(/502/);
  });
});
