'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduceMotion = useReducedMotion();

  const rise = (delay: number) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: EASE_OUT_EXPO },
  });

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-line"
    >
      <div className="ornament-field pointer-events-none absolute inset-0" aria-hidden />

      {/* The word itself, bled off the right edge — structure, not decoration. */}
      <motion.span
        lang="ar"
        dir="rtl"
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
        className="pointer-events-none absolute -right-8 top-1/2 hidden -translate-y-1/2 select-none text-[14rem] leading-none text-gold/12 lg:block xl:text-[18rem]"
      >
        سَبِيل
      </motion.span>

      <div className="relative mx-auto max-w-6xl px-5 pb-section pt-24 sm:px-8 sm:pt-32">
        <motion.p
          {...rise(0)}
          className="font-display text-sm uppercase tracking-[0.3em] text-gold-ink"
        >
          Sabeel · <span lang="ar" dir="rtl">سَبِيل</span> · the path
        </motion.p>

        <motion.h1
          {...rise(0.08)}
          id="hero-heading"
          className="mt-7 max-w-3xl font-display text-hero font-light tracking-[-0.02em] text-ink"
        >
          Learn Islam
          <br />
          <span className="italic text-emerald">from the sources.</span>
        </motion.h1>

        <motion.div {...rise(0.16)} className="hairline-gold mt-10 h-px w-40" />

        <motion.p
          {...rise(0.2)}
          className="mt-8 max-w-xl text-lede leading-relaxed text-ink-muted"
        >
          Whether you are taking your first step, finding your way back, or going deeper —
          this is a calm place to learn. Every verse, every narration, every claim is
          traceable to where it came from.
        </motion.p>

        <motion.div {...rise(0.28)} className="mt-11 flex flex-wrap items-center gap-4">
          <Link
            href="/roadmap"
            className="group inline-flex items-center gap-2 rounded-full bg-emerald px-7 py-3.5 text-sm font-medium text-surface shadow-paper transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-lift"
          >
            Start from the beginning
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
          <Link
            href="/quran"
            className="inline-flex items-center rounded-full border border-line-strong px-7 py-3.5 text-sm font-medium text-ink transition-colors duration-300 hover:border-emerald hover:text-emerald"
          >
            Read the Quran
          </Link>
        </motion.div>

        <motion.p {...rise(0.36)} className="mt-8 text-sm text-ink-faint">
          Free. No account needed to read.
        </motion.p>
      </div>
    </section>
  );
}
