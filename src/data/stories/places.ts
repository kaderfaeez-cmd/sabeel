/**
 * Places for the story maps.
 *
 * The authenticity problem this file exists to solve: the Quran names some locations
 * explicitly and deliberately withholds others. The People of the Cave are never
 * located — the Quran refuses even to settle how many they were. Dhul-Qarnayn travels
 * "west" and "east" with no place named at all.
 *
 * So `basis` is required on every place:
 *   'quran'       — the Quran names this location directly
 *   'traditional' — widely reported in the historical and exegetical literature, but
 *                   not named in the Quran; shown differently and labelled as such
 *
 * There is no third option. A place that is neither is simply not plotted, and a story
 * with no locatable places gets no map — with the page saying why, rather than inventing
 * a geography to fill the space.
 *
 * Coordinates are approximate and exist only to arrange the map sensibly. Sabeel makes
 * no claim to pinpoint accuracy and says so on every map.
 */

export type PlaceBasis = 'quran' | 'traditional';

export interface Place {
  readonly id: string;
  readonly name: string;
  /** Latitude in degrees north. */
  readonly lat: number;
  /** Longitude in degrees east. */
  readonly lon: number;
  readonly basis: PlaceBasis;
  /** Why this place matters in the story, or what the Quran says about it. */
  readonly note: string;
}

export const PLACES: Readonly<Record<string, Place>> = {
  egypt: {
    id: 'egypt',
    name: 'Egypt',
    lat: 30.0,
    lon: 31.2,
    basis: 'quran',
    note: 'Named directly in the Quran (Misr) in the stories of Yusuf and Musa.',
  },
  madyan: {
    id: 'madyan',
    name: 'Madyan',
    lat: 28.5,
    lon: 35.3,
    basis: 'quran',
    note: 'Named in the Quran as where Musa went after leaving Egypt.',
  },
  tuwa: {
    id: 'tuwa',
    name: 'The valley of Tuwa',
    lat: 28.6,
    lon: 33.9,
    basis: 'quran',
    note: 'Named in the Quran as the sacred valley where Musa was addressed.',
  },
  canaan: {
    id: 'canaan',
    name: 'The land of Yaqub',
    lat: 31.9,
    lon: 35.2,
    basis: 'traditional',
    note: 'Where Yusuf’s family lived before Egypt. The Quran does not name the place.',
  },
  jerusalem: {
    id: 'jerusalem',
    name: 'Bayt al-Maqdis',
    lat: 31.78,
    lon: 35.23,
    basis: 'traditional',
    note: 'Associated with Maryam and with Sulaiman in the historical literature.',
  },
  saba: {
    id: 'saba',
    name: 'Saba',
    lat: 15.4,
    lon: 45.35,
    basis: 'quran',
    note: 'Named directly in the Quran as the kingdom of the queen in Surah An-Naml.',
  },
  judi: {
    id: 'judi',
    name: 'Mount al-Judi',
    lat: 37.4,
    lon: 42.4,
    basis: 'quran',
    note: 'Named directly in the Quran as where the ark came to rest.',
  },
  makkah: {
    id: 'makkah',
    name: 'Bakkah',
    lat: 21.42,
    lon: 39.83,
    basis: 'quran',
    note: 'Named in the Quran as the site of the first house appointed for mankind.',
  },
  mesopotamia: {
    id: 'mesopotamia',
    name: 'The land of Ibrahim’s people',
    lat: 32.5,
    lon: 44.4,
    basis: 'traditional',
    note: 'Placed in Mesopotamia by the historical literature. The Quran does not name it.',
  },
  nineveh: {
    id: 'nineveh',
    name: 'The city of Yunus',
    lat: 36.36,
    lon: 43.15,
    basis: 'traditional',
    note: 'Identified as Nineveh in the historical literature. The Quran describes the people but does not name the city.',
  },
} as const;

export function getPlace(id: string): Place | undefined {
  return PLACES[id];
}

/**
 * Bounds of the map view, in degrees. Chosen to hold every plotted place with a margin,
 * covering the Nile, the Levant, Mesopotamia and the Arabian peninsula.
 */
export const MAP_BOUNDS = {
  minLon: 26,
  maxLon: 50,
  minLat: 12,
  maxLat: 40,
} as const;
