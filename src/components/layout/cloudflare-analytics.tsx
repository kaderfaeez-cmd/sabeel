import Script from 'next/script';

/**
 * Cloudflare Web Analytics: a cookieless, aggregate page-view beacon — no cookies, no
 * fingerprinting, no consent banner — feeding the owner's private dashboard. Production
 * deploys only, so local dev and previews never skew the numbers. The token is public.
 */
const BEACON_TOKEN = 'acd630c1e3984c888728e809d2ad4561';

export function CloudflareAnalytics() {
  if (process.env.VERCEL_ENV !== 'production') return null;
  return (
    <Script
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token: BEACON_TOKEN })}
      strategy="afterInteractive"
    />
  );
}
