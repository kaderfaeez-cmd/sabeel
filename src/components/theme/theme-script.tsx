import { THEME_STORAGE_KEY } from './theme-constants';

/**
 * Applies the stored theme before first paint so there is no flash of the wrong
 * theme. Kept deliberately tiny and dependency-free.
 *
 * NOTE (Phase 12): when the strict CSP lands, this needs the per-request nonce.
 */
const script = `
(function () {
  try {
    var stored = localStorage.getItem('${THEME_STORAGE_KEY}');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var dark = stored ? stored === 'dark' : prefersDark;
    document.documentElement.classList.toggle('dark', dark);
  } catch (e) {
    /* Storage unavailable (private mode, blocked cookies) — fall back to the
       light parchment default rather than failing to render. */
  }
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
