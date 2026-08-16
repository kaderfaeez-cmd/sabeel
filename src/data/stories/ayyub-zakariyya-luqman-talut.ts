import type { Story } from './types';

/**
 * Same discipline as every other story file: the hook and narrative set the scene and
 * name the feeling, but add no event the Quran does not state and put no words into
 * anyone's mouth. Every verse range was checked against the source before being written.
 */

export const AYYUB: Story = {
  id: 'ayyub',
  name: 'Ayyub',
  arabicName: 'أيوب',
  subtitle: 'He lost his health, his wealth and his children, and the Quran records six words from him',
  hook:
    'Imagine losing your health, your money and your children — not one after another with time to recover, but as a life that simply comes apart. Now imagine what you would say to God. Most of us would have a long speech ready. What the Quran preserves from him is astonishingly short, and there is not a word of complaint in it.',
  whyItMatters:
    'This is the story people reach for when someone says that faith should make life easy. It does not. Ayyub was a prophet, and he suffered for a long time. What the Quran honours is not that he avoided pain, but how he carried it.',
  whatYoullLearn: [
    'What Ayyub actually said at the worst point of his life',
    'Why the Quran calls him excellent despite his complaint',
    'That naming your suffering is not the same as complaining about Allah',
    'How the story ends, and what he was given back',
  ],
  readingMinutes: 5,
  difficulty: 'gentle',
  themes: ['hardship', 'patience', 'loneliness'],
  where: 'Surah Al-Anbiya (21) and Surah Sad (38).',
  passages: [
    {
      id: 'the-call',
      heading: 'What he said',
      when: 'At the worst of it',
      narrative:
        'After everything has been taken from him, he calls out. Read how carefully he phrases it — he states his own condition, and then says something about his Lord rather than making a demand.',
      surah: 21,
      ayahFrom: 83,
      ayahTo: 84,
      explanation:
        'He says that adversity has touched him, and that Allah is the most merciful of the merciful. That is the whole of it. He names what is happening to him honestly — he does not pretend to be fine — and then he names who he is speaking to. There is no bargaining and no accusation. The response follows immediately, and the Quran says his family was restored to him and the like of them with them.',
    },
    {
      id: 'sad',
      heading: 'Told again, with the ending',
      when: 'The account in Surah Sad',
      narrative:
        'The second telling adds detail: the instruction he was given, and the striking sentence the Quran uses to describe him afterwards.',
      surah: 38,
      ayahFrom: 41,
      ayahTo: 44,
      explanation:
        'He is told to strike the ground with his foot, and a spring appears to wash in and to drink. Relief arrives through an instruction to act, small and physical, rather than through nothing at all. Then the passage says he was found patient, and calls him an excellent servant who turned back repeatedly. Notice that he is called patient in the same passage where his cry is recorded. Patience here clearly does not mean silence.',
    },
  ],
  lessons: {
    aboutAllah:
      'Ayyub was answered immediately, and what he had lost was not merely replaced but multiplied. The story shows a Lord who does not require composure before He responds, and who is described by Ayyub himself as the most merciful of the merciful even while he is still suffering.',
    points: [
      'He named his suffering plainly. Honesty about pain is not a failure of patience.',
      'His call contained no demand and no accusation — he stated his condition and stated who Allah is.',
      'Relief came through an instruction to do something small and physical, not through waiting alone.',
      'The Quran calls him patient in the very passage that records his cry. Patience is not silence.',
    ],
    character: ['Honesty in hardship', 'Patience without pretence', 'Turning back repeatedly'],
  },
  reflections: [
    'Have you ever felt that admitting how hard something is would count against you?',
    'What would change if you brought the difficulty to Allah plainly, without dressing it up?',
    'Is there one small physical thing you could do today that you have been waiting to feel ready for?',
  ],
  actionToday:
    'Say one honest sentence to Allah about the hardest thing you are carrying — without softening it and without asking for anything yet.',
  relatedDuaId: 'distress',
  noMapReason:
    'The Quran does not say where Ayyub lived, and the historical reports differ. Sabeel does not plot a location it cannot establish.',
};

