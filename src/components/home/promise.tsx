import { BookOpen, Layers, ShieldCheck } from 'lucide-react';

/**
 * The platform's differentiator, stated plainly. This is not marketing copy —
 * each item is a commitment the architecture enforces (see docs/CONSTITUTION.md §3).
 */
const PROMISES = [
  {
    icon: ShieldCheck,
    title: 'Nothing is invented',
    body: 'Quran text, translations and narrations are retrieved from published sources. No verse or hadith on this platform is written by a person or a machine. If something cannot be verified, we say so instead of guessing.',
  },
  {
    icon: Layers,
    title: 'You always know what you are reading',
    body: 'Revelation, authentic narration, classical commentary, history and our own educational framing each look different and are each labelled. They are never blended into one voice.',
  },
  {
    icon: BookOpen,
    title: 'Difference is respected',
    body: 'Where scholars have long differed, we say so and present the accepted positions with respect. We do not settle debates, and we point you to a qualified scholar for anything requiring a ruling.',
  },
] as const;

export function Promise() {
  return (
    <section aria-labelledby="promise-heading" className="border-b border-line bg-surface-raised">
      <div className="mx-auto max-w-6xl px-5 py-section sm:px-8">
        <div className="max-w-2xl">
          <p className="font-display text-xs uppercase tracking-[0.28em] text-gold-ink">
            Why trust this
          </p>
          <h2
            id="promise-heading"
            className="mt-5 font-display text-display font-light tracking-[-0.015em] text-ink"
          >
            Authenticity is not a feature here.
            <span className="text-ink-faint"> It is the constraint everything else is built around.</span>
          </h2>
        </div>

        <ul className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {PROMISES.map(({ icon: Icon, title, body }) => (
            <li key={title} className="group bg-surface-raised p-8 transition-colors duration-300 hover:bg-surface">
              <Icon className="size-5 text-emerald" aria-hidden />
              <h3 className="mt-6 font-display text-title font-medium text-ink">{title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
