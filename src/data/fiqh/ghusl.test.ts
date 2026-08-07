import { describe, expect, test } from 'vitest';
import { GHUSL_DIFFERENCES, GHUSL_OCCASIONS, GHUSL_STEPS } from './ghusl';
import { WUDHU_STEPS } from './wudhu';
import { MADHHAB_LABEL } from '@/lib/content/types';

const SCHOOL_NAMES = Object.values(MADHHAB_LABEL);

describe('the Ghusl guide', () => {
  test('every step declares a ruling class — FIQH-POLICY §3', () => {
    for (const step of GHUSL_STEPS) {
      expect(['pillar', 'obligatory', 'sunnah', 'recommended']).toContain(step.ruling);
    }
  });

  test('every step carries evidence — no orphaned assertions', () => {
    for (const step of GHUSL_STEPS) {
      const hasReference =
        (step.evidence.quran?.length ?? 0) > 0 || (step.evidence.hadith?.length ?? 0) > 0;
      expect(hasReference).toBe(true);
    }
  });

  test('washing the whole body is a pillar and rests on the Quran', () => {
    const body = GHUSL_STEPS.find((step) => step.id === 'body');

    expect(body?.ruling).toBe('pillar');
    expect(body?.evidence.quran?.[0]).toEqual({ surah: 5, ayah: 6 });
  });

  test('every occasion requiring ghusl carries evidence', () => {
    for (const occasion of GHUSL_OCCASIONS) {
      const hasReference =
        (occasion.evidence.quran?.length ?? 0) > 0 ||
        (occasion.evidence.hadith?.length ?? 0) > 0;
      expect(hasReference).toBe(true);
    }
  });

  test('does not cite the two chain-only Muslim entries that were checked and rejected', () => {
    // Sahih Muslim 316 and 317 are commonly quoted for ghusl but are chain-only
    // fragments in this dataset. Passing authenticity is not the same as carrying
    // usable content.
    const cited = JSON.stringify(GHUSL_STEPS) + JSON.stringify(GHUSL_OCCASIONS);

    expect(cited).not.toMatch(/"collection":"muslim","number":31[67]/);
  });
});

describe('scholarly differences follow FIQH-POLICY §2', () => {
  const allDifferences = [...GHUSL_DIFFERENCES];

  test('every position names at least one recognised school', () => {
    for (const difference of allDifferences) {
      for (const position of difference.positions) {
        expect(position.schools.length).toBeGreaterThan(0);
        for (const school of position.schools) {
          expect(SCHOOL_NAMES).toContain(school);
        }
      }
    }
  });

  test('no position is marked correct, preferred or strongest', () => {
    // The policy forbids ranking the schools, and the data offers no field for it —
    // this guards against it creeping into the prose instead.
    const text = JSON.stringify(allDifferences).toLowerCase();

    expect(text).not.toMatch(/strongest|most correct|correct opinion|preferred view|the right view/);
  });

  test('every difference asks a real question', () => {
    for (const difference of allDifferences) {
      expect(difference.question.trim().endsWith('?')).toBe(true);
      expect(difference.positions.length).toBeGreaterThan(0);
    }
  });
});

describe('the shared step shape', () => {
  test('Wudhu and Ghusl steps share the same structure', () => {
    // Both feed the same StepCard; if one drifts the renderer silently loses a field.
    const shape = (step: (typeof GHUSL_STEPS)[number]) =>
      ['id', 'title', 'ruling', 'agreedUpon', 'instruction', 'evidence'].every(
        (key) => key in step,
      );

    expect(GHUSL_STEPS.every(shape)).toBe(true);
    expect(WUDHU_STEPS.every(shape)).toBe(true);
  });

  test('step ids are unique within each guide', () => {
    const ghuslIds = GHUSL_STEPS.map((s) => s.id);
    expect(new Set(ghuslIds).size).toBe(ghuslIds.length);
  });
});
