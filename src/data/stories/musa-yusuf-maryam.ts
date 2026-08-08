import type { Story } from './types';

/**
 * Narrative discipline for every `hook` and `narrative` field in this file:
 * they may set the scene and name the feeling, but they may not add events the Quran
 * does not state, and they never put words into anyone's mouth. Where a detail is
 * emotionally powerful but not in the text, it is left out.
 */

export const MUSA: Story = {
  id: 'musa',
  name: 'Musa',
  arabicName: 'موسى',
  subtitle: 'A baby placed in a river by his own mother, who grew up to face the man who wanted him dead',
  hook:
    'Imagine you have just given birth. The ruler of your country has been killing the baby boys of your people, and yours is a boy. Then the instruction comes: put him in the river. Not hide him. Not run. Put your newborn into the water and let go. Could you do it?',
  whyItMatters:
    'Almost everyone reaches a point where the right thing to do looks exactly like the thing they are most afraid of. This story begins there — with a mother told to let go of the one thing she wants to hold — and it does not pretend that was easy for her.',
  whatYoullLearn: [
    'Why Musa is mentioned in the Quran more than any other prophet',
    'What his mother was promised, and what she felt anyway',
    'What Musa asked for when he was given an impossible task',
    'The instruction Allah gave about how to speak to a tyrant',
  ],
  readingMinutes: 9,
  difficulty: 'gentle',
  themes: ['fear', 'hardship', 'family', 'injustice'],
  where: 'Told across several surahs — mainly Al-Qasas (28), Ta-Ha (20) and Ash-Shu‘ara (26).',
  passages: [
    {
      id: 'the-river',
      heading: 'The river',
      when: 'The very beginning',
      placeId: 'egypt',
      narrative:
        'Fir‘awn ruled Egypt and had been killing the sons of the Israelites. A mother has a newborn boy. She receives inspiration from Allah telling her what to do — and it is the last thing any mother would want to hear. She is told to put him in the river, and she is given a promise about what will happen next. Read what she was told, and then read what happened to her heart afterwards.',
      surah: 28,
      ayahFrom: 7,
      ayahTo: 13,
      explanation:
        'Two things stand out. First, she was given a promise before she was asked to act — she was told he would be returned to her. Second, the Quran says her heart became empty anyway, and that Allah steadied it so she would not give the secret away. Being promised something by Allah did not make her stop feeling afraid. Her fear was not a failure of trust; it was a mother’s heart, and Allah steadied it rather than scolding it. And the promise was kept in a way nobody could have planned: the baby refused every other nurse, so his own mother was paid to feed her own son inside the palace of the man who wanted him dead.',
    },
    {
      id: 'the-fire',
      heading: 'A fire in the valley',
      when: 'Years later, returning from Madyan',
      placeId: 'tuwa',
      narrative:
        'Years pass. Musa is now a grown man who has left Egypt after a killing he did not intend, and he is travelling with his family at night. He sees a fire in the distance. He is not looking for revelation — he is looking for warmth and directions. He tells his family to wait, and walks toward it.',
      surah: 20,
      ayahFrom: 9,
      ayahTo: 16,
      explanation:
        'He went to the fire for something completely ordinary. What he found was Allah speaking to him directly. It is worth sitting with how undramatic the beginning was: a cold night, a long journey, a light on a hillside. He was not in a state of spiritual preparation. He was tired and looking for a burning branch.',
    },
    {
      id: 'the-task',
      heading: '“Go to Fir‘awn”',
      when: 'The same night',
      placeId: 'tuwa',
      narrative:
        'Then comes the instruction. Musa is told to go to the most powerful and most dangerous man in the land — the man whose household raised him, and from whose justice he had fled. Watch what Musa does next. He does not refuse. But he does not pretend to be ready either.',
      surah: 20,
      ayahFrom: 24,
      ayahTo: 36,
      explanation:
        'Musa answers the command with a request. He asks for his chest to be expanded, for his task to be made easy, for a knot to be untied from his tongue so people can understand him, and for his brother Harun to be appointed to help him. He names his own difficulty out loud — including a difficulty with his speech — and asks for support. And it is granted immediately. Asking for help is not treated here as weakness or as a lack of faith. It is part of accepting the task.',
    },
    {
      id: 'gently',
      heading: 'Speak to him gently',
      when: 'Before they set out',
      placeId: 'egypt',
      narrative:
        'Two brothers are now sent to a tyrant who has been killing children. Before they go, they are told how to speak to him. This is one of the most surprising instructions in the Quran.',
      surah: 20,
      ayahFrom: 42,
      ayahTo: 46,
      explanation:
        'They are told to speak to him with gentle speech, in the hope that he might take heed or fear Allah. Consider who this instruction was about. If gentleness was the instruction when addressing Fir‘awn, it is difficult to think of a disagreement in an ordinary life that justifies harshness. They are also told, twice, not to be afraid — and told why: Allah is with them, hearing and seeing.',
    },
    {
      id: 'the-sea',
      heading: 'Trapped at the sea',
      // No placeId: the Quran does not say where the crossing happened, and the
      // proposed locations are disputed. Better to leave it unplotted than to pick one.
      when: 'Leaving Egypt at last',
      narrative:
        'The Israelites leave Egypt. Behind them, an army is closing in. In front of them is open water. His people look at the situation and say the obvious thing: we are caught. Read what Musa says back.',
      surah: 26,
      ayahFrom: 60,
      ayahTo: 68,
      explanation:
        'His people say they are overtaken. Musa answers: no — my Lord is with me and He will guide me. Notice when he says it. Not after the sea opens. Before. There was no visible way out at the moment he spoke. The certainty came first, and the path came after.',
    },
  ],
  lessons: {
    aboutAllah:
      'Allah steadied the heart of a frightened mother rather than blaming her for being frightened. He answered Musa’s request for help immediately and completely. And He instructed gentleness toward the worst man in the story. This is a portrait of a Lord who meets people in their weakness rather than despising it.',
    points: [
      'Guidance can look exactly like the thing you fear most. Musa’s mother was told to put her baby in a river.',
      'Feeling afraid while obeying is not a failure. The Quran records her fear and records Allah steadying her.',
      'Musa asked for help before he began, and named his own limitation out loud. He was not told to manage alone.',
      'Gentle speech was the instruction for confronting a tyrant, which sets the bar for every lesser confrontation.',
      'Musa declared certainty before there was any visible way out. Trust preceded the miracle, not the other way round.',
    ],
    character: ['Courage without pretending', 'Honesty about your limits', 'Gentleness toward opponents'],
  },
  reflections: [
    'Have you ever been asked to let go of something you desperately wanted to hold on to?',
    'Is there something you have not attempted because you would have to admit you cannot do it alone?',
    'Who are you speaking to harshly, that this story suggests you might approach differently?',
  ],
  actionToday:
    'Think of one thing you have been struggling with alone because asking for help felt like failing. Ask one person for help with it today — the way Musa asked before he started.',
  relatedDuaId: 'distress',
};

