import type { Metadata, Viewport } from 'next';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { ThemeScript } from '@/components/theme/theme-script';
import { fontVariables } from '@/lib/fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://sabeel.app'),
  title: {
    default: 'Sabeel — the path',
    template: '%s · Sabeel',
  },
  description:
    'Learn Islam from authentic sources. The Quran with trusted translations and recitation, prayer and purification guides, duas, and the stories of the Quran — every word traceable to its source.',
  keywords: [
    'Islam',
    'Quran',
    'learn Islam',
    'new Muslim',
    'revert',
    'salah',
    'wudhu',
    'dua',
    'hadith',
  ],
  openGraph: {
    type: 'website',
    siteName: 'Sabeel',
    title: 'Sabeel — the path',
    description:
      'Learn Islam from authentic sources. Every word traceable to its source.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f4ed' },
    { media: '(prefers-color-scheme: dark)', color: '#101d1f' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${fontVariables} min-h-dvh antialiased`}>
        <a href="#main" className="skip-link rounded-full bg-emerald px-4 py-2 text-sm text-surface">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
