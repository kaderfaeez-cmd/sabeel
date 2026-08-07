import type { Metadata } from 'next';
import { PrayerTimesPanel } from '@/features/prayer/prayer-times-panel';

export const metadata: Metadata = {
  title: 'Prayer Times',
  description:
    'Prayer times for your location, with a quiet reminder rather than an automatic Adhan. Choose your calculation method, or pick a city without sharing your location.',
};

export default function PrayerTimesPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-20">
      <p className="font-display text-xs uppercase tracking-[0.28em] text-gold-ink">Practice</p>
      <h1 className="mt-5 font-display text-display font-light tracking-[-0.015em] text-ink">
        Prayer Times
      </h1>
      <p className="mt-6 text-lede leading-relaxed text-ink-muted">
        The five daily prayers for wherever you are.
      </p>

      {/* Constitution §7 — stated up front, because for some people this is the reason
          they can use a site like this at all. */}
      <p className="mt-7 rounded-lg border-l-2 border-l-gold border-line bg-surface-raised px-5 py-4 text-sm leading-relaxed text-ink-muted">
        <span className="text-ink">Sabeel never plays the Adhan on its own.</span> Some
        people live in households where an audible reminder would create difficulty. You
        will see a quiet notice when a prayer time begins, and nothing more unless you
        turn on Adhan audio yourself in Settings.
      </p>

      <PrayerTimesPanel />
    </div>
  );
}
