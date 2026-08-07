import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Where to start',
  description:
    'A calm, ordered path for anyone new to Islam or returning to it. No prior knowledge assumed, nothing rushed, and nothing you have to prove to anyone.',
};

/**
 * The Beginner Roadmap.
 *
 * Constitution §1: never make someone feel judged or overwhelmed. So this page orders
 * things by what actually helps first, tells the reader plainly that they do not have to
 * do it all at once, and only links to sections that exist. It makes no claim about
 * Islam that is not either linked to evidence elsewhere or plainly our own framing (§3.2).
 */

interface Step {
  readonly n: string;
  readonly title: string;
  readonly body: string;
  readonly href?: string;
  readonly cta?: string;
}

const FIRST_WEEK: readonly Step[] = [
  {
    n: '01',
    title: 'Nobody expects you to know everything',
    body:
      'You are not behind. People who were born into Muslim families are still learning. Take one thing at a time, and let the rest wait — it will still be there.',
  },
  {
    n: '02',
    title: 'Learn to wash for prayer',
    body:
      'Wudhu comes before prayer, and it takes about a minute once you know it. Learning this first removes the main obstacle to praying at all.',
    href: '/wudhu',
    cta: 'Learn Wudhu',
  },
  {
    n: '03',
    title: 'Learn the prayer, position by position',
    body:
      'Not all at once. Learn the shape of it first, then the words, then what the words mean. Most people are praying imperfectly long before they are praying perfectly, and that is fine.',
    href: '/salah',
    cta: 'Learn Salah',
  },
  {
    n: '04',
    title: 'Find out when to pray',
    body:
      'Five times a day, set by the sun rather than the clock, so they move through the year. Sabeel will never play the Adhan at you — just a quiet notice.',
    href: '/prayer-times',
    cta: 'Prayer Times',
  },
  {
    n: '05',
    title: 'Start reading the Quran',
    body:
      'You do not need Arabic to begin. Start with the short surahs at the end, or with Al-Fatihah, which you already say in every prayer.',
    href: '/quran',
    cta: 'Read the Quran',
  },
  {
    n: '06',
    title: 'Learn a few duas',
    body:
      'Dua is just asking. You can do it in your own language, in your own words, at any time. These are simply the ones that were taught.',
    href: '/duas',
    cta: 'Dua Library',
  },
];

const HONEST_NOTES: readonly { title: string; body: string }[] = [
  {
    title: 'You will get things wrong',
    body:
      'Everyone does. Getting a word wrong in the prayer does not invalidate it, and forgetting entirely is not a catastrophe — you make it up and carry on.',
  },
  {
    title: 'Culture and religion are not the same thing',
    body:
      'Some of what you will be told is Islam is actually the custom of a particular place. Ask what the evidence is. That is a normal question, not a rude one.',
  },
  {
    title: 'Scholars differ, and that is not a crisis',
    body:
      'On many practical matters there is more than one accepted position. Where that is true, Sabeel says so and shows you the positions rather than picking for you.',
  },
  {
    title: 'Go at your own pace',
    body:
      'Islam was revealed over twenty-three years. There is no prize for learning it in a fortnight, and no penalty for taking longer.',
  },
];

export default function RoadmapPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
      <p className="font-display text-xs uppercase tracking-[0.28em] text-gold-ink">Begin</p>
      <h1 className="mt-5 font-display text-display font-light tracking-[-0.015em] text-ink">
        Where to start
      </h1>
      <p className="mt-6 text-lede leading-relaxed text-ink-muted">
        Whether this is your first week or you are finding your way back after years away,
        this is an order that tends to work. It is a suggestion, not a syllabus.
      </p>

      <ol className="mt-14 space-y-5">
        {FIRST_WEEK.map((step) => (
          <li
            key={step.n}
            className="rounded-2xl border border-line bg-surface-raised p-6 sm:p-8"
          >
            <div className="flex items-baseline gap-4">
              <span aria-hidden className="font-display text-sm text-ink-faint">
                {step.n}
              </span>
              <h2 className="font-display text-title font-medium tracking-[-0.01em] text-ink">
                {step.title}
              </h2>
            </div>
            <p className="mt-4 leading-relaxed text-ink-muted">{step.body}</p>
            {step.href && (
              <Link
                href={step.href}
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-sm text-ink transition-colors hover:border-emerald hover:text-emerald"
              >
                {step.cta}
                <span aria-hidden>→</span>
              </Link>
            )}
          </li>
        ))}
      </ol>

      <section aria-labelledby="honest" className="mt-16">
        <h2
          id="honest"
          className="font-display text-title font-medium tracking-[-0.01em] text-ink"
        >
          Things worth knowing early
        </h2>
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {HONEST_NOTES.map((note) => (
            <div key={note.title} className="rounded-xl border border-line bg-surface-raised p-6">
              <h3 className="font-display text-lg text-ink">{note.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{note.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-[0.65rem] uppercase tracking-[0.16em] text-ink-faint">
          Sabeel — educational summary
        </p>
      </section>

      <p className="mt-14 rounded-lg border border-line bg-surface-sunken px-6 py-5 text-sm leading-relaxed text-ink-muted">
        Sabeel is an educational platform, not a fatwa service, and it is no substitute for
        knowing people. If you can, find a local mosque or community — most questions are
        answered faster by a person than by a website.
      </p>
    </div>
  );
}
