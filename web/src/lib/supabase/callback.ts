import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { SOURCE_COOKIE, parseAttribution } from '@/lib/attribution';

const JUST_CONFIRMED_MS = 10 * 60 * 1000;

/**
 * Tag a brand-new account with the channel that brought it in (the Google sign-up path never goes through
 * the signUp action, and an email sign-up confirmed in another browser has no cookie there). Only accounts
 * confirmed in the last few minutes, and only when not already tagged, so a returning user is never
 * re-labelled. Best effort: attribution must never get in the way of signing in.
 */
async function recordSignupSource(supabase: Awaited<ReturnType<typeof createClient>>) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.user_metadata?.signup_source) return;
    const confirmedAt = user.email_confirmed_at ?? user.confirmed_at;
    if (!confirmedAt || Date.now() - new Date(confirmedAt).getTime() > JUST_CONFIRMED_MS) return;
    const source = parseAttribution((await cookies()).get(SOURCE_COOKIE)?.value);
    if (!source) return;
    await supabase.auth.updateUser({ data: { signup_source: source } });
  } catch {
    // ignore
  }
}

/**
 * Shared PKCE code-exchange handler for /auth/callback routes. `next` is
 * hardcoded per-route rather than read from a query param on the incoming
 * request — Supabase's redirect_to validation doesn't reliably preserve an
 * existing query string when it appends its own "?code=...", so a URL like
 * "/auth/callback?next=/reset-password" can arrive back with "next" gone
 * and only "code" surviving. A dedicated path per destination sidesteps
 * that entirely.
 */
export async function exchangeCodeAndRedirect(
  request: Request,
  next: string,
  options: { recordSource?: boolean } = {},
): Promise<NextResponse> {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (options.recordSource) await recordSignupSource(supabase);
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
