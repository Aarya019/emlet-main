'use client';

import { useEffect } from 'react';

/**
 * Supabase auth errors (expired/invalid links, failed recovery tokens) don't
 * always come back through our own /auth/callback route — if the email's
 * redirect_to wasn't honored (e.g. not on the Supabase redirect allow-list),
 * Supabase falls back to the project's bare Site URL and appends the error
 * as hash/query params there instead. Mounted in the root layout so that
 * lands on the friendly /auth/auth-code-error page no matter which page it
 * surfaces on, rather than dumping raw error params in the address bar.
 */
export default function AuthErrorRedirect() {
  useEffect(() => {
    if (window.location.pathname === '/auth/auth-code-error') return;

    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const search = new URLSearchParams(window.location.search);
    const errorCode = hash.get('error_code') || search.get('error_code');
    const error = hash.get('error') || search.get('error');
    if (!errorCode && !error) return;

    const params = new URLSearchParams();
    for (const key of ['error', 'error_code', 'error_description']) {
      const value = hash.get(key) || search.get(key);
      if (value) params.set(key, value);
    }
    window.location.replace(`/auth/auth-code-error?${params.toString()}`);
  }, []);

  return null;
}
