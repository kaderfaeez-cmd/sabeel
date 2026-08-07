/**
 * The translations Sabeel offers.
 *
 * Every entry carries full provenance — translator, language, source and edition — so a
 * reader can identify exactly which rendering they are reading, and so adding a language
 * later is a data change rather than a code change.
 *
 * Deliberately a small curated set rather than all 126 the API exposes: each one here is
 * a widely published work whose translator can be credited on screen (Constitution §3.1).
 */

export interface Translation {
  /** Quran.com translation resource id. */
  readonly id: number;
  readonly name: string;
  readonly translator: string;
  /** BCP 47 tag, so the UI can set `lang` correctly. */
  readonly language: string;
  readonly languageName: string;
  /** Text direction of the translation itself, not of the Arabic. */
  readonly direction: 'ltr' | 'rtl';
  /** Where Sabeel retrieves it from. */
  readonly source: string;
  /** Edition or revision, where the work has one. */
  readonly version?: string;
  readonly note: string;
}

export const TRANSLATIONS: readonly Translation[] = [
  {
    id: 20,
    name: 'Saheeh International',
    translator: 'Saheeh International',
    language: 'en',
    languageName: 'English',
    direction: 'ltr',
    source: 'Quran.com API v4',
    note: 'Clear modern English. The most common starting point.',
  },
  {
    id: 85,
    name: 'Abdel Haleem',
    translator: 'M.A.S. Abdel Haleem',
    language: 'en',
    languageName: 'English',
    direction: 'ltr',
    source: 'Quran.com API v4',
    version: 'Oxford World’s Classics',
    note: 'Flowing, readable prose. Excellent for reading at length.',
  },
  {
    id: 84,
    name: 'Mufti Taqi Usmani',
    translator: 'Mufti Taqi Usmani',
    language: 'en',
    languageName: 'English',
    direction: 'ltr',
    source: 'Quran.com API v4',
    note: 'Precise, with a traditional scholarly register.',
  },
  {
    id: 22,
    name: 'Yusuf Ali',
    translator: 'Abdullah Yusuf Ali',
    language: 'en',
    languageName: 'English',
    direction: 'ltr',
    source: 'Quran.com API v4',
    note: 'Classic literary rendering, widely quoted.',
  },
  {
    id: 19,
    name: 'Pickthall',
    translator: 'Mohammed Marmaduke Pickthall',
    language: 'en',
    languageName: 'English',
    direction: 'ltr',
    source: 'Quran.com API v4',
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

/** Languages currently available, for a future language switcher. */
export function availableLanguages(): readonly { code: string; name: string }[] {
  const seen = new Map<string, string>();
  for (const translation of TRANSLATIONS) {
    if (!seen.has(translation.language)) {
      seen.set(translation.language, translation.languageName);
    }
  }
  return [...seen].map(([code, name]) => ({ code, name }));
}

export function translationsForLanguage(language: string): readonly Translation[] {
  return TRANSLATIONS.filter((translation) => translation.language === language);
}

/** Full provenance line, for display wherever a translation is credited. */
export function describeProvenance(translation: Translation): string {
  const version = translation.version ? `, ${translation.version}` : '';
  return `${translation.translator}${version} · ${translation.languageName} · via ${translation.source}`;
}
