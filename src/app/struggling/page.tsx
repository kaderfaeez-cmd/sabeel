import type { Metadata } from 'next';
import Link from 'next/link';
import { STRUGGLES } from '@/data/struggles';

export const metadata: Metadata = {
  title: 'I’m struggling with…',
  description:
    'Feeling distant from Allah, guilt about the past, family who do not understand, doubts, or trouble staying consistent — what the Quran says, and one small thing to do.',
};

export default function StrugglingPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
      <p className="font-display text-xs uppercase tracking-[0.28em] text-gold-ink">
        You are not the first
      </p>
      <h1 className="mt-5 font-display text-hero font-light tracking-[-0.02em] text-ink">
        I’m struggling with…
      </h1>

      <p className="mt-8 max-w-2xl text-lede leading-relaxed text-ink-muted">
        Most people do not come to a site like this during a study session. They come at a
        particular moment, carrying something specific. Pick whichever of these is closest.
      </p>

      <ul className="mt-12 space-y-4">
        {STRUGGLES.map((struggle) => (
          <li key={struggle.id}>
            <Link
              href={`/struggling/${struggle.id}`}
              className="group flex items-center gap-5 rounded-2xl border border-line bg-surface-raised p-6 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-paper sm:p-7"
            >
              <span className="min-w-0 flex-1">
                <span className="block font-display text-title font-medium text-ink">
                  {struggle.title}
                </span>
                <span className="mt-2 block leading-relaxed text-ink-muted">
                  {struggle.summary}
                </span>
              </span>
              <span
                aria-hidden
                className="shrink-0 text-emerald transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-14 rounded-lg border border-line bg-surface-sunken px-6 py-5 text-sm leading-relaxed text-ink-muted">
        Sabeel is educational, and it is not counselling or medical advice. If something
        here is affecting your health or your safety, please speak to a doctor or a mental
        health professional as well. Seeking that help is not a failure of faith.
      </p>
    </div>
  );
}
