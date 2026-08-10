import { isValidReference } from '@/lib/quran/surahs';
import { clear, get, getAll, put, remove, STORE } from './db';

/**
 * Bookmarks, notes and reading position — all local-first.
 *
 * Every write validates the reference first, so a corrupted or hand-edited store can
 * never produce a bookmark pointing at an ayah that does not exist.
 */

export interface Bookmark {
  readonly id: string;
  readonly surah: number;
  readonly ayah: number;
  readonly createdAt: number;
}

export interface Note {
  readonly id: string;
  readonly surah: number;
  readonly ayah: number;
  readonly text: string;
  readonly updatedAt: number;
}

/**
 * A reflection written at the end of a story.
 *
 * Stored alongside the ayah notes so the Journal shows one stream rather than two. Kept
 * as a separate type because it has no surah:ayah — a story reflection is about the whole
 * story, not one verse.
 */
export interface StoryNote {
  readonly id: string;
  readonly storyId: string;
  readonly storyName: string;
  readonly text: string;
  readonly updatedAt: number;
}

export type JournalEntry =
  | { readonly kind: 'ayah'; readonly note: Note }
  | { readonly kind: 'story'; readonly note: StoryNote };

export interface ReadingPosition {
  readonly id: 'last-read';
  readonly surah: number;
  readonly ayah: number;
  readonly updatedAt: number;
}

const POSITION_KEY = 'last-read';

/** Notes are stored verbatim but bounded, so a runaway paste cannot fill the quota. */
export const MAX_NOTE_LENGTH = 4000;

export function referenceKey(surah: number, ayah: number): string {
  return `${surah}:${ayah}`;
}

function assertReference(surah: number, ayah: number): void {
  if (!isValidReference(surah, ayah)) {
    throw new RangeError(`Quran ${surah}:${ayah} is not a valid reference`);
  }
}

// ---------------------------------------------------------------------------
// Bookmarks
// ---------------------------------------------------------------------------

export async function addBookmark(surah: number, ayah: number): Promise<Bookmark> {
  assertReference(surah, ayah);
  const bookmark: Bookmark = {
    id: referenceKey(surah, ayah),
    surah,
    ayah,
    createdAt: Date.now(),
  };
  await put(STORE.bookmarks, bookmark);
  return bookmark;
}

export async function removeBookmark(surah: number, ayah: number): Promise<void> {
  await remove(STORE.bookmarks, referenceKey(surah, ayah));
}

export async function isBookmarked(surah: number, ayah: number): Promise<boolean> {
  const found = await get<Bookmark>(STORE.bookmarks, referenceKey(surah, ayah));
  return found !== undefined;
}

/** Newest first — the order a reader expects when returning to their bookmarks. */
export async function listBookmarks(): Promise<readonly Bookmark[]> {
  const all = await getAll<Bookmark>(STORE.bookmarks);
  return all.sort((a, b) => b.createdAt - a.createdAt);
}

export async function toggleBookmark(surah: number, ayah: number): Promise<boolean> {
  if (await isBookmarked(surah, ayah)) {
    await removeBookmark(surah, ayah);
    return false;
  }
  await addBookmark(surah, ayah);
  return true;
}

// ---------------------------------------------------------------------------
// Notes
// ---------------------------------------------------------------------------

/** An empty note deletes rather than storing a blank record. */
export async function saveNote(surah: number, ayah: number, text: string): Promise<Note | null> {
  assertReference(surah, ayah);

  const trimmed = text.trim();
  if (trimmed === '') {
    await remove(STORE.notes, referenceKey(surah, ayah));
    return null;
  }

  const note: Note = {
    id: referenceKey(surah, ayah),
    surah,
    ayah,
    text: trimmed.slice(0, MAX_NOTE_LENGTH),
    updatedAt: Date.now(),
  };
  await put(STORE.notes, note);
  return note;
}

export async function getNote(surah: number, ayah: number): Promise<Note | undefined> {
  return get<Note>(STORE.notes, referenceKey(surah, ayah));
}

/** Ayah notes only. Story reflections share the store but are not surah:ayah records. */
export async function listNotes(): Promise<readonly Note[]> {
  const all = await getAll<Note | StoryNote>(STORE.notes);
  return all
    .filter((note): note is Note => !note.id.startsWith('story:'))
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

// ---------------------------------------------------------------------------
// Story reflections
// ---------------------------------------------------------------------------

const STORY_NOTE_PREFIX = 'story:';

export async function saveStoryNote(
  storyId: string,
  storyName: string,
  text: string,
): Promise<StoryNote | null> {
  const trimmed = text.trim();
  if (trimmed === '') {
    await remove(STORE.notes, `${STORY_NOTE_PREFIX}${storyId}`);
    return null;
  }

  const note: StoryNote = {
    id: `${STORY_NOTE_PREFIX}${storyId}`,
    storyId,
    storyName,
    text: trimmed.slice(0, MAX_NOTE_LENGTH),
    updatedAt: Date.now(),
  };
  await put(STORE.notes, note);
  return note;
}

export async function getStoryNote(storyId: string): Promise<StoryNote | undefined> {
  return get<StoryNote>(STORE.notes, `${STORY_NOTE_PREFIX}${storyId}`);
}

function isStoryNote(value: Note | StoryNote): value is StoryNote {
  return value.id.startsWith(STORY_NOTE_PREFIX);
}

/** Everything written, newest first — ayah notes and story reflections in one stream. */
export async function listJournal(): Promise<readonly JournalEntry[]> {
  const all = await getAll<Note | StoryNote>(STORE.notes);
  return all
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map((note) =>
      isStoryNote(note)
        ? ({ kind: 'story', note } as const)
        : ({ kind: 'ayah', note } as const),
    );
}

// ---------------------------------------------------------------------------
// Reading position
// ---------------------------------------------------------------------------

export async function saveReadingPosition(surah: number, ayah: number): Promise<void> {
  assertReference(surah, ayah);
  const position: ReadingPosition = {
    id: POSITION_KEY,
    surah,
    ayah,
    updatedAt: Date.now(),
  };
  await put(STORE.progress, position);
}

export async function getReadingPosition(): Promise<ReadingPosition | undefined> {
  return get<ReadingPosition>(STORE.progress, POSITION_KEY);
}

/** Everything the user has stored, for a "clear my data" control in Settings. */
export async function clearAllReadingData(): Promise<void> {
  await Promise.all([
    clear(STORE.bookmarks),
    clear(STORE.notes),
    clear(STORE.progress),
  ]);
}
