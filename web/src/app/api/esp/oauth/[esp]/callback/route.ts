/**
 * GET /api/esp/oauth/[esp]/callback — handle OAuth callback
 *
 * Verifies state HMAC, exchanges code for tokens, validates credentials,
 * encrypts and stores them, then redirects to dashboard.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createHmac } from 'crypto';
import { encrypt } from '@/lib/crypto/encrypt';
import { getAdapter } from '@/lib/esp';
import type { EspSlug } from '@/lib/esp/types';

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}

const TOKEN_ENDPOINTS: Record<string, { tokenUrl: string }> = {
  mailchimp: { tokenUrl: 'https://login.mailchimp.com/oauth2/token' },
};

function verifyState(state: string): { userId: string; esp: string } | null {
  try {
    const decoded = Buffer.from(state, 'base64url').toString('utf8');
    const parts = decoded.split(':');
    // format: userId:esp:expiry:nonce:signature
    if (parts.length !== 5) return null;
    const [userId, esp, expiryStr, nonce, sig] = parts;
    const expiry = Number(expiryStr);
    if (Date.now() > expiry) return null; // expired

    const payload = `${userId}:${esp}:${expiry}:${nonce}`;
    const key = process.env.ESP_ENCRYPTION_KEY ?? '';
    const expectedSig = createHmac('sha256', key).update(payload).digest('hex');
    if (sig !== expectedSig) return null; // tampered
    return { userId, esp };
  } catch {
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ esp: string }> }
) {
  const { esp } = await params;
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const errorParam = searchParams.get('error');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const dashboardUrl = `${appUrl}/dashboard`;

  if (errorParam) {
    return NextResponse.redirect(`${dashboardUrl}?tab=user&esp_error=${encodeURIComponent(errorParam)}`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${dashboardUrl}?tab=user&esp_error=missing_params`);
  }

  // Verify CSRF state
  const stateData = verifyState(state);
  if (!stateData) {
    return NextResponse.redirect(`${dashboardUrl}?tab=user&esp_error=invalid_state`);
  }

  // Confirm the authenticated user matches state
  const supabase = await createClient();
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user || user.id !== stateData.userId) {
    return NextResponse.redirect(`${dashboardUrl}?tab=user&esp_error=auth_mismatch`);
  }

  const tokenConfig = TOKEN_ENDPOINTS[esp];
  if (!tokenConfig) {
    return NextResponse.redirect(`${dashboardUrl}?tab=user&esp_error=unsupported_esp`);
  }

  const clientId = process.env[`${esp.toUpperCase()}_CLIENT_ID`] ?? '';
  const clientSecret = process.env[`${esp.toUpperCase()}_CLIENT_SECRET`] ?? '';
  const redirectUri = `${appUrl}/api/esp/oauth/${esp}/callback`;

  // Exchange code for tokens
  let tokens: TokenResponse;
  try {
    const tokenRes = await fetch(tokenConfig.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }).toString(),
    });
    if (!tokenRes.ok) {
      const body = await tokenRes.text();
      console.error(`OAuth token exchange failed for ${esp}: ${body}`);
      return NextResponse.redirect(`${dashboardUrl}?tab=user&esp_error=token_exchange_failed`);
    }
    tokens = await tokenRes.json();
  } catch (e) {
    console.error(`OAuth token exchange error for ${esp}:`, e);
    return NextResponse.redirect(`${dashboardUrl}?tab=user&esp_error=token_exchange_error`);
  }

  // Validate credentials and get account info
  const adapter = getAdapter(esp as EspSlug);
  let validateResult;
  try {
    validateResult = await adapter.validateCredentials({
      accessToken: tokens.access_token,
      metadata: {},
    });
  } catch (e) {
    console.error(`ESP validation failed for ${esp}:`, e);
    return NextResponse.redirect(`${dashboardUrl}?tab=user&esp_error=validation_failed`);
  }

  const expiresAt = tokens.expires_in
    ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
    : null;

  const { error: upsertErr } = await supabase
    .from('esp_connections')
    .upsert(
      {
        user_id: user.id,
        esp_slug: esp,
        encrypted_access_token: encrypt(tokens.access_token),
        encrypted_refresh_token: tokens.refresh_token ? encrypt(tokens.refresh_token) : null,
        token_expires_at: expiresAt,
        account_name: validateResult.accountName,
        extra_metadata: validateResult.metadata ?? {},
        is_active: true,
      },
      { onConflict: 'user_id,esp_slug' }
    );

  if (upsertErr) {
    console.error('Failed to save ESP connection:', upsertErr);
    return NextResponse.redirect(`${dashboardUrl}?tab=user&esp_error=save_failed`);
  }

  return NextResponse.redirect(`${dashboardUrl}?tab=user&esp_connected=${esp}`);
}
