import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'You’re offline',
  robots: { index: false, follow: false },
};

/**
 * Shown when a page is requested with no connection and nothing cached for it.
 *
 * Written to be reassuring rather than an error screen — anything already read stays
 * available, which is the point of caching revelation in the first place.
 */
export default function OfflinePage() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 sm:px-8">
      <p className="font-display text-xs uppercase tracking-[0.28em] text-gold-ink">
        No connection
      </p>
      <h1 className="mt-5 font-display text-display font-light tracking-[-0.015em] text-ink">
        You’re offline
      </h1>

      <p className="mt-7 text-lede leading-relaxed text-ink-muted">
        This page has not been opened on this device before, so there is nothing saved for
        it yet. Anything you have already read is still here.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/quran"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-emerald px-6 py-3 text-sm text-surface"
        >
          Surahs you have read
          <span aria-hidden>→</span>
        </Link>
        <Link
          href="/journal"
          className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-6 py-3 text-sm text-ink transition-colors hover:border-emerald hover:text-emerald"
        >
          Your journal
        </Link>
      </div>

      <p className="mt-10 text-sm text-ink-faint">
        Your bookmarks, notes and reading position are stored on this device and never
        needed a connection.
      </p>
    </div>
  );
}
