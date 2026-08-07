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
      if (next === null) {
        try {
          localStorage.removeItem(key);
        } catch {
          /* nothing to remove */
        }
        setRaw('');
        return;
      }
      setRaw(JSON.stringify(next));
    },
    [key, setRaw],
  );

  return [parsed, setValue];
}
