import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ContentBlock } from '@/components/content/content-block';
import { AyahRow } from '@/features/quran/ayah-row';
import { fetchChapterInfo } from '@/lib/quran/chapter-info';
import { ReadingControls } from '@/features/quran/reading-controls';
import { ReadingTracker } from '@/features/quran/reading-tracker';
import { RecitationPlayer } from '@/features/quran/recitation-player';
import type { QuranBlock } from '@/lib/content/types';
import { fetchSurahVerses, QuranApiError } from '@/lib/quran/api';
import {
  fetchSurahAudio,
  getReciter,
  reciterLabel,
  resolveReciterId,
} from '@/lib/quran/recitations';
import { getSurah, TOTAL_SURAHS } from '@/lib/quran/surahs';
import { getTranslation, resolveTranslationId } from '@/lib/quran/translations';

interface PageProps {
  params: Promise<{ surah: string }>;
  searchParams: Promise<{ t?: string; tl?: string; r?: string }>;
}

/** Validates the route segment before it reaches anything else. */
function parseSurahNumber(raw: string): number | null {
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > TOTAL_SURAHS) return null;
  return parsed;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { surah: raw } = await params;
  const number = parseSurahNumber(raw);
  const surah = number ? getSurah(number) : undefined;

  if (!surah) return { title: 'Surah not found' };

  return {
    title: `${surah.name} — ${surah.meaning}`,
    description: `Read Surah ${surah.name} (${surah.meaning}) in Arabic with an English translation. ${surah.ayahCount} ayahs, revealed in ${surah.revelationPlace === 'makkah' ? 'Makkah' : 'Madinah'}.`,
  };
}

export default async function SurahPage({ params, searchParams }: PageProps) {
  const { surah: raw } = await params;
  const number = parseSurahNumber(raw);
  if (number === null) notFound();

  const surah = getSurah(number);
  if (!surah) notFound();

  const query = await searchParams;
  const translationId = resolveTranslationId(query.t);
  const reciterId = resolveReciterId(query.r);
  const showTransliteration = query.tl === '1';
  const translation = getTranslation(translationId);
  const reciter = getReciter(reciterId);

  const previous = number > 1 ? getSurah(number - 1) : undefined;
  const next = number < TOTAL_SURAHS ? getSurah(number + 1) : undefined;

  /**
   * Both fetches happen here rather than inside nested async components.
   *
   * A client component only registers for hydration when it is referenced from a
   * component the router renders directly; behind a nested async boundary it
   * server-renders but stays inert. RecitationPlayer and ReadingTracker are both client
   * components that depend on this data, so the data is resolved at this level.
   *
   * The two requests run in parallel — audio must never delay text.
   */
  const [verses, audioUrls, chapterInfo] = await Promise.all([
    loadVerses(number, translationId, showTransliteration),
    loadRecitation(number, reciterId),
    fetchChapterInfo(number),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <div className="flex items-center justify-between gap-4">
        <Link href="/quran" className="text-sm text-ink-muted hover:text-ink">
          ← All surahs
        </Link>
        <Link href="/quran/search" className="text-sm text-ink-muted hover:text-ink">
          Search
        </Link>
      </div>

      <header className="mt-8 border-b border-line pb-9">
        <p className="font-display text-xs uppercase tracking-[0.24em] text-gold-ink">
          Surah {surah.number} · {surah.revelationPlace === 'makkah' ? 'Makkan' : 'Madinan'} ·{' '}
          {surah.ayahCount} ayahs
        </p>

        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-4">
          <h1 className="font-display text-display font-light tracking-[-0.015em] text-ink">
            {surah.name}
          </h1>
          <p lang="ar" dir="rtl" className="text-4xl text-emerald">
            {surah.nameArabic}
          </p>
        </div>

        <p className="mt-2 text-lede text-ink-muted">{surah.meaning}</p>

        {/* Constitution §4: the reader is told the source once, up front, for the page. */}
        {translation && (
          <p className="mt-7 rounded-lg border-l-2 border-l-emerald bg-surface-raised px-5 py-3.5 text-sm leading-relaxed text-ink-muted">
            Arabic in the Uthmani script. English translation by{' '}
            <strong className="font-medium text-ink">{translation.translator}</strong>.
            Every ayah below carries its own reference.
          </p>
        )}

        {/* What this surah is about, from a named scholar — never Sabeel's own voice. */}
        {chapterInfo && (
          <details className="group mt-7 rounded-xl border border-line bg-surface-raised px-6 py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 marker:content-none">
              <span className="font-display text-lg text-ink">
                What is this surah about?
              </span>
              <span
                aria-hidden
                className="shrink-0 text-ink-faint transition-transform duration-300 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <div className="mt-5 border-t border-line pt-5">
              <ContentBlock block={chapterInfo} />
            </div>
          </details>
        )}

        <div className="mt-7">
          <Suspense fallback={null}>
            <ReadingControls
              translationId={translationId}
              reciterId={reciterId}
              showTransliteration={showTransliteration}
            />
          </Suspense>
        </div>
      </header>

      {surah.hasBismillah && verses !== null && (
        <p
          lang="ar"
          dir="rtl"
          className="border-b border-line py-9 text-center text-2xl leading-loose text-ink sm:text-3xl"
        >
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </p>
      )}

      {verses === null ? (
        <SourceUnavailable />
      ) : (
        <>
          <ReadingTracker surah={number} translationId={translationId} blocks={verses} />
          {verses.map((block) => (
            <AyahRow key={block.id} block={block} />
          ))}
        </>
      )}

      {/* Audio never starts on its own — the player only appears, it does not play. */}
      {audioUrls.length > 0 && verses !== null && (
        <RecitationPlayer
          audioUrls={audioUrls}
          reciterName={reciter ? reciterLabel(reciter) : 'Unknown reciter'}
        />
      )}

      <nav aria-label="Surah navigation" className="mt-14 flex justify-between gap-4">
        {previous ? (
          <Link
            href={`/quran/${previous.number}`}
            className="rounded-full border border-line px-5 py-2.5 text-sm text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
          >
            ← {previous.name}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/quran/${next.number}`}
            className="rounded-full border border-line px-5 py-2.5 text-sm text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
          >
            {next.name} →
          </Link>
        )}
      </nav>
    </div>
  );
}

/**
 * A source failure must never render an empty or partial surah that a reader could
 * mistake for the real thing (Constitution §3) — so `null` means "say so", not "show
 * nothing quietly".
 */
async function loadVerses(
  surahNumber: number,
  translationId: number,
  includeTransliteration: boolean,
): Promise<readonly QuranBlock[] | null> {
  try {
    return await fetchSurahVerses(surahNumber, translationId, { includeTransliteration });
  } catch (error) {
    if (!(error instanceof QuranApiError)) throw error;
    return null;
  }
}

/**
 * Loads recitation audio, treating any failure as "no audio available".
 * Reading must never be blocked by an audio problem.
 */
async function loadRecitation(
  surahNumber: number,
  reciterId: number,
): Promise<readonly string[]> {
  try {
    return await fetchSurahAudio(surahNumber, reciterId);
  } catch {
    return [];
  }
}

function SourceUnavailable() {
  return (
    <div
      role="alert"
      className="mt-10 rounded-lg border border-dashed border-line-strong bg-surface-sunken px-6 py-8"
    >
      <h2 className="font-display text-title text-ink">The text could not be loaded</h2>
      <p className="mt-3 leading-relaxed text-ink-muted">
        Sabeel could not reach the source for this surah, so it is showing nothing rather
        than showing something it cannot verify. Please try again shortly.
      </p>
    </div>
  );
}
