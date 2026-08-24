import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getProfile, updateProfile } from '@/lib/db/queries';
import { paddle } from '@/lib/paddle/server';

export async function POST(_req: NextRequest): Promise<NextResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = await getProfile(user.id);
  if (!profile?.paddle_subscription_id) {
    return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
  }

  try {
    const subscription = await paddle.subscriptions.cancel(profile.paddle_subscription_id, {
      effectiveFrom: 'next_billing_period',
    });
    const cancelAt = subscription.scheduledChange?.effectiveAt ?? null;
    await updateProfile(user.id, { cancel_at: cancelAt });
    return NextResponse.json({ cancelAt });
  } catch (err) {
    console.error('Error canceling Paddle subscription:', err);
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
  }
}
