'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import SourceCapture from '@/components/SourceCapture';
import {
  GA_MEASUREMENT_ID,
  OPEN_CONSENT_EVENT,
  REGION_SESSION_KEY,
  clearAnalyticsCookies,
  readStoredConsent,
  storeConsent,
} from '@/lib/consent';

/**
 * Loads Google Analytics and the attribution cookie only when allowed, and shows the consent banner where
 * the law requires asking (EU, UK, Switzerland, or an unknown region). Elsewhere they load as before and
 * no banner appears unless the visitor opens "Cookie settings".
 */
export default function ConsentManager() {
  const [allowed, setAllowed] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      // An earlier choice always wins.
      const stored = readStoredConsent();
      if (stored) {
        setAllowed(stored.analytics);
        return;
      }

      let region: string | null = null;
      try {
        region = window.sessionStorage.getItem(REGION_SESSION_KEY);
      } catch {
        // ignore
      }
      if (region !== 'required' && region !== 'not-required') {
        try {
          const res = await fetch('/api/region', { cache: 'no-store' });
          const data = (await res.json()) as { consentRequired?: boolean };
          region = data.consentRequired === false ? 'not-required' : 'required';
          try {
            window.sessionStorage.setItem(REGION_SESSION_KEY, region);
          } catch {
            // ignore
          }
        } catch {
          region = 'required'; // can't tell: ask
        }
      }
      if (cancelled) return;
      if (region === 'not-required') setAllowed(true);
      else setBannerOpen(true);
    }
    void init();

    const open = () => setBannerOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, open);
    return () => {
      cancelled = true;
      window.removeEventListener(OPEN_CONSENT_EVENT, open);
    };
  }, []);

  function choose(analytics: boolean) {
    storeConsent(analytics);
    // Google's documented switch for turning measurement off on this page without a reload.
    (window as unknown as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`] = !analytics;
    if (!analytics) clearAnalyticsCookies();
    setAllowed(analytics);
    setBannerOpen(false);
  }

  return (
    <>
      {allowed && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="lazyOnload" />
          <Script id="gtag-init" strategy="lazyOnload">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}</Script>
          <Suspense fallback={null}>
            <GoogleAnalytics />
          </Suspense>
          <SourceCapture />
        </>
      )}

      {bannerOpen && (
        <div
          role="region"
          aria-label="Cookie consent"
          className="fixed inset-x-4 bottom-4 z-[60] rounded-2xl border border-white/15 bg-black/95 p-5 text-white shadow-2xl backdrop-blur sm:right-auto sm:max-w-md"
        >
          <p className="mb-1 text-sm font-bold">Cookies</p>
          <p className="mb-4 text-sm leading-relaxed text-white/60">
            We&apos;d like to use Google Analytics, and one small cookie that records which link brought you here, to see what is useful. Nothing is set unless you accept, and the site works the same either way.{' '}
            <Link href="/privacy" className="text-white underline underline-offset-2 hover:text-[#00ffff]">
              Privacy policy
            </Link>
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => choose(false)}
              className="flex-1 rounded-xl border border-white/30 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={() => choose(true)}
              className="flex-1 rounded-xl border border-white bg-white px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-white/85"
            >
              Accept
            </button>
          </div>
        </div>
      )}
    </>
  );
}
