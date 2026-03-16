'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getPaddle } from '@/lib/paddle/client';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: 'free' | 'pro' | 'enterprise';
  name: string;
  price: string;
  period: string;
  description: string;
  credits: string;
  features: PlanFeature[];
  ctaLabel: string;
  priceId: string | null;
  highlight: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '',
    description: 'Get started and explore Emlet.',
    credits: '5 emails / month',
    features: [
      { text: '5 email generations / month', included: true },
      { text: 'All design styles', included: true },
      { text: 'Brand profile', included: true },
      { text: 'Export HTML', included: true },
      { text: 'Send test emails', included: false },
      { text: 'Priority support', included: false },
    ],
    ctaLabel: 'Get started free',
    priceId: null,
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19',
    period: '/mo',
    description: 'For creators and solo marketers.',
    credits: '50 emails / month',
    features: [
      { text: '50 email generations / month', included: true },
      { text: 'All design styles', included: true },
      { text: 'Brand profile', included: true },
      { text: 'Export HTML', included: true },
      { text: 'Send test emails', included: true },
      { text: 'Priority support', included: false },
    ],
    ctaLabel: 'Upgrade to Pro',
    priceId: process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID ?? null,
    highlight: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$49',
    period: '/mo',
    description: 'For teams and high-volume senders.',
    credits: 'Unlimited emails',
    features: [
      { text: 'Unlimited email generations', included: true },
      { text: 'All design styles', included: true },
      { text: 'Brand profile', included: true },
      { text: 'Export HTML', included: true },
      { text: 'Send test emails', included: true },
      { text: 'Priority support', included: true },
    ],
    ctaLabel: 'Upgrade to Enterprise',
    priceId: process.env.NEXT_PUBLIC_PADDLE_ENTERPRISE_PRICE_ID ?? null,
    highlight: false,
  },
];

export default function PricingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPlan, setCurrentPlan] = useState<'free' | 'pro' | 'enterprise'>('free');
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUser(user);
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('plan_type')
          .eq('id', user.id)
          .single();
        setCurrentPlan((data?.plan_type as 'free' | 'pro' | 'enterprise') ?? 'free');
      }
      setLoading(false);
    });
  }, []);

  const handleUpgrade = async (plan: Plan) => {
    if (!plan.priceId) return;

    if (!user) {
      window.location.href = `/sign-in?next=/pricing`;
      return;
    }

    setCheckoutLoading(plan.id);
    try {
      const paddle = await getPaddle();
      paddle.Checkout.open({
        items: [{ priceId: plan.priceId, quantity: 1 }],
        customer: { email: user.email ?? '' },
        customData: { userId: user.id },
        settings: {
          successUrl: `${window.location.origin}/dashboard?upgraded=true`,
        },
      });
    } catch (err) {
      console.error('Paddle checkout error:', err);
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleManageBilling = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch('/api/paddle/portal', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to get portal URL');
      const { url } = await res.json();
      if (url) window.open(url, '_blank');
    } catch (err) {
      console.error('Portal error:', err);
    } finally {
      setPortalLoading(false);
    }
  };

  const isPaidUser = currentPlan === 'pro' || currentPlan === 'enterprise';

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-black tracking-tight">
          <span className="bg-gradient-to-r from-[#00ffff] to-[#00ff00] bg-clip-text text-transparent">emlet</span>
        </Link>
        <div className="flex items-center gap-4">
          {isPaidUser && (
            <button
              onClick={handleManageBilling}
              disabled={portalLoading}
              className="px-4 py-1.5 text-sm border border-white/20 rounded-lg text-white/70 hover:border-white/40 hover:text-white transition-all"
            >
              {portalLoading ? 'Loading…' : 'Manage Billing'}
            </button>
          )}
          {user ? (
            <Link href="/dashboard" className="px-4 py-1.5 text-sm rounded-lg bg-white/10 hover:bg-white/15 transition-all">
              Dashboard
            </Link>
          ) : (
            <Link href="/sign-in" className="px-4 py-1.5 text-sm rounded-lg bg-white/10 hover:bg-white/15 transition-all">
              Sign in
            </Link>
          )}
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
          Simple, transparent{' '}
          <span className="bg-gradient-to-r from-[#00ffff] to-[#00ff00] bg-clip-text text-transparent">pricing</span>
        </h1>
        <p className="text-white/50 text-lg max-w-xl mx-auto">
          Generate stunning AI emails at the speed of thought. Upgrade or downgrade any time.
        </p>
      </div>

      {/* Pricing cards */}
      <div className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map(plan => {
            const isCurrent = !loading && user && currentPlan === plan.id;
            const isHigher =
              (plan.id === 'pro' && currentPlan === 'free') ||
              (plan.id === 'enterprise' && currentPlan !== 'enterprise');

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-8 flex flex-col gap-6 transition-all ${
                  plan.highlight
                    ? 'border-[#00ffff]/40 bg-[#00ffff]/5 shadow-lg shadow-[#00ffff]/10'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#00ffff] to-[#00ff00] text-black text-xs font-black whitespace-nowrap">
                    Most popular
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full border border-white/20 bg-black text-white/70 text-xs font-bold whitespace-nowrap">
                    Current plan
                  </div>
                )}

                {/* Name + price */}
                <div>
                  <p className="text-white/50 text-sm font-semibold uppercase tracking-widest mb-2">{plan.name}</p>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-4xl font-black">{plan.price}</span>
                    {plan.period && <span className="text-white/40 mb-1">{plan.period}</span>}
                  </div>
                  <p className="text-white/40 text-sm">{plan.description}</p>
                </div>

                {/* Credits badge */}
                <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm font-semibold text-white/80 w-fit">
                  {plan.credits}
                </div>

                {/* Features */}
                <ul className="flex flex-col gap-3 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className={`flex items-center gap-2.5 text-sm ${feature.included ? 'text-white/80' : 'text-white/25 line-through'}`}>
                      <svg className={`w-4 h-4 shrink-0 ${feature.included ? 'text-[#00ff00]' : 'text-white/20'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {feature.included
                          ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />}
                      </svg>
                      {feature.text}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {isCurrent ? (
                  <div className="w-full py-2.5 rounded-xl border border-white/10 text-white/30 text-sm font-bold text-center">
                    Current plan
                  </div>
                ) : plan.id === 'free' ? (
                  <Link
                    href={user ? '/dashboard' : '/sign-up'}
                    className="w-full py-2.5 rounded-xl border border-white/20 text-white/60 hover:border-white/40 hover:text-white text-sm font-bold text-center transition-all"
                  >
                    {user ? 'Go to dashboard' : 'Get started free'}
                  </Link>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan)}
                    disabled={checkoutLoading === plan.id || (!!user && !isHigher)}
                    className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
                      plan.highlight
                        ? 'bg-gradient-to-r from-[#00ffff] to-[#00ff00] text-black hover:shadow-lg hover:shadow-[#00ffff]/30'
                        : 'border border-white/20 text-white hover:border-white/40'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {checkoutLoading === plan.id ? 'Opening checkout…' : plan.ctaLabel}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Manage billing link */}
        {!loading && isPaidUser && (
          <p className="text-center mt-10 text-white/40 text-sm">
            Need to cancel or update your payment method?{' '}
            <button onClick={handleManageBilling} className="text-white/70 underline hover:text-white transition-colors">
              Manage billing
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
