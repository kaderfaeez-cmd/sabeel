import { describe, expect, test } from 'vitest';
import { checkSubstance, isFlagged } from './substance';

describe('checkSubstance — chain-only detection', () => {
  test('flags the real Sahih Muslim 226 fragment that started this', () => {
    const actual =
      'Harmala b. Yahya, Abdullah b. Wahb, Umar b. Muhammad, Ibn Umar narrated like the hadith transmitted by Ubaidullah.';

    const result = checkSubstance(actual);

    expect(isFlagged(result)).toBe(true);
    expect(result.flags).toContain('chain-only');
  });

  test('flags the real Sahih Muslim 397 fragment', () => {
    const actual =
      'This hadith has been narrated by another chain of transmitters, Abu Bakr b. Abi Shaiba and others.';

    expect(checkSubstance(actual).flags).toContain('chain-only');
  });

  test('flags an entry recording only an alternate chain', () => {
    expect(
      checkSubstance('Reported with the same chain of transmitters from Anas.').flags,
    ).toContain('chain-only');
  });

  test('explains why, so the build warning is actionable', () => {
    const result = checkSubstance('This hadith has been narrated by another chain.');

    expect(result.reasons.length).toBeGreaterThan(0);
    expect(result.reasons[0]).toMatch(/transmission|chain/i);
  });
});

describe('checkSubstance — substantive narrations are not flagged', () => {
  // These are the five narrations the Wudhu page actually cites. If the heuristic ever
  // starts flagging them, the whole page silently goes to review — so they are asserted.
  const published: readonly [string, string][] = [
    [
      'bukhari:1',
      "I heard Allah's Messenger saying, \"The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended. So whoever emigrated for worldly benefits or for a woman to marry, his emigration was for what he emigrated for",
    ],
    [
      'abudawud:101',
      'The Messenger of Allah said: The prayer of a person who does not perform ablution is not valid, and the ablution of a person who does not mention the name of Allah (in the beginning) is not valid',
    ],
    [
      'tirmidhi:37',
      'The Prophet performed Wudu; so he washed his face three times, and his forearms three times, and wiped his head, and wiped the insides of his ears with his index fingers',
    ],
  ];

  test.each(published)('does not flag %s', (_key, text) => {
    expect(isFlagged(checkSubstance(text))).toBe(false);
  });

  test('a narration ending without a full stop is NOT flagged', () => {
    // The dataset omits closing punctuation throughout. Flagging on it held every cited
    // narration for review, which is why that detector was removed.
    const text =
      'The Messenger of Allah said that purification is half of faith and that the prayer is light for the believer';

    expect(isFlagged(checkSubstance(text))).toBe(false);
  });
});

describe('checkSubstance — short and empty entries', () => {
  test('flags an empty entry', () => {
    const result = checkSubstance('   ');

    expect(result.flags).toContain('too-short');
    expect(result.reasons.join(' ')).toMatch(/no text/i);
  });

  test('flags a very short entry for a look, without judging it', () => {
    const result = checkSubstance('Actions are by intentions.');

    expect(result.flags).toContain('too-short');
    // The wording must acknowledge that genuine short narrations exist, because the
    // reviewer is the one who decides.
    expect(result.reasons.join(' ')).toMatch(/genuine short narrations exist/i);
  });
});
