import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SECTION_GROUPS, type SectionStatus } from '@/lib/navigation';

const STATUS_LABEL: Record<SectionStatus, string> = {
  live: 'Available',
  building: 'In build',
  planned: 'Planned',
};

const STATUS_STYLE: Record<SectionStatus, string> = {
  live: 'border-emerald/40 text-emerald',
  building: 'border-gold/50 text-gold-ink',
  planned: 'border-line-strong text-ink-faint',
};

export function SectionDirectory() {
  return (
    <section aria-labelledby="directory-heading" className="mx-auto max-w-6xl px-5 py-section sm:px-8">
      <div className="max-w-2xl">
        <p className="font-display text-xs uppercase tracking-[0.28em] text-gold-ink">The platform</p>
        <h2
          id="directory-heading"
          className="mt-5 font-display text-display font-light tracking-[-0.015em] text-ink"
        >
          Everything being built, and where it stands.
        </h2>
        <p className="mt-6 text-lede leading-relaxed text-ink-muted">
          Sabeel is built in phases, and each one is finished properly before the next begins.
          Sections are labelled honestly — you will never open an empty page dressed up as a
          finished one.
        </p>
      </div>

      <div className="mt-16 space-y-14">
        {SECTION_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="flex items-center gap-5">
              <h3 className="font-display text-xs uppercase tracking-[0.24em] text-ink-faint">
                {group.label}
              </h3>
              <span className="h-px flex-1 bg-line" aria-hidden />
            </div>

            <ul className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.sections.map((section) => (
                <li key={section.href}>
                  <Link
                    href={section.href}
                    className="group flex h-full flex-col rounded-xl border border-line bg-surface-raised p-6 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-lift"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="font-display text-xl font-medium text-ink">
                        {section.title}
                      </h4>
                      <span
                        className={cn(
                          'shrink-0 rounded-full border px-2.5 py-0.5 text-[0.65rem] uppercase tracking-wider',
                          STATUS_STYLE[section.status],
                        )}
                      >
                        {STATUS_LABEL[section.status]}
                      </span>
                    </div>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
                      {section.blurb}
                    </p>
                    <span className="mt-5 text-xs text-ink-faint">Phase {section.phase}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
