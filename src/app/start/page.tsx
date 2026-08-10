import type { Metadata } from 'next';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import { JOURNEY } from '@/lib/journey';

export const metadata: Metadata = {
  title: 'Your first steps',
  description:
    'Just became Muslim, or coming back? Start here. One step at a time, in an order that works, with nothing assumed.',
};

/**
 * The New Muslim path.
 *
 * The single ordered route through everything Sabeel already has. Deliberately not a
 * checklist — there is no completion state, nothing to fail, and the page says out loud
 * that it can be done slowly.
 */
export default function StartPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
      <p className="font-display text-xs uppercase tracking-[0.28em] text-gold-ink">Begin</p>
      <h1 className="mt-5 font-display text-hero font-light tracking-[-0.02em] text-ink">
        Your first steps
      </h1>

      <div className="mt-10 border-l-2 border-l-gold pl-6 sm:pl-8">
        <p className="font-display text-title font-light leading-[1.5] text-ink sm:text-[1.75rem]">
          If you have just become Muslim, you do not need to know everything. You do not
          need to have read the Quran, or memorised anything, or be able to pray perfectly
          yet. Breathe. Here is what actually helps first.
        </p>
      </div>

      <p className="mt-9 max-w-2xl leading-relaxed text-ink-muted">
        This is one route through Sabeel, in an order that tends to work. You can leave and
        come back — nothing here expires, and skipping ahead is fine if something else is
        more urgent for you right now.
      </p>

      <ol className="mt-14 space-y-4">
        {JOURNEY.map((step, index) => (
          <li key={step.id}>
            <Link
              href={step.href}
              className="group flex items-start gap-5 rounded-2xl border border-line bg-surface-raised p-6 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-paper sm:p-7"
            >
              <span
                aria-hidden
                className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full border border-line font-display text-sm text-ink-faint transition-colors group-hover:border-emerald group-hover:text-emerald"
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block font-display text-title font-medium text-ink">
                  {step.title}
                </span>
                <span className="mt-2 block leading-relaxed text-ink-muted">{step.blurb}</span>
                <span className="mt-3 inline-flex items-center gap-2 text-xs text-ink-faint">
                  <Clock className="size-3.5" aria-hidden />
                  About {step.minutes} min
                </span>
              </span>

              <span
                aria-hidden
                className="mt-1 shrink-0 text-emerald transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <section
        aria-labelledby="reassurance"
        className="mt-14 rounded-2xl border-l-2 border-l-emerald border-line bg-surface-raised p-7"
      >
        <h2 id="reassurance" className="font-display text-title font-medium text-ink">
          A few things worth hearing early
        </h2>
        <ul className="mt-5 space-y-4 leading-relaxed text-ink-muted">
          <li>
            <span className="text-ink">You will get things wrong.</span> Everyone does.
            Forgetting a prayer or getting a word wrong is not a catastrophe — you correct
            it and carry on.
          </li>
          <li>
            <span className="text-ink">Culture and religion are not the same thing.</span>{' '}
            Some of what you are told is Islam is the custom of a particular place. Asking
            what the evidence is, is a normal question.
          </li>
          <li>
            <span className="text-ink">Scholars differ, and that is not a crisis.</span> On
            many practical matters there is more than one accepted position. Sabeel shows
            you the positions rather than picking for you.
          </li>
          <li>
            <span className="text-ink">Nobody is keeping score here.</span> There are no
            streaks on this site and nothing to break.
          </li>
        </ul>
        <p className="mt-6 text-[0.65rem] uppercase tracking-[0.16em] text-ink-faint">
          Sabeel — educational summary
        </p>
      </section>

      <p className="mt-14 rounded-lg border border-line bg-surface-sunken px-6 py-5 text-sm leading-relaxed text-ink-muted">
        Sabeel is educational, and it is no substitute for knowing people. If you can, find
        a local mosque or community — most questions are answered faster by a person than
        by a website.
      </p>
    </div>
  );
}
