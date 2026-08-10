import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentBlock } from '@/components/content/content-block';
import { AuthenticityNotices } from '@/components/content/authenticity-notice';
import { JourneyTrail } from '@/components/lesson/journey-trail';
import { NextStep } from '@/components/lesson/next-step';
import type { EvidenceSpec } from '@/lib/fiqh/loader';
import { resolveEvidence } from '@/lib/fiqh/loader';
import { DEFAULT_TRANSLATION_ID } from '@/lib/quran/translations';

export const metadata: Metadata = {
  title: 'Learn Islam',
  description:
    'The foundations — what Muslims believe, the five pillars, and where each comes from, with the evidence shown rather than asserted.',
};

/**
 * Learn Islam — the foundations.
 *
 * Constitution §3.2: every claim here either carries evidence or is labelled as our own
 * framing. The pillars are given with their sources; the surrounding explanation is
 * marked as an educational summary.
 *
 * References checked with `npm run probe:hadith` before being written.
 */

interface Pillar {
  readonly id: string;
  readonly title: string;
  readonly arabic: string;
  readonly summary: string;
  readonly evidence: EvidenceSpec;
  readonly href?: string;
  readonly cta?: string;
}

const PILLARS: readonly Pillar[] = [
  {
    id: 'shahadah',
    title: 'The testimony of faith',
    arabic: 'الشهادة',
    summary:
      'To bear witness that there is no god but Allah, and that Muhammad ﷺ is His Messenger. This is what makes a person Muslim, and it is the sentence the prayer returns to at its end.',
    evidence: { quran: [{ surah: 47, ayah: 19 }] },
  },
  {
    id: 'salah',
    title: 'The prayer',
    arabic: 'الصلاة',
    summary:
      'Five prayers each day, at times set by the sun. It is the practice that shapes a Muslim day more than any other.',
    evidence: { quran: [{ surah: 2, ayah: 43 }] },
    href: '/salah',
    cta: 'Learn Salah',
  },
  {
    id: 'zakah',
    title: 'Obligatory charity',
    arabic: 'الزكاة',
    summary:
      'A yearly portion of accumulated wealth, given to those entitled to it. It is a due rather than a donation — the Quran names the categories of people it belongs to.',
    evidence: { quran: [{ surah: 9, ayah: 60 }] },
  },
  {
    id: 'sawm',
    title: 'Fasting in Ramadan',
    arabic: 'الصوم',
    summary:
      'From dawn until sunset for the month of Ramadan. The Quran states its purpose directly: so that you may become mindful of Allah.',
    evidence: { quran: [{ surah: 2, ayah: 183 }] },
  },
  {
    id: 'hajj',
    title: 'The pilgrimage',
    arabic: 'الحج',
    summary:
      'To Makkah, once in a lifetime, for those who are physically and financially able. The Quran states that condition explicitly.',
    evidence: { quran: [{ surah: 3, ayah: 97 }] },
  },
];

const BELIEFS: readonly { title: string; body: string }[] = [
  {
    title: 'One God, without partner',
    body:
      'Tawḥīd — that Allah is one, was not born and does not give birth, and that nothing is comparable to Him. Surah Al-Ikhlas states this in four short verses.',
  },
  {
    title: 'The prophets',
    body:
      'Muslims believe in a long line of prophets — including Adam, Nuh, Ibrahim, Musa, Dawud and Isa, peace be upon them — with Muhammad ﷺ as the last of them.',
  },
  {
    title: 'The revealed books',
    body:
      'Including the scripture given to Musa and to Isa. Muslims hold the Quran to be the final revelation, preserved in the language it was revealed in.',
  },
  {
    title: 'The angels',
    body: 'Created beings who carry out what they are commanded, without free will as we have it.',
  },
  {
    title: 'The Day of Judgement',
    body:
      'That this life is not the whole of it, and that everyone will be accounted for with perfect justice.',
  },
  {
    title: 'Divine decree',
    body:
      'That Allah knows all that was and will be — held alongside, not instead of, the responsibility each person carries for their own choices.',
  },
];

export default async function LearnPage() {
  const evidence = await Promise.all(
    PILLARS.map((pillar) => resolveEvidence(pillar.evidence, DEFAULT_TRANSLATION_ID)),
  );

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
      <JourneyTrail stepId="islam" />

      <p className="font-display text-xs uppercase tracking-[0.28em] text-gold-ink">Begin</p>
      <h1 className="mt-5 font-display text-display font-light tracking-[-0.015em] text-ink">
        Learn Islam
      </h1>
      <p className="mt-6 text-lede leading-relaxed text-ink-muted">
        Islam rests on a small number of things believed and a small number of things done.
        Everything else grows out of those.
      </p>

      <section aria-labelledby="pillars" className="mt-14">
        <h2 id="pillars" className="font-display text-title font-medium tracking-[-0.01em] text-ink">
          The five pillars
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">
          The practices Islam is built on. Each is given below with a verse establishing it.
        </p>

        <ol className="mt-8 space-y-5">
          {PILLARS.map((pillar, index) => (
            <li
              key={pillar.id}
              id={pillar.id}
              className="scroll-mt-24 rounded-2xl border border-line bg-surface-raised p-6 sm:p-8"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="font-display text-title font-medium text-ink">
                  {pillar.title}
                </h3>
                <p lang="ar" dir="rtl" className="text-2xl text-emerald">
                  {pillar.arabic}
                </p>
              </div>

              <p className="mt-4 leading-relaxed text-ink-muted">{pillar.summary}</p>

              {(evidence[index]?.quran?.length || evidence[index]?.hadith?.length) && (
                <div className="mt-6 space-y-4">
                  {evidence[index]?.quran?.map((block) => (
                    <ContentBlock key={block.id} block={block} />
                  ))}
                  {evidence[index]?.hadith?.map((block) => (
                    <ContentBlock key={block.id} block={block} />
                  ))}
                </div>
              )}

              {evidence[index]?.notices && evidence[index]!.notices!.length > 0 && (
                <AuthenticityNotices notices={evidence[index]!.notices!} />
              )}

              {pillar.href && (
                <Link
                  href={pillar.href}
                  className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-sm text-ink transition-colors hover:border-emerald hover:text-emerald"
                >
                  {pillar.cta}
                  <span aria-hidden>→</span>
                </Link>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="beliefs" className="mt-16">
        <h2 id="beliefs" className="font-display text-title font-medium tracking-[-0.01em] text-ink">
          What Muslims believe
        </h2>
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {BELIEFS.map((belief) => (
            <div key={belief.title} className="rounded-xl border border-line bg-surface-raised p-6">
              <h3 className="font-display text-lg text-ink">{belief.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{belief.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-[0.65rem] uppercase tracking-[0.16em] text-ink-faint">
          Sabeel — educational summary
        </p>
      </section>

      <NextStep stepId="islam" />

      <p className="mt-14 rounded-lg border border-line bg-surface-sunken px-6 py-5 text-sm leading-relaxed text-ink-muted">
        Sabeel is an educational platform, not a fatwa service. For anything depending on
        your own circumstances, please ask a qualified local scholar or imam.
      </p>
    </div>
  );
}
