/**
 * The English translations Sabeel offers.
 *
 * Deliberately a small curated set rather than all 126 the API exposes: every one here
 * is a widely published work whose translator can be credited on screen (Constitution
 * §3.1). Ids are Quran.com translation resource ids.
 */

export interface Translation {
  readonly id: number;
  readonly name: string;
  readonly translator: string;
  readonly note: string;
}

export const TRANSLATIONS: readonly Translation[] = [
  {
    id: 20,
    name: 'Saheeh International',
    translator: 'Saheeh International',
    note: 'Clear modern English. The most common starting point.',
  },
  {
    id: 85,
    name: 'Abdel Haleem',
    translator: 'M.A.S. Abdel Haleem',
    note: 'Flowing, readable prose. Excellent for reading at length.',
  },
  {
    id: 84,
    name: 'Mufti Taqi Usmani',
    translator: 'Mufti Taqi Usmani',
    note: 'Precise, with a traditional scholarly register.',
  },
  {
    id: 22,
    name: 'Yusuf Ali',
    translator: 'Abdullah Yusuf Ali',
    note: 'Classic literary rendering, widely quoted.',
  },
  {
    id: 19,
    name: 'Pickthall',
    translator: 'Mohammed Marmaduke Pickthall',
    note: 'Early English translation in a formal style.',
  },
] as const;

export const DEFAULT_TRANSLATION_ID = 20;

/** Quran.com resource id for the transliteration line. */
export const TRANSLITERATION_ID = 57;

export function getTranslation(id: number): Translation | undefined {
  return TRANSLATIONS.find((translation) => translation.id === id);
}

/** Narrows unvalidated input (a URL search param) to a translation we actually offer. */
export function resolveTranslationId(raw: string | undefined): number {
  if (!raw) return DEFAULT_TRANSLATION_ID;
  const parsed = Number(raw);
  return getTranslation(parsed) ? parsed : DEFAULT_TRANSLATION_ID;
}
