import type { RulingClass } from '@/lib/content/types';
import type { EvidenceSpec } from '@/lib/fiqh/loader';

/**
 * Wudhu — the ablution before prayer.
 *
 * Structure follows FIQH-POLICY.md:
 *  §1 the agreed core first — the four acts named directly in Quran 5:6;
 *  §3 every step classified by weight, with no default;
 *  §4 one valid widely-accepted method in the main flow, differences in a separate
 *     disclosure.
 *
 * Every hadith reference below was checked against the live dataset with
 * `node scripts/probe-hadith.mjs` before being written here. None is asserted from
 * memory. References whose text turned out to be a chain-only fragment were excluded,
 * because passing the authenticity gate is not the same as carrying usable content.
 *
 * Whatever the gate concludes at render time is what the reader sees — if a reference
 * stops clearing the gate, the page shows a notice rather than quietly dropping it.
 */

export interface WudhuStep {
  readonly id: string;
  readonly title: string;
  readonly ruling: RulingClass;
  /** True when all four Sunni schools concur. */
  readonly agreedUpon: boolean;
  readonly instruction: string;
  readonly why?: string;
  readonly evidence: EvidenceSpec;
  readonly commonMistakes?: readonly string[];
}

/**
 * Quran 5:6 (al-Ma'idah) names washing the face, the forearms to the elbows, wiping the
 * head, and washing the feet to the ankles. Those four are the backbone of this page and
 * need no hadith to be established.
 */
const AYAH_OF_WUDHU = { surah: 5, ayah: 6 } as const;

export const WUDHU_STEPS: readonly WudhuStep[] = [
  {
    id: 'intention',
    title: 'Intention (niyyah)',
    ruling: 'pillar',
    agreedUpon: false,
    instruction:
      'Intend in your heart that you are performing wudhu to purify yourself for worship. Nothing is said aloud — the intention is in the heart.',
    why: 'Intention is what separates an act of worship from an ordinary wash.',
    evidence: {
      hadith: [{ collection: 'bukhari', number: 1 }],
    },
    commonMistakes: [
      'Saying the intention out loud as a formula. The intention belongs in the heart.',
    ],
  },
  {
    id: 'bismillah',
    title: 'Say “Bismillah”',
    ruling: 'sunnah',
    agreedUpon: false,
    instruction: 'Begin by saying “Bismillah” — in the name of Allah.',
    evidence: {
      hadith: [{ collection: 'abudawud', number: 101 }],
      establishedPractice: true,
    },
  },
  {
    id: 'hands',
    title: 'Wash the hands',
    ruling: 'sunnah',
    agreedUpon: true,
    instruction: 'Wash both hands up to the wrists, three times, starting with the right.',
    evidence: {
      hadith: [{ collection: 'bukhari', number: 159 }],
    },
  },
  {
    id: 'mouth-nose',
    title: 'Rinse the mouth and nose',
    ruling: 'sunnah',
    agreedUpon: false,
    instruction:
      'Rinse the mouth three times, then draw water into the nose and blow it out three times.',
    evidence: {
      hadith: [{ collection: 'bukhari', number: 164 }],
    },
  },
  {
    id: 'face',
    title: 'Wash the face',
    ruling: 'pillar',
    agreedUpon: true,
    instruction:
      'Wash the whole face three times — from the hairline to the underside of the chin, and from ear to ear.',
    why: 'Named directly in the Quran, so all four schools treat it as obligatory.',
    evidence: {
      quran: [AYAH_OF_WUDHU],
      hadith: [{ collection: 'bukhari', number: 159 }],
    },
    commonMistakes: ['Leaving the edges of the face dry, particularly along the hairline.'],
  },
  {
    id: 'arms',
    title: 'Wash the arms to the elbows',
    ruling: 'pillar',
    agreedUpon: true,
    instruction:
      'Wash the right arm from the fingertips to and including the elbow, three times. Then the left.',
    why: 'Named directly in the Quran.',
    evidence: {
      quran: [AYAH_OF_WUDHU],
      hadith: [{ collection: 'bukhari', number: 159 }],
    },
    commonMistakes: ['Stopping short of the elbow. The elbow itself must be included.'],
  },
  {
    id: 'head',
    title: 'Wipe the head',
    ruling: 'pillar',
    agreedUpon: true,
    instruction:
      'With wet hands, wipe over the head once, from the front to the back and back again.',
    why: 'Named directly in the Quran. Note that the head is wiped, not washed.',
    evidence: {
      quran: [AYAH_OF_WUDHU],
    },
    commonMistakes: ['Pouring water over the head. This step is a wipe, not a wash.'],
  },
  {
    id: 'ears',
    title: 'Wipe the ears',
    ruling: 'sunnah',
    agreedUpon: false,
    instruction:
      'With the same wetness, wipe the inside of the ears with the index fingers and behind them with the thumbs.',
    evidence: {
      hadith: [{ collection: 'tirmidhi', number: 37 }],
      establishedPractice: true,
    },
  },
  {
    id: 'feet',
    title: 'Wash the feet to the ankles',
    ruling: 'pillar',
    agreedUpon: true,
    instruction:
      'Wash the right foot to and including the ankle, three times, making sure the water reaches between the toes. Then the left.',
    why: 'Named directly in the Quran.',
    evidence: {
      quran: [AYAH_OF_WUDHU],
      hadith: [{ collection: 'bukhari', number: 159 }],
    },
    commonMistakes: [
      'Missing the heels or the area between the toes — both are easy to leave dry.',
    ],
  },
];

/**
 * FIQH-POLICY §2 and §4: differences are stated respectfully, attributed to the schools
 * that hold them, and kept out of the main flow so a beginner is not overwhelmed.
 *
 * These positions are widely reported in the standard fiqh literature. They are labelled
 * `scholarly-summary` because Sabeel has not yet cleared a primary citation for each one
 * through its publication policy — the platform says so rather than implying more
 * certainty than it has earned.
 */
export interface WudhuDifference {
  readonly id: string;
  readonly question: string;
  readonly positions: readonly {
    readonly schools: readonly string[];
    readonly position: string;
  }[];
}

export const WUDHU_DIFFERENCES: readonly WudhuDifference[] = [
  {
    id: 'niyyah',
    question: 'Is the intention (niyyah) a condition for wudhu to be valid?',
    positions: [
      {
        schools: ['Maliki', "Shafi'i", 'Hanbali'],
        position:
          'Intention is required. Without it the washing is an ordinary wash rather than an act of worship.',
      },
      {
        schools: ['Hanafi'],
        position:
          'Intention is strongly recommended rather than a condition of validity, since the Quranic command specifies the washing itself.',
      },
    ],
  },
  {
    id: 'head-extent',
    question: 'How much of the head must be wiped?',
    positions: [
      { schools: ['Hanbali', 'Maliki'], position: 'The whole head is wiped.' },
      { schools: ['Hanafi'], position: 'A quarter of the head is sufficient.' },
      { schools: ["Shafi'i"], position: 'Wiping any part of the head is sufficient.' },
    ],
  },
  {
    id: 'order',
    question: 'Must the steps be performed in the Quranic order, without long gaps?',
    positions: [
      {
        schools: ["Shafi'i", 'Hanbali'],
        position:
          'Order and continuity are required — the steps follow the sequence given in the verse, without a long interruption.',
      },
      {
        schools: ['Hanafi', 'Maliki'],
        position:
          'Order and continuity are strongly recommended rather than strictly required, though the Malikis require continuity when it is remembered.',
      },
    ],
  },
];
