/**
 * Stories of the Quran — the learning experience.
 *
 * Rebuilt after real feedback from a recent revert: "it's complicated", "the stories are
 * direct translations", "even I'm not interested". The information was never wrong. The
 * experience was wrong — we opened with walls of translated text and expected a beginner
 * to supply their own context and their own reason to care.
 *
 * The fix is ordering, not dilution. Every authenticity rule is unchanged:
 *  - Quran passages are still FETCHED from the source and cited with their translator.
 *  - Nothing is retold in a way that puts words into a Prophet's mouth.
 *  - Every word Sabeel writes is labelled as ours.
 *  - Constitution §6 still holds: the type has nowhere to put an image of a person.
 *
 * What changed is that the reader is now given the situation, and a reason to care,
 * BEFORE they are asked to read revelation — and a plain-English explanation
 * immediately after it. The Quran is not hidden or replaced. It is surrounded.
 */

/** Emotional entry points. Used to help a reader find a story that meets where they are. */
export type StoryTheme =
  | 'loneliness'
  | 'forgiveness'
  | 'hardship'
  | 'patience'
  | 'family'
  | 'fear'
  | 'injustice'
  | 'doubt'
  | 'gratitude'
  | 'power';

export const THEME_LABEL: Record<StoryTheme, string> = {
  loneliness: 'Feeling alone',
  forgiveness: 'Forgiveness',
  hardship: 'Hardship',
  patience: 'Patience',
  family: 'Family',
  fear: 'Fear',
  injustice: 'Being wronged',
  doubt: 'Doubt',
  gratitude: 'Gratitude',
  power: 'Power and responsibility',
};

export interface StoryPassage {
  readonly id: string;
  readonly heading: string;

  /**
   * Where this moment sits in the story's own sequence — "Before he was born",
   * "Years later". Deliberately relative, never a date: the Quran does not date these
   * events, and inventing a chronology would be exactly the kind of confident detail
   * this platform refuses to add.
   */
  readonly when?: string;

  /** Id of a place in places.ts, when this moment has a locatable setting. */
  readonly placeId?: string;

  /**
   * The story, told plainly, BEFORE the verses.
   *
   * This is Sabeel's writing and is labelled as such on the page. It sets the scene so a
   * reader understands what is happening when the revelation arrives. It never invents
   * events, and never puts speech into anyone's mouth — the verses say what was said.
   */
  readonly narrative: string;

  readonly surah: number;
  readonly ayahFrom: number;
  readonly ayahTo: number;

  /**
   * Plain-English explanation AFTER the verses.
   *
   * Explains what the passage plainly says and what to notice in it. It does not assert
   * classical tafsir positions — where a point rests on scholarly interpretation rather
   * than the plain sense of the text, it is not made here.
   */
  readonly explanation: string;
}

export interface StoryLessons {
  /** What this story teaches about Allah. */
  readonly aboutAllah: string;
  /** Concrete points a reader can take away. */
  readonly points: readonly string[];
  /** Character traits the story models. */
  readonly character: readonly string[];
}

export interface Story {
  readonly id: string;
  readonly name: string;
  readonly arabicName: string;
  readonly subtitle: string;

  /**
   * The opening hook — a situation the reader can feel, before any Arabic, any reference
   * or any translation. This is the single biggest change from the first version.
   */
  readonly hook: string;

  /** Why a beginner should care, in one short paragraph. */
  readonly whyItMatters: string;

  /** Three to five concrete things the reader will come away with. */
  readonly whatYoullLearn: readonly string[];

  readonly readingMinutes: number;
  readonly difficulty: 'gentle' | 'moderate';
  readonly themes: readonly StoryTheme[];

  /** Where the story is found, in plain language. */
  readonly where: string;

  readonly passages: readonly StoryPassage[];
  readonly lessons: StoryLessons;

  /** Emotional reflection questions, tied to what the reader may actually be carrying. */
  readonly reflections: readonly string[];

  /** One small, specific thing to do today. Never vague, never a demand. */
  readonly actionToday: string;

  /** Id of a dua in the Dua Library that fits this story, if one does. */
  readonly relatedDuaId?: string;

  /**
   * Why this story has no map, when it has none.
   *
   * Required when no passage carries a `placeId`. Some stories are unlocatable on
   * purpose — the Quran never says where the cave was, and Dhul-Qarnayn's journey names
   * no place at all. Saying so is more honest than omitting the map silently, and far
   * more honest than inventing a location to fill the space.
   */
  readonly noMapReason?: string;
}
