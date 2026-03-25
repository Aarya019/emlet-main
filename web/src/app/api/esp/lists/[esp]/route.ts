/**
 * GET /api/esp/lists/[esp] — fetch mailing lists from a connected ESP
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { decrypt } from '@/lib/crypto/encrypt';
import { getAdapter, ESP_SLUGS } from '@/lib/esp';
import type { EspSlug } from '@/lib/esp/types';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ esp: string }> }
) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { esp } = await params;
  if (!ESP_SLUGS.includes(esp as EspSlug)) {
    return NextResponse.json({ error: 'Invalid ESP' }, { status: 400 });
  }

  const { data: conn, error: connErr } = await supabase
    .from('esp_connections')
    .select('encrypted_access_token, extra_metadata')
    .eq('user_id', user.id)
    .eq('esp_slug', esp)
    .eq('is_active', true)
    .single();

  if (connErr || !conn) {
    return NextResponse.json({ error: `No active ${esp} connection` }, { status: 404 });
  }

  let accessToken: string;
  try {
    accessToken = decrypt(conn.encrypted_access_token);
  } catch {
    return NextResponse.json({ error: 'Failed to decrypt credentials' }, { status: 500 });
  }

  const adapter = getAdapter(esp as EspSlug);
  try {
    const lists = await adapter.fetchLists({
      accessToken,
      metadata: (conn.extra_metadata ?? {}) as Record<string, string>,
    });
    return NextResponse.json({ lists });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Failed to fetch lists' }, { status: 502 });
  }
}
