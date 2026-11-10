'use client';

import { useEffect } from 'react';
import { SOURCE_COOKIE, SOURCE_COOKIE_MAX_AGE, readAttribution } from '@/lib/attribution';

/**
 * Remembers where a visitor first came from (UTM tags, ?ref=, ?template=, referring site) in a first-party
 * cookie, so the account they later create can be tied to a channel. Never overwrites an existing value.
 */
export default function SourceCapture() {
  useEffect(() => {
    try {
      if (document.cookie.split('; ').some((c) => c.startsWith(`${SOURCE_COOKIE}=`))) return;
      const attribution = readAttribution(new URL(window.location.href), document.referrer);
      if (!attribution) return;
      const secure = window.location.protocol === 'https:' ? '; secure' : '';
      document.cookie = `${SOURCE_COOKIE}=${encodeURIComponent(JSON.stringify(attribution))}; max-age=${SOURCE_COOKIE_MAX_AGE}; path=/; samesite=lax${secure}`;
    } catch {
      // attribution is optional: never break the page over it
    }
  }, []);

  return null;
}
