import type { RulingClass } from '@/lib/content/types';
import type { EvidenceSpec } from '@/lib/fiqh/loader';

/**
 * Learn Salah — the two-rak'ah prayer, position by position.
 *
 * Every hadith reference here was checked with `npm run probe:hadith` against the live
 * dataset before being written. None is asserted from memory.
 *
 * On the Arabic of the recitations (owner ruling, 2026-08-07): Al-Fatihah is fetched
 * live from the Quran source, so it is never transcribed by hand. Every other recitation
 * is rendered as a clearly-labelled **liturgical transcription** with the narration that
 * establishes it cited directly beneath — it is never presented as a quotation of the
 * hadith text itself. Constitution §3.2: the claim is labelled and linked to evidence.
 */

export interface Recitation {
  readonly id: string;
  readonly label: string;
  /** Liturgical transcription. Always shown with its establishing evidence. */
  readonly arabic: string;
  readonly transliteration: string;
  readonly translation: string;
  /**
   * "Why am I saying this?" — the point a new Muslim usually misses, because the words
   * are memorised long before they are understood.
   */
  readonly why: string;
  readonly ruling: RulingClass;
  /** Set when the text comes from the Quran and is fetched rather than transcribed. */
  readonly quranReference?: { readonly surah: number; readonly ayahFrom: number; readonly ayahTo: number };
  readonly evidence: EvidenceSpec;
}

export interface SalahPosition {
  readonly id: string;
  readonly name: string;
  readonly nameArabic: string;
  readonly ruling: RulingClass;
  readonly agreedUpon: boolean;
  /** What to do physically. */
  readonly physical: string;
  readonly recitations: readonly Recitation[];
  readonly commonMistakes?: readonly string[];
  /**
   * Guidance for anyone who cannot perform the position in the usual way. Never an
   * afterthought: the Sunnah itself provides for it, and a beginner who cannot stand
   * needs this on the same page, not in a separate "special cases" section.
   */
  readonly accessibility?: string;
  /**
   * Evidence for the accessibility guidance.
   *
   * Required whenever `accessibility` makes an Islamic claim rather than giving practical
   * advice. Constitution §3.2 — no orphaned assertions: guidance that says "the Sunnah
   * provides for this" must show what it is referring to, exactly like any other claim.
   */
  readonly accessibilityEvidence?: EvidenceSpec;
  readonly evidence: EvidenceSpec;
}

/** The narration establishing that the prayer is performed as the Prophet ﷺ performed it. */
const PRAY_AS_YOU_HAVE_SEEN: EvidenceSpec = {
  hadith: [{ collection: 'bukhari', number: 631 }],
};