export const ZAKARIYYA: Story = {
  id: 'zakariyya',
  name: 'Zakariyya',
  arabicName: 'زكريا',
  subtitle: 'An old man who asked for a child, quietly, long after it made sense to ask',
  hook:
    'Imagine wanting something for so long that you have stopped saying it out loud. You are old now. The window has closed. Everyone knows it, including you. And yet one day, privately, you ask anyway. This is the story of a man who did exactly that, and the Quran makes a point of telling us that he asked in secret.',
  whyItMatters:
    'Almost everyone has a dua they have quietly given up on. This is the passage the Quran offers for that, and the detail it emphasises is not that his request was reasonable — it was not — but that he made it anyway.',
  whatYoullLearn: [
    'Why the Quran mentions that he called out in private',
    'What he said about his own body and age before asking',
    'The sign he was given, and what he did with it',
    'That asking for something unlikely is not treated as foolish',
  ],
  readingMinutes: 5,
  difficulty: 'gentle',
  themes: ['hope', 'family', 'patience'],
  where: 'Surah Maryam (19) and Surah Aal-Imran (3).',
  passages: [
    {
      id: 'the-private-call',
      heading: 'A call made in secret',
      when: 'In old age',
      placeId: 'jerusalem',
      narrative:
        'The surah opens by describing this as a mention of the mercy of his Lord to him. Then it shows him calling out — and takes care to tell us that he did it quietly, where nobody could hear.',
      surah: 19,
      ayahFrom: 2,
      ayahTo: 11,
      explanation:
        'He describes his own weakness before he asks: his bones have grown feeble and his head is aflame with white hair. He is not pretending the request is sensible. He also says that he has never been unblessed in his supplication before — he is remembering past answers as grounds for asking again. He is given the good tidings of a son named Yahya, and told that no one has been given that name before him. When he asks for a sign, he is told he will not speak to people for three nights, though he is well.',
    },
    {
      id: 'aal-imran',
      heading: 'The same moment, told again',
      when: 'The account in Aal-Imran',
      placeId: 'jerusalem',
      narrative:
        'The second telling places the request immediately after something he had just witnessed — provision arriving for Maryam from a source nobody could explain.',
      surah: 3,
      ayahFrom: 38,
      ayahTo: 41,
      explanation:
        'Seeing unexplained provision given to someone else did not make him envious. It made him ask for himself. That is the hinge of the passage: another person being given something became his reason to believe it was possible, rather than a reason to feel passed over.',
    },
  ],
  lessons: {
    aboutAllah:
      'He was answered at an age when the request no longer made sense, and the Quran frames the whole episode as a mention of mercy. What He gives is not limited by what is reasonable to expect.',
    points: [
      'He asked privately. A dua does not need an audience, and the Quran singles this out for mention.',
      'He named his own weakness honestly before asking, rather than pretending to deserve it.',
      'He remembered that he had been answered before, and used that as grounds to ask again.',
      'Seeing someone else provided for prompted him to ask rather than to resent.',
    ],
    character: ['Persistence in dua', 'Hope past the point of reason', 'Freedom from envy'],
  },
  reflections: [
    'What have you stopped asking for because it seems too late?',
    'When something good happens to someone else, what is your first feeling?',
    'When were you last answered — and does it change how you ask now?',
  ],
  actionToday:
    'Ask Allah quietly today for the thing you gave up asking for. You do not have to believe it is likely.',
  relatedDuaId: 'family-quran',
};

