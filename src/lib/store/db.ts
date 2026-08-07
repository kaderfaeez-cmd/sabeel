/**
 * Local-first storage.
 *
 * Constitution §7: nothing is gated behind an account, and reading must work offline.
 * So bookmarks, notes and reading position live in the user's own browser first. Supabase
 * sync (Phase 9) will be an additive layer on top of this, never a prerequisite for it.
 *
 * Deliberately a small hand-rolled wrapper rather than a dependency: the surface used
 * here is four stores and five operations, and owning it keeps the offline behaviour
 * explicit and testable.
 */

export const DB_NAME = 'sabeel';
export const DB_VERSION = 1;

export const STORE = {
  bookmarks: 'bookmarks',
  notes: 'notes',
  progress: 'progress',
  surahCache: 'surahCache',
} as const;

export type StoreName = (typeof STORE)[keyof typeof STORE];

/** True when persistent storage is usable. Private modes and locked-down browsers say no. */
export function isStorageAvailable(): boolean {
  return typeof indexedDB !== 'undefined';
}

let connection: Promise<IDBDatabase> | null = null;

export function openDatabase(): Promise<IDBDatabase> {
  if (!isStorageAvailable()) {
    return Promise.reject(new Error('This browser has no local storage available.'));
  }

  connection ??= new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      // Keyed by `${surah}:${ayah}` so a bookmark is idempotent.
      if (!db.objectStoreNames.contains(STORE.bookmarks)) {
        db.createObjectStore(STORE.bookmarks, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE.notes)) {
        db.createObjectStore(STORE.notes, { keyPath: 'id' });
      }
      // Keyed by a fixed record name — there is only ever one reading position.
      if (!db.objectStoreNames.contains(STORE.progress)) {
        db.createObjectStore(STORE.progress, { keyPath: 'id' });
      }
      // Keyed by `${surah}:${translationId}` so offline reading survives a translation switch.
      if (!db.objectStoreNames.contains(STORE.surahCache)) {
        db.createObjectStore(STORE.surahCache, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error('Could not open local storage.'));
  });

  return connection;
}

/** Test seam — drops the memoised connection so a fresh database can be opened. */
export function resetConnection(): void {
  connection = null;
}

function promisify<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Storage request failed.'));
  });
}

export async function put<T>(store: StoreName, value: T): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction(store, 'readwrite');
  await promisify(tx.objectStore(store).put(value));
}

export async function get<T>(store: StoreName, key: string): Promise<T | undefined> {
  const db = await openDatabase();
  const tx = db.transaction(store, 'readonly');
  return promisify<T | undefined>(tx.objectStore(store).get(key));
}

export async function getAll<T>(store: StoreName): Promise<T[]> {
  const db = await openDatabase();
  const tx = db.transaction(store, 'readonly');
  return promisify<T[]>(tx.objectStore(store).getAll());
}

export async function remove(store: StoreName, key: string): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction(store, 'readwrite');
  await promisify(tx.objectStore(store).delete(key));
}

export async function clear(store: StoreName): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction(store, 'readwrite');
  await promisify(tx.objectStore(store).clear());
}
