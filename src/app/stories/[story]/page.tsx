import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ContentBlock } from '@/components/content/content-block';
import { LessonHero } from '@/components/lesson/lesson-hero';
import {
  AboutAllah,
  ActionToday,
  Explanation,
  Narrative,
  Reflections,
  TakeAways,
} from '@/components/lesson/lesson-blocks';
import { StoryReflection } from '@/features/journal/story-reflection';
import { StoryMap } from '@/components/story/story-map';
import { StoryTimeline } from '@/components/story/story-timeline';
import { DUAS } from '@/data/duas';
import { getStory, STORIES, THEME_LABEL, type StoryPassage } from '@/data/stories';
import type { QuranBlock } from '@/lib/content/types';
import { fetchSurahVerses } from '@/lib/quran/api';
import { getSurah } from '@/lib/quran/surahs';
import { DEFAULT_TRANSLATION_ID, getTranslation } from '@/lib/quran/translations';

interface PageProps {
  params: Promise<{ story: string }>;
}

export function generateStaticParams() {
  return STORIES.map((story) => ({ story: story.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { story: id } = await params;
  const story = getStory(id);
  if (!story) return { title: 'Story not found' };

  return { title: story.name, description: story.whyItMatters };
}

export default async function StoryPage({ params }: PageProps) {
  const { story: id } = await params;
  const story = getStory(id);
  if (!story) notFound();

  const translation = getTranslation(DEFAULT_TRANSLATION_ID);
  const passages = await Promise.all(
    story.passages.map((passage) => loadPassage(passage, DEFAULT_TRANSLATION_ID)),
  );

  const index = STORIES.findIndex((s) => s.id === story.id);
  const next = STORIES[index + 1] ?? STORIES[0];
  const relatedDua = story.relatedDuaId
    ? DUAS.find((dua) => dua.id === story.relatedDuaId)
    : undefined;

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <Link href="/stories" className="text-sm text-ink-muted hover:text-ink">
        ← All stories
      </Link>

      <div className="mt-8">
        <LessonHero
          eyebrow="A story from the Quran"
          title={story.name}
          arabicTitle={story.arabicName}
          subtitle={story.subtitle}
          hook={story.hook}
          whyItMatters={story.whyItMatters}
          whatYoullLearn={story.whatYoullLearn}
          readingMinutes={story.readingMinutes}
          difficulty={story.difficulty}
        />
      </div>

      <p className="mt-8 text-sm text-ink-faint">
        {story.where}
        {translation && ` · Translation by ${translation.translator}.`}
      </p>

      {/* Shape of the story, and where it happened — both before the reading begins,
          so a beginner knows what they are walking into. */}
      <div className="mt-14">
        <StoryTimeline passages={story.passages} storyName={story.name} />
      </div>

      <div className="mt-16">
        <StoryMap
          passages={story.passages}
          storyName={story.name}
          noMapReason={story.noMapReason}
        />
      </div>

      {/* The story itself: scene, then revelation, then plain explanation. */}
      <div className="mt-16 space-y-16">
        {story.passages.map((passage, i) => (
          <section
            key={passage.id}
            id={passage.id}
            aria-labelledby={`${passage.id}-h`}
            className="scroll-mt-24"
          >
            <p className="font-display text-xs uppercase tracking-[0.2em] text-ink-faint">
              Part {i + 1} of {story.passages.length}
            </p>

            <h2
              id={`${passage.id}-h`}
              className="mt-3 font-display text-display font-light tracking-[-0.015em] text-ink"
            >
              {passage.heading}
            </h2>

            <div className="mt-7">
              <Narrative>{passage.narrative}</Narrative>
            </div>

            <div className="mt-9">
              <p className="font-display text-xs uppercase tracking-[0.2em] text-emerald">
                Now read what Allah says · {getSurah(passage.surah)?.name} {passage.surah}:
                {passage.ayahFrom}
                {passage.ayahTo !== passage.ayahFrom && `–${passage.ayahTo}`}
              </p>

              <div className="mt-4 space-y-4">
                {passages[i] === null ? (
                  <p
                    role="alert"
                    className="rounded-lg border border-dashed border-line-strong bg-surface-sunken px-5 py-4 text-sm text-ink-muted"
                  >
                    These verses could not be loaded from the Quran source just now. Sabeel
                    shows nothing rather than something it cannot verify — please try again
                    shortly.
                  </p>
                ) : (
                  passages[i]!.map((block) => <ContentBlock key={block.id} block={block} />)
                )}
              </div>
            </div>

            <div className="mt-7">
              <Explanation>{passage.explanation}</Explanation>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-20">
        <AboutAllah>{story.lessons.aboutAllah}</AboutAllah>
      </div>

      <TakeAways points={story.lessons.points} character={story.lessons.character} />

      <Reflections questions={story.reflections} />

      <StoryReflection
        storyId={story.id}
        storyName={story.name}
        prompt={`Anything from ${story.name} you want to keep. It saves to your journal, on this device only.`}
      />

      <ActionToday
        action={story.actionToday}
        duaHref={relatedDua ? `/duas#${relatedDua.id}` : undefined}
        duaLabel={relatedDua ? `Dua: ${relatedDua.title}` : undefined}
      />

      <section aria-labelledby="themes" className="mt-14">
        <h2 id="themes" className="font-display text-xs uppercase tracking-[0.2em] text-ink-faint">
          This story speaks to
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {story.themes.map((theme) => (
            <li
              key={theme}
              className="rounded-full border border-line px-4 py-1.5 text-sm text-ink-muted"
            >
              {THEME_LABEL[theme]}
            </li>
          ))}
        </ul>
      </section>

      <nav aria-label="Continue" className="mt-14 border-t border-line pt-9">
        <p className="text-sm text-ink-faint">Next story</p>
        <Link
          href={`/stories/${next.id}`}
          className="group mt-3 flex items-center gap-4 rounded-2xl border border-line bg-surface-raised p-6 transition-colors hover:border-line-strong"
        >
          <span className="min-w-0 flex-1">
            <span className="block font-display text-title text-ink">{next.name}</span>
            <span className="mt-2 block leading-relaxed text-ink-muted">{next.subtitle}</span>
          </span>
          <span
            aria-hidden
            className="shrink-0 text-emerald transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </nav>
    </div>
  );
}

/** `null` means the source could not be reached — never an empty passage rendered silently. */
async function loadPassage(
  passage: StoryPassage,
  translationId: number,
): Promise<readonly QuranBlock[] | null> {
  try {
    const verses = await fetchSurahVerses(passage.surah, translationId);
    const selected = verses.filter(
      (block) =>
        block.source.ayahFrom >= passage.ayahFrom && block.source.ayahFrom <= passage.ayahTo,
    );
    return selected.length > 0 ? selected : null;
  } catch {
    return null;
  }
}
