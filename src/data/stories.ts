/**
 * Stories of the Quran.
 *
 * The architecture that makes this authentic: a story is a sequence of **Quranic
 * passages fetched from the source and cited**, with only the connective framing written
 * by Sabeel — and that framing is labelled as ours wherever it appears (Constitution
 * §3.2). No narrative detail is invented, and nothing is retold in a way that would put
 * words into the mouth of a Prophet.
 *
 * Constitution §6: no Prophet or revered figure is ever depicted. These pages carry no
 * figurative imagery of any kind.
 *
 * Every passage range is validated against the baked surah index by
 * `npm run check:stories`, which fails if a range runs past the end of its surah.
 */

export interface StoryPassage {
  readonly id: string;
  /** Sabeel's heading for this movement of the story. Editorial. */
  readonly heading: string;
  /** Sabeel's framing — what to notice, or what has just happened. Editorial. */
  readonly context: string;
  readonly surah: number;
  readonly ayahFrom: number;
  readonly ayahTo: number;
}

export interface Story {
  readonly id: string;
  readonly name: string;
  readonly arabicName: string;
  readonly subtitle: string;
  /** Where the story is found, in plain language. */
  readonly where: string;
  /** One-paragraph orientation before the passages begin. Editorial. */
  readonly opening: string;
  readonly passages: readonly StoryPassage[];
  readonly lessons: readonly string[];
  readonly reflections: readonly string[];
}

