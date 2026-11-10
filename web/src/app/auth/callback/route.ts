import { exchangeCodeAndRedirect } from '@/lib/supabase/callback';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // Only same-site paths: a value like "@evil.com" or "//evil.com" would otherwise turn the redirect
  // below (`https://${forwardedHost}${next}`) into one that leaves the site.
  const requestedNext = searchParams.get('next');
  const next = requestedNext && /^\/(?![/\\])/.test(requestedNext) ? requestedNext : '/dashboard';
  return exchangeCodeAndRedirect(request, next, { recordSource: true });
}
