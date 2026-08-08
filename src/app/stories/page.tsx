import type { Metadata } from 'next';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import { activeThemes, STORIES, storiesWithTheme, THEME_LABEL } from '@/data/stories';

export const metadata: Metadata = {
  title: 'Stories of the Quran',
  description:
    'Start with the story, then read what Allah says about it. Musa, Yusuf, Maryam and more — written for someone who has never studied Islam.',
};

export default function StoriesPage() {
  const featured = STORIES[0]!;
  const rest = STORIES.slice(1);
  const themes = activeThemes();

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
      <p className="font-display text-xs uppercase tracking-[0.28em] text-gold-ink">
        Stories of the Quran
      </p>
      <h1 className="mt-5 max-w-3xl font-display text-hero font-light tracking-[-0.02em] text-ink">
        Start with the story.
      </h1>
      <p className="mt-7 max-w-2xl text-lede leading-relaxed text-ink-muted">
        Every story here begins with the situation — something you can picture and feel —
        before a single verse appears. Then you read what Allah says about it, and then a
        plain explanation of what it means. No prior knowledge is assumed anywhere.
      </p>

      {/* Featured: the hook does the selling, not the title. */}
      <Link
        href={`/stories/${featured.id}`}
        className="group mt-14 block rounded-3xl border border-line bg-surface-raised p-8 transition-[border-color,box-shadow] duration-300 hover:border-line-strong hover:shadow-lift sm:p-12"
      >
        <p className="font-display text-xs uppercase tracking-[0.2em] text-gold-ink">
          Start here
        </p>

        <p className="mt-6 max-w-2xl font-display text-title font-light leading-[1.5] text-ink sm:text-[1.75rem]">
          {featured.hook}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <span className="font-display text-2xl text-ink">{featured.name}</span>
          <span lang="ar" dir="rtl" className="text-2xl text-emerald">
            {featured.arabicName}
          </span>
          <span className="inline-flex items-center gap-2 text-sm text-ink-faint">
            <Clock className="size-4" aria-hidden />
            About {featured.readingMinutes} min
          </span>
          <span
            aria-hidden
            className="ml-auto text-emerald transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </div>
      </Link>

      {/* Emotional entry point — meet the reader where they actually are. */}
      <section aria-labelledby="themes" className="mt-16">
        <h2 id="themes" className="font-display text-title font-medium text-ink">
          Where are you right now?
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
          The Quran speaks to specific situations. If something below matches what you are
          carrying, start there.
        </p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {themes.map((theme) => {
            const first = storiesWithTheme(theme)[0];
            if (!first) return null;
            return (
              <li key={theme}>
                <Link
                  href={`/stories/${first.id}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-line px-5 py-2.5 text-sm text-ink-muted transition-colors hover:border-emerald hover:text-emerald"
                >
                  {THEME_LABEL[theme]}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="all" className="mt-16">
        <h2 id="all" className="font-display text-title font-medium text-ink">
          All stories
        </h2>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {rest.map((story) => (
            <li key={story.id}>
              <Link
                href={`/stories/${story.id}`}
                className="group flex h-full flex-col rounded-2xl border border-line bg-surface-raised p-7 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-lift"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-title font-medium tracking-[-0.01em] text-ink">
                    {story.name}
                  </h3>
                  <p lang="ar" dir="rtl" className="shrink-0 text-2xl text-emerald">
                    {story.arabicName}
                  </p>
                </div>

                <p className="mt-3 flex-1 leading-relaxed text-ink-muted">{story.subtitle}</p>

                <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-faint">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5" aria-hidden />
                    {story.readingMinutes} min
                  </span>
                  <span>
                    {story.difficulty === 'gentle'
                      ? 'No prior knowledge needed'
                      : 'Builds on the basics'}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-16 max-w-2xl space-y-3 rounded-2xl border border-line bg-surface-sunken px-7 py-6 text-sm leading-relaxed text-ink-muted">
        <p>
          <span className="text-ink">Nothing here is retold or dramatised.</span> Every
          passage is fetched from the Quran and shown with its reference and translator.
          The writing between passages is Sabeel’s, and is labelled wherever it appears.
        </p>
        <p>There is no imagery of any Prophet on these pages, and there never will be.</p>
      </div>
    </div>
  );
}