export const STORIES: readonly Story[] = [
  {
    id: 'yusuf',
    name: 'Yusuf',
    arabicName: 'يوسف',
    subtitle: 'The brother thrown into a well, who became the one they came begging to',
    where: 'Surah Yusuf (12) — told from beginning to end in a single surah, which is unusual.',
    opening:
      'This is the only story the Quran tells in one continuous surah, from the dream at the start to its meaning at the end. It is a story about betrayal inside a family, years of injustice, and a man who ends up with total power over the people who wronged him — and what he does with it.',
    passages: [
      {
        id: 'dream',
        heading: 'The dream',
        context: 'It begins with a boy telling his father something he saw in his sleep.',
        surah: 12,
        ayahFrom: 4,
        ayahTo: 6,
      },
      {
        id: 'brothers',
        heading: 'The brothers decide',
        context: 'His brothers resent him. Notice that the Quran records their reasoning rather than simply calling them wicked.',
        surah: 12,
        ayahFrom: 7,
        ayahTo: 10,
      },
      {
        id: 'well',
        heading: 'The well',
        context: 'They carry it out, and return with a story for their father.',
        surah: 12,
        ayahFrom: 15,
        ayahTo: 18,
      },
      {
        id: 'egypt',
        heading: 'Sold into Egypt',
        context: 'He is found by a caravan, sold, and taken into the household of a man of standing.',
        surah: 12,
        ayahFrom: 19,
        ayahTo: 22,
      },
      {
        id: 'temptation',
        heading: 'The accusation',
        context: 'He refuses, and is imprisoned for it — punished for the thing he did not do.',
        surah: 12,
        ayahFrom: 23,
        ayahTo: 29,
      },
      {
        id: 'prison',
        heading: 'Years in prison',
        context: 'In prison he interprets two dreams, and asks to be remembered — and is forgotten.',
        surah: 12,
        ayahFrom: 36,
        ayahTo: 42,
      },
      {
        id: 'kings-dream',
        heading: 'The king’s dream',
        context: 'Years later a dream nobody can interpret brings him out.',
        surah: 12,
        ayahFrom: 43,
        ayahTo: 49,
      },
      {
        id: 'power',
        heading: 'Given authority',
        context: 'He is cleared, and asks to be put in charge of the stores of the land.',
        surah: 12,
        ayahFrom: 54,
        ayahTo: 57,
      },
      {
        id: 'reunion',
        heading: 'The brothers come begging',
        context: 'Famine drives them to Egypt, to the man they threw down a well — and they do not recognise him.',
        surah: 12,
        ayahFrom: 58,
        ayahTo: 62,
      },
      {
        id: 'forgiveness',
        heading: 'What he does with the power',
        context: 'This is the moment the whole story has been building toward.',
        surah: 12,
        ayahFrom: 89,
        ayahTo: 93,
      },
      {
        id: 'ending',
        heading: 'The dream, explained',
        context: 'The story closes by returning to where it began.',
        surah: 12,
        ayahFrom: 100,
        ayahTo: 101,
      },
    ],
    lessons: [
      'Being wronged is not evidence that Allah has abandoned you. Most of this story takes place while Yusuf is innocent and suffering.',
      'The Quran records the brothers’ jealousy and their reasoning. It does not flatten them into villains, and it does not excuse them either.',
      'Having power over someone who wronged you is a test in itself, and it is the test the story treats as the climax.',
      'Yusuf does not say the years were unimportant. He names what happened, and forgives anyway.',
    ],
    reflections: [
      'Is there something in your life you assumed meant abandonment, that you can now see differently?',
      'Yusuf was forgotten by the man he helped. Have you kept doing the right thing when nobody remembered?',
      'Who would you find hardest to forgive if you suddenly had the upper hand?',
    ],
  },
  {
    id: 'people-of-the-cave',
    name: 'The People of the Cave',
    arabicName: 'أصحاب الكهف',
    subtitle: 'Young men who walked away from everything, and slept for three centuries',
    where: 'Surah Al-Kahf (18), verses 9–26.',
    opening:
      'A group of young men in a city that had turned hostile to their belief. They leave rather than pretend, take shelter in a cave, and wake to find the world has moved on by centuries. The Quran is deliberately spare about the details, and says so directly.',
    passages: [
      {
        id: 'opening',
        heading: 'The question',
        context: 'The Quran introduces them as a sign worth considering.',
        surah: 18,
        ayahFrom: 9,
        ayahTo: 12,
      },
      {
        id: 'their-stand',
        heading: 'What they said',
        context: 'Young men who would not soften what they believed to make life easier.',
        surah: 18,
        ayahFrom: 13,
        ayahTo: 16,
      },
      {
        id: 'the-sleep',
        heading: 'The long sleep',
        context: 'The description is unhurried, almost tender.',
        surah: 18,
        ayahFrom: 17,
        ayahTo: 18,
      },
      {
        id: 'waking',
        heading: 'Waking',
        context: 'They send one of them into the city with old money, and the world has changed.',
        surah: 18,
        ayahFrom: 19,
        ayahTo: 21,
      },
      {
        id: 'how-many',
        heading: 'How many were they?',
        context: 'People argued over the number. The Quran refuses to settle it, and the refusal is the point.',
        surah: 18,
        ayahFrom: 22,
        ayahTo: 26,
      },
    ],
    lessons: [
      'They were young. The Quran describes them as youths who believed, and increased them in guidance.',
      'Leaving was not weakness. Sometimes distance is what protects belief rather than confrontation.',
      'The Quran declines to answer how many they were, and warns against arguing about it — a direct instruction about which questions are worth pursuing.',
      'Waking after three hundred years, their first concern was food that was lawful. The small things kept their shape.',
    ],
    reflections: [
      'Is there something you have been arguing about that the answer would not actually change?',
      'What would you find hardest to leave behind if staying meant hiding what you believe?',
    ],
  },
  {
    id: 'dhul-qarnayn',
    name: 'Dhul-Qarnayn',
    arabicName: 'ذو القرنين',
    subtitle: 'A ruler given power over the earth, who used it to build rather than take',
    where: 'Surah Al-Kahf (18), verses 83–98.',
    opening:
      'A traveller and ruler given extraordinary reach. The Quran follows him west, then east, then to a mountain pass where a people ask him for help. What is striking throughout is how he handles having power that nobody could challenge.',
    passages: [
      {
        id: 'given',
        heading: 'Established in the land',
        context: 'The Quran opens by describing what he was given.',
        surah: 18,
        ayahFrom: 83,
        ayahTo: 88,
      },
      {
        id: 'east',
        heading: 'Travelling east',
        context: 'He reaches a people with no shelter from the sun.',
        surah: 18,
        ayahFrom: 89,
        ayahTo: 91,
      },
      {
        id: 'the-barrier',
        heading: 'The barrier',
        context: 'A people ask him to build a wall, and offer to pay. Watch his answer.',
        surah: 18,
        ayahFrom: 92,
        ayahTo: 96,
      },
      {
        id: 'mercy',
        heading: 'What he said when it was finished',
        context: 'The wall is complete and impassable — and he immediately refuses credit for it.',
        surah: 18,
        ayahFrom: 97,
        ayahTo: 98,
      },
    ],
    lessons: [
      'Offered payment for the wall, he answers that what his Lord has given him is better, and asks only for their labour instead.',
      'With the wall finished and unbreachable, his first words are that it is a mercy from his Lord — not an achievement of his.',
      'He deals with each people he meets on their own terms rather than imposing one settlement everywhere.',
    ],
    reflections: [
      'When something you built succeeds, where does your mind go first?',
      'Is there help you could give that you have been quietly pricing?',
    ],
  },
  {
    id: 'maryam',
    name: 'Maryam',
    arabicName: 'مريم',
    subtitle: 'A woman who faced her community alone, and was told to be silent',
    where: 'Surah Maryam (19), verses 16–36. She is the only woman named in the Quran.',
    opening:
      'Maryam is the only woman named directly in the Quran, and an entire surah carries her name. This passage covers the announcement, the birth, and her return to a community certain of the worst about her.',
    passages: [
      {
        id: 'announcement',
        heading: 'The announcement',
        context: 'She withdraws from her family, and is met by an angel in the form of a man.',
        surah: 19,
        ayahFrom: 16,
        ayahTo: 21,
      },
      {
        id: 'birth',
        heading: 'Alone, in pain',
        context: 'The Quran does not soften this. She says she wishes she had died before it.',
        surah: 19,
        ayahFrom: 22,
        ayahTo: 26,
      },
      {
        id: 'return',
        heading: 'Facing them',
        context: 'She returns carrying the child, and is told to say nothing at all.',
        surah: 19,
        ayahFrom: 27,
        ayahTo: 33,
      },
      {
        id: 'closing',
        heading: 'The matter settled',
        context: 'The passage ends by stating plainly what Isa was, and was not.',
        surah: 19,
        ayahFrom: 34,
        ayahTo: 36,
      },
    ],
    lessons: [
      'The Quran records her saying she wished she had died rather than face this. Distress is not treated as a failure of faith.',
      'She was told to shake the palm toward her — she was in pain, and still asked to act. Provision came with effort, not instead of it.',
      'She was instructed to stay silent and let the truth speak for itself. Not every accusation needs your defence.',
      'Muslims honour Isa and his mother, and hold that he was a servant and messenger of Allah rather than a son of God.',
    ],
    reflections: [
      'Have you been in a situation where explaining yourself would have made it worse?',
      'Maryam was given a hard instruction at her weakest moment. What helps you act when you have nothing left?',
    ],
  },
  {
    id: 'nuh',
    name: 'Nuh',
    arabicName: 'نوح',
    subtitle: 'A man who called his people for lifetimes, and was mostly ignored',
    where: 'Surah Nuh (71) in full, with the flood in Surah Hud (11).',
    opening:
      'Nuh called his people for an extraordinarily long time and was largely rejected. Surah Nuh is close to a transcript of how he tried — publicly, privately, at night, in the open — and it is worth reading as a study in persistence.',
    passages: [
      {
        id: 'sent',
        heading: 'Sent to warn',
        context: 'The surah opens with the task he is given.',
        surah: 71,
        ayahFrom: 1,
        ayahTo: 4,
      },
      {
        id: 'how-he-tried',
        heading: 'Every way he could',
        context: 'He describes his own methods to his Lord. Notice how many different approaches he lists.',
        surah: 71,
        ayahFrom: 5,
        ayahTo: 12,
      },
      {
        id: 'what-he-showed',
        heading: 'What he pointed them to',
        context: 'Rather than argue, he turns their attention to the world around them.',
        surah: 71,
        ayahFrom: 13,
        ayahTo: 20,
      },
      {
        id: 'the-ark',
        heading: 'The ark',
        context: 'In Surah Hud, the building of the ark and the mockery it drew.',
        surah: 11,
        ayahFrom: 36,
        ayahTo: 41,
      },
      {
        id: 'his-son',
        heading: 'His son',
        context: 'The hardest part of the story: the flood comes, and his own son will not board.',
        surah: 11,
        ayahFrom: 42,
        ayahTo: 47,
      },
    ],
    lessons: [
      'He tried publicly, privately, loudly and quietly. Being ignored did not mean he had used the wrong method — sometimes it means nothing about you at all.',
      'When arguing failed, he pointed at the sky and the earth and asked them to look. Evidence was offered, not forced.',
      'His own son did not follow him. A prophet could not guarantee the belief of his own child, which should quiet anyone who measures themselves by their family’s choices.',
    ],
    reflections: [
      'Have you given up on something because it was not working yet?',
      'Is there someone whose choices you have been holding yourself responsible for?',
    ],
  },
  {
    id: 'ibrahim',
    name: 'Ibrahim',
    arabicName: 'إبراهيم',
    subtitle: 'The man who broke the idols and asked the harder question',
    where: 'Surah Al-Anbya (21), verses 51–70, and Surah As-Saffat (37).',
    opening:
      'Ibrahim is described in the Quran as a nation in himself. These passages cover his argument with his people about the idols, the fire he was thrown into, and later the test involving his son.',
    passages: [
      {
        id: 'questioning',
        heading: 'Asking what they are',
        context: 'He asks his father and his people a direct question about what they are worshipping.',
        surah: 21,
        ayahFrom: 51,
        ayahTo: 57,
      },
      {
        id: 'idols',
        heading: 'The broken idols',
        context: 'He breaks them all but one, and leaves the axe with the largest. His answer when questioned is the point.',
        surah: 21,
        ayahFrom: 58,
        ayahTo: 63,
      },
      {
        id: 'realising',
        heading: 'They turn on themselves',
        context: 'For a moment they see it — and then return to what they were doing.',
        surah: 21,
        ayahFrom: 64,
        ayahTo: 67,
      },
      {
        id: 'fire',
        heading: 'The fire',
        context: 'Their answer to the argument is force.',
        surah: 21,
        ayahFrom: 68,
        ayahTo: 70,
      },
      {
        id: 'the-test',
        heading: 'The test',
        context: 'Much later, the hardest instruction — and how both father and son received it.',
        surah: 37,
        ayahFrom: 100,
        ayahTo: 111,
      },
    ],
    lessons: [
      'He did not begin by telling them they were wrong. He asked them what they were doing, and let the question do the work.',
      'When he pointed at the largest idol, they briefly admitted the idols could do nothing — and then went back anyway. Seeing the truth and acting on it are different steps.',
      'The test in Surah As-Saffat is answered by both father and son. The son’s reply is his own, not extracted from him.',
    ],
    reflections: [
      'When you disagree with someone, do you tell them or ask them?',
      'Has there been a moment when you saw something clearly and carried on anyway?',
    ],
  },
  {
    id: 'musa',
    name: 'Musa',
    arabicName: 'موسى',
    subtitle: 'From a basket on a river to standing before the man who wanted him dead',
    where: 'Surah Ta-Ha (20) and Surah Al-Qasas (28).',
    opening:
      'Musa is mentioned in the Quran more than any other prophet. These passages follow the fire in the valley, the commission he was given, and the moment at the sea — including the objection he raised about his own speech.',
    passages: [
      {
        id: 'infancy',
        heading: 'The river',
        context: 'His mother is inspired to do the thing that looks most like losing him.',
        surah: 28,
        ayahFrom: 7,
        ayahTo: 13,
      },
      {
        id: 'fire',
        heading: 'The fire in the valley',
        context: 'Years later, in exile, he sees a fire and goes toward it for something ordinary.',
        surah: 20,
        ayahFrom: 9,
        ayahTo: 16,
      },
      {
        id: 'commission',
        heading: 'Sent to Fir‘awn',
        context: 'He is given the task, and immediately raises a difficulty about himself.',
        surah: 20,
        ayahFrom: 24,
        ayahTo: 36,
      },
      {
        id: 'gently',
        heading: 'How to speak to him',
        context: 'The instruction about tone, given about a tyrant, is one of the most striking lines in the Quran.',
        surah: 20,
        ayahFrom: 42,
        ayahTo: 46,
      },
      {
        id: 'sea',
        heading: 'At the sea',
        context: 'Trapped between an army and water, with his people certain they are finished.',
        surah: 26,
        ayahFrom: 60,
        ayahTo: 68,
      },
    ],
    lessons: [
      'His mother’s instruction was to put her child in a river. Sometimes the guidance you are given looks exactly like the thing you fear.',
      'Musa asked for his brother’s help, and for his own chest to be expanded. Asking for support is part of the story, not a flaw in it.',
      'They were told to speak gently to Fir‘awn. If that was the instruction there, very few conversations justify harshness.',
      'At the sea he says plainly that his Lord is with him and will guide him — before any way out is visible.',
    ],
    reflections: [
      'What would you attempt if you were allowed to ask for help first?',
      'Is there a conversation you have been having harshly that might go differently?',
    ],
  },
  {
    id: 'yunus',
    name: 'Yunus',
    arabicName: 'يونس',
    subtitle: 'The prophet who left, and called out from inside the dark',
    where: 'Surah As-Saffat (37) and Surah Al-Anbiya (21), verses 87–88.',
    opening:
      'Yunus left his people before he was permitted to, and the sea and a great fish are how the story turns. What he said inside that darkness is one of the most repeated supplications in Islam.',
    passages: [
      {
        id: 'leaving',
        heading: 'He left',
        context: 'The account in Surah As-Saffat is compressed and fast-moving.',
        surah: 37,
        ayahFrom: 139,
        ayahTo: 148,
      },
      {
        id: 'the-call',
        heading: 'From inside the darkness',
        context: 'Surah Al-Anbiya records what he called out, and what happened next.',
        surah: 21,
        ayahFrom: 87,
        ayahTo: 88,
      },
    ],
    lessons: [
      'His call begins by declaring that there is no god but Allah, then admits he was wrong. The order matters — the admission comes after the recognition.',
      'The Quran states directly that this is how believers are saved, which turns one man’s worst moment into an instruction for everyone.',
      'Leaving in frustration was not the end of his story. There was still a way back.',
    ],
    reflections: [
      'Is there something you walked away from that you have assumed is closed?',
      'When you have been wrong, how easily do you say so plainly?',
    ],
  },
  {
    id: 'sulaiman',
    name: 'Sulaiman',
    arabicName: 'سليمان',
    subtitle: 'A king who understood the ant, and a queen who was not humiliated',
    where: 'Surah An-Naml (27), verses 15–44.',
    opening:
      'Sulaiman was given a kingdom unlike any other, including understanding of speech beyond humans. The passage includes an ant, a bird bringing news, and a correspondence with a queen that ends very differently from how such stories usually end.',
    passages: [
      {
        id: 'given',
        heading: 'What he was given',
        context: 'The passage opens by naming the gift, and his response to it.',
        surah: 27,
        ayahFrom: 15,
        ayahTo: 19,
      },
      {
        id: 'hoopoe',
        heading: 'News from a bird',
        context: 'A missing bird returns with information about a kingdom to the south.',
        surah: 27,
        ayahFrom: 20,
        ayahTo: 28,
      },
      {
        id: 'queen',
        heading: 'The queen’s counsel',
        context: 'She receives the letter and consults her advisors. Her reasoning about what invading armies do is worth reading closely.',
        surah: 27,
        ayahFrom: 29,
        ayahTo: 35,
      },
      {
        id: 'ending',
        heading: 'How it ended',
        context: 'She comes, sees, and reaches her own conclusion — in her own words.',
        surah: 27,
        ayahFrom: 38,
        ayahTo: 44,
      },
    ],
    lessons: [
      'Hearing the ant, his response is to smile and ask to be made grateful. The gift turned his attention upward rather than inward.',
      'The queen is portrayed as thoughtful and politically astute. The Quran records her consulting her people and reasoning about consequences.',
      'She is never humiliated. She arrives at her own conclusion and states it herself.',
    ],
    reflections: [
      'When something goes well for you, what is your first reaction?',
      'Do you let people arrive at conclusions themselves, or do you need to deliver them?',
    ],
  },
  {
    id: 'adam',
    name: 'Adam',
    arabicName: 'آدم',
    subtitle: 'The first human, the first mistake, and the first words of return',
    where: 'Surah Al-Baqarah (2), verses 30–39, and Surah Al-A‘raf (7).',
    opening:
      'The beginning of the human story: the announcement to the angels, the teaching of the names, the refusal of Iblis, and a mistake followed immediately by a way back. How this ends is the part most worth noticing.',
    passages: [
      {
        id: 'announcement',
        heading: 'The announcement',
        context: 'The angels ask a reasonable question, and are answered.',
        surah: 2,
        ayahFrom: 30,
        ayahTo: 33,
      },
      {
        id: 'refusal',
        heading: 'The refusal',
        context: 'All prostrate except one, and the reason given is arrogance.',
        surah: 2,
        ayahFrom: 34,
        ayahTo: 36,
      },
      {
        id: 'return',
        heading: 'The words of return',
        context: 'This is the turn: what happens immediately after the mistake.',
        surah: 2,
        ayahFrom: 37,
        ayahTo: 39,
      },
      {
        id: 'their-words',
        heading: 'What they said',
        context: 'Surah Al-A‘raf records the supplication itself.',
        surah: 7,
        ayahFrom: 22,
        ayahTo: 23,
      },
    ],
    lessons: [
      'Iblis refused out of arrogance, and did not repent. Adam made a mistake and turned back. The difference between the two is not the error.',
      'Adam received words from his Lord — the way back was given to him, not invented by him.',
      'The human story begins with a mistake that is forgiven. That is the frame everything else sits inside.',
    ],
    reflections: [
      'Do you treat your mistakes as things to be corrected, or as evidence about who you are?',
      'What would change if you believed the way back was always already open?',
    ],
  },
];

export function getStory(id: string): Story | undefined {
  return STORIES.find((story) => story.id === id);
}
