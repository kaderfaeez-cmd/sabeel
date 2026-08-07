import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthenticityNotices } from '@/components/content/authenticity-notice';
import { ContentBlock } from '@/components/content/content-block';
import { ScholarlyDifferences } from '@/features/fiqh/scholarly-differences';
import {
  NON_NULLIFIERS,
  NULLIFIER_DIFFERENCES,
  NULLIFIERS,
} from '@/data/fiqh/nullifiers';
import type { Evidence } from '@/lib/content/types';
import { resolveEvidence } from '@/lib/fiqh/loader';
import { DEFAULT_TRANSLATION_ID } from '@/lib/quran/translations';

export const metadata: Metadata = {
  title: 'What breaks wudhu',
  description:
    'What breaks wudhu and what does not, with the evidence for each — including the points where the four Sunni schools differ, and the common worries that turn out not to break it at all.',
};

export default async function NullifiersPage() {
  const [nullifierEvidence, nonNullifierEvidence] = await Promise.all([
    Promise.all(NULLIFIERS.map((item) => resolveEvidence(item.evidence, DEFAULT_TRANSLATION_ID))),
    Promise.all(
      NON_NULLIFIERS.map((item) =>
        item.evidence
          ? resolveEvidence(item.evidence, DEFAULT_TRANSLATION_ID)
          : Promise.resolve<Evidence>({}),
      ),
    ),
  ]);

  const agreed = NULLIFIERS.filter((item) => item.agreement === 'agreed');
  const differed = NULLIFIERS.filter((item) => item.agreement === 'differed');

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
      <Link href="/wudhu" className="text-sm text-ink-muted hover:text-ink">
        ← Learn Wudhu
      </Link>

      <h1 className="mt-8 font-display text-display font-light tracking-[-0.015em] text-ink">
        What breaks wudhu
      </h1>
      <p className="mt-6 text-lede leading-relaxed text-ink-muted">
        Once you have wudhu, it stays valid until something breaks it. There are fewer of
        those than people often assume — and the section further down on what does{' '}
        <em>not</em> break it may be the more useful half of this page.
      </p>

      <section aria-labelledby="agreed" className="mt-14">
        <h2 id="agreed" className="font-display text-title font-medium tracking-[-0.01em] text-ink">
          Agreed upon by all four schools
        </h2>

        <ul className="mt-8 space-y-5">
          {agreed.map((item) => (
            <NullifierCard
              key={item.id}
              item={item}
              evidence={nullifierEvidence[NULLIFIERS.indexOf(item)] ?? {}}
            />
          ))}
        </ul>
      </section>

      <section aria-labelledby="differed" className="mt-16">
        <h2
          id="differed"
          className="font-display text-title font-medium tracking-[-0.01em] text-ink"
        >
          Where the schools differ
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">
          These are long-standing differences among accepted schools, not weak or fringe
          positions. If you follow a particular madhhab, follow it here. If you do not,
          any of these is a valid position to act on.
        </p>

        <ul className="mt-8 space-y-5">
          {differed.map((item) => (
            <NullifierCard
              key={item.id}
              item={item}
              evidence={nullifierEvidence[NULLIFIERS.indexOf(item)] ?? {}}
            />
          ))}
        </ul>
      </section>

      <section aria-labelledby="non-nullifiers" className="mt-16">
        <h2
          id="non-nullifiers"
          className="font-display text-title font-medium tracking-[-0.01em] text-ink"
        >
          What does <em>not</em> break wudhu
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">
          People far more often repeat wudhu when they did not need to than skip it when
          they did. If one of these has been worrying you, it should not.
        </p>

        <ul className="mt-8 space-y-4">
          {NON_NULLIFIERS.map((item, index) => (
            <li
              key={item.id}
              className="rounded-2xl border border-line bg-surface-raised p-6 sm:p-7"
            >
              <h3 className="font-display text-lg font-medium text-ink">{item.claim}</h3>
              <p className="mt-3 leading-relaxed text-ink-muted">{item.clarification}</p>

              {nonNullifierEvidence[index]?.hadith?.map((block) => (
                <div key={block.id} className="mt-5">
                  <ContentBlock block={block} />
                </div>
              ))}

              {nonNullifierEvidence[index]?.notices &&
                nonNullifierEvidence[index]!.notices!.length > 0 && (
                  <AuthenticityNotices notices={nonNullifierEvidence[index]!.notices!} />
                )}

              {!item.evidence && (
                <p className="mt-4 text-xs leading-relaxed text-ink-faint">
                  Sabeel — educational summary of the positions reported in the standard
                  fiqh literature. No primary citation is shown here yet.
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <ScholarlyDifferences differences={NULLIFIER_DIFFERENCES} />

      {/* FIQH-POLICY §5 — rendered by the page itself, so it cannot be omitted. */}
      <p className="mt-14 rounded-lg border border-line bg-surface-sunken px-6 py-5 text-sm leading-relaxed text-ink-muted">
        Sabeel is an educational platform, not a fatwa service. Purity questions often turn
        on circumstances this page cannot know. For anything specific to your situation,
        please ask a qualified local scholar or imam.
      </p>
    </div>
  );
}

function NullifierCard({
  item,
  evidence,
}: {
  item: (typeof NULLIFIERS)[number];
  evidence: Evidence;
}) {
  return (
    <li className="rounded-2xl border border-line bg-surface-raised p-6 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="font-display text-lg font-medium text-ink">{item.title}</h3>
        {item.agreement === 'differed' && (
          <span className="shrink-0 rounded-full border border-gold/50 px-3 py-1 text-[0.7rem] uppercase tracking-wider text-gold-ink">
            Schools differ
          </span>
        )}
      </div>

      <p className="mt-3 leading-relaxed text-ink-muted">{item.description}</p>

      {item.disagreementNote && (
        <p className="mt-3 text-sm leading-relaxed text-ink-faint">{item.disagreementNote}</p>
      )}

      {(evidence.quran?.length || evidence.hadith?.length) && (
        <div className="mt-5 space-y-4">
          {evidence.quran?.map((block) => (
            <ContentBlock key={block.id} block={block} />
          ))}
          {evidence.hadith?.map((block) => (
            <ContentBlock key={block.id} block={block} />
          ))}
        </div>
      )}

      {/*
        A notice here concerns the grading of a NARRATION. The badge above concerns
        whether the schools differ on the RULING. Those are different things, and an
        "agreed" nullifier carrying a "scholars differed" notice reads as a contradiction
        unless the distinction is spelled out.
      */}
      {item.agreement === 'agreed' && evidence.notices && evidence.notices.length > 0 && (
        <p className="mt-5 text-sm leading-relaxed text-ink-muted">
          <span className="text-ink">All four schools agree on this ruling.</span> The note
          below concerns how scholars graded one particular narration — not whether this
          breaks wudhu.
        </p>
      )}

      {evidence.notices && evidence.notices.length > 0 && (
        <AuthenticityNotices notices={evidence.notices} />
      )}
    </li>
  );
}
