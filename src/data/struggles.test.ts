import { describe, expect, test } from 'vitest';
import { DUAS } from './duas';
import { STORIES } from './stories';
import { getStruggle, STRUGGLES } from './struggles';

describe('every struggle rests on real, cited evidence', () => {
  test('each one carries a Quran or hadith reference', () => {
    // Comfort offered here is never invented — it is a passage, fetched and cited.
    for (const struggle of STRUGGLES) {
      const has =
        (struggle.evidence.quran?.length ?? 0) > 0 ||
        (struggle.evidence.hadith?.length ?? 0) > 0;
      expect(has, struggle.id).toBe(true);
    }
  });

  test('related duas and stories resolve', () => {
    const duaIds = new Set(DUAS.map((d) => d.id));
    const storyIds = new Set(STORIES.map((s) => s.id));

    for (const struggle of STRUGGLES) {
      if (struggle.relatedDuaId) {
        expect(duaIds.has(struggle.relatedDuaId), `${struggle.id} dua`).toBe(true);
      }
      if (struggle.relatedStoryId) {
        expect(storyIds.has(struggle.relatedStoryId), `${struggle.id} story`).toBe(true);
      }
    }
  });
});

describe('the tone is guidance, not treatment', () => {
  test('every struggle acknowledges the feeling before offering anything', () => {
    for (const struggle of STRUGGLES) {
      expect(struggle.opening.length, struggle.id).toBeGreaterThan(90);
    }
  });

  test('every struggle ends with small, concrete steps', () => {
    for (const struggle of STRUGGLES) {
      expect(struggle.steps.length, struggle.id).toBeGreaterThan(1);
      for (const step of struggle.steps) {
        expect(step.length, struggle.id).toBeGreaterThan(25);
      }
    }
  });

  test('loneliness points to real help rather than offering a verse as a substitute', () => {
    // Where a struggle can be a health matter, a website must say so plainly.
    const alone = getStruggle('alone');
    expect(alone?.seekHelp).toBeTruthy();
    expect(alone?.seekHelp).toMatch(/professional|doctor/i);
    expect(alone?.seekHelp).toMatch(/not a failure of faith/i);
  });

  test('no struggle claims to diagnose or cure', () => {
    const text = JSON.stringify(STRUGGLES).toLowerCase();
    expect(text).not.toMatch(/\bcure\b|\bdiagnos|\btreat your\b|will heal you/);
  });
});

describe('lookup', () => {
  test('ids are unique and resolvable', () => {
    const ids = STRUGGLES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(getStruggle(ids[0]!)).toBeDefined();
    expect(getStruggle('not-a-struggle')).toBeUndefined();
  });
});
