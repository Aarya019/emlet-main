import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getEmailGeneration } from '@/lib/db/queries';

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

  return NextResponse.json({ generation });
}
