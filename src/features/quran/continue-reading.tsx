'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getSurah } from '@/lib/quran/surahs';
import { getReadingPosition, listBookmarks, type Bookmark } from '@/lib/store/reading';

interface Resume {
  readonly surah: number;
  readonly ayah: number;
  readonly name: string;
}

/**
 * "Continue reading" and recent bookmarks.
 *
 * Renders nothing at all until there is something to show, so a first-time visitor is
 * never met with an empty widget explaining a feature they have not used yet.
 */
export function ContinueReading() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [bookmarks, setBookmarks] = useState<readonly Bookmark[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [position, marks] = await Promise.all([getReadingPosition(), listBookmarks()]);
        if (cancelled) return;

        if (position) {
          const surah = getSurah(position.surah);
          if (surah) {
            setResume({ surah: position.surah, ayah: position.ayah, name: surah.name });
          }
        }
        setBookmarks(marks.slice(0, 6));
      } catch {
        // No local storage available — the index still works without this section.
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!resume && bookmarks.length === 0) return null;

  return (
    <section aria-labelledby="continue-heading" className="mt-10">
      <h2 id="continue-heading" className="sr-only">
        Your reading
      </h2>

      {resume && (
        <Link
          href={`/quran/${resume.surah}#ayah-${resume.ayah}`}
          className="group flex items-center gap-4 rounded-xl border border-line bg-surface-raised p-5 transition-colors duration-300 hover:border-line-strong"
        >
          <span className="min-w-0 flex-1">
            <span className="block font-display text-xs uppercase tracking-[0.2em] text-gold-ink">
              Continue reading
            </span>
            <span className="mt-1.5 block font-display text-xl text-ink">
              {resume.name}{' '}
              <span className="text-ink-faint">
                {resume.surah}:{resume.ayah}
              </span>
            </span>
          </span>
          <span aria-hidden className="text-emerald transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      )}

      {bookmarks.length > 0 && (
        <div className="mt-6">
          <h3 className="font-display text-xs uppercase tracking-[0.2em] text-ink-faint">
            Bookmarks
          </h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {bookmarks.map((bookmark) => {
              const surah = getSurah(bookmark.surah);
              return (
                <li key={bookmark.id}>
                  <Link
                    href={`/quran/${bookmark.surah}#ayah-${bookmark.ayah}`}
                    className="inline-flex min-h-11 items-center rounded-full border border-line px-4 py-2 text-sm text-ink-muted transition-colors duration-200 hover:border-emerald hover:text-emerald"
                  >
                    {surah?.name ?? `Surah ${bookmark.surah}`} {bookmark.surah}:{bookmark.ayah}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
