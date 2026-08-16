'use client';

import { Pause, Play, Repeat, SkipBack, SkipForward, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';

/**
 * Recitation player with continuous playback.
 *
 * The audible gap between ayahs was not the recitation — it was the network. Each ayah is
 * a separate MP3, and the original player only began fetching the next one *after* the
 * current one ended, so every verse boundary cost a round trip.
 *
 * The fix is two audio elements ping-ponging: while one plays, the next ayah is already
 * loading into the other, so the handover is a `play()` on an element that is already
 * buffered. Combined with a small pre-roll this removes the pause almost entirely.
 *
 * A deliberate gap is still offered, because it is genuinely useful when learning — the
 * teaching recitations exist for exactly that. It is off by default.
 */

const GAP_KEY = 'sabeel:recitation-gap';

const GAPS = [
  { value: '0', label: 'Continuous', hint: 'No pause between verses' },
  { value: '1500', label: 'Short pause', hint: '1.5 seconds to repeat' },
  { value: '3000', label: 'Long pause', hint: '3 seconds to repeat' },
] as const;

export function RecitationPlayer({
  audioUrls,
  reciterName,
}: {
  audioUrls: readonly string[];
  reciterName: string;
}) {
  const primary = useRef<HTMLAudioElement>(null);
  const secondary = useRef<HTMLAudioElement>(null);
  /** Which element is currently the one being heard. */
  const usingPrimary = useRef(true);
  const gapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gap, setGap] = useLocalStorage(GAP_KEY, '0');
  const [showGapOptions, setShowGapOptions] = useState(false);

  const total = audioUrls.length;
  const gapMs = Number(gap) || 0;

  const active = useCallback(
    () => (usingPrimary.current ? primary.current : secondary.current),
    [],
  );
  const idle = useCallback(
    () => (usingPrimary.current ? secondary.current : primary.current),
    [],
  );

  /** Warm the idle element with the next ayah so the handover costs nothing. */
  const preload = useCallback(
    (index: number) => {
      const next = audioUrls[index];
      const element = idle();
      if (!next || !element) return;
      if (element.getAttribute('src') !== next) {
        element.src = next;
        element.load();
      }
    },
    [audioUrls, idle],
  );

  const highlight = useCallback((index: number, scroll: boolean) => {
    for (const el of document.querySelectorAll('[data-ayah]')) el.removeAttribute('data-active');
    const target = document.querySelector<HTMLElement>(`[data-ayah="${index + 1}"]`);
    if (!target) return;
    target.setAttribute('data-active', '');
    if (scroll) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  useEffect(() => {
    if (playing) highlight(current, true);
  }, [current, playing, highlight]);

  useEffect(() => {
    if (playing) return;
    for (const el of document.querySelectorAll('[data-ayah][data-active]')) {
      el.removeAttribute('data-active');
    }
  }, [playing]);

  /** Clear any pending gap when the component goes away. */
  useEffect(
    () => () => {
      if (gapTimer.current) clearTimeout(gapTimer.current);
    },
    [],
  );

  const playIndex = useCallback(
    async (index: number, useIdleElement = false) => {
      if (index < 0 || index >= total) return;

      if (gapTimer.current) {
        clearTimeout(gapTimer.current);
        gapTimer.current = null;
      }

      // Advancing uses the element that has already buffered the next ayah.
      if (useIdleElement) usingPrimary.current = !usingPrimary.current;

      const element = active();
      if (!element) return;

      const url = audioUrls[index];
      if (!url) return;

      setError(null);
      setCurrent(index);

      if (element.getAttribute('src') !== url) {
        element.src = url;
      }
      element.currentTime = 0;

      try {
        await element.play();
        setPlaying(true);
        preload(index + 1);
      } catch {
        setPlaying(false);
        setError('Playback could not start. Please try again.');
      }
    },
    [active, audioUrls, preload, total],
  );

  /** Called when whichever element is active reaches the end of its ayah. */
  const handleEnded = useCallback(() => {
    const next = current + 1;
    if (next >= total) {
      setPlaying(false);
      return;
    }

    if (gapMs > 0) {
      gapTimer.current = setTimeout(() => void playIndex(next, true), gapMs);
      return;
    }
    void playIndex(next, true);
  }, [current, gapMs, playIndex, total]);

  function toggle() {
    const element = active();
    if (!element) return;

    if (playing) {
      element.pause();
      if (gapTimer.current) {
        clearTimeout(gapTimer.current);
        gapTimer.current = null;
      }
      setPlaying(false);
    } else {
      void playIndex(current);
    }
  }

  function stop() {
    primary.current?.pause();
    secondary.current?.pause();
    if (gapTimer.current) clearTimeout(gapTimer.current);
    setPlaying(false);
    setCurrent(0);
  }

  const audioProps = {
    preload: 'auto' as const,
    onEnded: handleEnded,
    onError: () => {
      setPlaying(false);
      setError('That ayah could not be loaded.');
    },
  };

  return (
    <div className="sticky bottom-0 z-40 -mx-5 mt-10 border-t border-line bg-surface/90 px-5 py-3.5 backdrop-blur-xl sm:-mx-8 sm:px-8">
      {/* Two elements so the next ayah is buffered before the current one finishes. */}
      <audio ref={primary} {...audioProps} />
      <audio ref={secondary} {...audioProps} />

      <div className="mx-auto flex max-w-3xl items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? 'Pause recitation' : 'Play recitation'}
          className="grid size-11 shrink-0 place-items-center rounded-full bg-emerald text-surface transition-transform duration-200 hover:scale-105"
        >
          {playing ? <Pause className="size-5" aria-hidden /> : <Play className="size-5" aria-hidden />}
        </button>

        <button
          type="button"
          onClick={() => void playIndex(current - 1)}
          disabled={current === 0}
          aria-label="Previous ayah"
          className="grid size-11 shrink-0 place-items-center rounded-full border border-line text-ink-muted disabled:opacity-40"
        >
          <SkipBack className="size-4" aria-hidden />
        </button>

        <button
          type="button"
          onClick={() => void playIndex(current + 1)}
          disabled={current + 1 >= total}
          aria-label="Next ayah"
          className="grid size-11 shrink-0 place-items-center rounded-full border border-line text-ink-muted disabled:opacity-40"
        >
          <SkipForward className="size-4" aria-hidden />
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-ink" aria-live="polite">
            {error ?? `Ayah ${current + 1} of ${total}`}
          </p>
          <p className="truncate text-xs text-ink-faint">Recited by {reciterName}</p>
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setShowGapOptions((open) => !open)}
            aria-label="Pause between verses"
            aria-expanded={showGapOptions}
            className={`grid size-11 place-items-center rounded-full border border-line transition-colors ${
              gapMs > 0 ? 'text-emerald' : 'text-ink-muted'
            }`}
          >
            <Repeat className="size-4" aria-hidden />
          </button>

          {showGapOptions && (
            <div className="absolute bottom-full right-0 mb-2 w-60 rounded-xl border border-line bg-surface-raised p-2 shadow-lift">
              <p className="px-3 py-2 font-display text-[0.65rem] uppercase tracking-[0.18em] text-ink-faint">
                Pause between verses
              </p>
              {GAPS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setGap(option.value);
                    setShowGapOptions(false);
                  }}
                  aria-pressed={gap === option.value}
                  className={`flex min-h-11 w-full flex-col items-start rounded-lg px-3 py-2 text-left transition-colors hover:bg-surface-sunken ${
                    gap === option.value ? 'text-emerald' : 'text-ink'
                  }`}
                >
                  <span className="text-sm">{option.label}</span>
                  <span className="text-xs text-ink-faint">{option.hint}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {playing && (
          <button
            type="button"
            onClick={stop}
            aria-label="Stop recitation"
            className="grid size-11 shrink-0 place-items-center rounded-full border border-line text-ink-muted"
          >
            <X className="size-4" aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}
