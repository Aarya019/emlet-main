'use client';

import Script from 'next/script';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState, useSyncExternalStore } from 'react';
import { readTheme, subscribeToTheme, type Theme } from '@/lib/theme';

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
  }
}

export interface TurnstileHandle {
  /** Get a fresh token from the same widget — call after any failed submit, since tokens are single-use. */
  reset: () => void;
}

/**
 * Renders a Cloudflare Turnstile widget, if NEXT_PUBLIC_TURNSTILE_SITE_KEY is set.
 * Renders nothing (and callers should treat verification as a no-op) when unset,
 * so the app works before Cloudflare is configured.
 */
const Turnstile = forwardRef<TurnstileHandle, {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  className?: string;
}>(function Turnstile({ onVerify, onExpire, className }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  // The widget has its own colour scheme, so it is drawn in the site's current theme (and redrawn if the visitor switches).
  const theme = useSyncExternalStore(subscribeToTheme, readTheme, (): Theme => 'light');

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
    },
  }));

  useEffect(() => {
    if (!scriptReady || !siteKey || !containerRef.current || !window.turnstile) return;

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme,
      callback: (token: string) => onVerify(token),
      'expired-callback': () => onExpire?.(),
    });

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptReady, siteKey, theme]);

  if (!siteKey) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />
      <div ref={containerRef} className={className} />
    </>
  );
});

export default Turnstile;
