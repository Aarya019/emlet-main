/**
 * GET /api/esp/oauth/[esp] — initiate OAuth flow
 *
 * Builds the ESP's authorization URL and redirects the user there.
 * A signed state token (HMAC-SHA256 over userId+esp+expiry) prevents CSRF.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createHmac, randomBytes } from 'crypto';

const OAUTH_CONFIGS: Record<string, { authUrl: string; scopes: string }> = {
  mailchimp: {
    authUrl: 'https://login.mailchimp.com/oauth2/authorize',
    scopes: '',
  },
};

function signState(payload: string): string {
  const key = process.env.ESP_ENCRYPTION_KEY ?? '';
  return createHmac('sha256', key).update(payload).digest('hex');
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ esp: string }> }
) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { esp } = await params;
  const oauthConfig = OAUTH_CONFIGS[esp];
  if (!oauthConfig) {
    return NextResponse.json({ error: `OAuth not supported for: ${esp}` }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const redirectUri = `${appUrl}/api/esp/oauth/${esp}/callback`;

  // State: base64(userId:esp:expiry:nonce) + HMAC signature
  const expiry = Date.now() + 10 * 60 * 1000; // 10 min
  const nonce = randomBytes(8).toString('hex');
  const payload = `${user.id}:${esp}:${expiry}:${nonce}`;
  const sig = signState(payload);
  const state = Buffer.from(`${payload}:${sig}`).toString('base64url');

  const clientId = process.env[`${esp.toUpperCase()}_CLIENT_ID`];
  if (!clientId) {
    return NextResponse.json({ error: `${esp.toUpperCase()}_CLIENT_ID not configured` }, { status: 500 });
  }

  const authorizeUrl = new URL(oauthConfig.authUrl);
  authorizeUrl.searchParams.set('response_type', 'code');
  authorizeUrl.searchParams.set('client_id', clientId);
  authorizeUrl.searchParams.set('redirect_uri', redirectUri);
  authorizeUrl.searchParams.set('state', state);
  if (oauthConfig.scopes) authorizeUrl.searchParams.set('scope', oauthConfig.scopes);

  return NextResponse.redirect(authorizeUrl.toString());
}
