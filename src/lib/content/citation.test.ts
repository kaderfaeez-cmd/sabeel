import { describe, expect, test } from 'vitest';
import { formatAyahRange, formatCitation, isPrimarySource, KIND_LABEL } from './citation';
import type { ContentSource, SourcedContent } from './types';

describe('formatAyahRange', () => {
  test('renders a single ayah without a range', () => {
    expect(formatAyahRange(2, 255, 255)).toBe('2:255');
  });

  test('renders a span with an en dash', () => {
    expect(formatAyahRange(18, 60, 82)).toBe('18:60–82');
  });
});

describe('formatCitation', () => {
  test('credits the translator on every Quran citation', () => {
    // Arrange
    const source: ContentSource = {
      kind: 'quran',
      surah: 1,
      ayahFrom: 1,
      ayahTo: 7,
      translationId: 20,
      translatorName: 'Saheeh International',
    };

    // Act
    const citation = formatCitation(source);

    // Assert
    expect(citation).toBe('Quran 1:1–7 — translation by Saheeh International');
  });

  test('includes collection, number and grading so a hadith can be looked up', () => {
    const citation = formatCitation({
      kind: 'hadith',
      collection: 'bukhari',
      collectionName: 'Sahih al-Bukhari',
      bookNumber: 2,
      bookName: 'Belief',
      hadithNumber: 8,
      grading: 'sahih',
    });

    expect(citation).toContain('Sahih al-Bukhari');
    expect(citation).toContain('Book 2: Belief');
    expect(citation).toContain('Hadith 8');
    expect(citation).toContain('Sahih');
  });

  test('names the grader when the grading is not the collector own', () => {
    const citation = formatCitation({
      kind: 'hadith',
      collection: 'tirmidhi',
      collectionName: "Jami' at-Tirmidhi",
      hadithNumber: 2516,
      grading: 'hasan',
      gradedBy: 'al-Albani',
    });

    expect(citation).toContain('graded by al-Albani');
  });

  test('names both the work and the mufassir for tafsir', () => {
    const citation = formatCitation({
      kind: 'tafsir',
      work: 'Tafsir Ibn Kathir',
      author: 'Ibn Kathir',
      onAyah: { surah: 2, ayah: 255 },
    });

    expect(citation).toBe('Tafsir Ibn Kathir by Ibn Kathir, on Quran 2:255');
  });

  test('attributes a Companion statement to the Companion and a locatable work', () => {
    const citation = formatCitation({
      kind: 'athar',
      companion: 'Ibn Mas‘ud',
      work: 'Musannaf Ibn Abi Shaybah',
      locator: '1/234',
    });

    expect(citation).toContain('Ibn Mas‘ud');
    expect(citation).toContain('Musannaf Ibn Abi Shaybah');
    expect(citation).toContain('1/234');
  });

  test('names who reported a consensus — never an unattributed "scholars agree"', () => {
    const citation = formatCitation({
      kind: 'ijma',
      reportedBy: 'Ibn Qudamah',
      work: 'al-Mughni',
    });

    expect(citation).toContain('reported by Ibn Qudamah');
    expect(citation).toContain('al-Mughni');
  });

  test('names the school when a scholarly explanation is school-specific', () => {
    const citation = formatCitation({
      kind: 'scholarly',
      author: 'an-Nawawi',
      work: 'al-Majmu',
      madhhab: 'shafii',
    });

    expect(citation).toContain('an-Nawawi');
    expect(citation).toContain("Shafi'i school");
  });

  test('marks platform-written content as ours, with a review date', () => {
    const citation = formatCitation({ kind: 'editorial', reviewedOn: '2026-08-07' });

    expect(citation).toContain('Written by Sabeel');
    expect(citation).toContain('2026-08-07');
  });

  test('throws rather than rendering an unattributed block', () => {
    // A source kind that does not exist — simulates a future union member whose
    // citation handling was forgotten. Constitution §3: fail loudly, never render blank.
    const rogue = { kind: 'rumour' } as unknown as ContentSource;

    expect(() => formatCitation(rogue)).toThrow(/Unhandled content source/);
  });
});

describe('content labelling', () => {
  const kinds: SourcedContent['kind'][] = [
    'quran',
    'hadith',
    'tafsir',
    'athar',
    'ijma',
    'scholarly',
    'history',
    'summary',
  ];

  test('every content kind has a reader-facing label (Constitution §4)', () => {
    for (const kind of kinds) {
      expect(KIND_LABEL[kind]).toBeTruthy();
    }
  });

  test('platform-written content is labelled as ours, not as scripture', () => {
    expect(KIND_LABEL.summary).toMatch(/Sabeel/);
  });

  test('only revelation and narration count as primary sources', () => {
    expect(isPrimarySource('quran')).toBe(true);
    expect(isPrimarySource('hadith')).toBe(true);
    expect(isPrimarySource('tafsir')).toBe(false);
    expect(isPrimarySource('history')).toBe(false);
    expect(isPrimarySource('summary')).toBe(false);
  });

  test('a Companion statement is NOT primary — it must never read as a hadith', () => {
    expect(isPrimarySource('athar')).toBe(false);
    expect(KIND_LABEL.athar).toMatch(/Companion/);
    expect(KIND_LABEL.athar).not.toMatch(/^Hadith$/);
  });

  test('reported consensus is labelled as reported, not as revelation', () => {
    expect(isPrimarySource('ijma')).toBe(false);
    expect(KIND_LABEL.ijma).toMatch(/Reported/);
  });
});
