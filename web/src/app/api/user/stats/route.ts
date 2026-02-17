import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserStats } from '@/lib/db/queries';

export async function GET() {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const stats = await getUserStats(user.id);
  
  if (!stats) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }

  return NextResponse.json(stats);
}
