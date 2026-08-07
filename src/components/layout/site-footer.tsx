import Link from 'next/link';
import { SECTION_GROUPS } from '@/lib/navigation';

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface-sunken">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {SECTION_GROUPS.map((group) => (
            <div key={group.label}>
              <h2 className="font-display text-xs uppercase tracking-[0.22em] text-gold-ink">
                {group.label}
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {group.sections.map((section) => (
                  <li key={section.href}>
                    <Link
                      href={section.href}
                      className="text-ink-muted transition-colors duration-200 hover:text-ink"
                    >
                      {section.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-line pt-8">
          <p className="max-w-2xl text-sm leading-relaxed text-ink-muted">
            Sabeel is an educational platform. It does not replace scholars and it does not
            issue rulings. For matters requiring a ruling, please consult a qualified scholar.
          </p>
          <p className="mt-4 text-sm text-ink-faint">
            Quran text and translations are retrieved from published sources and shown with
            attribution. Hadith are shown with their collection, number and grading so that
            every citation can be checked independently.
          </p>
        </div>
      </div>
    </footer>
  );
}
