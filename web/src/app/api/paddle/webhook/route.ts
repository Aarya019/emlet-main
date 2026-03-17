import { NextRequest, NextResponse } from 'next/server';
import { paddle, PLAN_CREDITS } from '@/lib/paddle/server';
import { createAdminClient } from '@/lib/supabase/server';

function planFromPriceId(priceId: string): 'pro' | 'enterprise' | null {
  if (priceId === process.env.PADDLE_PRO_PRICE_ID) return 'pro';
  if (priceId === process.env.PADDLE_ENTERPRISE_PRICE_ID) return 'enterprise';
  return null;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!process.env.PADDLE_WEBHOOK_SECRET) {
    console.error('PADDLE_WEBHOOK_SECRET not set');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get('paddle-signature') ?? '';

  let event: any;
  try {
    event = await paddle.webhooks.unmarshal(rawBody, process.env.PADDLE_WEBHOOK_SECRET, signature);
  } catch (err) {
    console.error('Paddle webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const eventType: string = event.eventType ?? event.event_type ?? '';
  // Use admin client — webhook has no user session, so anon client is blocked by RLS
  const db = createAdminClient();

  try {
    switch (eventType) {
      // ── Subscription activated (new purchase) ──────────────────────────────
      case 'subscription.activated': {
        const sub = event.data;
        const customerId: string = sub.customerId ?? sub.customer_id;
        const subscriptionId: string = sub.id;
        const priceId: string = sub.items?.[0]?.price?.id ?? '';
        const plan = planFromPriceId(priceId);
        if (!plan) break;

        // Paddle propagates checkout customData onto the subscription object
        const customDataUserId: string | undefined =
          (sub.customData as any)?.userId ?? (sub.custom_data as any)?.userId;

        let userId = customDataUserId;
        if (!userId) {
          const { data } = await db.from('profiles').select('id').eq('paddle_customer_id', customerId).single();
          userId = data?.id;
        }
        if (!userId) {
          console.error('No user found for paddle customer', customerId, 'customData:', sub.customData);
          break;
        }

        const credits = plan === 'enterprise' ? 999999 : PLAN_CREDITS[plan];
        const { error } = await db.from('profiles').update({
          plan_type: plan,
          credits_remaining: credits,
          paddle_customer_id: customerId,
          paddle_subscription_id: subscriptionId,
          subscription_status: 'active',
          updated_at: new Date().toISOString(),
        }).eq('id', userId);
        if (error) console.error('DB update error (activated):', error);
        break;
      }

      // ── Subscription updated (upgrade / downgrade) ─────────────────────────
      case 'subscription.updated': {
        const sub = event.data;
        const subscriptionId: string = sub.id;
        const priceId: string = sub.items?.[0]?.price?.id ?? '';
        const status: string = sub.status ?? 'active';
        const plan = planFromPriceId(priceId);

        const { data: profile } = await db.from('profiles').select('id').eq('paddle_subscription_id', subscriptionId).single();
        if (!profile) break;

        if (plan) {
          const credits = plan === 'enterprise' ? 999999 : PLAN_CREDITS[plan];
          const { error } = await db.from('profiles').update({
            plan_type: plan,
            credits_remaining: credits,
            subscription_status: status,
            updated_at: new Date().toISOString(),
          }).eq('id', profile.id);
          if (error) console.error('DB update error (updated):', error);
        }
        break;
      }

      // ── Subscription canceled ──────────────────────────────────────────────
      case 'subscription.canceled': {
        const sub = event.data;
        const subscriptionId: string = sub.id;

        const { data: profile } = await db.from('profiles').select('id').eq('paddle_subscription_id', subscriptionId).single();
        if (!profile) break;

        const { error } = await db.from('profiles').update({
          plan_type: 'free',
          credits_remaining: PLAN_CREDITS.free,
          subscription_status: 'canceled',
          updated_at: new Date().toISOString(),
        }).eq('id', profile.id);
        if (error) console.error('DB update error (canceled):', error);
        break;
      }

      // ── Transaction completed = subscription renewal → reset credits ────────
      case 'transaction.completed': {
        const tx = event.data;
        const subscriptionId: string | undefined = tx.subscriptionId ?? tx.subscription_id;
        if (!subscriptionId) break;

        const { data: profile } = await db.from('profiles').select('id, plan_type').eq('paddle_subscription_id', subscriptionId).single();
        if (!profile) break;

        if (profile.plan_type === 'pro') {
          const { error } = await db.from('profiles').update({
            credits_remaining: PLAN_CREDITS.pro,
            updated_at: new Date().toISOString(),
          }).eq('id', profile.id);
          if (error) console.error('DB update error (transaction.completed):', error);
        }
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error(`Error handling Paddle event ${eventType}:`, err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
