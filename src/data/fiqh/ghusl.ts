import type { EvidenceSpec } from '@/lib/fiqh/loader';
import type { FiqhDifferenceData, FiqhStepData } from '@/lib/fiqh/step-types';

/**
 * Ghusl — the full washing of the body.
 *
 * Structure follows FIQH-POLICY.md: the agreed core first (§1), every step classified by
 * weight (§3), one valid widely-accepted method in the main flow with differences kept
 * in a separate disclosure (§4).
 *
 * Every hadith reference here was checked with `npm run probe:hadith` against the live
 * dataset before being written. None is asserted from memory. Two references that are
 * commonly cited for ghusl — Sahih Muslim 316 and 317 — were checked and found to be
 * chain-only fragments carrying no substantive text, so they are not used.
 *
 * Tone note: this page discusses ritual purity after intimacy and after menstruation.
 * It is written plainly and without euphemism, because a person who needs this
 * information should not have to decode it — and without any suggestion that needing it
 * is shameful. Constitution §1: no one should feel judged here.
 */

/** The Quranic basis: "And if you are in a state of janābah, then purify yourselves." */
const AYAH_OF_PURIFICATION = { surah: 5, ayah: 6 } as const;

/**
 * `Aisha and Maymunah both described the Prophet's ﷺ ghusl in detail, and those two
 * narrations are the backbone of every step below.
 */
const AISHAH_DESCRIPTION: EvidenceSpec = {
  hadith: [{ collection: 'bukhari', number: 248 }],
};

const MAYMUNAH_DESCRIPTION: EvidenceSpec = {
  hadith: [{ collection: 'bukhari', number: 274 }],
};

/** When a full washing becomes obligatory. */
export interface GhuslOccasion {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly evidence: EvidenceSpec;
}

export const GHUSL_OCCASIONS: readonly GhuslOccasion[] = [
  {
    id: 'janabah',
    title: 'After sexual intimacy or a wet dream',
    description:
      'A state called janābah. Ghusl is required before prayer can be performed again. This applies to both husband and wife, and to a wet dream whether or not one recalls it.',
    evidence: { quran: [AYAH_OF_PURIFICATION] },
  },
  {
    id: 'menstruation',
    title: 'At the end of menstruation',
    description:
      'When a monthly period finishes, ghusl is performed before returning to prayer and fasting. There is nothing to make up for the prayers missed during the period itself.',
    evidence: { hadith: [{ collection: 'bukhari', number: 314 }] },
  },
  {
    id: 'nifas',
    title: 'At the end of post-childbirth bleeding',
    description:
      'Known as nifās. Ghusl is performed once the bleeding stops, in the same way as after menstruation.',
    evidence: { hadith: [{ collection: 'bukhari', number: 314 }], establishedPractice: true },
  },
];