export const YUSUF: Story = {
  id: 'yusuf',
  name: 'Yusuf',
  arabicName: 'يوسف',
  subtitle: 'Thrown into a well by his brothers, he ended up the one they came begging to',
  hook:
    'Imagine the people who hurt you most badly are now standing in front of you, and they need something only you can give them. They do not recognise you. You have complete power over them, and nobody would blame you for using it. What do you do?',
  whyItMatters:
    'This is the only story the Quran tells from beginning to end in a single surah. It is about a family that broke, years of injustice that were never explained while they were happening, and a moment of choice at the end that most of us will face in some smaller form.',
  whatYoullLearn: [
    'Why this story is told in one continuous surah, unlike any other',
    'How the Quran describes the brothers — and why it does not simply call them evil',
    'What Yusuf said when he finally had power over them',
    'Why being wronged is not evidence that Allah has forgotten you',
  ],
  readingMinutes: 11,
  difficulty: 'gentle',
  themes: ['forgiveness', 'injustice', 'family', 'patience'],
  where: 'Surah Yusuf (12), told from beginning to end in one surah.',
  passages: [
    {
      id: 'dream',
      heading: 'A boy tells his father about a dream',
      when: 'Boyhood',
      placeId: 'canaan',
      narrative:
        'A young boy comes to his father with something he saw while asleep. His father’s reaction tells you immediately that this is not an ordinary dream — and that the father already knows the boy’s brothers cannot be told.',
      surah: 12,
      ayahFrom: 4,
      ayahTo: 6,
      explanation:
        'The father understands what the dream means before the reader does, and his first instinct is protective. He tells his son not to relate it to his brothers. Not every true thing needs to be announced — sometimes wisdom is knowing who not to tell.',
    },
    {
      id: 'brothers',
      heading: 'The brothers make a decision',
      when: 'Soon after',
      placeId: 'canaan',
      narrative:
        'The brothers talk among themselves. What is striking is that the Quran lets us hear their reasoning rather than simply condemning them. They feel overlooked. They are jealous. And they talk themselves into something terrible one step at a time.',
      surah: 12,
      ayahFrom: 7,
      ayahTo: 10,
      explanation:
        'They tell themselves that afterwards they will be righteous people — that they will fix it later. One of them argues for the lesser harm: do not kill him, put him in the well. The Quran does not flatten them into monsters. It shows ordinary jealousy becoming something monstrous through small, reasonable-sounding steps. That is how it usually happens.',
    },
    {
      id: 'well',
      heading: 'The well, and the shirt',
      when: 'That same day',
      placeId: 'canaan',
      narrative:
        'They carry it out. Then they return to their father in the evening with a story, and evidence they have prepared. Their father does not believe them — and what he says in response is one of the most quoted lines in the surah.',
      surah: 12,
      ayahFrom: 15,
      ayahTo: 18,
      explanation:
        'Their father sees straight through it, and does not rage. He says beautiful patience — and that Allah is the one whose help is sought against what they describe. He names the wrong without pretending it did not happen, and he does not let it turn him bitter. That combination is the whole difficulty of forgiveness in a single line.',
    },
    {
      id: 'egypt',
      heading: 'Sold, and taken to Egypt',
      when: 'Shortly after',
      placeId: 'egypt',
      narrative:
        'A passing caravan finds him. He is sold cheaply — the Quran notes how little they valued him — and ends up in the household of a man of standing in Egypt.',
      surah: 12,
      ayahFrom: 19,
      ayahTo: 22,
      explanation:
        'The people who sold him had no idea what they were handling. From the outside this looks like a boy’s life being destroyed. The Quran quietly notes that this was how he was established in the land. The rescue and the disaster were the same event.',
    },
    {
      id: 'accusation',
      heading: 'Accused of something he refused to do',
      when: 'Years later, as a young man',
      placeId: 'egypt',
      narrative:
        'Years later, as a young man in that household, Yusuf is pressured and refuses. The accusation that follows is the opposite of what happened. Even after evidence clears him, he is imprisoned.',
      surah: 12,
      ayahFrom: 23,
      ayahTo: 29,
      explanation:
        'He does the right thing and is punished for it. The Quran does not offer him any immediate reward for his refusal — the consequence is prison. This is worth noticing, because a great deal of religious talk implies that doing right is quickly followed by relief. Here it is followed by years of confinement.',
    },
    {
      id: 'prison',
      heading: 'Forgotten in prison',
      when: 'Several years',
      placeId: 'egypt',
      narrative:
        'In prison, two men ask him to interpret their dreams. He does — and before they leave, he asks one of them to mention him to the king. That man walks out and forgets.',
      surah: 12,
      ayahFrom: 36,
      ayahTo: 42,
      explanation:
        'Yusuf helped someone who then forgot him entirely, and the years continued. He did not stop being who he was because his kindness was not repaid. It is a small, painfully ordinary detail in the middle of a grand story.',
    },
    {
      id: 'kings-dream',
      heading: 'A dream nobody can interpret',
      when: 'Long afterwards',
      placeId: 'egypt',
      narrative:
        'The king has a dream that disturbs him, and none of his advisers can explain it. Suddenly the man who forgot remembers.',
      surah: 12,
      ayahFrom: 43,
      ayahTo: 49,
      explanation:
        'Yusuf does not only interpret the dream — he gives a practical plan for surviving the famine that is coming. He is useful, not just insightful. When his moment finally arrives after years of waiting, he is ready for it.',
    },
    {
      id: 'power',
      heading: 'Given authority over the land',
      when: 'Released at last',
      placeId: 'egypt',
      narrative:
        'He is cleared and brought out. The king offers him position — and Yusuf asks for a specific job.',
      surah: 12,
      ayahFrom: 54,
      ayahTo: 57,
      explanation:
        'He asks to be put in charge of the storehouses of the land. He asks for the role where he can actually prevent people from starving, not for the most comfortable one. Power is requested here as a responsibility with a purpose attached.',
    },
    {
      id: 'reunion',
      heading: 'His brothers come begging',
      when: 'When the famine came',
      placeId: 'egypt',
      narrative:
        'Famine spreads. His brothers travel to Egypt for food, and are brought before the official who controls the stores. They do not recognise him. He recognises them immediately.',
      surah: 12,
      ayahFrom: 58,
      ayahTo: 62,
      explanation:
        'The Quran states it plainly: he knew them, and they did not know him. Everything the story has been building toward now rests on what he decides to do with that.',
    },
    {
      id: 'forgiveness',
      heading: 'What he chose',
      when: 'The moment of recognition',
      placeId: 'egypt',
      narrative:
        'The moment finally arrives when he tells them who he is. He has every advantage. They have none. Read what he says.',
      surah: 12,
      ayahFrom: 89,
      ayahTo: 93,
      explanation:
        'He names what they did — he does not pretend it was nothing. And then he says there is no blame upon them this day, and asks Allah to forgive them. He forgives without rewriting history. Both halves matter: the wrong is stated, and it is released.',
    },
    {
      id: 'ending',
      heading: 'The dream, explained',
      when: 'The family reunited',
      placeId: 'egypt',
      narrative:
        'The family is reunited, and the dream the boy described at the very start finally makes sense. Yusuf says something about the years in between that reframes the entire story.',
      surah: 12,
      ayahFrom: 100,
      ayahTo: 101,
      explanation:
        'He calls it kindness that he was brought out of prison and his family brought from the desert — and he mentions that Shaytan had sown discord between him and his brothers. He describes what happened without bitterness, and thanks Allah for the ending rather than interrogating the middle.',
    },
  ],
  lessons: {
    aboutAllah:
      'Allah was working through the well, the sale, the false accusation and the forgotten promise — none of which looked like help at the time. The story teaches that His planning is often invisible while you are inside it, and only obvious afterwards.',
    points: [
      'Being wronged is not evidence that Allah has abandoned you. Most of this story happens while Yusuf is innocent and suffering.',
      'The Quran shows the brothers’ reasoning. Ordinary jealousy became something terrible through small steps that each sounded justifiable.',
      'Doing the right thing is not always followed by relief. Yusuf refused wrongdoing and went to prison for it.',
      'Forgiveness here does not mean pretending. He named what they did, and released them anyway.',
      'Having power over someone who hurt you is its own test — and the story treats that moment, not the rescue, as the climax.',
    ],
    character: ['Patience without bitterness', 'Integrity when nobody is watching', 'Forgiveness without denial'],
  },
  reflections: [
    'Is there a period of your life you assumed was wasted, that you can now see differently?',
    'Have you kept doing the right thing when nobody noticed or repaid you?',
    'Who would you find hardest to forgive if you suddenly had the upper hand?',
  ],
  actionToday:
    'Bring to mind one person you are holding something against. You do not have to contact them or pretend it did not happen. Simply make dua for them once today — that is where Yusuf’s forgiveness began.',
  relatedDuaId: 'sayyid-al-istighfar',
};

