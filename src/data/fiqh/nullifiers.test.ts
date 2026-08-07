import { describe, expect, test } from 'vitest';
import {
  NON_NULLIFIERS,
  NULLIFIER_DIFFERENCES,
  NULLIFIERS,
} from './nullifiers';
import { MADHHAB_LABEL } from '@/lib/content/types';

const SCHOOL_NAMES = Object.values(MADHHAB_LABEL);

describe('the nullifiers', () => {
  test('every nullifier carries evidence — no orphaned assertions', () => {
    for (const item of NULLIFIERS) {
      const hasReference =
        (item.evidence.quran?.length ?? 0) > 0 || (item.evidence.hadith?.length ?? 0) > 0;
      expect(hasReference).toBe(true);
    }
  });

  test('every nullifier states whether the schools agree', () => {
    for (const item of NULLIFIERS) {
      expect(['agreed', 'differed']).toContain(item.agreement);
    }
  });

  test('a contested nullifier is never presented as settled', () => {
    // The reader must be told it is contested at the point of reading it, not only in a
    // section further down the page.
    for (const item of NULLIFIERS.filter((n) => n.agreement === 'differed')) {
      expect(item.disagreementNote?.trim()).toBeTruthy();
    }
  });

  test('every contested nullifier has a matching difference section', () => {
    const differenceIds = new Set(NULLIFIER_DIFFERENCES.map((d) => d.id));

    for (const item of NULLIFIERS.filter((n) => n.agreement === 'differed')) {
      expect(differenceIds.has(item.id)).toBe(true);
    }
  });

  test('does not cite the three references that were checked and found to be other topics', () => {
    // Sahih Muslim 360 concerns defending property, 361 a dispute between companions,
    // and Tirmidhi 96 wiping over footwear. All three are commonly misremembered as
    // nullifier evidence.
    const cited = JSON.stringify(NULLIFIERS) + JSON.stringify(NON_NULLIFIERS);

    expect(cited).not.toMatch(/"collection":"muslim","number":36[01]/);
    expect(cited).not.toMatch(/"collection":"tirmidhi","number":96/);
  });
});

describe('what does not break wudhu', () => {
  test('the doubt entry cites its evidence, since it is the one that removes most anxiety', () => {
    const doubt = NON_NULLIFIERS.find((item) => item.id === 'doubt');

    expect(doubt?.evidence?.hadith?.[0]).toEqual({ collection: 'bukhari', number: 137 });
  });

  test('every entry gives a clarification, not just a denial', () => {
    for (const item of NON_NULLIFIERS) {
      expect(item.clarification.trim().length).toBeGreaterThan(40);
    }
  });

  test('bleeding and vomiting are NOT listed here — they are contested, not settled', () => {
    // Stating flatly that they do not break wudhu would misrepresent the Hanafi school.
    const ids = NON_NULLIFIERS.map((item) => item.id);

    expect(ids).not.toContain('bleeding');
    expect(ids).not.toContain('vomiting');
  });

  test('an entry citing evidence for a minority position must say what the evidence shows', () => {
    // Otherwise a reader sees a citation under "does not break wudhu" and assumes the
    // narration says so, when it may say close to the opposite.
    for (const item of NON_NULLIFIERS) {
      if (!item.evidence) continue;
      expect(item.clarification.length).toBeGreaterThan(40);
    }
  });
});

describe('the differences follow FIQH-POLICY §2', () => {
  test('every position names recognised schools only', () => {
    for (const difference of NULLIFIER_DIFFERENCES) {
      for (const position of difference.positions) {
        expect(position.schools.length).toBeGreaterThan(0);
        for (const school of position.schools) {
          expect(SCHOOL_NAMES).toContain(school);
        }
      }
    }
  });

  test('no position is marked correct, preferred or strongest', () => {
    const text = JSON.stringify(NULLIFIER_DIFFERENCES).toLowerCase();

    expect(text).not.toMatch(
      /strongest|most correct|correct opinion|preferred view|the right view|weaker opinion/,
    );
  });

  test('bleeding and vomiting each name the narration their positions rest on', () => {
    const bleeding = JSON.stringify(NULLIFIER_DIFFERENCES.find((d) => d.id === 'bleeding'));
    const vomiting = JSON.stringify(NULLIFIER_DIFFERENCES.find((d) => d.id === 'vomiting'));

    // Abu Dawud 198 — the sentry struck by arrows who continued praying.
    expect(bleeding).toMatch(/arrows/i);
    // Tirmidhi 87 — Abu ad-Darda, the Prophet ﷺ vomited and performed wudhu.
    expect(vomiting).toMatch(/Abu ad-Darda/);
  });

  test('where Sabeel has not verified a position’s evidence, it says so rather than omitting it', () => {
    const bleeding = JSON.stringify(NULLIFIER_DIFFERENCES.find((d) => d.id === 'bleeding'));

    expect(bleeding).toMatch(/has not yet verified/);
  });

  test('the two touching-private-parts positions each name the narration they follow', () => {
    // Both rest on authentic narrations pointing different ways. Saying so is the whole
    // point — otherwise one school looks like it is ignoring evidence.
    const difference = NULLIFIER_DIFFERENCES.find((d) => d.id === 'touching-private-parts');
    const text = JSON.stringify(difference);

    expect(text).toMatch(/Busrah/);
    expect(text).toMatch(/Talq/);
  });
});
