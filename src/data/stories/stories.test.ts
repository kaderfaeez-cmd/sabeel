import { describe, expect, test } from 'vitest';
import { activeThemes, getStory, STORIES, storiesWithTheme, THEME_LABEL } from './index';
import { getSurah } from '@/lib/quran/surahs';

describe('every passage points at a real place in the Quran', () => {
  test('every surah exists and every range fits inside it', () => {
    for (const story of STORIES) {
      for (const passage of story.passages) {
        const surah = getSurah(passage.surah);

        expect(surah, `${story.id}/${passage.id}: surah ${passage.surah}`).toBeDefined();
        expect(passage.ayahFrom, `${story.id}/${passage.id}`).toBeGreaterThanOrEqual(1);
        expect(
          passage.ayahTo,
          `${story.id}/${passage.id}: past end of ${surah!.name}`,
        ).toBeLessThanOrEqual(surah!.ayahCount);
        expect(
          passage.ayahTo,
          `${story.id}/${passage.id}: range runs backwards`,
        ).toBeGreaterThanOrEqual(passage.ayahFrom);
      }
    }
  });

  test('no passage exceeds twenty ayahs — these are readable movements', () => {
    for (const story of STORIES) {
      for (const passage of story.passages) {
        const length = passage.ayahTo - passage.ayahFrom + 1;
        expect(length, `${story.id}/${passage.id} is ${length} ayahs`).toBeLessThanOrEqual(20);
      }
    }
  });
});

describe('the beginner experience is present on every story', () => {
  // These assertions exist because of direct feedback from a recent revert: "it's
  // complicated", "the stories are direct translations", "even I'm not interested".
  // A story that opens straight into scripture is the failure mode being guarded against.

  test('every story opens with a hook a beginner can feel', () => {
    for (const story of STORIES) {
      expect(story.hook.length, story.id).toBeGreaterThan(120);
      // The hook must not lead with a citation or Arabic — it is the human entry point.
      expect(/\d+:\d+/.test(story.hook), `${story.id} hook contains a reference`).toBe(false);
      expect(/[؀-ۿ]/.test(story.hook), `${story.id} hook contains Arabic`).toBe(false);
    }
  });

  test('every story says why it matters and what you will learn', () => {
    for (const story of STORIES) {
      expect(story.whyItMatters.length, story.id).toBeGreaterThan(100);
      expect(story.whatYoullLearn.length, story.id).toBeGreaterThanOrEqual(3);
    }
  });

  test('every story gives an honest reading time and difficulty', () => {
    for (const story of STORIES) {
      expect(story.readingMinutes, story.id).toBeGreaterThan(0);
      expect(story.readingMinutes, story.id).toBeLessThan(30);
      expect(['gentle', 'moderate'], story.id).toContain(story.difficulty);
    }
  });

  test('every passage sets the scene BEFORE the verses and explains AFTER them', () => {
    for (const story of STORIES) {
      for (const passage of story.passages) {
        expect(passage.narrative.length, `${story.id}/${passage.id} narrative`).toBeGreaterThan(80);
        expect(
          passage.explanation.length,
          `${story.id}/${passage.id} explanation`,
        ).toBeGreaterThan(80);
      }
    }
  });

  test('every story ends with one concrete action', () => {
    for (const story of STORIES) {
      expect(story.actionToday.length, story.id).toBeGreaterThan(40);
    }
  });

  test('every story says what it teaches about Allah', () => {
    for (const story of STORIES) {
      expect(story.lessons.aboutAllah.length, story.id).toBeGreaterThan(80);
      expect(story.lessons.points.length, story.id).toBeGreaterThan(2);
      expect(story.lessons.character.length, story.id).toBeGreaterThan(1);
    }
  });

  test('reflections are questions, and are emotional rather than academic', () => {
    for (const story of STORIES) {
      expect(story.reflections.length, story.id).toBeGreaterThan(1);
      for (const reflection of story.reflections) {
        expect(reflection.trim().endsWith('?'), `${story.id}: "${reflection}"`).toBe(true);
      }
    }
  });
});

describe('Sabeel’s words never impersonate revelation', () => {
  test('no narrative or explanation contains quoted speech', () => {
    // Sabeel may set the scene, but the verses say what was said. Quotation marks in our
    // prose would mean we had started putting words in someone's mouth.
    for (const story of STORIES) {
      for (const passage of story.passages) {
        expect(passage.narrative, `${story.id}/${passage.id} narrative`).not.toMatch(/[""]/);
        expect(passage.explanation, `${story.id}/${passage.id} explanation`).not.toMatch(/[""]/);
      }
    }
  });
});

describe('the visual policy holds in the data', () => {
  test('a story has nowhere to put an image of a person', () => {
    // Constitution §6 enforced by shape rather than by intention.
    for (const story of STORIES) {
      const keys = Object.keys(story);
      expect(keys.some((k) => /image|photo|picture|illustration|avatar|portrait/i.test(k))).toBe(
        false,
      );
    }
  });
});

describe('structure and navigation', () => {
  test('story and passage ids are unique', () => {
    const ids = STORIES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const story of STORIES) {
      const passageIds = story.passages.map((p) => p.id);
      expect(new Set(passageIds).size, story.id).toBe(passageIds.length);
    }
  });

  test('getStory resolves and rejects correctly', () => {
    expect(getStory('musa')).toBeDefined();
    expect(getStory('not-a-story')).toBeUndefined();
  });

  test('every theme used has a reader-facing label', () => {
    for (const theme of activeThemes()) {
      expect(THEME_LABEL[theme]).toBeTruthy();
    }
  });

  test('theme filtering returns only stories carrying that theme', () => {
    for (const theme of activeThemes()) {
      const matches = storiesWithTheme(theme);
      expect(matches.length).toBeGreaterThan(0);
      for (const story of matches) {
        expect(story.themes).toContain(theme);
      }
    }
  });

  test('Musa opens the list — its hook needs no prior knowledge', () => {
    expect(STORIES[0]?.id).toBe('musa');
  });

  test('every related dua id, where present, is a real dua', async () => {
    const { DUAS } = await import('@/data/duas');
    const duaIds = new Set(DUAS.map((d) => d.id));

    for (const story of STORIES) {
      if (!story.relatedDuaId) continue;
      expect(duaIds.has(story.relatedDuaId), `${story.id} -> ${story.relatedDuaId}`).toBe(true);
    }
  });
});
