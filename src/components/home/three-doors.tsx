import { BookOpen, HelpCircle, Sprout } from 'lucide-react';
import Link from 'next/link';

/**
 * The first thing on the homepage.
 *
 * From real beginner feedback: the problem was never that Sabeel lacked content — it was
 * that a new Muslim opening it had to navigate a library while thinking "I just became
 * Muslim and I have no idea what I am supposed to do."
 *
 * So the page opens with one question instead of a menu. Three doors, no scrolling
 * required, and every one leads somewhere that already exists.
 */

const DOORS = [
  {
    icon: Sprout,
    title: 'I’m new to Islam',
    body: 'Start at the beginning. One step at a time, nothing assumed.',
    href: '/start',
    cta: 'Begin here',
    emphasis: true,
  },
  {
    icon: BookOpen,
    title: 'I know the basics',
    body: 'Go deeper — the Quran, the stories, and where the schools differ.',
    href: '/quran',
    cta: 'Read the Quran',
    emphasis: false,
  },
  {
    icon: HelpCircle,
    title: 'I’m struggling with something',
    body: 'Guilt, distance from Allah, family, doubt, keeping consistent.',
    href: '/struggling',
    cta: 'Find something for it',
    emphasis: false,
  },
] as const;

export function ThreeDoors() {
  return (
    <section aria-labelledby="doors-heading" className="mx-auto max-w-6xl px-5 sm:px-8">
      <h2
        id="doors-heading"
        className="font-display text-display font-light tracking-[-0.015em] text-ink"
      >
        How can Sabeel help you today?
      </h2>

      <ul className="mt-10 grid gap-4 md:grid-cols-3">
        {DOORS.map(({ icon: Icon, title, body, href, cta, emphasis }) => (
          <li key={title}>
            <Link
              href={href}
              className={`group flex h-full flex-col rounded-2xl border p-7 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift ${
                emphasis
                  ? 'border-emerald/45 bg-[var(--emerald-soft)]'
                  : 'border-line bg-surface-raised hover:border-line-strong'
              }`}
            >
              <Icon
                className={`size-6 ${emphasis ? 'text-emerald' : 'text-gold-ink'}`}
                aria-hidden
              />

              <h3 className="mt-5 font-display text-title font-medium tracking-[-0.01em] text-ink">
                {title}
              </h3>
              <p className="mt-3 flex-1 leading-relaxed text-ink-muted">{body}</p>

              <span
                className={`mt-6 inline-flex items-center gap-2 text-sm ${
                  emphasis ? 'text-emerald' : 'text-ink'
                }`}
              >
                {cta}
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-7 text-sm text-ink-faint">
        You are not expected to learn everything today.
      </p>
    </section>
  );
}
