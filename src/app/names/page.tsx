import type { Metadata } from 'next';
import { ContentBlock } from '@/components/content/content-block';
import { NamesGrid } from '@/features/names/names-grid';
import { TOTAL_NAMES } from '@/lib/names';
import { resolveEvidence } from '@/lib/fiqh/loader';
import { DEFAULT_TRANSLATION_ID } from '@/lib/quran/translations';

export const metadata: Metadata = {
  title: '99 Names of Allah',
  description:
    'Al-Asmāʼ al-Ḥusnā — the 99 names, each in Arabic with its transliteration and meaning, searchable.',
};

export default async function NamesPage() {
  // The verse that names them as belonging to Allah, and the one that instructs their use.
  const evidence = await resolveEvidence(
    { quran: [{ surah: 7, ayah: 180 }, { surah: 17, ayah: 110 }] },
    DEFAULT_TRANSLATION_ID,
  );

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
      <p className="font-display text-xs uppercase tracking-[0.28em] text-gold-ink">
        Remembrance
      </p>
      <h1 className="mt-5 font-display text-display font-light tracking-[-0.015em] text-ink">
        The 99 Names
      </h1>
      <p lang="ar" dir="rtl" className="mt-3 text-3xl text-emerald">
        الأسماء الحسنى
      </p>
      <p className="mt-6 max-w-2xl text-lede leading-relaxed text-ink-muted">
        Al-Asmāʼ al-Ḥusnā — the most beautiful names. Each one describes something true
        about Allah, and the Quran instructs that He be called by them.
      </p>

      <div className="mt-10 max-w-2xl space-y-4">
        {evidence.quran?.map((block) => (
          <ContentBlock key={block.id} block={block} />
        ))}
      </div>

      <p className="mt-8 max-w-2xl rounded-lg border border-dashed border-line-strong bg-surface-sunken px-5 py-4 text-sm leading-relaxed text-ink-muted">
        Scholars have differed on exactly which names make up the ninety-nine, since the
        list is not enumerated in a single narration. The names below follow the
        commonly-circulated list. Sabeel presents it as such rather than as a fixed and
        settled enumeration.
      </p>

      <NamesGrid />

      <p className="mt-14 max-w-2xl text-sm leading-relaxed text-ink-faint">
        Arabic, transliteration and meanings are retrieved from a published source rather
        than written here — {TOTAL_NAMES} names is far too much Arabic to transcribe by
        hand, and this platform does not guess at any of it.
      </p>
    </div>
  );
}
