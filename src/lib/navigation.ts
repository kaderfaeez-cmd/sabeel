/**
 * Single source of truth for the platform's sections.
 *
 * `status` is shown honestly in the UI. A section that is not built yet says so
 * rather than presenting an empty or placeholder page — Constitution §3 applies to
 * the product's claims about itself, not only to its religious content.
 */

export type SectionStatus = 'live' | 'building' | 'planned';

export interface Section {
  readonly title: string;
  readonly href: string;
  readonly blurb: string;
  readonly status: SectionStatus;
  /** Roadmap phase that delivers this section. */
  readonly phase: number;
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
        title: 'Beginner Roadmap',
        href: '/roadmap',
        blurb: 'A gentle, ordered path for anyone starting or returning. No prior knowledge assumed.',
        status: 'planned',
        phase: 6,
      },
      {
        title: 'Learn Islam',
        href: '/learn',
        blurb: 'The foundations — belief, the pillars, and how they fit together.',
        status: 'planned',
        phase: 6,
      },
    ],
  },
  {
    label: 'Revelation',
    sections: [
      {
        title: 'The Quran',
        href: '/quran',
        blurb: 'All 114 surahs in Arabic with five trusted translations and transliteration. Recitation and notes are next.',
        status: 'live',
        phase: 2,
      },
      {
        title: 'Stories of the Quran',
        href: '/stories',
        blurb: 'Immersive, sourced retellings with timelines, maps and reflection. No Prophet is depicted.',
        status: 'planned',
        phase: 7,
      },
      {
        title: 'Hadith Library',
        href: '/hadith',
        blurb: 'Browsable collections, always shown with book, number and grading.',
        status: 'planned',
        phase: 11,
      },
    ],
  },
  {
    label: 'Practice',
    sections: [
      {
        title: 'Learn Salah',
        href: '/salah',
        blurb: 'Every position and word, what it means and why you say it, with evidence and guidance if you cannot stand.',
        status: 'live',
        phase: 3,
      },
      {
        title: 'Learn Wudhu',
        href: '/wudhu',
        blurb: 'Every step with its evidence, the common mistakes, and where the schools differ.',
        status: 'live',
        phase: 3,
      },
      {
        title: 'Learn Ghusl',
        href: '/ghusl',
        blurb: 'When the full washing is required and how to perform it, with the evidence for each step.',
        status: 'live',
        phase: 3,
      },
      {
        title: 'Prayer Times',
        href: '/prayer-times',
        blurb: 'Quiet reminders by default. The Adhan only plays if you choose to switch it on.',
        status: 'planned',
        phase: 4,
      },
    ],
  },
  {
    label: 'Remembrance',
    sections: [
      {
        title: 'Dua Library',
        href: '/duas',
        blurb: 'For morning, night, travel, anxiety, parents, work and more — each with its reference.',
        status: 'planned',
        phase: 5,
      },
      {
        title: '99 Names of Allah',
        href: '/names',
        blurb: 'Each name with its meaning and where it appears in the Quran.',
        status: 'planned',
        phase: 5,
      },
    ],
  },
  {
    label: 'Understanding',
    sections: [
      {
        title: 'Women in Islam',
        href: '/women',
        blurb: 'Rights and status from the sources — and the difference between culture and Islam.',
        status: 'planned',
        phase: 8,
      },
      {
        title: 'Marriage in Islam',
        href: '/marriage',
        blurb: 'Choosing a spouse, mahr, rights and responsibilities, and what the sources actually say.',
        status: 'planned',
        phase: 8,
      },
      {
        title: 'Islamic History',
        href: '/history',
        blurb: 'A sourced timeline, from revelation onward.',
        status: 'planned',
        phase: 11,
      },
      {
        title: 'Arabic Learning',
        href: '/arabic',
        blurb: 'From the alphabet to recognising the most frequent words of the Quran.',
        status: 'planned',
        phase: 11,
      },
    ],
  },
  {
    label: 'Yours',
    sections: [
      {
        title: 'Journal',
        href: '/journal',
        blurb: 'A private place for reflection. Stays on your device unless you sign in.',
        status: 'planned',
        phase: 9,
      },
      {
        title: 'Progress',
        href: '/progress',
        blurb: 'What you have read and learned — encouragement, never guilt.',
        status: 'planned',
        phase: 9,
      },
      {
        title: 'Assistant',
        href: '/assistant',
        blurb: 'Answers grounded only in verified sources, with citations. It will not issue rulings.',
        status: 'planned',
        phase: 10,
      },
      {
        title: 'Settings',
        href: '/settings',
        blurb: 'Translation, recitation, text size, reminders and accessibility.',
        status: 'planned',
        phase: 9,
      },
    ],
  },
] as const;

/** Compact set used in the header. The full set lives on the home page and in the footer. */
export const PRIMARY_NAV = [
  { title: 'The Quran', href: '/quran' },
  { title: 'Begin here', href: '/roadmap' },
  { title: 'Salah', href: '/salah' },
  { title: 'Duas', href: '/duas' },
  { title: 'Stories', href: '/stories' },
] as const;
