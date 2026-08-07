import { describe, expect, test } from 'vitest';
import {
  findSource,
  performerLabel,
  resolveSourceId,
  resolveTrackUrl,
  type AudioSource,
} from './providers';
import { reciterSources } from '@/lib/quran/recitations';

const sources: readonly AudioSource[] = [
  { id: 'a', kind: 'quran-recitation', performer: 'Reciter A', provider: 'p' },
  { id: 'b', kind: 'quran-recitation', performer: 'Reciter B', style: 'Muallim', provider: 'p' },
];

describe('performerLabel', () => {
  test('adds the style only when there is one', () => {
    expect(performerLabel(sources[0]!)).toBe('Reciter A');
    expect(performerLabel(sources[1]!)).toBe('Reciter B (Muallim)');
  });
});

describe('resolveSourceId', () => {
  test('accepts a source we offer', () => {
    expect(resolveSourceId(sources, 'b', 'a')).toBe('b');
  });

  test('falls back for absent, unknown and hostile input', () => {
    expect(resolveSourceId(sources, undefined, 'a')).toBe('a');
    expect(resolveSourceId(sources, 'zzz', 'a')).toBe('a');
    expect(resolveSourceId(sources, '../../etc/passwd', 'a')).toBe('a');
  });

  test('falls back to the first source when even the fallback is unknown', () => {
    expect(resolveSourceId(sources, undefined, 'missing')).toBe('a');
  });
});

describe('resolveTrackUrl', () => {
  test('joins a relative path to the provider base', () => {
    expect(resolveTrackUrl('https://verses.quran.com', 'Alafasy/mp3/112001.mp3')).toBe(
      'https://verses.quran.com/Alafasy/mp3/112001.mp3',
    );
  });

  test('does not double slashes', () => {
    expect(resolveTrackUrl('https://x.com/', '/a/b.mp3')).toBe('https://x.com/a/b.mp3');
  });

  test('passes an absolute URL through unchanged', () => {
    const absolute = 'https://download.quranicaudio.com/x/112.mp3';
    expect(resolveTrackUrl('https://verses.quran.com', absolute)).toBe(absolute);
  });
});

describe('the reciter set is expressed in the shared audio vocabulary', () => {
  test('every reciter maps to an AudioSource with a credited performer and provider', () => {
    for (const source of reciterSources()) {
      expect(source.performer.trim()).not.toBe('');
      expect(source.provider.trim()).not.toBe('');
      expect(source.kind).toBe('quran-recitation');
    }
  });

  test('no reciter is hardcoded — more than one is available', () => {
    expect(reciterSources().length).toBeGreaterThan(1);
  });

  test('ids are unique and resolvable', () => {
    const all = reciterSources();
    expect(new Set(all.map((s) => s.id)).size).toBe(all.length);
    expect(findSource(all, all[0]!.id)).toBeDefined();
  });

  test('two recordings by the same performer are distinguishable by label', () => {
    const labels = reciterSources().map(performerLabel);
    expect(new Set(labels).size).toBe(labels.length);
  });
});
