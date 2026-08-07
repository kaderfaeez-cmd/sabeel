import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { SearchField } from '@/features/quran/search-field';
import { getSurah } from '@/lib/quran/surahs';
import { searchQuran, type SearchResponse } from '@/lib/quran/search';
import { getTranslation, resolveTranslationId } from '@/lib/quran/translations';

export const metadata: Metadata = {
  title: 'Search the Quran',
  description:
    'Search the Quran by word or theme. Every result carries its surah and ayah reference and its translator.',
};

interface PageProps {
  searchParams: Promise<{ q?: string; t?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q, t } = await searchParams;
  const query = (q ?? '').trim();
  const translationId = resolveTranslationId(t);
  const translation = getTranslation(translationId);

  // Resolved here rather than in a nested async component inside Suspense: that shape
  // server-renders but the boundary is not reliably finalised on the client, leaving the
  // reader looking at a permanent loading state. Same reason the recitation player and
  // reading tracker are resolved at page level.
  const { response, failure } = query === '' ? emptyState() : await runSearch(query, translationId);

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
      <Link href="/quran" className="text-sm text-ink-muted hover:text-ink">
        ← All surahs
      </Link>

      <h1 className="mt-8 font-display text-display font-light tracking-[-0.015em] text-ink">
        Search the Quran
      </h1>
      <p className="mt-5 max-w-xl leading-relaxed text-ink-muted">
        Search the translation by word or theme. Every result shows where it comes from.
      </p>

      <Suspense fallback={null}>
        <SearchField initialQuery={query} />
      </Suspense>

      {query === '' && (
        <p className="mt-10 text-ink-faint">
          Try a theme such as “patience”, “gratitude”, “orphans” or “the sea”.
        </p>
      )}

      {failure && (
        <p
          role="alert"
          className="mt-10 rounded-lg border border-dashed border-line-strong bg-surface-sunken px-6 py-6 text-ink-muted"
        >
          {failure}. Please try again shortly.
        </p>
      )}

      {response && response.results.length === 0 && query !== '' && (
        <p className="mt-10 text-ink-muted">
          Nothing matched “{query}”. Try a different word, or a theme such as “patience”
          or “gratitude”.
        </p>
      )}

      {response && response.results.length > 0 && (
        <>
          <p className="mt-8 text-sm text-ink-faint">
            {response.totalResults.toLocaleString('en')} results · showing the first{' '}
            {response.results.length} · translation by {translation?.translator}
          </p>

          <ul className="mt-6 space-y-3">
            {response.results.map((result) => {
              const surah = getSurah(result.surah);
              return (
                <li key={`${result.surah}:${result.ayah}`}>
                  <Link
                    href={`/quran/${result.surah}?t=${translationId}#ayah-${result.ayah}`}
                    className="block rounded-xl border border-line bg-surface-raised p-5 transition-colors duration-300 hover:border-line-strong"
                  >
                    <span className="font-display text-xs tracking-[0.14em] text-gold-ink">
                      {surah?.name} · {result.surah}:{result.ayah}
                    </span>

                    <p lang="ar" dir="rtl" className="mt-3 text-xl leading-loose text-ink">
                      {result.arabic}
                    </p>

                    {/* Plain segments, never raw markup from the search API. */}
                    <p className="mt-3 leading-relaxed text-ink-muted">
                      {result.segments.map((segment, index) =>
                        segment.match ? (
                          <mark
                            key={index}
                            className="rounded bg-[var(--emerald-soft)] px-0.5 text-ink"
                          >
                            {segment.text}
                          </mark>
                        ) : (
                          <span key={index}>{segment.text}</span>
                        ),
                      )}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

function emptyState(): { response: SearchResponse | null; failure: string | null } {
  return { response: null, failure: null };
}

async function runSearch(
  query: string,
  translationId: number,
): Promise<{ response: SearchResponse | null; failure: string | null }> {
  try {
    return { response: await searchQuran(query, translationId), failure: null };
  } catch (error) {
    return {
      response: null,
      failure: error instanceof Error ? error.message : 'Search is unavailable',
    };
  }
}
