import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ContentBlock } from '@/components/content/content-block';
import { getStory, STORIES, type StoryPassage } from '@/data/stories';
import type { QuranBlock } from '@/lib/content/types';
import { fetchSurahVerses } from '@/lib/quran/api';
import { getSurah } from '@/lib/quran/surahs';
import { DEFAULT_TRANSLATION_ID, getTranslation } from '@/lib/quran/translations';

interface PageProps {
  params: Promise<{ story: string }>;
}

export function generateStaticParams() {
  return STORIES.map((story) => ({ story: story.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { story: id } = await params;
  const story = getStory(id);
  if (!story) return { title: 'Story not found' };

  return {
    title: story.name,
    description: `${story.subtitle} — read in the Quran’s own words, with the passages, lessons and questions to sit with.`,
  };
}

export default async function StoryPage({ params }: PageProps) {
  const { story: id } = await params;
  const story = getStory(id);
  if (!story) notFound();

  const translation = getTranslation(DEFAULT_TRANSLATION_ID);

  // Resolved at page level, and each passage independently — one unreachable surah must
  // not empty the whole story.
  const passages = await Promise.all(
    story.passages.map((passage) => loadPassage(passage, DEFAULT_TRANSLATION_ID)),
  );

  const index = STORIES.findIndex((s) => s.id === story.id);
  const next = STORIES[index + 1];

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <Link href="/stories" className="text-sm text-ink-muted hover:text-ink">
        ← All stories
      </Link>

      <header className="mt-8 border-b border-line pb-9">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h1 className="font-display text-display font-light tracking-[-0.015em] text-ink">
            {story.name}
          </h1>
          <p lang="ar" dir="rtl" className="text-4xl text-emerald">
            {story.arabicName}
          </p>
        </div>

        <p className="mt-3 text-lede text-ink-muted">{story.subtitle}</p>
        <p className="mt-5 text-sm text-ink-faint">{story.where}</p>

        <div className="mt-7 rounded-lg border-l-2 border-l-emerald bg-surface-raised px-5 py-4">
          <p className="leading-relaxed text-ink-muted">{story.opening}</p>
          <p className="mt-3 text-[0.65rem] uppercase tracking-[0.16em] text-ink-faint">
            Sabeel — educational summary
          </p>
        </div>

        {translation && (
          <p className="mt-5 text-sm text-ink-faint">
            Passages below are from the Quran, translated by {translation.translator}.
          </p>
        )}
      </header>

      <div className="mt-12 space-y-12">
        {story.passages.map((passage, i) => (
          <section key={passage.id} id={passage.id} aria-labelledby={`${passage.id}-h`} className="scroll-mt-24">
            <p className="font-display text-xs uppercase tracking-[0.2em] text-gold-ink">
              {String(i + 1).padStart(2, '0')} ·{' '}
              {getSurah(passage.surah)?.name} {passage.surah}:{passage.ayahFrom}
              {passage.ayahTo !== passage.ayahFrom && `–${passage.ayahTo}`}
            </p>

            <h2
              id={`${passage.id}-h`}
              className="mt-3 font-display text-title font-medium tracking-[-0.01em] text-ink"
            >
              {passage.heading}
            </h2>

            {/* Sabeel's framing, clearly separated from the revelation below it. */}
            <p className="mt-3 leading-relaxed text-ink-muted">{passage.context}</p>

            <div className="mt-6 space-y-4">
              {passages[i] === null ? (
                <p
                  role="alert"
                  className="rounded-lg border border-dashed border-line-strong bg-surface-sunken px-5 py-4 text-sm text-ink-muted"
                >
                  These verses could not be loaded from the Quran source just now. Sabeel
                  is showing nothing rather than something it cannot verify — please try
                  again shortly.
                </p>
              ) : (
                passages[i]!.map((block) => <ContentBlock key={block.id} block={block} />)
              )}
            </div>
          </section>
        ))}
      </div>

      <section aria-labelledby="lessons" className="mt-16">
        <h2 id="lessons" className="font-display text-title font-medium tracking-[-0.01em] text-ink">
          What this story teaches
        </h2>
        <ul className="mt-6 space-y-4">
          {story.lessons.map((lesson) => (
            <li
              key={lesson}
              className="rounded-xl border-l-2 border-l-gold border-line bg-surface-raised px-6 py-5 leading-relaxed text-ink-muted"
            >
              {lesson}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[0.65rem] uppercase tracking-[0.16em] text-ink-faint">
          Sabeel — educational summary
        </p>
      </section>

      <section aria-labelledby="reflect" className="mt-14">
        <h2 id="reflect" className="font-display text-title font-medium tracking-[-0.01em] text-ink">
          Questions to sit with
        </h2>
        <ul className="mt-6 space-y-3">
          {story.reflections.map((question) => (
            <li key={question} className="text-lede leading-relaxed text-ink">
              {question}
            </li>
          ))}
        </ul>
      </section>

      <nav aria-label="Story navigation" className="mt-16 flex flex-wrap justify-between gap-4">
        <Link
          href="/stories"
          className="min-h-11 rounded-full border border-line px-5 py-2.5 text-sm text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
        >
          ← All stories
        </Link>
        {next && (
          <Link
            href={`/stories/${next.id}`}
            className="min-h-11 rounded-full border border-line px-5 py-2.5 text-sm text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
          >
            {next.name} →
          </Link>
        )}
      </nav>
    </div>
  );
}

/** `null` means the source could not be reached — never an empty passage rendered silently. */
async function loadPassage(
  passage: StoryPassage,
  translationId: number,
): Promise<readonly QuranBlock[] | null> {
  try {
    const verses = await fetchSurahVerses(passage.surah, translationId);
    const selected = verses.filter(
      (block) =>
        block.source.ayahFrom >= passage.ayahFrom && block.source.ayahFrom <= passage.ayahTo,
    );
    return selected.length > 0 ? selected : null;
  } catch {
    return null;
  }
}
