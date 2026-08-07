import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, test } from 'vitest';
import { clear, STORE } from './db';
import {
  addBookmark,
  clearAllReadingData,
  getNote,
  getReadingPosition,
  isBookmarked,
  listBookmarks,
  listNotes,
  MAX_NOTE_LENGTH,
  referenceKey,
  removeBookmark,
  saveNote,
  saveReadingPosition,
  toggleBookmark,
} from './reading';

beforeEach(async () => {
  await clearAllReadingData();
  await clear(STORE.surahCache);
});

describe('referenceKey', () => {
  test('formats a stable surah:ayah key', () => {
    expect(referenceKey(2, 255)).toBe('2:255');
  });
});

describe('bookmarks', () => {
  test('adds and finds a bookmark', async () => {
    await addBookmark(2, 255);
    await expect(isBookmarked(2, 255)).resolves.toBe(true);
  });

  test('is idempotent — bookmarking twice stores one record', async () => {
    await addBookmark(2, 255);
    await addBookmark(2, 255);
    await expect(listBookmarks()).resolves.toHaveLength(1);
  });

  test('removes a bookmark', async () => {
    await addBookmark(2, 255);
    await removeBookmark(2, 255);
    await expect(isBookmarked(2, 255)).resolves.toBe(false);
  });

  test('removing a bookmark that was never added is not an error', async () => {
    await expect(removeBookmark(2, 255)).resolves.toBeUndefined();
  });

  test('toggle reports the resulting state', async () => {
    await expect(toggleBookmark(1, 1)).resolves.toBe(true);
    await expect(toggleBookmark(1, 1)).resolves.toBe(false);
    await expect(isBookmarked(1, 1)).resolves.toBe(false);
  });

  test('lists newest first', async () => {
    await addBookmark(1, 1);
    await new Promise((r) => setTimeout(r, 2));
    await addBookmark(2, 255);

    const bookmarks = await listBookmarks();

    expect(bookmarks.map((b) => b.id)).toEqual(['2:255', '1:1']);
  });

  test('refuses a reference that does not exist', async () => {
    // Al-Baqarah has 286 ayahs.
    await expect(addBookmark(2, 287)).rejects.toThrow(RangeError);
    await expect(addBookmark(115, 1)).rejects.toThrow(RangeError);
    await expect(listBookmarks()).resolves.toHaveLength(0);
  });
});

describe('notes', () => {
  test('saves and reads back a note', async () => {
    await saveNote(18, 10, 'Reflect on reliance in the cave.');

    const note = await getNote(18, 10);

    expect(note?.text).toBe('Reflect on reliance in the cave.');
    expect(note?.surah).toBe(18);
  });

  test('trims surrounding whitespace', async () => {
    await saveNote(1, 1, '   spaced   ');
    await expect(getNote(1, 1)).resolves.toMatchObject({ text: 'spaced' });
  });

  test('an empty note deletes rather than storing a blank record', async () => {
    await saveNote(1, 1, 'something');
    const result = await saveNote(1, 1, '    ');

    expect(result).toBeNull();
    await expect(getNote(1, 1)).resolves.toBeUndefined();
  });

  test('caps length so one paste cannot fill the storage quota', async () => {
    await saveNote(1, 1, 'x'.repeat(MAX_NOTE_LENGTH + 500));

    const note = await getNote(1, 1);

    expect(note?.text).toHaveLength(MAX_NOTE_LENGTH);
  });

  test('saving again replaces rather than duplicating', async () => {
    await saveNote(1, 1, 'first');
    await saveNote(1, 1, 'second');

    const notes = await listNotes();

    expect(notes).toHaveLength(1);
    expect(notes[0]?.text).toBe('second');
  });

  test('refuses a reference that does not exist', async () => {
    await expect(saveNote(2, 287, 'x')).rejects.toThrow(RangeError);
  });
});

describe('reading position', () => {
  test('is undefined before anything has been read', async () => {
    await expect(getReadingPosition()).resolves.toBeUndefined();
  });

  test('stores only the most recent position', async () => {
    await saveReadingPosition(2, 100);
    await saveReadingPosition(18, 60);

    const position = await getReadingPosition();

    expect(position?.surah).toBe(18);
    expect(position?.ayah).toBe(60);
  });

  test('refuses a reference that does not exist', async () => {
    await expect(saveReadingPosition(2, 999)).rejects.toThrow(RangeError);
  });
});

describe('clearAllReadingData', () => {
  test('removes bookmarks, notes and position together', async () => {
    await addBookmark(1, 1);
    await saveNote(1, 1, 'note');
    await saveReadingPosition(1, 1);

    await clearAllReadingData();

    await expect(listBookmarks()).resolves.toHaveLength(0);
    await expect(listNotes()).resolves.toHaveLength(0);
    await expect(getReadingPosition()).resolves.toBeUndefined();
  });
});
