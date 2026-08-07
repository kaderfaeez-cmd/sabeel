'use client';

import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { NAMES, searchNames, TOTAL_NAMES } from '@/lib/names';

/**
 * The 99 Names, with instant filtering.
 *
 * Search runs against the baked list, so it is synchronous and works offline — there is
 * no request behind it.
 */
export function NamesGrid() {
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchNames(query), [query]);

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
          aria-label="Search the names"
          className="min-h-11 w-full rounded-full border border-line bg-surface-raised py-3.5 pl-11 pr-5 text-ink placeholder:text-ink-faint focus:border-emerald focus:outline-none"
        />
      </div>

      <p aria-live="polite" className="mt-4 text-sm text-ink-faint">
        {results.length === NAMES.length
          ? `All ${TOTAL_NAMES} names`
          : `${results.length} ${results.length === 1 ? 'name' : 'names'}`}
      </p>

      {results.length === 0 ? (
        <p className="mt-10 text-ink-muted">
          Nothing matched “{query}”. Try a meaning such as “merciful”, or a number from 1
          to 99.
        </p>
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((name) => (
            <li
              key={name.number}
              className="rounded-xl border border-line bg-surface-raised p-5 transition-colors duration-300 hover:border-line-strong"
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  aria-hidden
                  className="font-display text-xs text-ink-faint"
                >
                  {String(name.number).padStart(2, '0')}
                </span>
                <p lang="ar" dir="rtl" className="text-2xl leading-relaxed text-emerald">
                  {name.arabic}
                </p>
              </div>

              <p className="mt-4 font-display text-lg text-ink">{name.transliteration}</p>
              <p className="mt-1 text-sm text-ink-muted">{name.meaning}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