export const MARYAM: Story = {
  id: 'maryam',
  name: 'Maryam',
  arabicName: 'مريم',
  subtitle: 'She gave birth alone, then walked back into a community that had already judged her',
  hook:
    'Imagine being accused of the worst thing your community can imagine, and knowing that no explanation you give will be believed. Now imagine being told to say nothing at all. Not to defend yourself. Not to explain. Just to stay silent and let the truth arrive on its own.',
  whyItMatters:
    'Maryam is the only woman named in the Quran, and an entire surah carries her name. Her story does not skip past the hard parts — it records her pain, her fear of what people would say, and a moment where she wished she had died. It is one of the most honest passages in the Quran about what distress actually feels like.',
  whatYoullLearn: [
    'Why Maryam holds a unique place in the Quran',
    'What she said at her lowest moment — and that it was recorded rather than edited out',
    'What she was told to do when she was in pain, and why it matters',
    'What Muslims believe about Isa, stated plainly',
  ],
  readingMinutes: 7,
  difficulty: 'gentle',
  themes: ['loneliness', 'fear', 'hardship', 'injustice'],
  where: 'Surah Maryam (19), verses 16–36.',
  passages: [
    {
      id: 'announcement',
      heading: 'A visitor she did not expect',
      when: 'Withdrawn from her family',
      placeId: 'jerusalem',
      narrative:
        'Maryam has withdrawn from her family to a place in the east. She is alone, by choice. Then a figure appears in the form of a man. Her first reaction is not wonder — it is to seek protection.',
      surah: 19,
      ayahFrom: 16,
      ayahTo: 21,
      explanation:
        'She responds to a strange man appearing where she is alone by seeking refuge in the Most Merciful. Her instinct is self-protection, and the Quran presents that as entirely right. Only then is she told who he is and what is coming — and she asks the obvious question about how this could possibly happen.',
    },
    {
      id: 'birth',
      heading: 'Alone, and in pain',
      when: 'When her time came',
      narrative:
        'The birth comes. She is by herself, holding on to the trunk of a palm tree. What she says next is not what people usually expect to find in scripture.',
      surah: 19,
      ayahFrom: 22,
      ayahTo: 26,
      explanation:
        'She says she wishes she had died before this and been forgotten entirely. The Quran records it. It is not softened, corrected, or presented as a failing. Then she is comforted — and told to shake the trunk of the palm toward her so dates would fall. She is in labour, in pain, and still asked to do something. Provision came with her effort, not instead of it. She is also told to stay away from speaking to anyone.',
    },
    {
      id: 'return',
      heading: 'Walking back to them',
      when: 'Carrying the child',
      placeId: 'jerusalem',
      narrative:
        'She returns to her people carrying the child. They say exactly what she feared they would say. She has been instructed not to speak — so she points at the baby.',
      surah: 19,
      ayahFrom: 27,
      ayahTo: 33,
      explanation:
        'She was told to let the truth arrive without her defending it, and it did. The first words spoken in her defence are not hers. There is something worth sitting with here: sometimes the most dignified response to an accusation is not the best argument, but silence and time.',
    },
    {
      id: 'closing',
      heading: 'Stated plainly',
      when: 'The passage closes',
      narrative:
        'The passage closes by settling what Isa was, and what he was not — a matter people have disagreed about for centuries.',
      surah: 19,
      ayahFrom: 34,
      ayahTo: 36,
      explanation:
        'Muslims honour Isa as a prophet and messenger of Allah, and honour his mother greatly. The passage states that it is not befitting for Allah to take a son. This is said without hostility toward those who believe otherwise — it is a statement of what Muslims hold, placed at the end of a story that treats Maryam with enormous respect.',
    },
  ],
  lessons: {
    aboutAllah:
      'Allah did not rebuke her for saying she wished she had died. He comforted her, provided for her, and then defended her without requiring her to defend herself. This is a portrait of a Lord who does not demand composure from people in pain.',
    points: [
      'Distress is not a failure of faith. Her words at her lowest moment were preserved, not edited out.',
      'She was asked to shake the palm tree while in labour. Provision often arrives through effort rather than instead of it.',
      'She was told to stay silent. Not every accusation requires your defence.',
      'The only woman named in the Quran is honoured with an entire surah bearing her name.',
    ],
    character: ['Dignity under accusation', 'Honesty about pain', 'Trust when there is no visible support'],
  },
  reflections: [
    'Have you been in a situation where explaining yourself would only have made things worse?',
    'Have you ever felt you had to appear fine while struggling, because admitting it felt like weakness?',
    'What helps you keep going when you have nothing left to give?',
  ],
  actionToday:
    'If you are carrying something heavy, say it honestly to Allah today — in your own language, in your own words. Maryam’s distress was recorded in scripture. Yours does not need to be tidied up before you bring it.',
  relatedDuaId: 'anxiety-quran',
};
