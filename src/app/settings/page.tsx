import type { Metadata } from 'next';
import { SettingsPanel } from '@/features/settings/settings-panel';

export const metadata: Metadata = {
  title: 'Settings',
  description:
    'Choose your translation, reciter and text size, control the Adhan, and delete anything Sabeel has stored on your device.',
};

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-20">
      <p className="font-display text-xs uppercase tracking-[0.28em] text-gold-ink">Yours</p>
      <h1 className="mt-5 font-display text-display font-light tracking-[-0.015em] text-ink">
        Settings
      </h1>
      <p className="mt-6 text-lede leading-relaxed text-ink-muted">
        Everything here is stored on this device. There is no account.
      </p>

      <SettingsPanel />
    </div>
  );
}
