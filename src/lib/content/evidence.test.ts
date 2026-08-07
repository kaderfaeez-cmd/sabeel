import { describe, expect, test } from 'vitest';
import {
  awaitsHumanReview,
  ESTABLISHED_PRACTICE_NOTICE,
  EVIDENCE_STATUS,
  EVIDENCE_STATUS_COPY,
  isCitableAsProof,
  isDisplayable,
  type EvidenceStatus,
} from './evidence';
import { hasCitableEvidence, type Evidence, type QuranBlock } from './types';

const quranBlock: QuranBlock = {
  kind: 'quran',
  id: 'q',
  arabic: 'x',
  translation: 'y',
  source: {
    kind: 'quran',
    surah: 2,
    ayahFrom: 43,
    ayahTo: 43,
    translationId: 20,
    translatorName: 'Saheeh International',
  },
};

describe('the evidence statuses are kept distinct', () => {
  test('every status has its own reader-facing wording', () => {
    const nonVerified = EVIDENCE_STATUS.filter(
      (s): s is Exclude<EvidenceStatus, 'verified'> => s !== 'verified',
    );

    const bodies = nonVerified.map((s) => EVIDENCE_STATUS_COPY[s].body);

    expect(new Set(bodies).size).toBe(bodies.length);
  });

  test('"unverified-in-dataset" does not imply the narration is defective', () => {
    // This is the owner's correction, asserted directly: the copy must describe a limit
    // of OUR checking, and must not assert weakness or falsehood.
    const body = EVIDENCE_STATUS_COPY['unverified-in-dataset'].body;

    expect(body).toContain('does not necessarily mean the narration is weak or false');
    expect(body).toContain('cannot confidently present it as evidence');
  });

  test('"weak" and "unverified-in-dataset" never share wording', () => {
    expect(EVIDENCE_STATUS_COPY.weak.body).not.toBe(
      EVIDENCE_STATUS_COPY['unverified-in-dataset'].body,
    );
  });

  test('"disputed" describes a scholarly difference, not a defect', () => {
    const copy = EVIDENCE_STATUS_COPY.disputed;

    expect(copy.heading).toMatch(/differed/i);
    expect(copy.body).not.toMatch(/weak/i);
  });

  test('"disputed" says it is the GRADING that is disputed, not the ruling', () => {
    // This notice appears beside rulings the four schools agree on. Without naming the
    // grading it reads as a disagreement about the ruling itself.
    expect(EVIDENCE_STATUS_COPY.disputed.heading).toMatch(/grading/i);
  });

  test('"fabricated" is distinct from "weak"', () => {
    expect(EVIDENCE_STATUS_COPY.fabricated.body).toMatch(/fabricated/i);
    expect(EVIDENCE_STATUS_COPY.fabricated.body).not.toBe(EVIDENCE_STATUS_COPY.weak.body);
  });
});

describe('isCitableAsProof', () => {
  test('only a verified narration may be presented as proof', () => {
    expect(isCitableAsProof('verified')).toBe(true);
    for (const status of EVIDENCE_STATUS.filter((s) => s !== 'verified')) {
      expect(isCitableAsProof(status)).toBe(false);
    }
  });
});

describe('isDisplayable', () => {
  test('a disputed narration is shown, because hiding a real difference would distort', () => {
    expect(isDisplayable('disputed')).toBe(true);
  });

  test('weak and fabricated narrations are never displayed as evidence', () => {
    expect(isDisplayable('weak')).toBe(false);
    expect(isDisplayable('fabricated')).toBe(false);
  });

  test('an unverified reference is not displayed as evidence', () => {
    expect(isDisplayable('unverified-in-dataset')).toBe(false);
    expect(isDisplayable('not-found')).toBe(false);
  });
});

describe('needs-review — an open question, not a conclusion', () => {
  test('is not citable and not displayed as evidence', () => {
    expect(isCitableAsProof('needs-review')).toBe(false);
    expect(isDisplayable('needs-review')).toBe(false);
  });

  test('is the only status awaiting a human decision', () => {
    expect(awaitsHumanReview('needs-review')).toBe(true);
    for (const status of EVIDENCE_STATUS.filter((s) => s !== 'needs-review')) {
      expect(awaitsHumanReview(status)).toBe(false);
    }
  });

  test('its wording says nothing about the narration itself', () => {
    // Constitution §3.3: detection flagged it; no judgement has been made.
    const body = EVIDENCE_STATUS_COPY['needs-review'].body;

    expect(body).toContain('says nothing about the narration itself');
    expect(body).toContain('human review');
    expect(body).not.toMatch(/\bweak\b/i);
  });

  test('does not share wording with weak or unverified-in-dataset', () => {
    const body = EVIDENCE_STATUS_COPY['needs-review'].body;
    expect(body).not.toBe(EVIDENCE_STATUS_COPY.weak.body);
    expect(body).not.toBe(EVIDENCE_STATUS_COPY['unverified-in-dataset'].body);
  });
});

describe('ESTABLISHED_PRACTICE_NOTICE', () => {
  test('says the practice is established, and that the gap is ours', () => {
    // A page must never read as "there is no evidence" merely because the gate has not
    // yet cleared a specific narration.
    expect(ESTABLISHED_PRACTICE_NOTICE.body).toContain('mainstream Sunni scholarship');
    expect(ESTABLISHED_PRACTICE_NOTICE.body).toContain('not yet verified a citation');
    expect(ESTABLISHED_PRACTICE_NOTICE.body).toContain('future updates');
  });
});

describe('hasCitableEvidence', () => {
  test('is true when the Quran establishes the point, even with no hadith', () => {
    const evidence: Evidence = { quran: [quranBlock] };
    expect(hasCitableEvidence(evidence)).toBe(true);
  });

  test('is false when only notices are present', () => {
    const evidence: Evidence = {
      notices: [{ id: 'n', status: 'unverified-in-dataset' }],
    };
    expect(hasCitableEvidence(evidence)).toBe(false);
  });

  test('is false for empty arrays, not merely absent ones', () => {
    expect(hasCitableEvidence({ quran: [], hadith: [] })).toBe(false);
  });

  test('scholarly explanation alone is not citable proof', () => {
    // Explanation supports understanding; it does not establish a ruling.
    const evidence: Evidence = {
      scholarly: [
        {
          kind: 'scholarly',
          id: 's',
          text: 'x',
          source: { kind: 'scholarly', author: 'A', work: 'W' },
        },
      ],
    };
    expect(hasCitableEvidence(evidence)).toBe(false);
  });
});
