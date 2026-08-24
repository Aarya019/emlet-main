import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getEmailGeneration, getBrandProfile, getOrCreateProfile } from '@/lib/db/queries';
import { generateEmailHtml, styleConfigs } from '@/lib/email/renderer';

export async function GET(
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
    return NextResponse.json(
      { error: 'Email not found' }, 
      { status: 404 }
    );
  }

  let brand = null;
  if (generation.brand_profile_id) {
    brand = await getBrandProfile(generation.brand_profile_id, user.id);
  }

  const config = styleConfigs[generation.design_style] || styleConfigs.minimalist;
  const defaultColors = {
    bodyBg:      config.bodyBg,
    bodyColor:   config.bodyColor,
    primaryColor: brand?.primary_color   || '#5c5cf0',
    secondaryColor: brand?.secondary_color || brand?.primary_color || '#5c5cf0',
  };

  const profile = await getOrCreateProfile(user.id);
  const trialStatus = profile ? {
    planType: profile.plan_type,
    aiEditUsed: profile.free_ai_edit_used,
    blockRegenerateUsed: profile.free_block_regenerate_used,
    testEmailUsed: profile.free_test_email_used,
  } : null;

  return NextResponse.json({ generation, defaultColors, trialStatus });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // Only delete if it belongs to this user
  const { error } = await supabase
    .from('email_generations')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting email generation:', error);
    return NextResponse.json({ error: 'Failed to delete email' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(
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

  // Re-render the email HTML from updated content
  let html_code = generation.html_code;
  const subject_line: string = content_json.subject || generation.subject_line || '';
  const preview_text: string = content_json.previewText || generation.preview_text || '';

  try {
    let brandProfile = null;
    if (generation.brand_profile_id) {
      brandProfile = await getBrandProfile(generation.brand_profile_id, user.id);
    }
    const { html } = await generateEmailHtml(content_json, generation.design_style, brandProfile);
    html_code = html;
  } catch (err) {
    console.error('Re-render failed, saving content only:', err);
  }

  const { data, error } = await supabase
    .from('email_generations')
    .update({ content_json, html_code, subject_line, preview_text })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating email generation:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }

  return NextResponse.json({ generation: data });
}
