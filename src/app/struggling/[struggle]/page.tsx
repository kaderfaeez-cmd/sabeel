import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AuthenticityNotices } from '@/components/content/authenticity-notice';
import { ContentBlock } from '@/components/content/content-block';
import { DUAS } from '@/data/duas';
import { getStory } from '@/data/stories';
import { getStruggle, STRUGGLES } from '@/data/struggles';
import { resolveEvidence } from '@/lib/fiqh/loader';
import { DEFAULT_TRANSLATION_ID } from '@/lib/quran/translations';

interface PageProps {
  params: Promise<{ struggle: string }>;
}

export function generateStaticParams() {
  return STRUGGLES.map((struggle) => ({ struggle: struggle.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { struggle: id } = await params;
  const struggle = getStruggle(id);
  if (!struggle) return { title: 'Not found' };
  return { title: struggle.title, description: struggle.opening.slice(0, 155) };
}

export default async function StrugglePage({ params }: PageProps) {
  const { struggle: id } = await params;
  const struggle = getStruggle(id);
  if (!struggle) notFound();

  const evidence = await resolveEvidence(struggle.evidence, DEFAULT_TRANSLATION_ID);
  const dua = struggle.relatedDuaId
    ? DUAS.find((d) => d.id === struggle.relatedDuaId)
    : undefined;
  const story = struggle.relatedStoryId ? getStory(struggle.relatedStoryId) : undefined;

  return (
    <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8 sm:py-20">
      <Link href="/struggling" className="text-sm text-ink-muted hover:text-ink">
        ← Other struggles
      </Link>

      <h1 className="mt-8 font-display text-display font-light tracking-[-0.015em] text-ink">
        {struggle.title}
      </h1>

      {/* Acknowledge before offering anything. */}
      <div className="mt-8 border-l-2 border-l-gold pl-6">
        <p className="text-lede leading-relaxed text-ink">{struggle.opening}</p>
        <p className="mt-3 text-[0.65rem] uppercase tracking-[0.16em] text-ink-faint">
          Sabeel — educational summary
        </p>
      </div>

      <section aria-labelledby="what-allah-says" className="mt-12">
        <h2
          id="what-allah-says"
          className="font-display text-xs uppercase tracking-[0.2em] text-emerald"
        >
          What Allah says
        </h2>

        <div className="mt-4 space-y-4">
          {evidence.quran?.map((block) => (
            <ContentBlock key={block.id} block={block} />
          ))}
          {evidence.hadith?.map((block) => (
            <ContentBlock key={block.id} block={block} />
          ))}
        </div>

        {evidence.notices && evidence.notices.length > 0 && (
          <AuthenticityNotices notices={evidence.notices} />
        )}
      </section>

      <section
        aria-labelledby="reflection"
        className="mt-8 rounded-2xl bg-surface-sunken px-6 py-5"
      >
        <h2 id="reflection" className="font-display text-xs uppercase tracking-[0.2em] text-gold-ink">
          What this is saying
        </h2>
        <p className="mt-3 leading-relaxed text-ink-muted">{struggle.reflection}</p>
        <p className="mt-3 text-[0.65rem] uppercase tracking-[0.16em] text-ink-faint">
          Sabeel — educational summary
        </p>
      </section>

      <section aria-labelledby="steps" className="mt-12">
        <h2 id="steps" className="font-display text-title font-medium text-ink">
          Something small you can do
        </h2>
        <ul className="mt-6 space-y-3">
          {struggle.steps.map((step) => (
            <li
              key={step}
              className="rounded-xl border-l-2 border-l-emerald border-line bg-surface-raised px-6 py-4 leading-relaxed text-ink-muted"
            >
              {step}
            </li>
          ))}
        </ul>
      </section>

      {(dua || story) && (
        <section aria-labelledby="alongside" className="mt-12">
          <h2 id="alongside" className="font-display text-xs uppercase tracking-[0.2em] text-ink-faint">
            Alongside this
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {dua && (
              <Link
                href={`/duas#${dua.id}`}
                className="group rounded-xl border border-line bg-surface-raised p-5 transition-colors hover:border-line-strong"
              >
                <span className="block font-display text-xs uppercase tracking-[0.18em] text-gold-ink">
                  A dua
                </span>
                <span className="mt-2 block font-display text-lg text-ink group-hover:text-emerald">
                  {dua.title}
                </span>
              </Link>
            )}
            {story && (
              <Link
                href={`/stories/${story.id}`}
                className="group rounded-xl border border-line bg-surface-raised p-5 transition-colors hover:border-line-strong"
              >
                <span className="block font-display text-xs uppercase tracking-[0.18em] text-gold-ink">
                  A story
                </span>
                <span className="mt-2 block font-display text-lg text-ink group-hover:text-emerald">
                  {story.name}
                </span>
              </Link>
            )}
          </div>
        </section>
      )}

      {/* Where a website is not the right help, say so rather than offering a verse instead. */}
      {struggle.seekHelp && (
        <p className="mt-12 rounded-lg border-l-2 border-l-gold border-line bg-surface-raised px-6 py-5 leading-relaxed text-ink-muted">
          {struggle.seekHelp}
        </p>
      )}

      <p className="mt-12 text-sm text-ink-faint">
        You are not expected to fix this today.
      </p>
    </div>
  );
}
