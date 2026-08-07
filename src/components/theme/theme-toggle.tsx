'use client';

import { Moon, Sun } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import { THEME_STORAGE_KEY, type Theme } from './theme-constants';

/**
 * The `<html>` class is the single source of truth for the active theme — it is set by
 * ThemeScript before first paint, so no React state can be authoritative at mount.
 * We therefore subscribe to it rather than mirroring it into state, which also keeps
 * the toggle correct if the theme is changed from anywhere else.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
  return () => observer.disconnect();
}

const getSnapshot = (): Theme =>
  document.documentElement.classList.contains('dark') ? 'dark' : 'light';

/** No theme is knowable on the server; the toggle renders a placeholder until hydration. */
const getServerSnapshot = (): null => null;

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    // Mutating the class notifies the observer above, which re-renders this button.
    document.documentElement.classList.toggle('dark', next === 'dark');
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Preference cannot be persisted; the visual change still applies for this session.
    }
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="grid size-11 place-items-center rounded-full border border-line text-ink-muted transition-colors duration-200 hover:border-line-strong hover:text-ink md:size-9"
    >
      {theme === null ? (
        <span className="size-4" />
      ) : isDark ? (
        <Sun className="size-4" aria-hidden />
      ) : (
        <Moon className="size-4" aria-hidden />
      )}
    </button>
  );
}
