'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { TRANSLATIONS } from '@/lib/quran/translations';

/**
 * Translation and transliteration controls.
 *
 * Both live in the URL rather than in component state, so a reading position is always
 * shareable and the server can render the chosen translation directly
 * (ARCHITECTURE.md, "State" — URL state).
 */
export function ReadingControls({
  translationId,
  showTransliteration,
}: {
  translationId: number;
  showTransliteration: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function update(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams);
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    startTransition(() => {
      router.replace(`${pathname}?${params}`, { scroll: false });
    });
  }

  return (
    <div
      className="flex flex-wrap items-center gap-x-6 gap-y-4"
      data-pending={isPending ? '' : undefined}
    >
      <div className="flex items-center gap-3">
        <label htmlFor="translation" className="text-sm text-ink-muted">
          Translation
        </label>
        <select
          id="translation"
          value={translationId}
          onChange={(event) => update('t', event.target.value)}
          className="rounded-full border border-line bg-surface-raised px-4 py-2 text-sm text-ink focus:border-emerald focus:outline-none"
        >
          {TRANSLATIONS.map((translation) => (
            <option key={translation.id} value={translation.id}>
              {translation.name}
            </option>
          ))}
        </select>
      </div>

      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-muted">
        <input
          type="checkbox"
          checked={showTransliteration}
          onChange={(event) => update('tl', event.target.checked ? '1' : null)}
          className="size-4 accent-[var(--emerald)]"
        />
        Show transliteration
      </label>
    </div>
  );
}
