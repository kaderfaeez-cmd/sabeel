import type { EvidenceSpec } from '@/lib/fiqh/loader';

/**
 * "I'm struggling with…"
 *
 * People often reach for a site like this at a specific moment, not during a study
 * session. This meets that, and routes it into what Sabeel already has — a verse, a dua,
 * a story, a practical next step.
 *
 * Two rules held throughout:
 *  - The comfort is never invented. Every entry rests on a Quranic passage that is
 *    fetched and cited like any other, and Sabeel's own words are labelled.
 *  - This is not therapy and does not pretend to be. Where a struggle may need real
 *    help, the page says so plainly rather than offering a verse as a substitute.
 */

export interface Struggle {
  readonly id: string;
  readonly title: string;
  /** Shown on the index — the feeling in the reader's own words. */
  readonly summary: string;
  /** Acknowledges the struggle before offering anything. Sabeel's words. */
  readonly opening: string;
  readonly evidence: EvidenceSpec;
  /** What the passage offers, in plain English. Sabeel's words. */
  readonly reflection: string;
  /** Small, concrete, achievable today. */
  readonly steps: readonly string[];
  readonly relatedDuaId?: string;
  readonly relatedStoryId?: string;
  /** Set when the struggle may need help beyond a website. */
  readonly seekHelp?: string;
}

