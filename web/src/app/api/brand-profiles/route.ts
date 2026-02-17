import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getBrandProfiles, createBrandProfile } from '@/lib/db/queries';
import type { BrandProfileInsert } from '@/lib/db/types';

export async function GET() {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profiles = await getBrandProfiles(user.id);
  
  return NextResponse.json({ profiles });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.brand_name) {
      return NextResponse.json(
        { error: 'Brand name is required' }, 
        { status: 400 }
      );
    }

    const profileData: BrandProfileInsert = {
      user_id: user.id,
      brand_name: body.brand_name,
      industry: body.industry || null,
      brand_voice: body.brand_voice || 'professional',
      primary_color: body.primary_color || '#5c5cf0',
      secondary_color: body.secondary_color || null,
      brand_description: body.brand_description || null,
      logo_url: body.logo_url || null,
      website_url: body.website_url || null,
      is_default: body.is_default ?? false,
    };

    const profile = await createBrandProfile(profileData);
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Failed to create brand profile' }, 
        { status: 500 }
      );
    }

    return NextResponse.json({ profile }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/brand-profiles:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
