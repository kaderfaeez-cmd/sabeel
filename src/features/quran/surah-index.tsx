'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { searchSurahs, type Surah } from '@/lib/quran/surahs';

/**
 * The 114 surahs with instant filtering. Search runs against the baked index, so it is
 * synchronous and works offline — there is no request behind it.
 */
export function SurahIndex() {
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchSurahs(query), [query]);

  return (
    <>
      <div className="relative mt-10">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-faint"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, meaning or number…"
          aria-label="Search the surahs"
          className="w-full rounded-full border border-line bg-surface-raised py-3.5 pl-11 pr-5 text-ink placeholder:text-ink-faint focus:border-emerald focus:outline-none"
        />
      </div>

      <p aria-live="polite" className="mt-4 text-sm text-ink-faint">
        {results.length === 114
          ? 'All 114 surahs'
          : `${results.length} ${results.length === 1 ? 'surah' : 'surahs'}`}
      </p>

      {results.length === 0 ? (
        <p className="mt-10 text-ink-muted">
          Nothing matched “{query}”. Try a surah name, its meaning, or a number from 1 to 114.
        </p>
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((surah) => (
            <SurahCard key={surah.number} surah={surah} />
          ))}
        </ul>
      )}
    </>
  );
}

function SurahCard({ surah }: { surah: Surah }) {
  return (
    <li>
      <Link
        href={`/quran/${surah.number}`}
        className="group flex items-center gap-4 rounded-xl border border-line bg-surface-raised p-4 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-paper"
      >
        <span
          aria-hidden
          className="grid size-10 shrink-0 place-items-center rounded-lg bg-surface-sunken font-display text-sm text-ink-muted transition-colors duration-300 group-hover:bg-[var(--emerald-soft)] group-hover:text-emerald"
        >
          {surah.number}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block font-display text-lg font-medium text-ink">
            {surah.name}
          </span>
          <span className="block truncate text-xs text-ink-faint">
            {surah.meaning} · {surah.ayahCount} ayahs ·{' '}
            {surah.revelationPlace === 'makkah' ? 'Makkan' : 'Madinan'}
          </span>
        </span>

        <span lang="ar" dir="rtl" className="shrink-0 text-xl text-ink-muted">
          {surah.nameArabic}
        </span>
      </Link>
    </li>
  );
}
