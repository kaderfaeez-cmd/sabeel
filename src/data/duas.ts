import type { EvidenceSpec } from '@/lib/fiqh/loader';

/**
 * The Dua Library.
 *
 * Same rule as the Salah recitations (owner ruling, 2026-08-07): the Arabic is rendered
 * as a clearly-labelled liturgical transcription, with the narration that establishes it
 * cited beneath and resolved through the authenticity gate. It is never presented as a
 * quotation of the hadith text itself.
 *
 * Every reference was checked against the live dataset with `npm run probe:hadith`
 * before being written here. A dua whose narration does not clear the gate shows an
 * authenticity notice rather than being quietly dropped.
 */

export type DuaCategory =
  | 'daily'
  | 'distress'
  | 'protection'
  | 'forgiveness'
  | 'family';

export interface DuaCategoryMeta {
  readonly id: DuaCategory;
  readonly title: string;
  readonly blurb: string;
}

export const DUA_CATEGORIES: readonly DuaCategoryMeta[] = [
  { id: 'daily', title: 'Through the day', blurb: 'Morning, evening, and leaving the house.' },
  { id: 'distress', title: 'Worry and hardship', blurb: 'For anxiety, grief and difficulty.' },
  { id: 'protection', title: 'Protection', blurb: 'Seeking refuge and safety.' },
  { id: 'forgiveness', title: 'Forgiveness', blurb: 'Turning back to Allah.' },
  { id: 'family', title: 'Family', blurb: 'For parents, spouse and children.' },
];

export interface Dua {
  readonly id: string;
  readonly category: DuaCategory;
  readonly title: string;
  readonly when: string;
  readonly arabic: string;
  readonly transliteration: string;
  readonly translation: string;
  /** Why this dua says what it says — the same idea as "Why am I saying this?" in Salah. */
  readonly why: string;
  readonly evidence: EvidenceSpec;
}

