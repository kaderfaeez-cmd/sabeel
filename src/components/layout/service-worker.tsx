'use client';

import { useEffect } from 'react';

/**
 * Registers the service worker.
 *
 * Registered after load so it never competes with the first paint. Failure is silent by
 * design — a browser that refuses service workers (private mode, older Safari, locked-down
 * enterprise policy) should still get the whole site, just without offline support.
 */
export function ServiceWorker() {
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
    if (process.env.NODE_ENV !== 'production') return;

    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Offline support is an enhancement; the site works without it.
      });
    };

    if (document.readyState === 'complete') {
      register();
    } else {
      window.addEventListener('load', register, { once: true });
    }
  }, []);

  return null;
}
