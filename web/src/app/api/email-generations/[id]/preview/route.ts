import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getEmailGeneration, getBrandProfile } from '@/lib/db/queries';
import { generateEmailHtml } from '@/lib/email/renderer';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const generation = await getEmailGeneration(id, user.id);
  if (!generation) {
    return NextResponse.json({ error: 'Email not found' }, { status: 404 });
  }

  const body = await request.json();
  const { content_json } = body;

  if (!content_json || typeof content_json !== 'object') {
    return NextResponse.json({ error: 'Invalid content_json' }, { status: 400 });
  }

  let brandProfile = null;
  if (generation.brand_profile_id) {
    brandProfile = await getBrandProfile(generation.brand_profile_id, user.id);
  }

  const { html } = await generateEmailHtml(content_json, generation.design_style, brandProfile, true);

  return NextResponse.json({ html });
}