export const DUAS: readonly Dua[] = [
  {
    id: 'morning',
    category: 'daily',
    title: 'In the morning',
    when: 'After Fajr, or when you wake.',
    arabic:
      'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
    transliteration:
      'Allāhumma bika aṣbaḥnā, wa bika amsaynā, wa bika naḥyā, wa bika namūtu, wa ilayka-n-nushūr',
    translation:
      'O Allah, by You we enter the morning, by You we enter the evening, by You we live, by You we die, and to You is the resurrection.',
    why:
      'It places the whole day — waking, living, dying — inside one sentence, and hands all of it to Allah before anything else has happened.',
    evidence: { hadith: [{ collection: 'abudawud', number: 5068 }] },
  },
  {
    id: 'evening',
    category: 'daily',
    title: 'In the evening',
    when: 'After Maghrib, or as the day closes.',
    arabic:
      'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ',
    transliteration: 'Allāhumma innī as’aluka al-‘āfiyata fī-d-dunyā wa-l-ākhirah',
    translation:
      'O Allah, I ask You for wellbeing in this world and the next.',
    why:
      '‘Āfiyah is a wide word — health, safety, being spared harm. Asking for it is asking to be kept whole, rather than asking for any one thing.',
    evidence: { hadith: [{ collection: 'abudawud', number: 5074 }] },
  },
  {
    id: 'leaving-home',
    category: 'daily',
    title: 'Leaving the house',
    when: 'As you step out of the door.',
    arabic:
      'بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration:
      'Bismillāh, tawakkaltu ‘ala-llāh, wa lā ḥawla wa lā quwwata illā billāh',
    translation:
      'In the name of Allah. I place my trust in Allah. There is no power and no strength except with Allah.',
    why:
      'You are about to walk into a day you do not control. This says so plainly, and hands the outcome over before you meet it.',
    evidence: { hadith: [{ collection: 'tirmidhi', number: 3426 }] },
  },
  {
    id: 'sayyid-al-istighfar',
    category: 'forgiveness',
    title: 'The best way of seeking forgiveness',
    when: 'Morning and evening. Known as Sayyid al-Istighfār.',
    arabic:
      'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration:
      'Allāhumma anta Rabbī, lā ilāha illā anta, khalaqtanī wa anā ‘abduk, wa anā ‘alā ‘ahdika wa wa‘dika mā istaṭa‘t. A‘ūdhu bika min sharri mā ṣana‘t. Abū’u laka bi ni‘matika ‘alayya, wa abū’u bi dhanbī faghfir lī, fa innahu lā yaghfiru-dh-dhunūba illā ant.',
    translation:
      'O Allah, You are my Lord. There is no god but You. You created me and I am Your servant, and I keep to Your covenant and promise as much as I am able. I seek refuge in You from the evil of what I have done. I acknowledge Your favour upon me, and I acknowledge my sin — so forgive me, for none forgives sins but You.',
    why:
      'Notice the order: who Allah is, who you are, an honest admission that you keep the covenant only "as much as I am able", and only then the request. It does not pretend you are better than you are.',
    evidence: { hadith: [{ collection: 'bukhari', number: 6306 }] },
  },
  {
    id: 'istighfar',
    category: 'forgiveness',
    title: 'Simple istighfār',
    when: 'Any time. The Prophet ﷺ said this many times a day.',
    arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    transliteration: 'Astaghfiru-llāha wa atūbu ilayh',
    translation: 'I seek the forgiveness of Allah and I turn to Him.',
    why:
      'Short enough to say anywhere. The second half matters as much as the first — it is not only asking to be forgiven, but turning back.',
    evidence: { hadith: [{ collection: 'bukhari', number: 6307 }] },
  },
  {
    id: 'distress',
    category: 'distress',
    title: 'When something weighs on you',
    when: 'In anxiety, grief, or when you do not know what to do.',
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    transliteration: 'Ḥasbunā-llāhu wa ni‘ma-l-wakīl',
    translation: 'Allah is enough for us, and the best of guardians.',
    why:
      'This appears in the Quran as what was said by people who had just been told to be afraid. It is not a denial that the difficulty is real — it is a statement about who is holding it.',
    evidence: { quran: [{ surah: 3, ayah: 173 }] },
  },
  {
    id: 'anxiety-quran',
    category: 'distress',
    title: 'When the heart is unsettled',
    when: 'Whenever you need to be reminded where calm comes from.',
    arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    transliteration: 'Alā bi dhikri-llāhi taṭma’innu-l-qulūb',
    translation: 'Truly, it is in the remembrance of Allah that hearts find rest.',
    why:
      'Not a dua but a verse worth keeping close. It names where settledness actually comes from, which is often not where we look for it first.',
    evidence: { quran: [{ surah: 13, ayah: 28 }] },
  },
  {
    id: 'parents',
    category: 'family',
    title: 'For your parents',
    when: 'Any time — and especially if they have passed away.',
    arabic: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    transliteration: 'Rabbi irḥamhumā kamā rabbayānī ṣaghīrā',
    translation:
      'My Lord, have mercy on them as they raised me when I was small.',
    why:
      'The Quran teaches this dua directly. The reasoning inside it is striking — mercy asked for, on the grounds of care already given.',
    evidence: { quran: [{ surah: 17, ayah: 24 }] },
  },
  {
    id: 'family-quran',
    category: 'family',
    title: 'For your spouse and children',
    when: 'For the people closest to you.',
    arabic:
      'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
    transliteration:
      'Rabbanā hab lanā min azwājinā wa dhurriyyātinā qurrata a‘yunin wa-j‘alnā li-l-muttaqīna imāmā',
    translation:
      'Our Lord, grant us from among our spouses and offspring comfort to our eyes, and make us a leader for the righteous.',
    why:
      '“Comfort to our eyes” is an idiom for the kind of joy that settles you when you look at someone. The dua asks for that, and then asks to be worth following.',
    evidence: { quran: [{ surah: 25, ayah: 74 }] },
  },
  {
    id: 'protection-refuge',
    category: 'protection',
    title: 'Seeking refuge',
    when: 'Before reciting the Quran, and whenever you feel pulled toward harm.',
    arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
    transliteration: 'A‘ūdhu billāhi mina-sh-shayṭāni-r-rajīm',
    translation: 'I seek refuge with Allah from the accursed Shaytan.',
    why:
      'The Quran instructs this directly before recitation. Refuge is asked for, not claimed — the request itself is the protection.',
    evidence: { quran: [{ surah: 16, ayah: 98 }] },
  },
  {
    id: 'protection-evening',
    category: 'protection',
    title: 'Trusting Allah with what you cannot see',
    when: 'When worry about the unknown takes hold.',
    arabic: 'وَعَلَى اللَّهِ فَلْيَتَوَكَّلِ الْمُؤْمِنُونَ',
    transliteration: 'Wa ‘ala-llāhi falyatawakkali-l-mu’minūn',
    translation: 'And upon Allah let the believers rely.',
    why:
      'Reliance here is not passivity. It is doing what you can, and then refusing to carry the part that was never yours to carry.',
    evidence: { quran: [{ surah: 3, ayah: 122 }] },
  },
];

export function duasInCategory(category: DuaCategory): readonly Dua[] {
  return DUAS.filter((dua) => dua.category === category);
}
