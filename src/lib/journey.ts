/**
 * The guided journey.
 *
 * The core finding from real beginner feedback was not "there is not enough content" —
 * it was "I do not know where to begin". That is a navigation problem, and this file is
 * the fix: a single ordered path through what already exists, so that every lesson can
 * say where the reader is and what comes next.
 *
 * Ordering principle: build a relationship with Allah first, then practice, then the
 * wider picture. The Hereafter comes late deliberately — leading a new Muslim with
 * judgement rather than with mercy would be the wrong first impression, and the Quran
 * itself opens by naming Allah as the Most Merciful.
 */

export interface JourneyStep {
  readonly id: string;
  readonly title: string;
  /** One line on what this step gives the reader. */
  readonly blurb: string;
  readonly href: string;
  readonly minutes: number;
  /** Short label for the compact "you are here" trail. */
  readonly short: string;
}

export const JOURNEY: readonly JourneyStep[] = [
  {
    id: 'start',
    title: 'Where to start',
    short: 'Start',
    blurb: 'What to expect, and permission to take it slowly.',
    href: '/roadmap',
    minutes: 4,
  },
  {
    id: 'islam',
    title: 'What Islam is',
    short: 'Islam',
    blurb: 'Who Allah is, what Muslims believe, and the five pillars.',
    href: '/learn',
    minutes: 9,
  },
  {
    id: 'wudhu',
    title: 'Learn Wudhu',
    short: 'Wudhu',
    blurb: 'The short washing before prayer. This is what unlocks everything else.',
    href: '/wudhu',
    minutes: 8,
  },
  {
    id: 'salah',
    title: 'Learn Salah',
    short: 'Salah',
    blurb: 'The prayer, position by position, with the meaning of every word.',
    href: '/salah',
    minutes: 14,
  },
  {
    id: 'prayer-times',
    title: 'When to pray',
    short: 'Times',
    blurb: 'The five times, wherever you are. No Adhan unless you ask for it.',
    href: '/prayer-times',
    minutes: 3,
  },
  {
    id: 'duas',
    title: 'Talking to Allah',
    short: 'Dua',
    blurb: 'Dua is simply asking — in your own words, in any language.',
    href: '/duas',
    minutes: 8,
  },
  {
    id: 'quran',
    title: 'Begin the Quran',
    short: 'Quran',
    blurb: 'Where to start reading, and how the translations differ.',
    href: '/quran',
    minutes: 5,
  },
  {
    id: 'stories',
    title: 'Stories of the Quran',
    short: 'Stories',
    blurb: 'The people the Quran tells you about, and why.',
    href: '/stories',
    minutes: 10,
  },
  {
    id: 'ghusl',
    title: 'Learn Ghusl',
    short: 'Ghusl',
    blurb: 'The full washing — when it is needed and how it is done.',
    href: '/ghusl',
    minutes: 7,
  },
  {
    id: 'names',
    title: 'The 99 Names',
    short: 'Names',
    blurb: 'Ninety-nine ways of knowing who you are speaking to.',
    href: '/names',
    minutes: 6,
  },
];

export function journeyIndex(id: string): number {
  return JOURNEY.findIndex((step) => step.id === id);
}

export function journeyStep(id: string): JourneyStep | undefined {
  return JOURNEY.find((step) => step.id === id);
}

export function nextStep(id: string): JourneyStep | undefined {
  const index = journeyIndex(id);
  return index >= 0 ? JOURNEY[index + 1] : undefined;
}

export function previousStep(id: string): JourneyStep | undefined {
  const index = journeyIndex(id);
  return index > 0 ? JOURNEY[index - 1] : undefined;
}

/** Maps a pathname onto a journey step, so any page can locate itself. */
export function stepForPath(pathname: string): JourneyStep | undefined {
  // Longest href first, so /wudhu/nullifiers does not match /wudhu.
  const byLength = [...JOURNEY].sort((a, b) => b.href.length - a.href.length);
  return byLength.find(
    (step) => pathname === step.href || pathname.startsWith(`${step.href}/`),
  );
}
