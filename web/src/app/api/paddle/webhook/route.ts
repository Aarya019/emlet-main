import { NextRequest, NextResponse } from 'next/server';
import { paddle, PLAN_CREDITS } from '@/lib/paddle/server';
import {
  setUserPlan,
  getUserByPaddleSubscriptionId,
  getUserByPaddleCustomerId,
  resetMonthlyCredits,
} from '@/lib/db/queries';

// Map Paddle price IDs → plan names
function planFromPriceId(priceId: string): 'pro' | 'enterprise' | null {
  if (priceId === process.env.PADDLE_PRO_PRICE_ID) return 'pro';
  if (priceId === process.env.PADDLE_ENTERPRISE_PRICE_ID) return 'enterprise';
  return null;
}

// Look up user ID from Paddle customer_id via profiles table
async function userIdFromCustomerId(customerId: string): Promise<string | null> {
  // First try profiles table (works for returning customers)
  const profile = await getUserByPaddleCustomerId(customerId);
  if (profile) return profile.id;
  return null;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!process.env.PADDLE_WEBHOOK_SECRET) {
    console.error('PADDLE_WEBHOOK_SECRET not set');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get('paddle-signature') ?? '';

  // Verify webhook signature
  let event: any;
  try {
    event = await paddle.webhooks.unmarshal(rawBody, process.env.PADDLE_WEBHOOK_SECRET, signature);
  } catch (err) {
    console.error('Paddle webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const eventType: string = event.eventType ?? event.event_type ?? '';

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

        // customData.userId is set on the checkout → propagated to the subscription by Paddle
        const customDataUserId: string | undefined =
          (sub.customData as any)?.userId ?? (sub.custom_data as any)?.userId;

        const userId = customDataUserId ?? (await userIdFromCustomerId(customerId));
        if (!userId) {
          console.error('No user found for paddle customer', customerId, 'customData:', sub.customData);
          break;
        }

        const credits = plan === 'enterprise' ? 999999 : PLAN_CREDITS[plan];
        await setUserPlan(userId, plan, credits, customerId, subscriptionId, 'active');
        break;
      }

      // ── Subscription updated (upgrade / downgrade) ─────────────────────────
      case 'subscription.updated': {
        const sub = event.data;
        const subscriptionId: string = sub.id;
        const priceId: string = sub.items?.[0]?.price?.id ?? '';
        const status: string = sub.status ?? 'active';
        const plan = planFromPriceId(priceId);

        const profile = await getUserByPaddleSubscriptionId(subscriptionId);
        if (!profile) break;

        if (plan) {
          const credits = plan === 'enterprise' ? 999999 : PLAN_CREDITS[plan];
          await setUserPlan(profile.id, plan, credits, undefined, undefined, status);
        }
        break;
      }

      // ── Subscription canceled ──────────────────────────────────────────────
      case 'subscription.canceled': {
        const sub = event.data;
        const subscriptionId: string = sub.id;

        const profile = await getUserByPaddleSubscriptionId(subscriptionId);
        if (!profile) break;

        await setUserPlan(profile.id, 'free', PLAN_CREDITS.free, undefined, subscriptionId, 'canceled');
        break;
      }

      // ── Transaction completed = subscription renewal → reset credits ────────
      case 'transaction.completed': {
        const tx = event.data;
        // Only handle subscription renewals (not initial activations — those are handled above)
        const subscriptionId: string | undefined = tx.subscriptionId ?? tx.subscription_id;
        if (!subscriptionId) break;

        const profile = await getUserByPaddleSubscriptionId(subscriptionId);
        if (!profile) break;

        if (profile.plan_type === 'pro') {
          await resetMonthlyCredits(profile.id, PLAN_CREDITS.pro);
        }
        // enterprise: no need to reset — unlimited
        break;
      }

      default:
        // Unhandled event — that's fine, just acknowledge
        break;
    }
  } catch (err) {
    console.error(`Error handling Paddle event ${eventType}:`, err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
