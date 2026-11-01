import { NextResponse } from 'next/server';
import { consentRequiredFor } from '@/lib/consent';

// Per-visitor answer (it depends on where they are), so never cached or shared.
export const dynamic = 'force-dynamic';

/** Does this visitor's region require cookie consent? Read from the CDN's geo header. */
export async function GET(request: Request) {
  const country = request.headers.get('x-vercel-ip-country');
  return NextResponse.json(
    { consentRequired: consentRequiredFor(country) },
    { headers: { 'Cache-Control': 'private, no-store' } },
  );
}
