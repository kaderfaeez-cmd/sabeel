'use client';

import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getSurah } from '@/lib/quran/surahs';
import {
  listJournal,
  saveNote,
  saveStoryNote,
  type JournalEntry,
} from '@/lib/store/reading';

/**
 * The reflection journal.
 *
 * Everything here is the notes already attached to ayahs, gathered in one place. It is
 * stored on this device only and needs no account (Constitution §7). Nothing is sent
 * anywhere, and the page says so rather than leaving the reader to wonder.
 */
export function JournalPanel() {
  const [notes, setNotes] = useState<readonly JournalEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const loaded = await listJournal();
        if (!cancelled) setNotes(loaded);
      } catch {
        if (!cancelled) {
          setNotes([]);
          setError('This browser is blocking local storage, so notes cannot be saved here.');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function remove(entry: JournalEntry) {
    try {
      if (entry.kind === 'ayah') {
        await saveNote(entry.note.surah, entry.note.ayah, '');
      } else {
        await saveStoryNote(entry.note.storyId, entry.note.storyName, '');
      }
      setNotes(await listJournal());
    } catch {
      setError('That note could not be removed.');
    }
  }

  if (notes === null) {
    return <p className="mt-10 text-ink-faint">Loading your journal…</p>;
  }

  if (notes.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border border-dashed border-line-strong bg-surface-sunken px-7 py-10 text-center">
        <p className="font-display text-title text-ink">Nothing here yet</p>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-ink-muted">
          While you are reading the Quran, the note icon beside any ayah lets you write
          something down — a reflection, a question, something to come back to. They will
          gather here.
        </p>
        {error && <p className="mt-5 text-sm text-ink-faint">{error}</p>}
      </div>
    );
  }

  return (
    <>
      <p className="mt-8 text-sm text-ink-faint">
        {notes.length} {notes.length === 1 ? 'reflection' : 'reflections'}
      </p>

      <ul className="mt-6 space-y-4">
        {notes.map((entry) => {
          const isAyah = entry.kind === 'ayah';
          const href = isAyah
            ? `/quran/${entry.note.surah}#ayah-${entry.note.ayah}`
            : `/stories/${entry.note.storyId}`;
          const label = isAyah
            ? `${getSurah(entry.note.surah)?.name ?? `Surah ${entry.note.surah}`} · ${entry.note.surah}:${entry.note.ayah}`
            : entry.note.storyName;
          const deleteLabel = isAyah
            ? `Delete your note on ${entry.note.surah}:${entry.note.ayah}`
            : `Delete your reflection on ${entry.note.storyName}`;

          return (
            <li
              key={entry.note.id}
              className="rounded-2xl border border-line bg-surface-raised p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <a
                  href={href}
                  className="font-display text-xs uppercase tracking-[0.18em] text-gold-ink hover:underline"
                >
                  {isAyah ? label : `Story · ${label}`}
                </a>
                <button
                  type="button"
                  onClick={() => void remove(entry)}
                  aria-label={deleteLabel}
                  className="grid size-11 shrink-0 place-items-center rounded-full text-ink-faint transition-colors hover:bg-surface-sunken hover:text-ink"
                >
                  <Trash2 className="size-4" aria-hidden />
                </button>
              </div>

              <p className="mt-3 whitespace-pre-wrap leading-relaxed text-ink">
                {entry.note.text}
              </p>

              <p className="mt-4 text-xs text-ink-faint">
                {new Date(entry.note.updatedAt).toLocaleDateString(undefined, {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </li>
          );
        })}
      </ul>

      {error && (
        <p role="alert" className="mt-6 text-sm text-ink-muted">
          {error}
        </p>
      )}
    </>
  );
}
