import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Shared PKCE code-exchange handler for /auth/callback routes. `next` is
 * hardcoded per-route rather than read from a query param on the incoming
 * request — Supabase's redirect_to validation doesn't reliably preserve an
 * existing query string when it appends its own "?code=...", so a URL like
 * "/auth/callback?next=/reset-password" can arrive back with "next" gone
 * and only "code" surviving. A dedicated path per destination sidesteps
 * that entirely.
 */
export async function exchangeCodeAndRedirect(request: Request, next: string): Promise<NextResponse> {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development';
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
