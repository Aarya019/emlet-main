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
  
  // Return stats with auth user fields
  return NextResponse.json({
    ...(stats || {
      credits_remaining: 0,
      plan_type: 'free',
      total_emails: 0,
      emails_this_month: 0,
    }),
    email: user.email ?? '',
    member_since: user.created_at ?? '',
  });
}
