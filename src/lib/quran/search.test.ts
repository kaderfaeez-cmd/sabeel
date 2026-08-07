import { afterEach, describe, expect, test, vi } from 'vitest';
import { MAX_QUERY_LENGTH, parseHighlighted, searchQuran } from './search';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe('parseHighlighted', () => {
  test('splits a highlighted match into flagged segments', () => {
    const segments = parseHighlighted('So be patient with gracious <em>patience</em>.');

    expect(segments).toEqual([
      { text: 'So be patient with gracious ', match: false },
      { text: 'patience', match: true },
      { text: '.', match: false },
    ]);
  });

  test('handles several matches in one verse', () => {
    const segments = parseHighlighted('<em>Allah</em> is the light of <em>Allah</em>');

    expect(segments.filter((s) => s.match)).toHaveLength(2);
  });

  test('returns a single plain segment when nothing is highlighted', () => {
    expect(parseHighlighted('No match here')).toEqual([
      { text: 'No match here', match: false },
    ]);
  });

  test('strips any markup other than the highlight, rather than trusting it', () => {
    // The API is a third party; injected markup must never survive into rendering.
    const segments = parseHighlighted(
      'safe <script>alert(1)</script> text <em>match</em><img src=x onerror=1>',
    );
    const joined = segments.map((s) => s.text).join('');

    expect(joined).not.toContain('<');
    expect(joined).not.toContain('script');
    expect(segments.some((s) => s.match && s.text === 'match')).toBe(true);
  });

  test('strips markup nested inside a highlight', () => {
    const segments = parseHighlighted('<em>a<b>b</b></em>');

    expect(segments).toEqual([{ text: 'ab', match: true }]);
  });

  test('returns nothing for empty input', () => {
    expect(parseHighlighted('')).toEqual([]);
  });
});

describe('searchQuran', () => {
  test('returns an empty response for a blank query without calling the API', async () => {
    const spy = vi.fn();
    globalThis.fetch = spy as unknown as typeof fetch;

    const response = await searchQuran('   ');

    expect(response.results).toHaveLength(0);
    expect(response.totalResults).toBe(0);
    expect(spy).not.toHaveBeenCalled();
  });

  test('caps an over-long query rather than forwarding it', async () => {
    let requested: URL | undefined;
    globalThis.fetch = vi.fn().mockImplementation((url: URL) => {
      requested = url;
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({ search: { total_results: 0, results: [] } }),
      });
    }) as unknown as typeof fetch;

    await searchQuran('x'.repeat(MAX_QUERY_LENGTH + 200));

    expect(requested?.searchParams.get('q')).toHaveLength(MAX_QUERY_LENGTH);
  });

  test('maps results to references with parsed segments', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        search: {
          total_results: 195,
          results: [
            {
              verse_key: '70:5',
              text: 'فَٱصْبِرْ',
              translations: [
                {
                  text: 'So be patient with gracious <em>patience</em>.',
                  resource_id: 20,
                  name: 'Saheeh International',
                },
              ],
            },
          ],
        },
      }),
    }) as unknown as typeof fetch;

    const response = await searchQuran('patience', 20);

    expect(response.totalResults).toBe(195);
    expect(response.results[0]?.surah).toBe(70);
    expect(response.results[0]?.ayah).toBe(5);
    expect(response.results[0]?.translatorName).toBe('Saheeh International');
    expect(response.results[0]?.segments.some((s) => s.match)).toBe(true);
  });

  test('drops a result whose verse key cannot be parsed rather than guessing', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        search: {
          total_results: 2,
          results: [
            { verse_key: 'not-a-key', text: 'x', translations: [] },
            { verse_key: '1:1', text: 'y', translations: [] },
          ],
        },
      }),
    }) as unknown as typeof fetch;

    const response = await searchQuran('x');

    expect(response.results).toHaveLength(1);
    expect(response.results[0]?.surah).toBe(1);
  });

  test('throws on a non-OK response rather than returning empty results', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    }) as unknown as typeof fetch;

    await expect(searchQuran('patience')).rejects.toThrow(/Search is unavailable/);
  });
});
