import type { Metadata, Viewport } from 'next';
import { SiteBackground } from '@/components/layout/site-background';
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
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  appleWebApp: { capable: true, title: 'Sabeel', statusBarStyle: 'black-translucent' },
  openGraph: {
    type: 'website',
    siteName: 'Sabeel',
    title: 'Sabeel — the path',
    description:
      'Learn Islam from authentic sources. Every word traceable to where it came from.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Sabeel — the path' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sabeel — the path',
    description:
      'Learn Islam from authentic sources. Every word traceable to where it came from.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f4ed' },
    { media: '(prefers-color-scheme: dark)', color: '#0d1b33' },
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
        <SiteBackground />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
