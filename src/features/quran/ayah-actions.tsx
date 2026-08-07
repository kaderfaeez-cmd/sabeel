'use client';

import { Bookmark, BookmarkCheck, Check, Copy, NotebookPen } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { getNote, isBookmarked, saveNote, toggleBookmark } from '@/lib/store/reading';

/**
 * Per-ayah actions: bookmark, note, copy.
 *
 * All state is local-first (IndexedDB) and requires no account. Storage failures are
 * surfaced rather than swallowed — a reader who thinks a note saved when it did not has
 * lost their reflection.
 */
export function AyahActions({
  surah,
  ayah,
  arabic,
  translation,
  translatorName,
}: {
  surah: number;
  ayah: number;
  arabic: string;
  translation: string;
  translatorName: string;
}) {
  const [bookmarked, setBookmarked] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [hasNote, setHasNote] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const noteFieldId = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [marked, note] = await Promise.all([
          isBookmarked(surah, ayah),
          getNote(surah, ayah),
        ]);
        if (cancelled) return;
        setBookmarked(marked);
        setHasNote(note !== undefined);
        setNoteText(note?.text ?? '');
      } catch {
        // Storage unavailable (private mode). Actions stay visible but will report
        // failure if used, rather than silently pretending to work.
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [surah, ayah]);

  // Focus after the textarea exists. Focusing inside the click handler ran before React
  // had rendered it, so keyboard users were left on the button with a panel open.
  useEffect(() => {
    if (noteOpen) textareaRef.current?.focus();
  }, [noteOpen]);

  async function onToggleBookmark() {
    setError(null);
    try {
      setBookmarked(await toggleBookmark(surah, ayah));
    } catch {
      setError('Could not save. This browser may be blocking local storage.');
    }
  }

  async function onSaveNote() {
    setError(null);
    try {
      const saved = await saveNote(surah, ayah, noteText);
      setHasNote(saved !== null);
      setNoteOpen(false);
    } catch {
      setError('Could not save your note.');
    }
  }

  async function onCopy() {
    setError(null);
    // Attribution travels with the text — a copied verse must not lose its source.
    const text = `${arabic}\n\n"${translation}"\n\nQuran ${surah}:${ayah} — translation by ${translatorName}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Could not copy to the clipboard.');
    }
  }

  return (
    <div className="mt-5">
      <div className="flex flex-wrap items-center gap-1">
        <ActionButton
          onClick={() => void onToggleBookmark()}
          label={bookmarked ? `Remove bookmark on ayah ${ayah}` : `Bookmark ayah ${ayah}`}
          active={bookmarked}
        >
          {bookmarked ? (
            <BookmarkCheck className="size-4" aria-hidden />
          ) : (
            <Bookmark className="size-4" aria-hidden />
          )}
        </ActionButton>

        <ActionButton
          onClick={() => setNoteOpen((open) => !open)}
          label={hasNote ? `Edit your note on ayah ${ayah}` : `Add a note to ayah ${ayah}`}
          active={hasNote}
          expanded={noteOpen}
          controls={noteFieldId}
        >
          <NotebookPen className="size-4" aria-hidden />
        </ActionButton>

        <ActionButton onClick={() => void onCopy()} label={`Copy ayah ${ayah} with its reference`}>
          {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
        </ActionButton>

        <span aria-live="polite" className="sr-only">
          {copied ? 'Copied with reference' : ''}
        </span>
      </div>

      {noteOpen && (
        <div id={noteFieldId} className="mt-3">
          <label htmlFor={`${noteFieldId}-input`} className="sr-only">
            Your note on ayah {ayah}
          </label>
          <textarea
            id={`${noteFieldId}-input`}
            ref={textareaRef}
            value={noteText}
            onChange={(event) => setNoteText(event.target.value)}
            rows={3}
            placeholder="A reflection, a question, something to return to…"
            className="w-full rounded-lg border border-line bg-surface-raised p-3 text-sm text-ink placeholder:text-ink-faint focus:border-emerald focus:outline-none"
          />
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => void onSaveNote()}
              className="rounded-full bg-emerald px-4 py-1.5 text-xs text-surface"
            >
              Save note
            </button>
            <button
              type="button"
              onClick={() => setNoteOpen(false)}
              className="rounded-full border border-line px-4 py-1.5 text-xs text-ink-muted"
            >
              Cancel
            </button>
            <span className="ml-auto text-xs text-ink-faint">Stays on this device</span>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-2 text-xs text-ink-muted">
          {error}
        </p>
      )}
    </div>
  );
}

function ActionButton({
  onClick,
  label,
  active,
  expanded,
  controls,
  children,
}: {
  onClick: () => void;
  label: string;
  active?: boolean;
  expanded?: boolean;
  controls?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      aria-expanded={expanded}
      aria-controls={controls}
      className={`grid size-11 place-items-center rounded-full transition-colors duration-200 hover:bg-surface-sunken ${
        active ? 'text-emerald' : 'text-ink-faint'
      }`}
    >
      {children}
    </button>
  );
}
