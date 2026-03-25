/**
 * POST /api/esp/push — push a generated email to a connected ESP
 *
 * Body: {
 *   emailGenerationId: string
 *   espSlug: EspSlug
 *   pushType: 'template' | 'campaign_draft'
 *   listId?: string       — required when pushType = 'campaign_draft'
 *   fromName?: string
 *   fromEmail?: string
 * }
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { decrypt } from '@/lib/crypto/encrypt';
import { getAdapter, ESP_SLUGS } from '@/lib/esp';
import { getEmailGeneration } from '@/lib/db/queries';
import type { EspSlug } from '@/lib/esp/types';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { emailGenerationId, espSlug, pushType, listId, fromName, fromEmail } = body as {
    emailGenerationId: string;
    espSlug: string;
    pushType: 'template' | 'campaign_draft';
    listId?: string;
    fromName?: string;
    fromEmail?: string;
  };

  if (!emailGenerationId || typeof emailGenerationId !== 'string') {
    return NextResponse.json({ error: 'Missing emailGenerationId' }, { status: 400 });
  }
  if (!ESP_SLUGS.includes(espSlug as EspSlug)) {
    return NextResponse.json({ error: 'Invalid ESP' }, { status: 400 });
  }
  if (pushType !== 'template' && pushType !== 'campaign_draft') {
    return NextResponse.json({ error: 'pushType must be template or campaign_draft' }, { status: 400 });
  }

  // Fetch the email (enforces user ownership via queries.ts)
  const emailGen = await getEmailGeneration(emailGenerationId, user.id);
  if (!emailGen) return NextResponse.json({ error: 'Email not found' }, { status: 404 });
  if (!emailGen.html_code) return NextResponse.json({ error: 'Email has no HTML' }, { status: 400 });

  // Fetch the ESP connection
  const { data: conn, error: connErr } = await supabase
    .from('esp_connections')
    .select('encrypted_access_token, extra_metadata')
    .eq('user_id', user.id)
    .eq('esp_slug', espSlug)
    .eq('is_active', true)
    .single();

  if (connErr || !conn) {
    return NextResponse.json({ error: `No active ${espSlug} connection found` }, { status: 404 });
  }

  let accessToken: string;
  try {
    accessToken = decrypt(conn.encrypted_access_token);
  } catch {
    return NextResponse.json({ error: 'Failed to decrypt credentials' }, { status: 500 });
  }

  const creds = {
    accessToken,
    metadata: (conn.extra_metadata ?? {}) as Record<string, string>,
  };

  const adapter = getAdapter(espSlug as EspSlug);
  const emailName = emailGen.subject_line ?? `Emlet Email ${new Date().toLocaleDateString()}`;

  try {
    let result;
    if (pushType === 'template') {
      result = await adapter.createTemplate(creds, {
        name: emailName,
        html: emailGen.html_code,
        fromName: fromName,
        fromEmail: fromEmail,
      });
    } else {
      result = await adapter.createCampaignDraft(creds, {
        name: emailName,
        subject: emailGen.subject_line ?? emailName,
        previewText: emailGen.preview_text ?? undefined,
        html: emailGen.html_code,
        fromName: fromName,
        fromEmail: fromEmail,
        listId: listId,
      });
    }
    return NextResponse.json({ result });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Push failed' }, { status: 502 });
  }
}
