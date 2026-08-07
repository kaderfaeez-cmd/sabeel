'use client';

import { Pause, Play, SkipBack, SkipForward, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Recitation player with per-ayah sync.
 *
 * Plays one ayah at a time and advances automatically, highlighting and scrolling to the
 * active ayah. Audio is only ever started by the user — nothing on this platform plays
 * sound on its own (Constitution §7, the same principle as the Adhan rule).
 */
export function RecitationPlayer({
  audioUrls,
  reciterName,
}: {
  audioUrls: readonly string[];
  reciterName: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = audioUrls.length;

  /** Marks the active ayah in the DOM so the reading surface can highlight it. */
  const highlight = useCallback((index: number, scroll: boolean) => {
    for (const el of document.querySelectorAll('[data-ayah]')) {
      el.removeAttribute('data-active');
    }
    const target = document.querySelector<HTMLElement>(`[data-ayah="${index + 1}"]`);
    if (!target) return;
    target.setAttribute('data-active', '');
    if (scroll) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  useEffect(() => {
    if (!playing) return;
    highlight(current, true);
  }, [current, playing, highlight]);

  // Clear the highlight when the player unmounts or stops.
  useEffect(() => {
    if (playing) return;
    for (const el of document.querySelectorAll('[data-ayah][data-active]')) {
      el.removeAttribute('data-active');
    }
  }, [playing]);

  async function play(index: number) {
    const audio = audioRef.current;
    if (!audio || index < 0 || index >= total) return;

    setError(null);
    setCurrent(index);
    audio.src = audioUrls[index] ?? '';

    try {
      await audio.play();
      setPlaying(true);
    } catch {
      // Autoplay policy or a network failure — say so rather than appearing stuck.
      setPlaying(false);
      setError('Playback could not start. Please try again.');
    }
  }

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      void play(current);
    }
  }

  return (
    <div className="sticky bottom-0 z-40 -mx-5 mt-10 border-t border-line bg-surface/90 px-5 py-3.5 backdrop-blur-xl sm:-mx-8 sm:px-8">
      <audio
        ref={audioRef}
        preload="none"
        onEnded={() => {
          if (current + 1 < total) {
            void play(current + 1);
          } else {
            setPlaying(false);
          }
        }}
        onError={() => {
          setPlaying(false);
          setError('That ayah could not be loaded.');
        }}
      />

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
          onClick={() => void play(current - 1)}
          disabled={current === 0}
          aria-label="Previous ayah"
          className="grid size-11 shrink-0 place-items-center rounded-full border border-line text-ink-muted disabled:opacity-40"
        >
          <SkipBack className="size-4" aria-hidden />
        </button>

        <button
          type="button"
          onClick={() => void play(current + 1)}
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

        {playing && (
          <button
            type="button"
            onClick={() => {
              audioRef.current?.pause();
              setPlaying(false);
              setCurrent(0);
            }}
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