export const LUQMAN: Story = {
  id: 'luqman',
  name: 'Luqman',
  arabicName: 'لقمان',
  subtitle: 'A father giving his son advice, preserved in the Quran word for word',
  hook:
    'Imagine the few things you would want to tell your child if you only had one conversation. Not everything you know — just what actually matters. A man once did that, and Allah preserved it in the Quran. He was not a prophet. He was a father who had been given wisdom, and what he chose to say is remarkably practical.',
  whyItMatters:
    'Most of the Quran’s guidance arrives through prophets. This arrives through an ordinary man talking to his son, which makes it unusually easy to apply. It covers belief, parents, accountability, prayer, patience, arrogance and even how to walk and speak.',
  whatYoullLearn: [
    'What wisdom is described as, and what Luqman was told to do with it',
    'The first thing he warned his son about, and why he called it a great wrong',
    'What he said about parents who disagree with you',
    'His advice on how to carry yourself among people',
  ],
  readingMinutes: 6,
  difficulty: 'gentle',
  themes: ['family', 'gratitude', 'patience'],
  where: 'Surah Luqman (31), verses 12–19.',
  passages: [
    {
      id: 'wisdom',
      heading: 'What he was given',
      when: 'Before the advice begins',
      narrative:
        'Before any of the advice, the passage says what he was given and what he was told to do with it. The instruction attached to wisdom is short and unexpected.',
      surah: 31,
      ayahFrom: 12,
      ayahTo: 13,
      explanation:
        'He was given wisdom, and told to be grateful — and the passage adds that whoever is grateful is grateful for their own benefit. Then the advice to his son begins, and the first item is not a rule about behaviour. It is not to associate anything with Allah, which he calls a great injustice. Everything practical that follows is built on that.',
    },
    {
      id: 'parents',
      heading: 'Parents, and the limits of obedience',
      when: 'The advice continues',
      narrative:
        'The passage steps aside from Luqman for a moment to address the hardest case directly: parents who want you to believe something you cannot.',
      surah: 31,
      ayahFrom: 14,
      ayahTo: 15,
      explanation:
        'It records what a mother endures in carrying and weaning a child, and instructs gratitude to Allah and to parents. Then it deals with the conflict: if they press you toward associating others with Allah, do not obey them — and in the same breath, accompany them in this world with kindness. Refusing on one point and treating them well are not presented as alternatives.',
    },
    {
      id: 'accountability',
      heading: 'Nothing is too small to be seen',
      when: 'The advice continues',
      narrative:
        'He then tells his son something about scale — that being small or hidden is no protection from being known.',
      surah: 31,
      ayahFrom: 16,
      ayahTo: 17,
      explanation:
        'He says that if a deed were the weight of a mustard seed and inside a rock, or in the heavens or the earth, Allah would bring it forth. Then the practical instructions: establish prayer, enjoin what is right, forbid what is wrong, and be patient over what befalls you — with the last one clearly expected to be needed because of the ones before it.',
    },
    {
      id: 'manner',
      heading: 'How to carry yourself',
      when: 'The closing advice',
      narrative:
        'The advice ends with something almost startlingly ordinary: posture, pace, and tone of voice.',
      surah: 31,
      ayahFrom: 18,
      ayahTo: 19,
      explanation:
        'Do not turn your cheek away from people in contempt, do not walk through the earth exultantly, be moderate in your pace, and lower your voice. Character here is not abstract. It is how you hold your face, how you walk down a street, and how loudly you speak — the things people actually notice about you.',
    },
  ],
  lessons: {
    aboutAllah:
      'The passage insists that nothing is too small or too hidden to be known, and pairs that with the instruction to be grateful. Being fully seen is presented as a reason for care rather than for fear.',
    points: [
      'The advice begins with belief and ends with how you walk and speak. Both are treated as part of the same thing.',
      'Refusing a parent on one point and treating them with kindness are not alternatives.',
      'Patience is listed straight after enjoining good — as though difficulty is expected, not exceptional.',
      'Arrogance is described through behaviour: a turned cheek, a swaggering walk, a raised voice.',
    ],
    character: ['Gratitude', 'Humility in bearing', 'Kindness within disagreement'],
  },
  reflections: [
    'If you had one conversation with someone you love, what would you actually say?',
    'Is there a small habit in how you speak or carry yourself that you would not want described back to you?',
    'Where are you refusing something on principle in a way that has also become unkind?',
  ],
  actionToday:
    'Pick one of Luqman’s closing instructions — your pace, your tone, or your attention to someone — and apply it once today.',
  relatedDuaId: 'parents',
  noMapReason:
    'The Quran does not say where Luqman lived, and the reports about him differ. Sabeel does not plot a location it cannot establish.',
};