export const STRUGGLES: readonly Struggle[] = [
  {
    id: 'distant-from-allah',
    title: 'I feel distant from Allah',
    summary: 'Prayer feels empty, or like nobody is listening.',
    opening:
      'This happens to almost everyone, including people who have been Muslim their whole lives. Feeling distant is not the same as being abandoned, and it is not evidence that something is wrong with you.',
    evidence: { quran: [{ surah: 2, ayah: 186 }] },
    reflection:
      'The verse answers a question about where Allah is by saying He is near, and that He responds to the one who calls. Notice it does not make the nearness conditional on feeling it. The distance you are sensing is in the feeling, not in the fact.',
    steps: [
      'Pray one prayer today slowly enough to understand a single sentence of it.',
      'Say one dua in your own language, in your own words, about exactly this.',
      'Do not try to fix all five prayers at once. Pick the next one.',
    ],
    relatedDuaId: 'anxiety-quran',
    relatedStoryId: 'yunus',
  },
  {
    id: 'guilt',
    title: 'I feel guilty about my past',
    summary: 'I keep thinking about things I did before, or things I still do.',
    opening:
      'A great deal of religious guilt comes from believing the door has closed. According to the Quran it has not, and the language it uses about this is unusually direct.',
    evidence: { quran: [{ surah: 39, ayah: 53 }] },
    reflection:
      'The verse addresses those who have wronged themselves and tells them not to despair of the mercy of Allah — and it says He forgives all sins. It is worth reading slowly, because the instruction is not to earn forgiveness first. It is not to despair.',
    steps: [
      'Say the words of return once today, plainly, without listing the reasons it was not your fault.',
      'Change one small thing rather than promising to change everything.',
      'If the guilt keeps circling, tell one person you trust. Carrying it alone makes it heavier, not holier.',
    ],
    relatedDuaId: 'sayyid-al-istighfar',
    relatedStoryId: 'adam',
  },
  {
    id: 'family',
    title: 'My family doesn’t understand',
    summary: 'They are hurt, angry, or think I have rejected them.',
    opening:
      'This is one of the hardest parts of becoming Muslim, and Islam does not ask you to stop being their child. The Quran is explicit that good treatment of parents continues even where there is deep disagreement.',
    evidence: { quran: [{ surah: 31, ayah: 15 }] },
    reflection:
      'The verse deals with the hardest case — parents pressing their child to associate others with Allah — and even there, the instruction is to accompany them in this world with kindness. Disagreement and good treatment are not alternatives.',
    steps: [
      'Pick one ordinary act of kindness toward them this week that has nothing to do with religion.',
      'Do not argue theology at the dinner table. Almost nobody was convinced that way.',
      'Make dua for them by name.',
    ],
    relatedDuaId: 'parents',
  },
  {
    id: 'consistency',
    title: 'I can’t stay consistent',
    summary: 'I start well, then stop, then feel worse for stopping.',
    opening:
      'The pattern of starting and stopping is so common that the Sunnah addresses it directly, and the guidance is the opposite of what people expect: do less, not more.',
    evidence: { hadith: [{ collection: 'bukhari', number: 6464 }], establishedPractice: true },
    reflection:
      'The most beloved deeds are the consistent ones, even if small. That reframes the whole problem — the answer to breaking a big commitment is a smaller commitment you can actually keep, not a bigger one to make up for it.',
    steps: [
      'Choose the smallest version of the thing you keep abandoning. One prayer. Two minutes of Quran.',
      'Do it at the same point in your day, attached to something you already do.',
      'When you miss it, restart the same day rather than waiting for a fresh week.',
    ],
    relatedStoryId: 'nuh',
  },
  {
    id: 'overwhelmed',
    title: 'I feel overwhelmed',
    summary: 'There is too much to learn and I do not know where to start.',
    opening:
      'You are being asked to absorb a language, a practice, a history and a community at once. That would overwhelm anyone. Islam itself was revealed over twenty-three years.',
    evidence: { quran: [{ surah: 2, ayah: 286 }] },
    reflection:
      'The verse states that Allah does not burden a soul beyond what it can bear. Read as a description rather than a demand, it means the version of this that is actually required of you is one you can carry — not the one in your head.',
    steps: [
      'Close every other tab. Pick the single next step and ignore the rest today.',
      'Learn wudhu before anything else. It is short, and it unlocks prayer.',
      'Give yourself a month, not a weekend.',
    ],
    relatedDuaId: 'distress',
  },
  {
    id: 'doubts',
    title: 'I have doubts and questions',
    summary: 'I am not sure about something, and I feel bad for asking.',
    opening:
      'Asking is not a failure of faith. The Quran records the angels asking a hard question and being answered rather than silenced, and it repeatedly invites people to look and to reason.',
    evidence: { quran: [{ surah: 2, ayah: 260 }] },
    reflection:
      'In this verse Ibrahim asks Allah to show him how the dead are brought to life. He is asked whether he believes, and he says yes — but that he wants his heart to be at rest. The question is not treated as unbelief, and it is answered.',
    steps: [
      'Write the question down plainly. Vague unease is harder to resolve than a clear question.',
      'Ask someone knowledgeable rather than a search engine.',
      'Accept that some answers take time, and that not knowing yet is a normal place to stand.',
    ],
    relatedStoryId: 'ibrahim',
  },
  {
    id: 'alone',
    title: 'I feel alone in this',
    summary: 'Nobody around me understands, or I have nobody to ask.',
    opening:
      'Practising alone is genuinely hard, and it is not a sign that you are doing it wrong. Several of the people the Quran honours most were, at points, entirely on their own.',
    evidence: { quran: [{ surah: 9, ayah: 40 }] },
    reflection:
      'The verse recalls a moment of hiding with one companion and being told not to grieve, because Allah is with them. It is a small sentence said in a genuinely frightening situation, and the comfort offered is presence rather than rescue.',
    steps: [
      'Find one Muslim you can message. One is enough to change this.',
      'Visit a mosque once, even briefly. You do not need to know anyone.',
      'Read the story of the People of the Cave — young people who had only each other.',
    ],
    relatedStoryId: 'people-of-the-cave',
    seekHelp:
      'If loneliness has become something heavier — if you are struggling to function, or having thoughts of harming yourself — please speak to a doctor or a mental health professional. That is not a failure of faith, and a website is not the right help for it.',
  },
];

export function getStruggle(id: string): Struggle | undefined {
  return STRUGGLES.find((struggle) => struggle.id === id);
}
