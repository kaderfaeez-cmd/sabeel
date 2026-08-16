'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { SECTION_GROUPS } from '@/lib/navigation';

/**
 * Mobile navigation disclosure.
 *
 * The desktop header hides its nav below `md`, so this is the only way to move
 * around the platform on a phone — and the platform is mobile-first. It exposes
 * every section rather than a truncated subset.
 */
export function MobileNav() {
  const panelId = useId();
  const pathname = usePathname();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  /**
   * The panel is stored as *the route it was opened on*, so a navigation closes it by
   * derivation rather than by an effect firing after the new page has already painted.
   */
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const setOpen = (next: boolean) => setOpenedOn(next ? pathname : null);

  /**
   * The panel is portalled to <body>.
   *
   * The header carries `backdrop-blur`, and a backdrop-filter creates a containing block
   * for `position: fixed` descendants — so an in-place `fixed inset-0` panel sized itself
   * to the 64px header instead of the viewport, leaving the menu invisible on every
   * phone. A portal puts it outside any ancestor that could constrain it.
   *
   * No mounted flag is needed: the panel only ever renders after a click, so this never
   * runs during the server render.
   */
  const canPortal = typeof document !== 'undefined';

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      // Closing is unconditional here, so we can call the setter directly and keep
      // this effect's dependencies to the one thing it actually reacts to.
      if (event.key === 'Escape') setOpenedOn(null);
    }

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        aria-expanded={open}
        aria-controls={panelId}
        className="grid size-11 place-items-center rounded-full border border-line text-ink-muted transition-colors duration-200 hover:border-line-strong hover:text-ink"
      >
        <Menu className="size-5" aria-hidden />
      </button>

      {open &&
        canPortal &&
        createPortal(
          <div
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="fixed inset-0 z-[100] h-dvh w-screen overflow-y-auto bg-surface"
          >
          <div className="flex h-16 items-center justify-between border-b border-line px-5">
            <span className="font-display text-2xl font-semibold text-ink">Sabeel</span>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
              className="grid size-11 place-items-center rounded-full border border-line text-ink-muted"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>

          <nav aria-label="All sections" className="px-5 pb-16 pt-8">
            {SECTION_GROUPS.map((group) => (
              <div key={group.label} className="mb-9">
                <h2 className="font-display text-xs uppercase tracking-[0.24em] text-gold-ink">
                  {group.label}
                </h2>
                <ul className="mt-3.5 space-y-1">
                  {group.sections.map((section) => (
                    <li key={section.href}>
                      <Link
                        href={section.href}
                        className="flex min-h-11 items-center font-display text-xl text-ink transition-colors duration-200 hover:text-emerald"
                      >
                        {section.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          </div>,
          document.body,
        )}
    </div>
  );
}