export const TALUT: Story = {
  id: 'talut',
  name: 'Talut and Jalut',
  arabicName: 'طالوت وجالوت',
  subtitle: 'An army that shrank at every test, and won anyway',
  hook:
    'Imagine asking for a leader, being given one, and immediately objecting that he is not rich enough. Then imagine setting out to fight, and being tested by something as ordinary as a river — and most of your army failing at it. By the time the fighting starts there is almost nobody left. That is when the story actually begins.',
  whyItMatters:
    'This is the passage for feeling outnumbered. It is honest that most people dropped away, honest that those remaining were frightened, and it puts the decisive line in the mouths of the few who stayed rather than in the mouth of the commander.',
  whatYoullLearn: [
    'Why the people objected to the leader they were given',
    'What the test at the river actually was',
    'What the small group said when they saw the size of the opposing army',
    'How Dawud enters the story',
  ],
  readingMinutes: 6,
  difficulty: 'moderate',
  themes: ['fear', 'doubt', 'patience'],
  where: 'Surah Al-Baqarah (2), verses 246–251.',
  passages: [
    {
      id: 'the-request',
      heading: 'They asked for a king',
      when: 'After the time of Musa',
      narrative:
        'A group of the Children of Israel ask a prophet of theirs to appoint a king so they can fight. He asks them a question first — whether they will actually fight if it is prescribed for them.',
      surah: 2,
      ayahFrom: 246,
      ayahTo: 248,
      explanation:
        'They insist they will fight, having been driven from their homes. When Talut is appointed they object that he has not been given wealth. The answer is that Allah has chosen him and increased him in knowledge and stature — and that Allah gives His sovereignty to whom He wills. The objection is about money; the qualification given is knowledge and capacity.',
    },
    {
      id: 'the-river',
      heading: 'The test at the river',
      when: 'On the march',
      narrative:
        'On the way, he tells them they will be tested by a river, and gives a precise instruction about drinking from it. Most of them do not keep to it.',
      surah: 2,
      ayahFrom: 249,
      ayahTo: 250,
      explanation:
        'Whoever drinks from it is not of him, except one who takes a sip from his hand. Most drink. Those who remain then see the army they are facing and some say they have no power against it today — and it is the few certain of meeting Allah who answer that many a small company has overcome a large one by the permission of Allah. The decisive sentence comes from the ranks, not from the leader. Then they pray for patience to be poured upon them.',
    },
    {
      id: 'dawud',
      heading: 'And Dawud killed Jalut',
      when: 'The battle',
      narrative:
        'The battle turns on a single line, and introduces someone who has not been mentioned until now.',
      surah: 2,
      ayahFrom: 251,
      ayahTo: 251,
      explanation:
        'They defeated them by the permission of Allah, and Dawud killed Jalut, and Allah gave him sovereignty and wisdom and taught him from what He willed. The passage closes by saying that were it not for Allah checking people by means of one another, the earth would be corrupted. Dawud arrives in the story with no introduction at all — the outcome is credited to permission rather than to strength.',
    },
  ],
  lessons: {
    aboutAllah:
      'Leadership is given on the basis of knowledge and capacity rather than wealth, and the victory is repeatedly described as by permission rather than by force. The passage is careful never to let the outcome rest on the numbers.',
    points: [
      'They objected that the leader was not wealthy. The qualification offered was knowledge and capability.',
      'Most of the army failed at something as small as how they drank from a river.',
      'The line about a small company overcoming a large one is spoken by the ranks, not by the commander.',
      'Even the ones who stayed prayed for patience to be poured on them. Courage here includes asking for help with it.',
    ],
    character: ['Discipline in small things', 'Courage that admits fear', 'Judging people by more than wealth'],
  },
  reflections: [
    'Have you ever failed at a small test long before the big one arrived?',
    'Where are you judging someone — or yourself — by the wrong measure?',
    'What would it take for you to stay when most people around you have stopped?',
  ],
  actionToday:
    'Identify the one small daily thing you keep letting slip, and keep it today. That is the river.',
  relatedDuaId: 'distress',
  noMapReason:
    'The Quran does not name where this took place, and the river is described without being identified. Sabeel does not plot a location it cannot establish.',
};
