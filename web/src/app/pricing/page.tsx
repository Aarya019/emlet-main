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
    description: 'Try Emlet with no commitment.',
    credits: '5 emails / month',
    features: [
      { text: '5 email generations / month', included: true },
      { text: '7 design styles', included: true },
      { text: '1 brand profile', included: true },
      { text: 'Inline AI editing', included: true },
      { text: 'Export HTML', included: true },
      { text: 'Send test emails', included: false },
      { text: 'Multiple brand profiles', included: false },
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
      { text: '7 design styles', included: true },
      { text: '3 brand profiles', included: true },
      { text: 'Inline AI editing', included: true },
      { text: 'Export HTML', included: true },
      { text: 'Send test emails', included: true },
      { text: 'Multiple brand profiles', included: true },
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
      { text: '7 design styles', included: true },
      { text: 'Unlimited brand profiles', included: true },
      { text: 'Inline AI editing', included: true },
      { text: 'Export HTML', included: true },
      { text: 'Send test emails', included: true },
      { text: 'Multiple brand profiles', included: true },
      { text: 'Priority support', included: true },
    ],
    ctaLabel: 'Upgrade to Enterprise',
    priceId: process.env.NEXT_PUBLIC_PADDLE_ENTERPRISE_PRICE_ID ?? null,
    highlight: false,
  },
];

const FAQS = [
  {
    q: 'What counts as one email generation?',
    a: 'Each time you generate a new email from a prompt, that uses one credit. Editing an existing email — including AI rewrites and block regeneration — does not use credits.',
  },
  {
    q: 'Do unused credits roll over?',
    a: 'No. Credits reset at the start of each billing cycle and do not carry over. If you need more, consider upgrading to a higher plan.',
  },
  {
    q: 'Can I cancel my subscription at any time?',
    a: 'Yes. You can cancel from the billing portal at any time. Your plan stays active until the end of the current billing period — you will not be charged again after that.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'We offer refunds within 7 days of your initial payment if you are not satisfied. Contact us at support@emlet.app and we will sort it out.',
  },
  {
    q: 'What design styles are available?',
    a: 'Minimalist, Editorial, Retro, Brutalist, Cyberpunk, Handwritten, and Bauhaus — all available on every plan.',
  },
];

