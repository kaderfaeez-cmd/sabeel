import type { Metadata } from 'next';
import Link from 'next/link';
import { ContinueReading } from '@/features/quran/continue-reading';
import { SurahIndex } from '@/features/quran/surah-index';
import { TOTAL_AYAHS, TOTAL_SURAHS } from '@/lib/quran/surahs';

export const metadata: Metadata = {
  title: 'The Quran',
  description:
    'Read the Quran in Arabic with trusted English translations, transliteration and verse-by-verse references. All 114 surahs, free and without an account.',
};

export default function QuranPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <p className="font-display text-xs uppercase tracking-[0.28em] text-gold-ink">
        Revelation
      </p>
      <h1 className="mt-5 font-display text-display font-light tracking-[-0.015em] text-ink">
        The Quran
      </h1>
      <p className="mt-6 max-w-2xl text-lede leading-relaxed text-ink-muted">
        {TOTAL_SURAHS} surahs, {TOTAL_AYAHS.toLocaleString('en')} ayahs. Arabic alongside
        a translation of your choosing, with every verse carrying its reference and its
        translator.
      </p>

      <Link
        href="/quran/search"
        className="mt-7 inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-sm text-ink transition-colors duration-300 hover:border-emerald hover:text-emerald"
      >
        Search the Quran
        <span aria-hidden>→</span>
      </Link>

      <ContinueReading />

      <SurahIndex />
    </div>
  );
}
