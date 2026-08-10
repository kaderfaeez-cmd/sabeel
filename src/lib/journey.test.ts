import { describe, expect, test } from 'vitest';
import {
  JOURNEY,
  journeyIndex,
  journeyStep,
  nextStep,
  previousStep,
  stepForPath,
} from './journey';
import { SECTION_GROUPS } from './navigation';

describe('the guided journey', () => {
  test('step ids are unique', () => {
    const ids = JOURNEY.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('every step points at a page that exists in the navigation', () => {
    // A journey step leading to a 404 is the exact failure the nav rule exists to stop.
    const known = new Set(SECTION_GROUPS.flatMap((g) => g.sections.map((s) => s.href)));
    for (const step of JOURNEY) {
      expect(known.has(step.href), `${step.id} -> ${step.href}`).toBe(true);
    }
  });

  test('every step gives an honest time and a reason to click', () => {
    for (const step of JOURNEY) {
      expect(step.minutes, step.id).toBeGreaterThan(0);
      expect(step.minutes, step.id).toBeLessThan(60);
      expect(step.blurb.length, step.id).toBeGreaterThan(25);
      expect(step.short.length, step.id).toBeLessThanOrEqual(10);
    }
  });

  test('wudhu comes before salah — it is what unlocks prayer', () => {
    expect(journeyIndex('wudhu')).toBeLessThan(journeyIndex('salah'));
  });

  test('the path opens with orientation rather than with practice', () => {
    expect(JOURNEY[0]?.id).toBe('start');
    expect(JOURNEY[1]?.id).toBe('islam');
  });
});

describe('navigation between steps', () => {
  test('nextStep walks forward and stops at the end', () => {
    expect(nextStep('wudhu')?.id).toBe('salah');
    expect(nextStep(JOURNEY[JOURNEY.length - 1]!.id)).toBeUndefined();
  });

  test('previousStep walks back and stops at the start', () => {
    expect(previousStep('salah')?.id).toBe('wudhu');
    expect(previousStep('start')).toBeUndefined();
  });

  test('an unknown id yields nothing rather than throwing', () => {
    expect(journeyStep('nope')).toBeUndefined();
    expect(nextStep('nope')).toBeUndefined();
    expect(previousStep('nope')).toBeUndefined();
    expect(journeyIndex('nope')).toBe(-1);
  });
});

describe('stepForPath', () => {
  test('matches a page to its step', () => {
    expect(stepForPath('/salah')?.id).toBe('salah');
    expect(stepForPath('/quran')?.id).toBe('quran');
  });

  test('matches a nested route to its parent step', () => {
    expect(stepForPath('/quran/18')?.id).toBe('quran');
    expect(stepForPath('/stories/musa')?.id).toBe('stories');
  });

  test('does not match a longer path to a shorter step by accident', () => {
    // /wudhu/nullifiers must not be mistaken for a different step.
    expect(stepForPath('/wudhu/nullifiers')?.id).toBe('wudhu');
  });

  test('returns nothing for a page outside the journey', () => {
    expect(stepForPath('/settings')).toBeUndefined();
    expect(stepForPath('/')).toBeUndefined();
  });
});
