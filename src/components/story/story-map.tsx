import { getPlace, MAP_BOUNDS, type Place } from '@/data/stories/places';
import type { StoryPassage } from '@/data/stories';

/**
 * A schematic map of where a story takes place.
 *
 * Drawn as inline SVG rather than a tile map: no third-party requests, no key, works
 * offline, themes correctly, and weighs nothing. The landmasses are a deliberately
 * simplified sketch — enough to orient a reader who does not know the region, and
 * labelled as approximate so it is never mistaken for a survey.
 *
 * Places named in the Quran are marked differently from places that come only from the
 * historical literature, and the legend says which is which. A story the Quran does not
 * locate gets no map at all.
 */

const VIEW_WIDTH = 720;
const VIEW_HEIGHT = 560;
const PAD = 28;

function project(lat: number, lon: number): { x: number; y: number } {
  const { minLon, maxLon, minLat, maxLat } = MAP_BOUNDS;
  const x = PAD + ((lon - minLon) / (maxLon - minLon)) * (VIEW_WIDTH - PAD * 2);
  // Latitude increases northward; SVG y increases downward.
  const y = PAD + ((maxLat - lat) / (maxLat - minLat)) * (VIEW_HEIGHT - PAD * 2);
  return { x, y };
}

/**
 * Simplified coastlines for the Nile valley, the Red Sea, the Gulf and the Levant,
 * traced coarsely in projected coordinates. Orientation only — not a survey.
 */
function landPath(): string {
  const p = (lat: number, lon: number) => {
    const { x, y } = project(lat, lon);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  };

  // Africa / Egypt side, up the Red Sea, round Sinai, down the Arabian coast.
  return [
    `M ${p(40, 26)}`,
    `L ${p(31.5, 26)}`,
    `L ${p(30, 30)}`,
    `L ${p(24, 34)}`,
    `L ${p(18, 38)}`,
    `L ${p(13, 42)}`,
    `L ${p(12, 44)}`,
    `L ${p(12, 50)}`,
    `L ${p(20, 50)}`,
    `L ${p(25, 50)}`,
    `L ${p(30, 48)}`,
    `L ${p(36, 44)}`,
    `L ${p(40, 42)}`,
    `L ${p(40, 26)}`,
    'Z',
  ].join(' ');
}

/** The Red Sea wedge, which makes the region instantly recognisable. */
function seaPath(): string {
  const p = (lat: number, lon: number) => {
    const { x, y } = project(lat, lon);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  };
  return [
    `M ${p(29.5, 32.6)}`,
    `L ${p(24, 35.5)}`,
    `L ${p(18, 39.5)}`,
    `L ${p(12.6, 43.3)}`,
    `L ${p(13.6, 44.6)}`,
    `L ${p(19, 41)}`,
    `L ${p(25, 37)}`,
    `L ${p(29.8, 34.2)}`,
    'Z',
  ].join(' ');
}

export function StoryMap({
  passages,
  storyName,
  noMapReason,
}: {
  passages: readonly StoryPassage[];
  storyName: string;
  noMapReason?: string;
}) {
  const stops = passages
    .map((passage, index) => {
      const place = passage.placeId ? getPlace(passage.placeId) : undefined;
      return place ? { place, index, heading: passage.heading } : null;
    })
    .filter((s): s is { place: Place; index: number; heading: string } => s !== null);

  // Deduplicate consecutive stops at the same place, so a story that stays put does not
  // draw a pile of markers on one point.
  const unique: typeof stops = [];
  for (const stop of stops) {
    if (unique[unique.length - 1]?.place.id !== stop.place.id) unique.push(stop);
  }

  if (unique.length === 0) {
    return (
      <section
        aria-labelledby="map-heading"
        className="rounded-2xl border border-dashed border-line-strong bg-surface-sunken p-7"
      >
        <h2 id="map-heading" className="font-display text-xs uppercase tracking-[0.2em] text-ink-faint">
          Where this happened
        </h2>
        <p className="mt-4 leading-relaxed text-ink-muted">
          {noMapReason ??
            'The Quran does not say where this story takes place, so Sabeel does not show a map for it.'}
        </p>
      </section>
    );
  }

  const points = unique.map((stop) => ({
    ...stop,
    ...project(stop.place.lat, stop.place.lon),
  }));

  const hasTraditional = unique.some((s) => s.place.basis === 'traditional');

  return (
    <section aria-labelledby="map-heading">
      <h2 id="map-heading" className="font-display text-title font-medium tracking-[-0.01em] text-ink">
        Where this happened
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
        A rough sketch of the region, to help if the place names are unfamiliar. Positions
        are approximate and the outlines are simplified — this is for orientation, not
        accuracy.
      </p>

      <figure className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface-raised">
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          className="h-auto w-full"
          role="img"
          aria-label={`Schematic map of the places in the story of ${storyName}: ${unique
            .map((s) => s.place.name)
            .join(', ')}.`}
        >
          <path d={landPath()} fill="var(--surface-sunken)" stroke="var(--line)" strokeWidth="1.5" />
          <path d={seaPath()} fill="var(--surface)" stroke="var(--line)" strokeWidth="1" />

          {/* The journey, drawn in order. */}
          {points.length > 1 && (
            <path
              d={points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
              fill="none"
              stroke="var(--gold)"
              strokeWidth="2"
              strokeDasharray="6 6"
              strokeLinecap="round"
              opacity="0.7"
            />
          )}

          {points.map((point, i) => (
            <g key={point.place.id}>
              <circle
                cx={point.x}
                cy={point.y}
                r="9"
                fill="var(--surface-raised)"
                stroke={point.place.basis === 'quran' ? 'var(--emerald)' : 'var(--line-strong)'}
                strokeWidth="2.5"
                strokeDasharray={point.place.basis === 'quran' ? undefined : '3 3'}
              />
              <text
                x={point.x}
                y={point.y + 3.5}
                textAnchor="middle"
                fontSize="10"
                fill="var(--ink-muted)"
                fontFamily="var(--font-body)"
              >
                {i + 1}
              </text>
              <text
                x={point.x + 15}
                y={point.y + 4}
                fontSize="13"
                fill="var(--ink)"
                fontFamily="var(--font-display)"
              >
                {point.place.name}
              </text>
            </g>
          ))}
        </svg>
      </figure>

      <ul className="mt-5 space-y-2.5">
        {unique.map((stop, i) => (
          <li key={stop.place.id} className="flex gap-3 text-sm leading-relaxed">
            <span aria-hidden className="shrink-0 text-ink-faint">
              {i + 1}
            </span>
            <span>
              <span className="text-ink">{stop.place.name}</span>
              <span className="text-ink-muted"> — {stop.place.note}</span>
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-faint">
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden
            className="inline-block size-3 rounded-full border-2 border-emerald"
          />
          Named in the Quran
        </span>
        {hasTraditional && (
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block size-3 rounded-full border-2 border-dashed border-line-strong"
            />
            From the historical literature, not named in the Quran
          </span>
        )}
      </p>
    </section>
  );
}
