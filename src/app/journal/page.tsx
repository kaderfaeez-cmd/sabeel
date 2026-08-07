import type { Metadata } from 'next';
import { JournalPanel } from '@/features/journal/journal-panel';

export const metadata: Metadata = {
  title: 'Journal',
  description:
    'Your reflections on what you have read, gathered in one place and stored only on your own device.',
};

export default function JournalPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-20">
      <p className="font-display text-xs uppercase tracking-[0.28em] text-gold-ink">Yours</p>
      <h1 className="mt-5 font-display text-display font-light tracking-[-0.015em] text-ink">
        Journal
      </h1>
      <p className="mt-6 text-lede leading-relaxed text-ink-muted">
        Anything you write beside an ayah gathers here. It stays on this device, and there
        is no account to make.
      </p>

      <JournalPanel />
    </div>
  );
}
