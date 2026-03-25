/**
 * GET  /api/esp/connections — list user's connected ESPs (no tokens returned)
 * POST /api/esp/connections — connect an API-key ESP
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { encrypt } from '@/lib/crypto/encrypt';
import { getAdapter, ESP_META, ESP_SLUGS } from '@/lib/esp';
import type { EspSlug } from '@/lib/esp/types';

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error: dbErr } = await supabase
    .from('esp_connections')
    .select('esp_slug, account_name, is_active, extra_metadata, created_at')
    .eq('user_id', user.id)
    .eq('is_active', true);

  if (dbErr) return NextResponse.json({ error: 'Failed to fetch connections' }, { status: 500 });

  return NextResponse.json({ connections: data ?? [] });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { espSlug, apiKey, extraMetadata } = body as { espSlug: string; apiKey: string; extraMetadata?: Record<string, string> };

  if (!espSlug || !ESP_SLUGS.includes(espSlug as EspSlug)) {
    return NextResponse.json({ error: 'Invalid ESP' }, { status: 400 });
  }
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length < 8) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 400 });
  }

  const slug = espSlug as EspSlug;
  const meta = ESP_META[slug];

  // Only API-key ESPs are handled here; OAuth ESPs go through /api/esp/oauth/[esp]
  if (meta.authType !== 'apikey') {
    return NextResponse.json({ error: 'Use OAuth flow for this ESP' }, { status: 400 });
  }

  // Validate the key against the real API
  const adapter = getAdapter(slug);
  let validateResult;
  try {
    validateResult = await adapter.validateCredentials({
      accessToken: apiKey.trim(),
      metadata: {},
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: `Could not connect to ${meta.name}: ${e.message}` },
      { status: 422 }
    );
  }

  const encryptedToken = encrypt(apiKey.trim());

  const { error: upsertErr } = await supabase
    .from('esp_connections')
    .upsert(
      {
        user_id: user.id,
        esp_slug: slug,
        encrypted_access_token: encryptedToken,
        encrypted_refresh_token: null,
        token_expires_at: null,
        account_name: validateResult.accountName,
        extra_metadata: { ...(validateResult.metadata ?? {}), ...(extraMetadata ?? {}) },
        is_active: true,
      },
      { onConflict: 'user_id,esp_slug' }
    );

  if (upsertErr) return NextResponse.json({ error: 'Failed to save connection' }, { status: 500 });

  return NextResponse.json({
    connection: {
      esp_slug: slug,
      account_name: validateResult.accountName,
      is_active: true,
    },
  });
}
