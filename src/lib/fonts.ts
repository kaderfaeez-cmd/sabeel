import { Amiri, Cormorant_Garamond, Inter } from 'next/font/google';

/**
 * Typography pairing for SABEEL.
 *
 * The direction is "illuminated manuscript": a classical serif carries voice and
 * gravitas, a neutral sans carries long-form legibility, and a true naskh face carries
 * Arabic. Three families is one more than the usual budget — justified because Arabic
 * is not a stylistic choice here, it is the primary text of the platform.
 */

/** Display / editorial voice. Headings, pull quotes, numerals in ornament. */
export const fontDisplay = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

/** UI and body. Chosen for legibility at small sizes and in long reading sessions. */
export const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

/**
 * Arabic. Amiri is a revival of Bulaq naskh — the tradition used for printed
 * mushaf typesetting — so Quranic text renders in a form readers recognise.
 */
export const fontArabic = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-arabic',
  display: 'swap',
});

export const fontVariables = [
  fontDisplay.variable,
  fontBody.variable,
  fontArabic.variable,
].join(' ');