export const SALAH_POSITIONS: readonly SalahPosition[] = [
  {
    id: 'niyyah',
    name: 'Intention',
    nameArabic: 'النية',
    ruling: 'pillar',
    agreedUpon: false,
    physical:
      'Stand facing the qiblah and intend in your heart which prayer you are about to perform. Nothing is said aloud.',
    recitations: [],
    commonMistakes: ['Reciting the intention aloud as a formula. It belongs in the heart.'],
    accessibility:
      'If you cannot stand, you may sit — and if you cannot sit, you may pray lying on your side. Your prayer is complete either way.',
    accessibilityEvidence: { hadith: [{ collection: 'bukhari', number: 1117 }] },
    evidence: { hadith: [{ collection: 'bukhari', number: 1 }] },
  },
  {
    id: 'takbir',
    name: 'Opening takbir',
    nameArabic: 'تكبيرة الإحرام',
    ruling: 'pillar',
    agreedUpon: true,
    physical:
      'Raise your hands to about shoulder or ear height, then say the takbir. From this moment you are in prayer, and ordinary speech and movement end.',
    recitations: [
      {
        id: 'takbir',
        label: 'The takbir',
        arabic: 'اللَّهُ أَكْبَرُ',
        transliteration: 'Allāhu akbar',
        translation: 'Allah is greater.',
        why:
          'You begin by declaring that Allah is greater — greater than whatever you have just walked away from, and greater than whatever is waiting for you afterwards. It is the sentence that closes the door on the world for a few minutes.',
        ruling: 'pillar',
        evidence: { hadith: [{ collection: 'abudawud', number: 61 }] },
      },
    ],
    commonMistakes: [
      'Beginning to recite before finishing the takbir.',
      'Raising the hands after saying it rather than with it.',
    ],
    accessibility:
      'If you cannot raise your hands, the takbir alone is enough. If you cannot speak it aloud, saying it inwardly is sufficient.',
    evidence: { hadith: [{ collection: 'abudawud', number: 61 }] },
  },
  {
    id: 'qiyam',
    name: 'Standing and reciting',
    nameArabic: 'القيام',
    ruling: 'pillar',
    agreedUpon: true,
    physical:
      'Stand with your hands placed on your chest or below it, eyes toward the place of prostration. Recite Al-Fatihah, then any passage of the Quran you know.',
    recitations: [
      {
        id: 'fatihah',
        label: 'Surah Al-Fatihah',
        // Fetched live from the Quran source — see quranReference below. Never transcribed.
        arabic: '',
        transliteration: '',
        translation: '',
        why:
          'Al-Fatihah is a conversation. You praise Allah, then you ask for the one thing everything else depends on: to be kept on the straight path. It is the only part of the prayer you cannot leave out, and it is a request repeated at least seventeen times a day.',
        ruling: 'pillar',
        quranReference: { surah: 1, ayahFrom: 1, ayahTo: 7 },
        evidence: {
          quran: [{ surah: 1, ayah: 1 }],
          hadith: [{ collection: 'bukhari', number: 756 }],
        },
      },
    ],
    commonMistakes: [
      'Rushing Al-Fatihah so that the words run together.',
      'Looking around rather than keeping the eyes toward the place of prostration.',
    ],
    accessibility:
      'If standing is painful or not possible, pray sitting. The Prophet ﷺ was asked directly about this by a man who could not stand, and told him to pray sitting, and if not, lying on his side.',
    accessibilityEvidence: { hadith: [{ collection: 'bukhari', number: 1117 }] },
    evidence: { hadith: [{ collection: 'bukhari', number: 756 }] },
  },
  {
    id: 'ruku',
    name: 'Bowing',
    nameArabic: 'الركوع',
    ruling: 'pillar',
    agreedUpon: true,
    physical:
      'Say the takbir, then bow so your back is level and your hands rest on your knees. Settle — do not rush through it.',
    recitations: [
      {
        id: 'tasbih-ruku',
        label: 'The tasbih of bowing',
        arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
        transliteration: 'Subḥāna Rabbiya al-‘Aẓīm',
        translation: 'Glory be to my Lord, the Most Great.',
        why:
          'Your body is lowered and your words say why: the One you are bowing to is greater than you. The posture and the sentence are saying the same thing at the same time.',
        ruling: 'sunnah',
        evidence: {
          hadith: [{ collection: 'abudawud', number: 869 }],
          establishedPractice: true,
        },
      },
    ],
    commonMistakes: [
      'Not straightening the back, so the bow is closer to a stoop.',
      'Moving into the next position before the body has settled.',
    ],
    accessibility:
      'Sitting down, bowing is a slight lean forward from the waist. It does not need to look like a standing bow.',
    evidence: { hadith: [{ collection: 'bukhari', number: 793 }] },
  },
  {
    id: 'itidal',
    name: 'Rising from bowing',
    nameArabic: 'الاعتدال',
    ruling: 'pillar',
    agreedUpon: true,
    physical: 'Rise until you are standing upright again, and be still before moving on.',
    recitations: [
      {
        id: 'sami-allah',
        label: 'On rising',
        arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ · رَبَّنَا وَلَكَ الْحَمْدُ',
        transliteration: 'Sami‘a Allāhu liman ḥamidah · Rabbanā wa laka al-ḥamd',
        translation: 'Allah hears the one who praises Him · Our Lord, to You belongs all praise.',
        why:
          'You say that Allah hears those who praise Him — and then immediately praise Him. It is a reminder that you are not speaking into empty air.',
        ruling: 'sunnah',
        evidence: {
          hadith: [{ collection: 'bukhari', number: 793 }],
          establishedPractice: true,
        },
      },
    ],
    commonMistakes: ['Going straight into prostration without standing upright first.'],
    evidence: { hadith: [{ collection: 'bukhari', number: 793 }] },
  },
  {
    id: 'sujud',
    name: 'Prostration',
    nameArabic: 'السجود',
    ruling: 'pillar',
    agreedUpon: true,
    physical:
      'Say the takbir and go down so that seven parts touch the ground: the forehead together with the nose, both hands, both knees, and the toes of both feet.',
    recitations: [
      {
        id: 'tasbih-sujud',
        label: 'The tasbih of prostration',
        arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
        transliteration: 'Subḥāna Rabbiya al-A‘lā',
        translation: 'Glory be to my Lord, the Most High.',
        why:
          'This is the lowest your body goes, and the words name Allah as the Highest. It is also the position in which you are closest to Him — which is why supplication here is encouraged.',
        ruling: 'sunnah',
        evidence: {
          hadith: [{ collection: 'abudawud', number: 869 }],
          establishedPractice: true,
        },
      },
    ],
    commonMistakes: [
      'Resting the forearms on the ground rather than keeping them raised.',
      'Letting the nose lift away from the ground.',
    ],
    accessibility:
      'If you cannot reach the ground, bend forward as far as you comfortably can, lower than your bow. There is no need to place an object under the forehead to prostrate on.',
    evidence: { hadith: [{ collection: 'nasai', number: 1145 }] },
  },
  {
    id: 'jalsa',
    name: 'Sitting between the prostrations',
    nameArabic: 'الجلسة بين السجدتين',
    ruling: 'pillar',
    agreedUpon: true,
    physical:
      'Say the takbir, sit up on your left foot with the right foot upright, settle, then prostrate a second time.',
    recitations: [
      {
        id: 'rabbighfirli',
        label: 'Between the prostrations',
        arabic: 'رَبِّ اغْفِرْ لِي',
        transliteration: 'Rabbi ighfir lī',
        translation: 'My Lord, forgive me.',
        why:
          'Three words, in the middle of the prayer, asking for the thing you most need. It is deliberately short — the prayer keeps returning you to it.',
        ruling: 'sunnah',
        evidence: {
          hadith: [{ collection: 'abudawud', number: 857 }],
          establishedPractice: true,
        },
      },
    ],
    commonMistakes: ['Rising into the second prostration before sitting has settled.'],
    evidence: { hadith: [{ collection: 'abudawud', number: 857 }] },
  },
  {
    id: 'tashahhud',
    name: 'The final sitting',
    nameArabic: 'التشهد',
    ruling: 'pillar',
    agreedUpon: true,
    physical:
      'After the second prostration of the final rak‘ah, sit and recite the tashahhud, with the right index finger raised in pointing.',
    recitations: [
      {
        id: 'tashahhud',
        label: 'The tashahhud',
        arabic:
          'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
        transliteration:
          'At-taḥiyyātu lillāhi wa-ṣ-ṣalawātu wa-ṭ-ṭayyibāt. As-salāmu ‘alayka ayyuhā-n-nabiyyu wa raḥmatullāhi wa barakātuh. As-salāmu ‘alaynā wa ‘alā ‘ibādillāhi-ṣ-ṣāliḥīn. Ash-hadu an lā ilāha illā-llāh, wa ash-hadu anna Muḥammadan ‘abduhu wa rasūluh.',
        translation:
          'All greetings, prayers and good things belong to Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous servants of Allah. I bear witness that there is no god but Allah, and I bear witness that Muhammad is His servant and His Messenger.',
        why:
          'The prayer ends by returning to where Islam begins: the testimony of faith. Notice the order — greeting, then peace for the Prophet ﷺ, then peace for yourself and every righteous servant of Allah, and only then the declaration. You are placed inside a community before you speak as an individual.',
        ruling: 'pillar',
        evidence: { hadith: [{ collection: 'bukhari', number: 831 }] },
      },
    ],
    commonMistakes: [
      'Moving the finger continuously. It is raised in pointing, not waved.',
    ],
    evidence: { hadith: [{ collection: 'bukhari', number: 831 }] },
  },
  {
    id: 'salam',
    name: 'The closing salam',
    nameArabic: 'التسليم',
    ruling: 'pillar',
    agreedUpon: true,
    physical:
      'Turn your head to the right and give the salam, then to the left and give it again. The prayer is now complete.',
    recitations: [
      {
        id: 'salam',
        label: 'The salam',
        arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
        transliteration: 'As-salāmu ‘alaykum wa raḥmatullāh',
        translation: 'Peace be upon you, and the mercy of Allah.',
        why:
          'You leave the prayer the way you would leave any gathering — by greeting those around you with peace. Even alone, the prayer ends outward, not inward.',
        ruling: 'pillar',
        evidence: {
          hadith: [{ collection: 'abudawud', number: 61 }],
          establishedPractice: true,
        },
      },
    ],
    evidence: PRAY_AS_YOU_HAVE_SEEN,
  },
];

