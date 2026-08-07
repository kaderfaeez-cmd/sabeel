import type { Metadata } from 'next';
import Link from 'next/link';
import { STORIES } from '@/data/stories';

export const metadata: Metadata = {
  title: 'Stories of the Quran',
  description:
    'The stories the Quran tells — Yusuf, Maryam, Musa, the People of the Cave and more — read in the Quran’s own words, with lessons and questions to sit with.',
};

export default function StoriesPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
      <p className="font-display text-xs uppercase tracking-[0.28em] text-gold-ink">
        Revelation
      </p>
      <h1 className="mt-5 font-display text-display font-light tracking-[-0.015em] text-ink">
        Stories of the Quran
      </h1>
      <p className="mt-6 max-w-2xl text-lede leading-relaxed text-ink-muted">
        The Quran tells these stories to be learned from rather than merely recounted.
        Each one here is read in the Quran’s own words — the passages are the story, and
        Sabeel only sets the scene between them.
      </p>

      <div className="mt-9 max-w-2xl space-y-3 rounded-xl border border-line bg-surface-raised px-6 py-5 text-sm leading-relaxed text-ink-muted">
        <p>
          <span className="text-ink">Nothing here is retold or dramatised.</span> Every
          passage is fetched from the Quran and shown with its reference and translator.
          The short notes between passages are Sabeel’s framing, and are labelled as such.
        </p>
        <p>
          There is no imagery of any Prophet on these pages, and there never will be.
        </p>
      </div>

      <ul className="mt-14 grid gap-4 sm:grid-cols-2">
        {STORIES.map((story) => (
          <li key={story.id}>
            <Link
              href={`/stories/${story.id}`}
              className="group flex h-full flex-col rounded-2xl border border-line bg-surface-raised p-7 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-lift"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-display text-title font-medium tracking-[-0.01em] text-ink">
                  {story.name}
                </h2>
                <p lang="ar" dir="rtl" className="shrink-0 text-2xl text-emerald">
                  {story.arabicName}
                </p>
              </div>

              <p className="mt-3 flex-1 leading-relaxed text-ink-muted">{story.subtitle}</p>

              <p className="mt-5 text-xs text-ink-faint">
                {story.passages.length} passages · {story.where.split('—')[0]?.trim()}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
