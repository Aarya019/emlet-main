import { NextRequest, NextResponse } from 'next/server';
import { paddle, PLAN_CREDITS } from '@/lib/paddle/server';
import { createAdminClient } from '@/lib/supabase/server';

function planFromPriceId(priceId: string): 'pro' | null {
  return priceId === process.env.PADDLE_PRO_PRICE_ID ? 'pro' : null;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  console.log('[paddle-webhook] received request');

  if (!process.env.PADDLE_WEBHOOK_SECRET) {
    console.error('[paddle-webhook] PADDLE_WEBHOOK_SECRET not set');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get('paddle-signature') ?? '';
  console.log('[paddle-webhook] signature header present:', !!signature);
  console.log('[paddle-webhook] raw body length:', rawBody.length);

  let event: any;
  try {
    event = await paddle.webhooks.unmarshal(rawBody, process.env.PADDLE_WEBHOOK_SECRET, signature);
  } catch (err) {
    console.error('[paddle-webhook] signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const eventType: string = event.eventType ?? event.event_type ?? '';
  console.log('[paddle-webhook] event type:', eventType);
  console.log('[paddle-webhook] event data keys:', Object.keys(event.data ?? {}));

  // Use admin client — webhook has no user session, so anon client is blocked by RLS
  const db = createAdminClient();
  console.log('[paddle-webhook] SUPABASE_SERVICE_ROLE_KEY set:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

  try {
    switch (eventType) {
      // ── Subscription activated (new purchase) ──────────────────────────────
      case 'subscription.activated': {
        const sub = event.data;
        const customerId: string = sub.customerId ?? sub.customer_id;
        const subscriptionId: string = sub.id;
        const priceId: string = sub.items?.[0]?.price?.id ?? '';
        const plan = planFromPriceId(priceId);
        console.log('[paddle-webhook] activated - customerId:', customerId, 'subscriptionId:', subscriptionId, 'priceId:', priceId, 'plan:', plan);
        if (!plan) { console.warn('[paddle-webhook] unknown priceId:', priceId, 'env pro:', process.env.PADDLE_PRO_PRICE_ID); break; }

        // Paddle propagates checkout customData onto the subscription object
        const customDataUserId: string | undefined =
          (sub.customData as any)?.userId ?? (sub.custom_data as any)?.userId;

        let userId = customDataUserId;
        if (!userId) {
          const { data } = await db.from('profiles').select('id').eq('paddle_customer_id', customerId).single();
          userId = data?.id;
        }
        if (!userId) {
          console.error('[paddle-webhook] no user found - customerId:', customerId, 'customData:', sub.customData);
          break;
        }
        console.log('[paddle-webhook] resolved userId:', userId);
        const credits = PLAN_CREDITS[plan];
        const { error } = await db.from('profiles').update({
          plan_type: plan,
          credits_remaining: credits,
          paddle_customer_id: customerId,
          paddle_subscription_id: subscriptionId,
          subscription_status: 'active',
          cancel_at: null,
          updated_at: new Date().toISOString(),
        }).eq('id', userId);
        if (error) {
          console.error('[paddle-webhook] DB update error (activated):', error);
          throw error;
        }
        console.log('[paddle-webhook] DB updated successfully for userId:', userId);
        break;
      }

      // ── Subscription updated (upgrade / downgrade) ─────────────────────────
      case 'subscription.updated': {
        const sub = event.data;
        const subscriptionId: string = sub.id;
        const priceId: string = sub.items?.[0]?.price?.id ?? '';
        const status: string = sub.status ?? 'active';
        const plan = planFromPriceId(priceId);
        const scheduledChange = sub.scheduledChange ?? sub.scheduled_change ?? null;
        const cancelAt: string | null = scheduledChange?.action === 'cancel'
          ? (scheduledChange.effectiveAt ?? scheduledChange.effective_at ?? null)
          : null;

        const { data: profile } = await db.from('profiles').select('id').eq('paddle_subscription_id', subscriptionId).single();
        if (!profile) break;

        if (plan) {
          const credits = PLAN_CREDITS[plan];
          const { error } = await db.from('profiles').update({
            plan_type: plan,
            credits_remaining: credits,
            subscription_status: status,
            cancel_at: cancelAt,
            updated_at: new Date().toISOString(),
          }).eq('id', profile.id);
          if (error) {
            console.error('DB update error (updated):', error);
            throw error;
          }
        } else {
          // Price unresolved (e.g. only the scheduled-change field changed) — still keep cancel_at in sync.
          const { error } = await db.from('profiles').update({
            cancel_at: cancelAt,
            updated_at: new Date().toISOString(),
          }).eq('id', profile.id);
          if (error) {
            console.error('DB update error (updated, cancel_at only):', error);
            throw error;
          }
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
          cancel_at: null,
          updated_at: new Date().toISOString(),
        }).eq('id', profile.id);
        if (error) {
          console.error('DB update error (canceled):', error);
          throw error;
        }
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error(`[paddle-webhook] unhandled error for event ${eventType}:`, err);
    // Return 500 so Paddle retries the delivery — a 200 here would tell Paddle
    // the event was handled when it wasn't, permanently desyncing plan state.
    return NextResponse.json({ error: 'Processing error — see server logs' }, { status: 500 });
  }

  console.log('[paddle-webhook] done, eventType:', eventType);
  return NextResponse.json({ received: true });
}
