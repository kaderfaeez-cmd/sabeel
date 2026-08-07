import type { Metadata } from 'next';
import { ProgressPanel } from '@/features/progress/progress-panel';

export const metadata: Metadata = {
  title: 'Progress',
  description:
    'What you have read so far. No streaks, no targets, and nothing to keep up with.',
};

export default function ProgressPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-20">
      <p className="font-display text-xs uppercase tracking-[0.28em] text-gold-ink">Yours</p>
      <h1 className="mt-5 font-display text-display font-light tracking-[-0.015em] text-ink">
        Progress
      </h1>
      <p className="mt-6 text-lede leading-relaxed text-ink-muted">
        What you have read so far. There are no streaks here and nothing to break.
      </p>

      <ProgressPanel />
    </div>
  );
}
