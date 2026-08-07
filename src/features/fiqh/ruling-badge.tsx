import { RULING_LABEL, type RulingClass } from '@/lib/content/types';
import { cn } from '@/lib/utils';

/**
 * FIQH-POLICY §3: every action is labelled by weight, so a beginner can tell what is
 * essential from what varies. The type makes `ruling` required with no default, and this
 * component makes it visible on every step.
 */

const STYLE: Record<RulingClass, string> = {
  pillar: 'border-emerald text-emerald',
  obligatory: 'border-emerald/60 text-emerald',
  sunnah: 'border-gold/60 text-gold-ink',
  recommended: 'border-line-strong text-ink-faint',
};

const EXPLANATION: Record<RulingClass, string> = {
  pillar: 'Without this, the act is not valid.',
  obligatory: 'Required where it applies.',
  sunnah: 'The established practice of the Prophet ﷺ.',
  recommended: 'Encouraged, but not required.',
};

export function RulingBadge({ ruling }: { ruling: RulingClass }) {
  const label = RULING_LABEL[ruling];

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[0.7rem] uppercase tracking-wider',
        STYLE[ruling],
      )}
      title={EXPLANATION[ruling]}
    >
      {label.en}
      <span lang="ar" dir="rtl" className="normal-case tracking-normal opacity-70">
        {label.ar}
      </span>
    </span>
  );
}

/** A legend so the badges are meaningful the first time a reader sees them. */
export function RulingLegend() {
  const order: readonly RulingClass[] = ['pillar', 'obligatory', 'sunnah', 'recommended'];

  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {order.map((ruling) => (
        <div key={ruling} className="flex items-start gap-3">
          <dt className="shrink-0">
            <RulingBadge ruling={ruling} />
          </dt>
          <dd className="text-sm leading-relaxed text-ink-muted">{EXPLANATION[ruling]}</dd>
        </div>
      ))}
    </dl>
  );
}