/** FIQH-POLICY §2/§4 — optional deeper reading, attributed, never ranked. */
export const SALAH_DIFFERENCES = [
  {
    id: 'hand-placement',
    question: 'Where are the hands placed while standing?',
    positions: [
      { schools: ['Hanafi'], position: 'Below the navel for men; on the chest for women.' },
      { schools: ["Shafi'i"], position: 'Below the chest and above the navel.' },
      { schools: ['Hanbali'], position: 'Below the navel is reported, as is above it.' },
      {
        schools: ['Maliki'],
        position:
          'Letting the hands hang at the sides is reported as the position in obligatory prayers, and placing them is also permitted.',
      },
    ],
  },
  {
    id: 'fatihah-behind-imam',
    question: 'Does someone praying behind an imam recite Al-Fatihah themselves?',
    positions: [
      {
        schools: ["Shafi'i"],
        position: 'Yes — Al-Fatihah is recited by every worshipper in every rak‘ah.',
      },
      {
        schools: ['Hanafi'],
        position:
          'No — the imam’s recitation counts for those behind him, and they listen rather than recite.',
      },
      {
        schools: ['Maliki', 'Hanbali'],
        position:
          'It is recited in the quiet prayers; in the aloud prayers the worshipper listens.',
      },
    ],
  },
  {
    id: 'finger',
    question: 'How is the finger held during the tashahhud?',
    positions: [
      { schools: ['Hanafi'], position: 'Raised at the testimony of faith, then lowered.' },
      { schools: ["Shafi'i"], position: 'Raised once at the testimony and held still.' },
      { schools: ['Maliki'], position: 'Moved gently from side to side throughout.' },
      { schools: ['Hanbali'], position: 'Raised each time the name of Allah is mentioned.' },
    ],
  },
] as const;
