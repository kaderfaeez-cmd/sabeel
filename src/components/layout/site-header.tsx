import Link from 'next/link';
import { MobileNav } from '@/components/layout/mobile-nav';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { PRIMARY_NAV } from '@/lib/navigation';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-5 sm:px-8">
        <Link href="/" className="group flex min-h-11 items-center gap-2.5">
          <span className="font-display text-2xl font-semibold tracking-tight text-ink">
            Sabeel
          </span>
          <span
            lang="ar"
            dir="rtl"
            aria-hidden
            className="text-lg text-gold transition-opacity duration-300 group-hover:opacity-100 sm:opacity-70"
          >
            سَبِيل
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden flex-1 md:block">
          <ul className="flex items-center gap-7 text-sm">
            {PRIMARY_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="relative text-ink-muted transition-colors duration-200 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-[width] after:duration-300 hover:text-ink hover:after:w-full"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2.5 md:ml-0">
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