export const GHUSL_STEPS: readonly FiqhStepData[] = [
  {
    id: 'intention',
    title: 'Intention (niyyah)',
    ruling: 'pillar',
    agreedUpon: false,
    instruction:
      'Intend in your heart that you are performing ghusl to lift the state of impurity. Nothing is said aloud.',
    why: 'It is the intention that makes this an act of worship rather than an ordinary wash.',
    evidence: { hadith: [{ collection: 'bukhari', number: 1 }] },
    commonMistakes: ['Reciting the intention aloud as a formula. It belongs in the heart.'],
  },
  {
    id: 'hands',
    title: 'Wash the hands',
    ruling: 'sunnah',
    agreedUpon: true,
    instruction: 'Begin by washing both hands two or three times.',
    evidence: MAYMUNAH_DESCRIPTION,
  },
  {
    id: 'private-parts',
    title: 'Wash the private parts',
    ruling: 'sunnah',
    agreedUpon: true,
    instruction:
      'Wash the private parts with the left hand, removing anything on the body, then wash that hand.',
    evidence: MAYMUNAH_DESCRIPTION,
  },
  {
    id: 'wudhu',
    title: 'Perform wudhu',
    ruling: 'sunnah',
    agreedUpon: false,
    instruction:
      'Perform wudhu as you would for prayer. Many perform it fully here and leave the feet until the end.',
    why: 'Both descriptions of the Prophet’s ﷺ ghusl include a full wudhu before the washing itself.',
    evidence: AISHAH_DESCRIPTION,
  },
  {
    id: 'hair',
    title: 'Wet the roots of the hair',
    ruling: 'obligatory',
    agreedUpon: true,
    instruction:
      'Work water into the hair with the fingers until it reaches the scalp. Water must reach the roots, not only the surface of the hair.',
    why: 'This is the step most often missed, and it is the one the narrations single out.',
    evidence: AISHAH_DESCRIPTION,
    commonMistakes: [
      'Wetting only the outside of the hair. The water must reach the scalp beneath it.',
    ],
  },
  {
    id: 'head',
    title: 'Pour water over the head three times',
    ruling: 'sunnah',
    agreedUpon: true,
    instruction: 'Pour three handfuls of water over the head, so it runs down through the hair.',
    evidence: AISHAH_DESCRIPTION,
  },
  {
    id: 'body',
    title: 'Wash the whole body',
    ruling: 'pillar',
    agreedUpon: true,
    instruction:
      'Pour water over the rest of the body until every part is wet — the right side, then the left. Nothing may be left dry.',
    why:
      'This is the act itself. Everything before it is preparation; this is what the Quran commands when it says to purify yourselves.',
    evidence: {
      quran: [AYAH_OF_PURIFICATION],
      hadith: [{ collection: 'bukhari', number: 248 }],
    },
    commonMistakes: [
      'Leaving the navel, behind the ears, under the arms, or between the toes dry.',
      'Forgetting that anything blocking water from the skin — nail polish, wax, thick oil — must be removed first.',
    ],
  },
  {
    id: 'feet',
    title: 'Wash the feet',
    ruling: 'sunnah',
    agreedUpon: false,
    instruction:
      'If you left the feet out of the earlier wudhu, wash them now, after moving aside from where you were standing.',
    evidence: MAYMUNAH_DESCRIPTION,
  },
];

/**
 * FIQH-POLICY §2 and §4 — optional deeper reading, attributed to the schools holding
 * each position, with none ranked above another.
 *
 * These positions are widely reported in the standard fiqh literature. They are presented
 * as a summary of accepted scholarly positions rather than as directly cited evidence,
 * and the page says so.
 */
export const GHUSL_DIFFERENCES: readonly FiqhDifferenceData[] = [
  {
    id: 'mouth-nose',
    question: 'Are rinsing the mouth and nose obligatory in ghusl, or recommended?',
    positions: [
      {
        schools: ['Hanafi'],
        position:
          'Obligatory. The inside of the mouth and nose are treated as part of what must be washed for the ghusl to be complete.',
      },
      {
        schools: ['Hanbali'],
        position: 'Obligatory, on the same reasoning as in wudhu.',
      },
      {
        schools: ['Maliki', "Shafi'i"],
        position:
          'Recommended rather than obligatory, since the Quranic command concerns the outward body.',
      },
    ],
  },
  {
    id: 'niyyah',
    question: 'Is the intention a condition for ghusl to be valid?',
    positions: [
      {
        schools: ['Maliki', "Shafi'i", 'Hanbali'],
        position: 'Required. Without it the washing does not lift the state of impurity.',
      },
      {
        schools: ['Hanafi'],
        position:
          'Strongly recommended rather than a condition of validity, since the command specifies the washing itself.',
      },
    ],
  },
  {
    id: 'braided-hair',
    question: 'Must braided hair be undone for the ghusl?',
    positions: [
      {
        schools: ['Hanafi', 'Maliki', "Shafi'i", 'Hanbali'],
        position:
          'Braids need not be undone provided water reaches the roots of the hair. If it cannot, the braid is loosened enough for water to reach the scalp.',
      },
    ],
  },
  {
    id: 'wudhu-again',
    question: 'Is a separate wudhu needed after ghusl before praying?',
    positions: [
      {
        schools: ['Hanafi', 'Maliki', "Shafi'i", 'Hanbali'],
        position:
          'No. A ghusl performed as described also serves for wudhu, so long as nothing has since occurred that would break wudhu.',
      },
    ],
  },
];
