import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/lib/db/queries';
import { paddle } from '@/lib/paddle/server';

export async function POST(_req: NextRequest): Promise<NextResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = await getProfile(user.id);
  if (!profile?.paddle_customer_id) {
    return NextResponse.json({ error: 'No billing account found' }, { status: 404 });
  }

  try {
    const portalSession = await paddle.customerPortalSessions.create(
      profile.paddle_customer_id,
      []
    );
    return NextResponse.json({ url: (portalSession as any).urls?.general?.overview ?? null });
  } catch (err) {
    console.error('Error creating Paddle portal session:', err);
    return NextResponse.json({ error: 'Failed to create portal session' }, { status: 500 });
  }
}
