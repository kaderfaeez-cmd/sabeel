import { afterEach, describe, expect, test, vi } from 'vitest';
import { condense, fetchChapterInfo, splitSource, toPlainText } from './chapter-info';

const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe('toPlainText', () => {
  test('strips markup and normalises whitespace', () => {
    expect(toPlainText('<p>Name</p><p>This Surah   takes its name</p>')).toBe(
      'Name\n\nThis Surah takes its name',
    );
  });

  test('decodes the entities the source uses', () => {
    expect(toPlainText('a &amp; b &quot;c&quot;')).toBe('a & b "c"');
  });
});

describe('condense', () => {
  test('leaves short text alone', () => {
    expect(condense('Short.', 900)).toBe('Short.');
  });

  test('cuts at a sentence boundary rather than mid-word', () => {
    const text = `${'A'.repeat(400)}. ${'B'.repeat(400)}. ${'C'.repeat(400)}.`;
    const out = condense(text, 500);
    expect(out.endsWith('.')).toBe(true);
    expect(out.length).toBeLessThanOrEqual(500);
  });
});

describe('splitSource', () => {
  test('splits the author from the work', () => {
    expect(splitSource("Sayyid Abul Ala Maududi - Tafhim al-Qur'an")).toEqual({
      author: 'Sayyid Abul Ala Maududi',
      work: "Tafhim al-Qur'an",
    });
  });

  test('falls back safely when there is no separator', () => {
    expect(splitSource('Some Source')).toEqual({ author: 'Some Source', work: 'Some Source' });
  });
});

describe('fetchChapterInfo', () => {
  function mock(body: unknown, ok = true) {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok,
      status: ok ? 200 : 500,
      json: async () => body,
    }) as unknown as typeof fetch;
  }

  test('returns a scholarly block with the author credited', async () => {
    mock({
      chapter_info: {
        text: '<p>This Surah takes its name from the cave mentioned in it, and it was revealed in Makkah during the third stage.</p>',
        source: "Sayyid Abul Ala Maududi - Tafhim al-Qur'an",
      },
    });

    const block = await fetchChapterInfo(18);

    expect(block?.kind).toBe('scholarly');
    expect(block?.source.author).toBe('Sayyid Abul Ala Maududi');
    expect(block?.text).toContain('takes its name');
  });

  test('REFUSES to return anything when the source is missing', async () => {
    // Constitution §3.2 — an unattributed introduction cannot be shown at all.
    mock({ chapter_info: { text: '<p>Some description of the surah, reasonably long.</p>' } });

    await expect(fetchChapterInfo(18)).resolves.toBeNull();
  });

  test('rejects a surah number outside 1..114 without calling the API', async () => {
    const spy = vi.fn();
    globalThis.fetch = spy as unknown as typeof fetch;

    await expect(fetchChapterInfo(0)).resolves.toBeNull();
    await expect(fetchChapterInfo(115)).resolves.toBeNull();
    expect(spy).not.toHaveBeenCalled();
  });

  test('returns null rather than throwing when the source is unreachable', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('offline')) as unknown as typeof fetch;
    await expect(fetchChapterInfo(1)).resolves.toBeNull();
  });

  test('returns null on a non-OK response', async () => {
    mock({}, false);
    await expect(fetchChapterInfo(1)).resolves.toBeNull();
  });
});
