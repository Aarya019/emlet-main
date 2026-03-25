/**
 * DELETE /api/esp/connections/[esp] — disconnect an ESP
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ESP_SLUGS } from '@/lib/esp';
import type { EspSlug } from '@/lib/esp/types';

export async function DELETE(
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

  const { error: dbErr } = await supabase
    .from('esp_connections')
    .update({ is_active: false })
    .eq('user_id', user.id)
    .eq('esp_slug', esp);

  if (dbErr) return NextResponse.json({ error: 'Failed to disconnect' }, { status: 500 });

  return NextResponse.json({ success: true });
}
