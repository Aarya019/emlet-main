import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { 
  getBrandProfile, 
  updateBrandProfile, 
  deleteBrandProfile 
} from '@/lib/db/queries';
import type { BrandProfileUpdate } from '@/lib/db/types';

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
  const profile = await getBrandProfile(id, user.id);
  
  if (!profile) {
    return NextResponse.json(
      { error: 'Brand profile not found' }, 
      { status: 404 }
    );
  }

  return NextResponse.json({ profile });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id } = await params;

    const updates: BrandProfileUpdate = {
      brand_name: body.brand_name,
      industry: body.industry,
      brand_voice: body.brand_voice,
      primary_color: body.primary_color,
      secondary_color: body.secondary_color,
      brand_description: body.brand_description,
      logo_url: body.logo_url,
      website_url: body.website_url,
      is_default: body.is_default,
    };

    // Remove undefined values
    Object.keys(updates).forEach(key => {
      if (updates[key as keyof BrandProfileUpdate] === undefined) {
        delete updates[key as keyof BrandProfileUpdate];
      }
    });

    const profile = await updateBrandProfile(id, user.id, updates);
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Failed to update brand profile' }, 
        { status: 500 }
      );
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error in PUT /api/brand-profiles/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
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
  const success = await deleteBrandProfile(id, user.id);
  
  if (!success) {
    return NextResponse.json(
      { error: 'Failed to delete brand profile' }, 
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
