'use client';

import { usePathname } from 'next/navigation';

/**
 * Sabeel's permanent backdrop.
 *
 * Present on every page, never replaced by a page-specific hero. The whole interface
 * floats above it.
 *
 * The hard constraint this is built around: **readability wins.** The contrast of every
 * text token was measured and is asserted by tests, and a background image is the
 * easiest way to destroy that. So the artwork never touches the text directly — it sits
 * beneath a scrim, and every content surface stays near-opaque. The plates are already
 * low-contrast and were generated with large empty areas for exactly this reason.
 *
 * Layers, back to front:
 *   1. flat theme colour        — the guaranteed contrast floor
 *   2. atmospheric artwork      — the OpenArt plate, dimmed
 *   3. scrim gradient           — pins contrast where content actually sits
 *   4. geometric pattern        — the eight-point khatam, barely visible
 *   5. vignette                 — gentle lighting, draws the eye inward
 *   6. drifting particles       — CSS only, no JS, disabled for reduced motion
 */

/** Each section gets its own plate so the app feels varied without losing identity. */
const PLATES = {
  dunes: 'dunes',
  mountains: 'mountains',
  courtyard: 'courtyard',
} as const;

type Plate = (typeof PLATES)[keyof typeof PLATES];

function plateForPath(pathname: string): Plate {
  if (pathname.startsWith('/quran')) return PLATES.mountains;
  if (pathname.startsWith('/stories')) return PLATES.dunes;
  if (
    pathname.startsWith('/salah') ||
    pathname.startsWith('/wudhu') ||
    pathname.startsWith('/ghusl') ||
    pathname.startsWith('/prayer-times')
  ) {
    return PLATES.courtyard;
  }
  if (pathname.startsWith('/duas') || pathname.startsWith('/names')) return PLATES.mountains;
  return PLATES.dunes;
}

export function SiteBackground() {
  const pathname = usePathname();
  const plate = plateForPath(pathname);

  return (
    <div className="site-bg" aria-hidden>
      {/* 2 — the artwork. Two <picture> elements, cross-faded by theme. */}
      <div className="site-bg__art site-bg__art--dawn">
        <picture>
          <source
            media="(max-width: 720px)"
            srcSet={`/backgrounds/${plate}-dawn-sm.avif`}
            type="image/avif"
          />
          <source srcSet={`/backgrounds/${plate}-dawn.avif`} type="image/avif" />
          <source
            media="(max-width: 720px)"
            srcSet={`/backgrounds/${plate}-dawn-sm.webp`}
            type="image/webp"
          />
          <img src={`/backgrounds/${plate}-dawn.webp`} alt="" decoding="async" />
        </picture>
      </div>

      <div className="site-bg__art site-bg__art--night">
        <picture>
          <source
            media="(max-width: 720px)"
            srcSet={`/backgrounds/${plate}-night-sm.avif`}
            type="image/avif"
          />
          <source srcSet={`/backgrounds/${plate}-night.avif`} type="image/avif" />
          <source
            media="(max-width: 720px)"
            srcSet={`/backgrounds/${plate}-night-sm.webp`}
            type="image/webp"
          />
          <img src={`/backgrounds/${plate}-night.webp`} alt="" decoding="async" />
        </picture>
      </div>

      {/* 3 — scrim. Does the actual work of protecting contrast. */}
      <div className="site-bg__scrim" />

      {/* 4 — geometric pattern, and 5 — vignette. */}
      <div className="site-bg__pattern ornament-field" />
      <div className="site-bg__vignette" />

      {/* 6 — drifting dust. Pure CSS, removed entirely under reduced motion. */}
      <div className="site-bg__dust" />
    </div>
  );
}