export default function PricingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPlan, setCurrentPlan] = useState<'free' | 'pro' | 'enterprise'>('free');
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/5">
        <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-center px-4 py-3 md:grid-cols-3 md:px-6 md:py-4">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="Emlet" className="h-7 w-auto md:h-8" />
          </Link>
          <nav className="hidden items-center justify-center gap-8 text-sm text-white/70 md:flex">
            <Link href="/#features" className="transition-colors hover:text-white">Features</Link>
            <Link href="/#faq" className="transition-colors hover:text-white">FAQ</Link>
          </nav>
          <div className="flex items-center justify-end gap-3">
            {isPaidUser && (
              <button
                onClick={handleManageBilling}
                disabled={portalLoading}
                className="hidden sm:block rounded-full border border-white/20 px-4 py-1.5 text-sm text-white transition-all hover:border-white/40 disabled:opacity-50"
              >
                {portalLoading ? 'Loading…' : 'Manage Billing'}
              </button>
            )}
            {user ? (
              <Link href="/dashboard" className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-black transition-all hover:shadow-lg hover:shadow-white/20 hover:-translate-y-px">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/sign-in" className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white transition-all hover:border-[#00ffff] hover:text-[#00ffff]">
                  Sign in
                </Link>
                <Link href="/sign-up" className="hidden sm:block rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-black transition-all hover:shadow-lg hover:shadow-white/20 hover:-translate-y-px">
                  Get started free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-3xl mx-auto px-6 pt-20 pb-14 text-center">
        <p className="text-xs font-semibold tracking-widest text-white/30 uppercase mb-5">Pricing</p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-5">
          Simple, transparent{' '}
          <span className="bg-gradient-to-r from-[#00ffff] to-[#00ff00] bg-clip-text text-transparent">pricing</span>
        </h1>
        <p className="text-white/50 text-lg max-w-xl mx-auto mb-6">
          Generate stunning AI emails in seconds. No design skills needed.
          Upgrade or cancel any time — no lock-in.
        </p>
        {/* Value props row */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/40">
          {['No credit card for free tier', 'Cancel any time', '7-day refund policy'].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-[#00ff00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Pricing cards */}
      <div className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map(plan => {
            const isCurrent = !loading && user && currentPlan === plan.id;
            const isHigher =
              (plan.id === 'pro' && currentPlan === 'free') ||
              (plan.id === 'enterprise' && currentPlan !== 'enterprise');

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border flex flex-col gap-6 transition-all ${
                  plan.highlight
                    ? 'border-[#00ffff]/50 bg-gradient-to-b from-[#00ffff]/10 to-transparent shadow-2xl shadow-[#00ffff]/10 p-8'
                    : 'border-white/10 bg-white/[0.03] p-8'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#00ffff] to-[#00ff00] text-black text-xs font-black whitespace-nowrap tracking-wide">
                    MOST POPULAR
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute -top-3.5 right-4 px-3 py-1 rounded-full border border-white/20 bg-black text-white/60 text-xs font-bold whitespace-nowrap">
                    Current plan
                  </div>
                )}

                {/* Name + price */}
                <div>
                  <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${plan.highlight ? 'text-[#00ffff]' : 'text-white/40'}`}>
                    {plan.name}
                  </p>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-5xl font-black tracking-tight">{plan.price}</span>
                    {plan.period && <span className="text-white/40 text-lg mb-1.5">{plan.period}</span>}
                  </div>
                  <p className="text-white/50 text-sm">{plan.description}</p>
                </div>

                {/* Credits badge */}
                <div className={`px-3 py-2 rounded-lg text-sm font-bold w-fit border ${
                  plan.highlight
                    ? 'bg-[#00ffff]/10 border-[#00ffff]/30 text-[#00ffff]'
                    : 'bg-white/5 border-white/10 text-white/70'
                }`}>
                  {plan.credits}
                </div>

                {/* Features */}
                <ul className="flex flex-col gap-2.5 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className={`flex items-center gap-2.5 text-sm ${feature.included ? 'text-white/80' : 'text-white/25'}`}>
                      {feature.included ? (
                        <svg className="w-4 h-4 shrink-0 text-[#00ff00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 shrink-0 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      {feature.text}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {isCurrent ? (
                  <div className="w-full py-3 rounded-xl border border-white/10 text-white/30 text-sm font-bold text-center">
                    Current plan
                  </div>
                ) : plan.id === 'free' ? (
                  <Link
                    href={user ? '/dashboard' : '/sign-up'}
                    className="w-full py-3 rounded-xl border border-white/20 text-white/70 hover:border-white/40 hover:text-white text-sm font-bold text-center transition-all block"
                  >
                    {user ? 'Go to dashboard' : 'Get started free'}
                  </Link>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan)}
                    disabled={checkoutLoading === plan.id || (!!user && !isHigher)}
                    className={`w-full py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      plan.highlight
                        ? 'bg-gradient-to-r from-[#00ffff] to-[#00ff00] text-black hover:shadow-xl hover:shadow-[#00ffff]/30 hover:-translate-y-px'
                        : 'border border-white/20 text-white hover:border-white/40 hover:bg-white/5'
                    }`}
                  >
                    {checkoutLoading === plan.id ? 'Opening checkout…' : plan.ctaLabel}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Manage billing */}
        {!loading && isPaidUser && (
          <p className="text-center mt-10 text-white/40 text-sm">
            Need to cancel or update your payment method?{' '}
            <button onClick={handleManageBilling} className="text-white/70 underline hover:text-white transition-colors">
              Manage billing
            </button>
          </p>
        )}

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mt-24">
          <h2 className="text-2xl font-black text-white text-center mb-8">Frequently asked questions</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-sm font-semibold text-white pr-4">{faq.q}</span>
                  <svg
                    className={`w-4 h-4 text-white/40 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm text-white/50 leading-relaxed border-t border-white/5 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/30">
          <span>© {new Date().getFullYear()} Emlet. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-white/60 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy</Link>
            <a href="mailto:support@emlet.app" className="hover:text-white/60 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
