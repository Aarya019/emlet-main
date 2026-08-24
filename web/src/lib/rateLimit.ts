import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Fixed-window per-user rate limit backed by the `check_rate_limit` Postgres
 * function (atomic increment-and-check, one row per user+route+window — see
 * migration 20260720_scaling_fixes.sql). Fails OPEN: if the limiter itself
 * errors, the request is allowed through rather than blocking real users
 * because of a DB hiccup.
 */
export async function checkRateLimit(
  userId: string,
  route: string,
  windowSeconds: number,
  maxRequests: number,
): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('check_rate_limit', {
    user_uuid: userId,
    route_name: route,
    window_seconds: windowSeconds,
    max_requests: maxRequests,
  });

  if (error) {
    console.error(`Rate limit check failed for route "${route}":`, error);
    return true;
  }

  return !!data;
}

export function rateLimitResponse(): NextResponse {
  return NextResponse.json(
    { error: 'Too many requests — please slow down and try again in a moment.' },
    { status: 429 },
  );
}
