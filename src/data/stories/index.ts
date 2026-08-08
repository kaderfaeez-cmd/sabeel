import { PEOPLE_OF_THE_CAVE, IBRAHIM, NUH } from './cave-nuh-ibrahim';
import { MARYAM, MUSA, YUSUF } from './musa-yusuf-maryam';
import { ADAM, DHUL_QARNAYN, SULAIMAN, YUNUS } from './yunus-sulaiman-adam-dhulqarnayn';
import type { Story, StoryTheme } from './types';

export type { Story, StoryPassage, StoryLessons, StoryTheme } from './types';
export { THEME_LABEL } from './types';

/**
 * Ordered so a first-time reader meets the most immediately gripping stories first.
 * Musa opens the list because its hook — a mother told to place her baby in a river —
 * needs no prior knowledge of Islam to land.
 */
export const STORIES: readonly Story[] = [
  MUSA,
  YUSUF,
  MARYAM,
  YUNUS,
  PEOPLE_OF_THE_CAVE,
  ADAM,
  NUH,
  IBRAHIM,
  DHUL_QARNAYN,
  SULAIMAN,
];

export function getStory(id: string): Story | undefined {
  return STORIES.find((story) => story.id === id);
}

export function storiesWithTheme(theme: StoryTheme): readonly Story[] {
  return STORIES.filter((story) => story.themes.includes(theme));
}

/** Every theme that at least one story carries, for the "where are you right now?" picker. */
export function activeThemes(): readonly StoryTheme[] {
  const seen = new Set<StoryTheme>();
  for (const story of STORIES) {
    for (const theme of story.themes) seen.add(theme);
  }
  return [...seen];
}
