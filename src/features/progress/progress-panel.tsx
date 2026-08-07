'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getSurah, TOTAL_SURAHS } from '@/lib/quran/surahs';
import { listBookmarks, listNotes, getReadingPosition } from '@/lib/store/reading';
import { listCachedSurahs } from '@/lib/store/surah-cache';

interface Summary {
  readonly surahsOpened: number;
  readonly bookmarks: number;
  readonly notes: number;
  readonly lastRead: { surah: number; ayah: number; name: string } | null;
}

/**
 * Progress.
 *
 * Constitution §7: no shame mechanics. There is no streak that can be broken here, no
 * red state, and no percentage-complete bar implying a target the reader has failed to
 * reach. It reports what has been read, and nothing more.
 */
export function ProgressPanel() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [cached, bookmarks, notes, position] = await Promise.all([
          listCachedSurahs(),
          listBookmarks(),
          listNotes(),
          getReadingPosition(),
        ]);
        if (cancelled) return;

        const distinct = new Set(cached.map((entry) => entry.surah));
        const surah = position ? getSurah(position.surah) : undefined;

        setSummary({
          surahsOpened: distinct.size,
          bookmarks: bookmarks.length,
          notes: notes.length,
          lastRead:
            position && surah
              ? { surah: position.surah, ayah: position.ayah, name: surah.name }
              : null,
        });
      } catch {
        if (!cancelled) setUnavailable(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (unavailable) {
    return (
      <p className="mt-10 rounded-lg border border-dashed border-line-strong bg-surface-sunken px-6 py-5 text-ink-muted">
        This browser is blocking local storage, so nothing can be recorded on this device.
        Everything on Sabeel still works — none of it requires an account.
      </p>
    );
  }

  if (summary === null) {
    return <p className="mt-10 text-ink-faint">Loading…</p>;
  }

  const nothingYet =
    summary.surahsOpened === 0 && summary.bookmarks === 0 && summary.notes === 0;

  if (nothingYet) {
    return (
      <div className="mt-10 rounded-2xl border border-dashed border-line-strong bg-surface-sunken px-7 py-10 text-center">
        <p className="font-display text-title text-ink">Nothing recorded yet</p>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-ink-muted">
          Open a surah and this will start filling in. There is no target here and nothing
          to keep up with — it simply remembers where you have been.
        </p>
        <Link
          href="/quran"
          className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-emerald px-6 py-3 text-sm text-surface"
        >
          Read the Quran
          <span aria-hidden>→</span>
        </Link>
      </div>
    );
  }

  return (
    <>
      {summary.lastRead && (
        <Link
          href={`/quran/${summary.lastRead.surah}#ayah-${summary.lastRead.ayah}`}
          className="group mt-10 flex items-center gap-4 rounded-2xl border-l-2 border-l-emerald border-line bg-surface-raised p-6 transition-colors hover:border-line-strong"
        >
          <span className="min-w-0 flex-1">
            <span className="block font-display text-xs uppercase tracking-[0.18em] text-gold-ink">
              Continue reading
            </span>
            <span className="mt-1.5 block font-display text-xl text-ink">
              {summary.lastRead.name}{' '}
              <span className="text-ink-faint">
                {summary.lastRead.surah}:{summary.lastRead.ayah}
              </span>
            </span>
          </span>
          <span aria-hidden className="text-emerald transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      )}

      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Surahs opened" value={`${summary.surahsOpened}`} of={`of ${TOTAL_SURAHS}`} />
        <Stat label="Bookmarks" value={`${summary.bookmarks}`} />
        <Stat label="Reflections written" value={`${summary.notes}`} />
      </dl>

      <p className="mt-8 rounded-lg border border-line bg-surface-sunken px-6 py-5 text-sm leading-relaxed text-ink-muted">
        There is no streak here, and nothing to lose by stopping for a while. Islam was
        revealed over twenty-three years — reading a page today and nothing tomorrow is not
        a failure.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/journal"
          className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-5 py-2.5 text-sm text-ink transition-colors hover:border-emerald hover:text-emerald"
        >
          Your journal
        </Link>
        <Link
          href="/settings"
          className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-5 py-2.5 text-sm text-ink transition-colors hover:border-emerald hover:text-emerald"
        >
          Settings
        </Link>
      </div>
    </>
  );
}

function Stat({ label, value, of }: { label: string; value: string; of?: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface-raised p-6">
      <dt className="font-display text-xs uppercase tracking-[0.18em] text-ink-faint">
        {label}
      </dt>
      <dd className="mt-3 font-display text-display font-light leading-none text-ink">
        {value}
        {of && <span className="ml-2 text-base text-ink-faint">{of}</span>}
      </dd>
    </div>
  );
}
