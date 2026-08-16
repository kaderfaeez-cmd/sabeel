'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Reads and writes a localStorage value without mirroring it into React state.
 *
 * localStorage is the source of truth, so subscribing to it is correct where copying it
 * into state in an effect is not — that pattern causes a cascading render and is what
 * React 19's `set-state-in-effect` rule exists to catch. The server snapshot is the
 * fallback, so SSR and the first client render agree.
 */

const listeners = new Set<() => void>();

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  // `storage` fires for other tabs; the local set below covers this one.
  window.addEventListener('storage', onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
}

function notify() {
  for (const listener of listeners) listener();
}

export function useLocalStorage(
  key: string,
  fallback: string,
): [string, (value: string) => void] {
  const getSnapshot = useCallback(() => {
    try {
      return localStorage.getItem(key) ?? fallback;
    } catch {
      return fallback;
    }
  }, [key, fallback]);

  const getServerSnapshot = useCallback(() => fallback, [fallback]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (next: string) => {
      try {
        localStorage.setItem(key, next);
      } catch {
        // Storage unavailable; nothing persists, but the app keeps working.
      }
      notify();
    },
    [key],
  );

  return [value, setValue];
}

/**
 * Deletes a key and tells every subscriber.
 *
 * Needed because writing an empty string is not the same as removing: it leaves the key
 * present with a falsy value, so anything checking `getItem(key) !== null` sees a stale
 * entry that should be gone.
 */
export function removeLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Nothing to remove.
  }
  notify();
}

/** Same, for a JSON-encoded object. Returns `null` when absent or unparseable. */
export function useLocalStorageObject<T>(
  key: string,
): [T | null, (value: T | null) => void] {
  const [raw, setRaw] = useLocalStorage(key, '');

  let parsed: T | null = null;
  if (raw) {
    try {
      parsed = JSON.parse(raw) as T;
    } catch {
      parsed = null;
    }
  }

  const setValue = useCallback(
    (next: T | null) => {
      // Remove properly rather than writing an empty string, which would leave the key
      // behind with a falsy value.
      if (next === null) {
        removeLocalStorage(key);
        return;
      }
      setRaw(JSON.stringify(next));
    },
    [key, setRaw],
  );

  return [parsed, setValue];
}
