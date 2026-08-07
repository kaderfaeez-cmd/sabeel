import { describe, expect, test } from 'vitest';
import { getStory, STORIES } from './stories';
import { getSurah } from '@/lib/quran/surahs';

describe('every story passage points at a real place in the Quran', () => {
  test('every surah exists and every range fits inside it', () => {
    // A range running past the end of a surah would silently render fewer verses than
    // the story claims, or none at all.
    for (const story of STORIES) {
      for (const passage of story.passages) {
        const surah = getSurah(passage.surah);

        expect(surah, `${story.id}/${passage.id}: surah ${passage.surah}`).toBeDefined();
        expect(
          passage.ayahFrom,
          `${story.id}/${passage.id}: ayahFrom`,
        ).toBeGreaterThanOrEqual(1);
        expect(
          passage.ayahTo,
          `${story.id}/${passage.id}: ayahTo past end of ${surah!.name}`,
        ).toBeLessThanOrEqual(surah!.ayahCount);
        expect(
          passage.ayahTo,
          `${story.id}/${passage.id}: range runs backwards`,
        ).toBeGreaterThanOrEqual(passage.ayahFrom);
      }
    }
  });

  test('no passage is absurdly long — these are readable movements, not whole surahs', () => {
    for (const story of STORIES) {
      for (const passage of story.passages) {
        const length = passage.ayahTo - passage.ayahFrom + 1;
        expect(length, `${story.id}/${passage.id} is ${length} ayahs`).toBeLessThanOrEqual(20);
      }
    }
  });
});

describe('story structure', () => {
  test('story ids are unique and resolvable', () => {
    const ids = STORIES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(getStory(ids[0]!)).toBeDefined();
    expect(getStory('not-a-story')).toBeUndefined();
  });

  test('passage ids are unique within a story', () => {
    for (const story of STORIES) {
      const ids = story.passages.map((p) => p.id);
      expect(new Set(ids).size, story.id).toBe(ids.length);
    }
  });

  test('every story has passages, lessons and reflections', () => {
    for (const story of STORIES) {
      expect(story.passages.length, story.id).toBeGreaterThan(1);
      expect(story.lessons.length, story.id).toBeGreaterThan(1);
      expect(story.reflections.length, story.id).toBeGreaterThan(0);
    }
  });

  test('every story carries its Arabic name', () => {
    for (const story of STORIES) {
      expect(story.arabicName.trim(), story.id).not.toBe('');
      // Arabic block, so a Latin-script placeholder cannot slip through.
      expect(/[؀-ۿ]/.test(story.arabicName), story.id).toBe(true);
    }
  });
});

describe('the visual policy holds in the data', () => {
  test('no story carries an image field of any kind', () => {
    // Constitution §6: no Prophet or revered figure is ever depicted. The safest
    // enforcement is that the type carries nowhere to put a picture.
    for (const story of STORIES) {
      const keys = Object.keys(story);
      expect(keys.some((k) => /image|photo|picture|illustration|avatar/i.test(k))).toBe(false);
    }
  });
});

describe('the framing is Sabeel’s and the scripture is not', () => {
  test('no passage puts words in quotation marks in its framing', () => {
    // Story framing must not paraphrase or invent speech — the verses say what was said.
    for (const story of STORIES) {
      for (const passage of story.passages) {
        expect(passage.context, `${story.id}/${passage.id}`).not.toMatch(/[""]/);
      }
    }
  });

  test('lessons and reflections are substantive rather than filler', () => {
    for (const story of STORIES) {
      for (const lesson of story.lessons) {
        expect(lesson.length, story.id).toBeGreaterThan(40);
      }
      for (const reflection of story.reflections) {
        expect(reflection.trim().endsWith('?'), `${story.id}: "${reflection}"`).toBe(true);
      }
    }
  });
});
