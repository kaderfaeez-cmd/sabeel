import type { EvidenceSpec } from '@/lib/fiqh/loader';
import type { FiqhDifferenceData } from '@/lib/fiqh/step-types';

/**
 * What breaks wudhu, and what does not.
 *
 * Structured to answer the question a beginner actually has — "do I need to wash again?"
 * — rather than as a list of rulings. The agreed nullifiers come first (FIQH-POLICY §1),
 * the contested ones are marked as contested rather than stated flatly, and the
 * misconceptions section exists because being told what does *not* break wudhu removes
 * more anxiety than another rule does.
 *
 * Every reference was checked with `npm run probe:hadith`. Three references commonly
 * cited from memory for this topic turned out to be entirely different narrations —
 * Sahih Muslim 360 concerns defending one's property, Sahih Muslim 361 a dispute between
 * companions, and Jami' at-Tirmidhi 96 wiping over footwear. None of them is used.
 */

export type NullifierAgreement = 'agreed' | 'differed';

export interface Nullifier {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  /** Whether the four Sunni schools agree that this breaks wudhu. */
  readonly agreement: NullifierAgreement;
  /** Shown when `agreement` is 'differed' — a one-line summary before the detail below. */
  readonly disagreementNote?: string;
  readonly evidence: EvidenceSpec;
}

/** The Quranic basis: relieving oneself, and contact between spouses, are both named. */
const AYAH_OF_WUDHU = { surah: 5, ayah: 6 } as const;

export const NULLIFIERS: readonly Nullifier[] = [
  {
    id: 'discharge',
    title: 'Anything leaving the front or back passage',
    description:
      'Urine, stool and wind. This is the most common reason wudhu needs to be renewed, and all four schools agree on it.',
    agreement: 'agreed',
    evidence: {
      quran: [AYAH_OF_WUDHU],
      hadith: [{ collection: 'bukhari', number: 135 }],
    },
  },
  {
    id: 'deep-sleep',
    title: 'Deep sleep',
    description:
      'Sleep deep enough that you would not notice something leaving you. Dozing lightly while seated and still aware of your surroundings is not the same thing.',
    agreement: 'agreed',
    evidence: {
      hadith: [{ collection: 'abudawud', number: 203 }],
      establishedPractice: true,
    },
  },
  {
    id: 'unconsciousness',
    title: 'Loss of consciousness',
    description:
      'Fainting, intoxication, or anaesthesia — anything that takes away awareness more completely than sleep does.',
    agreement: 'agreed',
    evidence: {
      hadith: [{ collection: 'abudawud', number: 203 }],
      establishedPractice: true,
    },
  },
  {
    id: 'touching-private-parts',
    title: 'Touching the private parts directly',
    description:
      'Touching the private parts with the bare hand, without a barrier.',
    agreement: 'differed',
    disagreementNote:
      'Two authentic narrations point in different directions, and the schools weighed them differently. See the section below.',
    evidence: { hadith: [{ collection: 'abudawud', number: 181 }] },
  },
  {
    id: 'camel-meat',
    title: 'Eating camel meat',
    description:
      'The Prophet ﷺ was asked directly about performing wudhu after eating camel meat, and about eating mutton, and answered the two differently.',
    agreement: 'differed',
    disagreementNote:
      'The narration is authentic and explicit; the schools differed over whether it establishes an ongoing obligation.',
    evidence: {
      hadith: [
        { collection: 'tirmidhi', number: 81 },
        { collection: 'abudawud', number: 184 },
      ],
    },
  },
  {
    id: 'bleeding',
    title: 'Bleeding from a wound',
    description:
      'A cut, a nosebleed, or any bleeding from somewhere other than the two passages.',
    agreement: 'differed',
    disagreementNote:
      'The majority hold that it does not break wudhu. The Hanafi school holds that flowing blood does.',
    evidence: { hadith: [{ collection: 'abudawud', number: 198 }] },
  },
  {
    id: 'vomiting',
    title: 'Vomiting',
    description:
      'Bringing up the contents of the stomach, whether deliberately or not.',
    agreement: 'differed',
    disagreementNote:
      'The majority hold that it does not break wudhu. The Hanafi school holds that a mouthful does.',
    evidence: { hadith: [{ collection: 'tirmidhi', number: 87 }] },
  },
  {
    id: 'contact-spouses',
    title: 'Contact between spouses',
    description:
      'Quran 5:6 mentions "or you have contacted women" among the things after which purification is needed. What that contact refers to is understood differently by the schools.',
    agreement: 'differed',
    disagreementNote:
      'The difference turns on the meaning of a single Quranic word, not on a weak narration.',
    evidence: { quran: [AYAH_OF_WUDHU] },
  },
];

/**
 * What does NOT break wudhu.
 *
 * Deliberately given its own section. A new Muslim is far more likely to re-perform wudhu
 * unnecessarily out of uncertainty than to skip it, and repeated needless washing is a
 * real source of anxiety. Constitution §1 — no one should feel overwhelmed here.
 */
export interface NonNullifier {
  readonly id: string;
  readonly claim: string;
  readonly clarification: string;
  readonly evidence?: EvidenceSpec;
  /**
   * What the cited narration actually shows.
   *
   * Required whenever the evidence supports a *minority* position rather than the
   * majority one stated in the clarification. Without it, a reader sees a citation under
   * a "does not break wudhu" heading and assumes the narration says so — when in the
   * case of vomiting it says close to the opposite. Constitution §3.2: the claim and its
   * evidence must line up, not merely sit next to each other.
   */
  readonly evidenceShows?: string;
  /**
   * Id of a difference section this entry points down to.
   *
   * Set when the majority position is reassuring but the matter is genuinely contested.
   * The entry then states the majority view in plain language, says plainly that a school
   * differs, and links to the detail — rather than either omitting the reassurance or
   * presenting it as settled.
   */
  readonly seeDifference?: string;
}

