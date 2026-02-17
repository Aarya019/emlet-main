import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getEmailGenerations } from '@/lib/db/queries';

export async function GET() {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const generations = await getEmailGenerations(user.id);
  
  return NextResponse.json({ generations });
}
