import { Clock } from 'lucide-react';
import Link from 'next/link';
import { nextStep } from '@/lib/journey';

/**
 * "What do I do now?"
 *
 * The single most common question a beginner has, and the one a library of pages answers
 * worst. Every lesson ends by answering it explicitly rather than returning the reader to
 * a menu.
 *
 * Deliberately warm and never demanding: it says what comes next, not what is overdue.
 */
export function NextStep({ stepId }: { stepId: string }) {
  const next = nextStep(stepId);

  if (!next) {
    return (
      <section
        aria-labelledby="next-step"
        className="mt-14 rounded-2xl border border-line bg-surface-raised p-7"
      >
        <h2 id="next-step" className="font-display text-xs uppercase tracking-[0.2em] text-gold-ink">
          You have reached the end of the path
        </h2>
        <p className="mt-4 text-lede leading-relaxed text-ink-muted">
          That is the whole suggested journey. There is no finish line here — most of this
          is worth returning to, and it reads differently the second time.
        </p>
        <Link
          href="/stories"
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-sm text-ink transition-colors hover:border-emerald hover:text-emerald"
        >
          Read the stories again
          <span aria-hidden>→</span>
        </Link>
      </section>
    );
  }

  return (
    <section aria-labelledby="next-step" className="mt-14">
      <h2 id="next-step" className="font-display text-xs uppercase tracking-[0.2em] text-gold-ink">
        Your next step
      </h2>

      <Link
        href={next.href}
        className="group mt-4 flex items-center gap-5 rounded-2xl border border-emerald/40 bg-[var(--emerald-soft)] p-7 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-lift"
      >
        <span className="min-w-0 flex-1">
          <span className="block font-display text-title text-ink">{next.title}</span>
          <span className="mt-2 block leading-relaxed text-ink-muted">{next.blurb}</span>
          <span className="mt-3 inline-flex items-center gap-2 text-sm text-ink-faint">
            <Clock className="size-4" aria-hidden />
            About {next.minutes} min
          </span>
        </span>
        <span
          aria-hidden
          className="shrink-0 text-2xl text-emerald transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      </Link>

      <p className="mt-4 text-sm text-ink-faint">
        You are not expected to learn everything today.
      </p>
    </section>
  );
}
