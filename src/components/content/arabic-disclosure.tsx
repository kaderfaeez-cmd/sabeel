/**
 * Shows the complete Arabic text behind a disclosure.
 *
 * The Arabic is **never** truncated — a hadith entry includes its full isnad, and cutting
 * scripture-adjacent text to fit a layout is not something this platform does. But for a
 * beginner the translation is what they need first, and a screen of chain-of-narration
 * Arabic above it buries the meaning.
 *
 * So: translation by default, complete Arabic one click away, nothing lost.
 */
export function ArabicDisclosure({
  arabic,
  label = 'Show original Arabic',
}: {
  arabic: string;
  label?: string;
}) {
  return (
    <details className="group mt-4">
      <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-full border border-line px-4 py-1.5 text-xs text-ink-muted transition-colors duration-200 marker:content-none hover:border-line-strong hover:text-ink">
        <span
          aria-hidden
          className="transition-transform duration-300 group-open:rotate-90"
        >
          ▸
        </span>
        {label}
      </summary>

      <p
        lang="ar"
        dir="rtl"
        className="mt-4 border-r-2 border-r-line pr-4 text-xl leading-loose text-ink sm:text-2xl"
      >
        {arabic}
      </p>
    </details>
  );
}
