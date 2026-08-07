/**
 * The hadith collections Sabeel cites.
 *
 * `authenticByCollection` marks the two Sahih collections. Their contents are accepted
 * as authentic by scholarly consensus, and the dataset accordingly ships them with an
 * empty `grades` array — an absence that means "no separate grading is needed", not
 * "ungraded".
 *
 * For every other collection the absence of a grading means exactly what it says, and
 * SOURCES.md §4 applies: a narration whose grading cannot be established is not
 * presented as evidence.
 */

export interface Collection {
  /** Dataset edition slug. */
  readonly slug: string;
  /** Name shown to the reader and used in citations. */
  readonly name: string;
  readonly compiler: string;
  readonly authenticByCollection: boolean;
}

export const COLLECTIONS: readonly Collection[] = [
  {
    slug: 'bukhari',
    name: 'Sahih al-Bukhari',
    compiler: 'Imam al-Bukhari',
    authenticByCollection: true,
  },
  {
    slug: 'muslim',
    name: 'Sahih Muslim',
    compiler: 'Imam Muslim',
    authenticByCollection: true,
  },
  {
    slug: 'abudawud',
    name: 'Sunan Abu Dawud',
    compiler: 'Imam Abu Dawud',
    authenticByCollection: false,
  },
  {
    slug: 'tirmidhi',
    name: "Jami' at-Tirmidhi",
    compiler: 'Imam at-Tirmidhi',
    authenticByCollection: false,
  },
  {
    slug: 'nasai',
    name: "Sunan an-Nasa'i",
    compiler: "Imam an-Nasa'i",
    authenticByCollection: false,
  },
  {
    slug: 'ibnmajah',
    name: 'Sunan Ibn Majah',
    compiler: 'Imam Ibn Majah',
    authenticByCollection: false,
  },
  {
    slug: 'malik',
    name: 'Muwatta Malik',
    compiler: 'Imam Malik',
    authenticByCollection: false,
  },
  {
    slug: 'nawawi',
    name: "An-Nawawi's Forty Hadith",
    compiler: 'Imam an-Nawawi',
    authenticByCollection: false,
  },
] as const;

export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((collection) => collection.slug === slug);
}
