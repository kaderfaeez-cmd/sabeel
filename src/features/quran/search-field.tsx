'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { MAX_QUERY_LENGTH } from '@/lib/quran/search';

/**
 * Submits to the URL rather than fetching directly, so a search is shareable,
 * bookmarkable and server-rendered.
 */
export function SearchField({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialQuery);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams(searchParams);
    const trimmed = value.trim();

    if (trimmed === '') {
      params.delete('q');
    } else {
      params.set('q', trimmed.slice(0, MAX_QUERY_LENGTH));
    }
    router.push(`/quran/search?${params}`);
  }

  return (
    <form onSubmit={submit} role="search" className="relative mt-9">
      <Search
        className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-faint"
        aria-hidden
      />
      <input
        type="search"
        name="q"
        value={value}
        maxLength={MAX_QUERY_LENGTH}
        onChange={(event) => setValue(event.target.value)}
        placeholder="patience, gratitude, the sea…"
        aria-label="Search the Quran translation"
        className="w-full rounded-full border border-line bg-surface-raised py-3.5 pl-11 pr-28 text-ink placeholder:text-ink-faint focus:border-emerald focus:outline-none"
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-emerald px-5 py-2.5 text-sm text-surface"
      >
        Search
      </button>
    </form>
  );
}