export const NON_NULLIFIERS: readonly NonNullifier[] = [
  {
    id: 'doubt',
    claim: 'Being unsure whether you broke wudhu',
    clarification:
      'If you had wudhu and are now uncertain, you still have it. The Prophet ﷺ was asked about exactly this and said not to leave the prayer unless you hear a sound or smell something. Certainty is not removed by doubt.',
    evidence: { hadith: [{ collection: 'bukhari', number: 137 }] },
  },
  // Bleeding and vomiting appear here in plain language because they are among the most
  // common worries — but both are genuine Hanafi-versus-majority differences, so neither
  // is stated as settled. Each gives the majority view, names the school that differs,
  // and points down to the full discussion.
  {
    id: 'bleeding',
    claim: 'A small cut, a nosebleed, or a graze',
    clarification:
      'According to the majority of scholars this does not break wudhu, and you can carry on praying. The Hanafi school holds that flowing blood does break it, so this one depends on the school you follow.',
    seeDifference: 'bleeding',
  },
  {
    id: 'vomiting',
    claim: 'Vomiting',
    clarification:
      'According to the majority of scholars this does not break wudhu. The Hanafi school holds that a mouthful does. If you are unsure which position to follow, performing wudhu again is always safe.',
    seeDifference: 'vomiting',
  },
  {
    id: 'laughing',
    claim: 'Laughing outside of prayer',
    clarification:
      'Does not break wudhu. There is a Hanafi position that loud laughter *during* the prayer breaks it, which is a separate matter.',
  },
  {
    id: 'touching-quran',
    claim: 'Touching the Quran, or reciting from memory',
    clarification:
      'Neither breaks wudhu. Whether wudhu is required *before* touching a mushaf is a different question, and one the schools also discuss.',
  },
  {
    id: 'changing-nappy',
    claim: 'Changing a nappy, or helping someone use the toilet',
    clarification:
      'What leaves *your* body breaks *your* wudhu. Caring for someone else does not, unless your own bare hand touches your own private parts.',
  },
];

/** FIQH-POLICY §2 and §4 — optional deeper reading, attributed, never ranked. */
export const NULLIFIER_DIFFERENCES: readonly FiqhDifferenceData[] = [
  {
    id: 'touching-private-parts',
    question: 'Does touching the private parts break wudhu?',
    positions: [
      {
        schools: ["Shafi'i", 'Hanbali', 'Maliki'],
        position:
          'Yes, when touched directly with the bare hand. They follow the narration of Busrah bint Safwan, in which the Prophet ﷺ instructed a person who touches it to perform wudhu.',
      },
      {
        schools: ['Hanafi'],
        position:
          'No. They follow the narration of Talq ibn ‘Ali, in which the Prophet ﷺ was asked about this and answered that it is only a part of a person’s own body.',
      },
    ],
  },
  {
    id: 'camel-meat',
    question: 'Does eating camel meat break wudhu?',
    positions: [
      {
        schools: ['Hanbali'],
        position:
          'Yes. The narration is explicit and distinguishes camel meat from mutton, so it is taken as an ongoing ruling.',
      },
      {
        schools: ['Hanafi', 'Maliki', "Shafi'i"],
        position:
          'No. They understand the instruction as connected to its circumstances rather than as a permanent obligation.',
      },
    ],
  },
  {
    id: 'contact-spouses',
    question: 'Does a husband and wife touching break wudhu?',
    positions: [
      {
        schools: ["Shafi'i"],
        position:
          'Skin-to-skin contact between a man and a woman who could marry one another breaks wudhu, taking the Quranic word in its literal sense.',
      },
      {
        schools: ['Maliki', 'Hanbali'],
        position: 'Only contact accompanied by desire breaks it.',
      },
      {
        schools: ['Hanafi'],
        position:
          'Ordinary touching does not break it. They understand the Quranic word as referring to sexual relations.',
      },
    ],
  },
  {
    id: 'bleeding',
    question: 'Does bleeding from a wound break wudhu?',
    positions: [
      {
        schools: ['Maliki', "Shafi'i", 'Hanbali'],
        position:
          'No. Only what leaves the two passages breaks wudhu. They point to the sentry from the Ansar who was struck by three arrows while on watch and continued his prayer rather than break it.',
      },
      {
        schools: ['Hanafi'],
        position:
          'Yes, when the blood flows rather than merely appears. They rely on reports about wudhu from flowing blood which Sabeel has not yet verified through its publication policy.',
      },
    ],
  },
  {
    id: 'vomiting',
    question: 'Does vomiting break wudhu?',
    positions: [
      {
        schools: ['Hanafi'],
        position:
          'A mouthful does. They rely on the narration of Abu ad-Darda, in which the Prophet ﷺ vomited and then performed wudhu, and read that as establishing a requirement.',
      },
      {
        schools: ['Maliki', "Shafi'i", 'Hanbali'],
        position:
          'It does not. They read the same narration as showing a recommended act, or a wudhu performed in order to pray rather than because of the vomiting.',
      },
    ],
  },
];
