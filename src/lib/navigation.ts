/**
 * Single source of truth for the platform's sections.
 *
 * **Only sections that exist appear here.** A live site must not advertise a destination
 * that returns a 404 — that is the navigational equivalent of an unsourced claim. Work
 * that is planned but not built lives in docs/ROADMAP.md, not in the navigation.
 *
 * `status` is still shown honestly: `live` means complete, `building` means usable but
 * with named gaps stated on the page itself.
 */

export type SectionStatus = 'live' | 'building';

export interface Section {
  readonly title: string;
  readonly href: string;
  readonly blurb: string;
  readonly status: SectionStatus;
}

export type SectionGroup = {
  readonly label: string;
  readonly sections: readonly Section[];
};

export const SECTION_GROUPS: readonly SectionGroup[] = [
  {
    label: 'Begin',
    sections: [
      {
        title: 'Your first steps',
        href: '/start',
        blurb: 'Just became Muslim? Start here — one step at a time, nothing assumed.',
        status: 'live',
      },
      {
        title: 'I’m struggling with…',
        href: '/struggling',
        blurb: 'Distance from Allah, guilt, family, doubt, staying consistent.',
        status: 'live',
      },
      {
        title: 'Where to start',
        href: '/roadmap',
        blurb: 'A gentle, ordered path for anyone starting or returning. No prior knowledge assumed.',
        status: 'live',
      },
      {
        title: 'Learn Islam',
        href: '/learn',
        blurb: 'The five pillars and what Muslims believe, each shown with its evidence.',
        status: 'live',
      },
    ],
  },
  {
    label: 'Revelation',
    sections: [
      {
        title: 'The Quran',
        href: '/quran',
        blurb:
          'All 114 surahs in Arabic with five trusted translations, transliteration, recitation and search.',
        status: 'live',
      },
      {
        title: 'Stories of the Quran',
        href: '/stories',
        blurb:
          'Yusuf, Maryam, Musa and more — read in the Quran’s own words, with lessons and questions.',
        status: 'live',
      },
    ],
  },
  {
    label: 'Practice',
    sections: [
      {
        title: 'Learn Salah',
        href: '/salah',
        blurb:
          'Every position and word, what it means and why you say it, with guidance if you cannot stand.',
        status: 'live',
      },
      {
        title: 'Learn Wudhu',
        href: '/wudhu',
        blurb: 'Every step with its evidence, the common mistakes, and where the schools differ.',
        status: 'live',
      },
      {
        title: 'What breaks wudhu',
        href: '/wudhu/nullifiers',
        blurb: 'What needs a fresh wudhu, what does not, and the points scholars differ on.',
        status: 'live',
      },
      {
        title: 'Learn Ghusl',
        href: '/ghusl',
        blurb: 'When the full washing is required and how to perform it, step by step.',
        status: 'live',
      },
      {
        title: 'Prayer Times',
        href: '/prayer-times',
        blurb: 'Quiet reminders by default. The Adhan only plays if you switch it on.',
        status: 'live',
      },
    ],
  },
  {
    label: 'Remembrance',
    sections: [
      {
        title: 'Dua Library',
        href: '/duas',
        blurb: 'For morning, evening, worry, protection, forgiveness and family — each with its reference.',
        status: 'live',
      },
      {
        title: '99 Names of Allah',
        href: '/names',
        blurb: 'Al-Asmāʼ al-Ḥusnā — each name in Arabic with its transliteration and meaning.',
        status: 'live',
      },
    ],
  },
  {
    label: 'Yours',
    sections: [
      {
        title: 'Journal',
        href: '/journal',
        blurb: 'Your reflections, gathered in one place. Stays on your device.',
        status: 'live',
      },
      {
        title: 'Progress',
        href: '/progress',
        blurb: 'What you have read. No streaks, nothing to keep up with.',
        status: 'live',
      },
      {
        title: 'Settings',
        href: '/settings',
        blurb: 'Translation, reciter, text size, reminders and your stored data.',
        status: 'live',
      },
    ],
  },
] as const;

/** Compact set used in the header. */
export const PRIMARY_NAV = [
  { title: 'Start here', href: '/start' },
  { title: 'The Quran', href: '/quran' },
  { title: 'Stories', href: '/stories' },
  { title: 'Salah', href: '/salah' },
  { title: 'Duas', href: '/duas' },
] as const;
