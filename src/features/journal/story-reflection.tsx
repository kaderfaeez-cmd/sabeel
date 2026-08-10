'use client';

import { Check, NotebookPen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getStoryNote, saveStoryNote } from '@/lib/store/reading';

/**
 * Write a reflection at the end of a story.
 *
 * The reflection questions above this used to have nowhere to go — a reader was asked to
 * sit with something and then given no way to hold on to it. This saves to the same
 * local-first store as the ayah notes, and appears in the Journal alongside them.
 */
export function StoryReflection({
  storyId,
  storyName,
  prompt,
}: {
  storyId: string;
  storyName: string;
  prompt: string;
}) {
  const [text, setText] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getStoryNote(storyId)
      .then((note) => {
        if (cancelled) return;
        setText(note?.text ?? '');
        setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [storyId]);

  async function save() {
    setError(null);
    try {
      await saveStoryNote(storyId, storyName, text);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError('This browser is blocking local storage, so the note could not be saved.');
    }
  }

  return (
    <section
      aria-labelledby="reflection-write"
      className="mt-10 rounded-2xl border border-line bg-surface-raised p-7"
    >
      <h2
        id="reflection-write"
        className="flex items-center gap-2 font-display text-xs uppercase tracking-[0.2em] text-gold-ink"
      >
        <NotebookPen className="size-3.5" aria-hidden />
        Write it down
      </h2>

      <p className="mt-4 leading-relaxed text-ink-muted">{prompt}</p>

      <label htmlFor={`reflection-${storyId}`} className="sr-only">
        Your reflection on {storyName}
      </label>
      <textarea
        id={`reflection-${storyId}`}
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={5}
        disabled={!loaded}
        placeholder="Whatever came to mind. Nobody else will see this."
        className="mt-5 w-full rounded-lg border border-line bg-surface p-4 leading-relaxed text-ink placeholder:text-ink-faint focus:border-emerald focus:outline-none"
      />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void save()}
          disabled={!loaded}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-emerald px-5 py-2.5 text-sm text-surface disabled:opacity-50"
        >
          {saved ? <Check className="size-4" aria-hidden /> : null}
          {saved ? 'Saved to your journal' : 'Save to my journal'}
        </button>
        <span className="text-xs text-ink-faint">Stays on this device</span>
      </div>

      <p aria-live="polite" className="sr-only">
        {saved ? 'Saved to your journal' : ''}
      </p>

      {error && (
        <p role="alert" className="mt-3 text-sm text-ink-muted">
          {error}
        </p>
      )}
    </section>
  );
}
