'use client';

import { useEffect, useState } from 'react';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';
import { performerLabel } from '@/lib/audio/providers';
import { reciterSources } from '@/lib/quran/recitations';
import { describeProvenance, TRANSLATIONS } from '@/lib/quran/translations';
import { clearAllReadingData } from '@/lib/store/reading';

const KEYS = {
  translation: 'sabeel:translation',
  reciter: 'sabeel:reciter',
  adhan: 'sabeel:adhan-audio',
  textScale: 'sabeel:text-scale',
} as const;

const TEXT_SCALES = [
  { value: '1', label: 'Normal' },
  { value: '1.15', label: 'Large' },
  { value: '1.3', label: 'Larger' },
] as const;

export function SettingsPanel() {
  const [translation, setTranslation] = useLocalStorage(KEYS.translation, '20');
  const [reciter, setReciter] = useLocalStorage(KEYS.reciter, '7');
  const [adhanRaw, setAdhanRaw] = useLocalStorage(KEYS.adhan, 'off');
  const [textScale, setTextScale] = useLocalStorage(KEYS.textScale, '1');
  const [cleared, setCleared] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const adhan = adhanRaw === 'on';

  // Applying the scale is a DOM side effect of the stored value, not state mirroring.
  useEffect(() => {
    document.documentElement.style.setProperty('--text-scale', textScale);
  }, [textScale]);

  async function clearData() {
    try {
      await clearAllReadingData();
      setCleared(true);
      setConfirming(false);
    } catch {
      setCleared(false);
    }
  }

  const selectedTranslation = TRANSLATIONS.find((t) => String(t.id) === translation);

  return (
    <div className="mt-12 space-y-10">
      <Group title="Reading">
        <Field label="Translation" htmlFor="translation">
          <select
            id="translation"
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            className="min-h-11 w-full rounded-lg border border-line bg-surface-raised px-4 py-2.5 text-ink focus:border-emerald focus:outline-none"
          >
            {TRANSLATIONS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          {selectedTranslation && (
            <p className="mt-2 text-xs text-ink-faint">
              {describeProvenance(selectedTranslation)}
            </p>
          )}
        </Field>

        <Field label="Text size" htmlFor="text-scale">
          <div className="flex flex-wrap gap-2">
            {TEXT_SCALES.map((scale) => (
              <button
                key={scale.value}
                type="button"
                onClick={() => setTextScale(scale.value)}
                aria-pressed={textScale === scale.value}
                className={`min-h-11 rounded-full border px-5 py-2.5 text-sm transition-colors ${
                  textScale === scale.value
                    ? 'border-emerald text-emerald'
                    : 'border-line text-ink-muted hover:border-line-strong'
                }`}
              >
                {scale.label}
              </button>
            ))}
          </div>
        </Field>
      </Group>

      <Group title="Recitation">
        <Field label="Reciter" htmlFor="reciter">
          <select
            id="reciter"
            value={reciter}
            onChange={(e) => setReciter(e.target.value)}
            className="min-h-11 w-full rounded-lg border border-line bg-surface-raised px-4 py-2.5 text-ink focus:border-emerald focus:outline-none"
          >
            {reciterSources().map((source) => (
              <option key={source.id} value={source.id}>
                {performerLabel(source)}
              </option>
            ))}
          </select>
        </Field>
      </Group>

      <Group title="Reminders">
        <div className="rounded-xl border border-line bg-surface-raised p-6">
          <label className="flex cursor-pointer items-start gap-4">
            <input
              type="checkbox"
              checked={adhan}
              onChange={(e) => setAdhanRaw(e.target.checked ? 'on' : 'off')}
              className="mt-1 size-5 shrink-0 accent-[var(--emerald)]"
            />
            <span>
              <span className="block font-display text-lg text-ink">Play the Adhan</span>
              <span className="mt-2 block text-sm leading-relaxed text-ink-muted">
                Off by default, and it will stay off unless you turn it on here. Some
                people live in households where an audible reminder creates difficulty, so
                Sabeel shows a quiet notice instead.
              </span>
              <span className="mt-2 block text-xs text-ink-faint">
                Audio files are not yet included, so this setting is recorded but has no
                effect until they are added.
              </span>
            </span>
          </label>
        </div>
      </Group>

      <Group title="Your data">
        <div className="rounded-xl border border-line bg-surface-raised p-6">
          <p className="leading-relaxed text-ink-muted">
            Bookmarks, notes and reading position are stored on this device only. There is
            no account, and none of it is sent anywhere.
          </p>

          {!confirming && !cleared && (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="mt-5 min-h-11 rounded-full border border-line-strong px-5 py-2.5 text-sm text-ink transition-colors hover:border-line-strong hover:text-ink"
            >
              Delete everything stored on this device
            </button>
          )}

          {confirming && (
            <div className="mt-5 rounded-lg border border-dashed border-line-strong bg-surface-sunken p-5">
              <p className="text-sm leading-relaxed text-ink">
                This permanently deletes your bookmarks, notes and reading position from
                this device. It cannot be undone.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => void clearData()}
                  className="min-h-11 rounded-full bg-emerald px-5 py-2.5 text-sm text-surface"
                >
                  Yes, delete it
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="min-h-11 rounded-full border border-line px-5 py-2.5 text-sm text-ink-muted"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {cleared && (
            <p role="status" className="mt-5 text-sm text-emerald">
              Everything stored on this device has been deleted.
            </p>
          )}
        </div>
      </Group>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`g-${title}`}>
      <h2
        id={`g-${title}`}
        className="font-display text-xs uppercase tracking-[0.2em] text-gold-ink"
      >
        {title}
      </h2>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface-raised p-6">
      <label htmlFor={htmlFor} className="block font-display text-lg text-ink">
        {label}
      </label>
      <div className="mt-4">{children}</div>
    </div>
  );
}

