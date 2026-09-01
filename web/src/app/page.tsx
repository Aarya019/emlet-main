'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { getPaddle } from '@/lib/paddle/client';
import StarField from '@/components/StarField';
import type { User } from '@supabase/supabase-js';
import type { PlanType } from '@/lib/db/types';

// ── Replace these with your actual YouTube video IDs ──────────────────────────
const STEPS = [
  {
    number: '01',
    title: 'Describe your email',
    description: 'Type what you want in plain English: a product launch, Black Friday promo, welcome email, or newsletter. No templates to fill in, no design decisions upfront.',
    videoId: 'PLACEHOLDER_VIDEO_ID_1',
  },
  {
    number: '02',
    title: 'AI generates a stunning design',
    description: 'Emlet writes the copy and builds a fully designed, brand-matched email in seconds. Beautiful layouts, compelling headlines, production-ready out of the box.',
    videoId: 'PLACEHOLDER_VIDEO_ID_2',
  },
  {
    number: '03',
    title: 'Edit, export & send',
    description: 'Fine-tune every block in the visual editor. Export pixel-perfect HTML or TSX and drop it into Mailchimp, SendGrid, Resend, or any email provider.',
    videoId: 'PLACEHOLDER_VIDEO_ID_3',
  },
];

const FEATURES = [
  { title: 'Converts, not just looks good', desc: 'AI-written copy engineered to drive clicks, opens, and revenue. Not just pretty words.' },
  { title: '10+ design styles', desc: 'Minimalist, editorial, retro, brutalist, cyberpunk and more, all optimised for inboxes.' },
  { title: 'Block-based editor', desc: 'Hero, CTA, testimonial, stats: every block fully editable without touching code.' },
  { title: 'Inbox-perfect rendering', desc: 'Production HTML that renders perfectly in Gmail, Outlook, and Apple Mail.' },
  { title: 'Export anywhere', desc: 'One-click HTML & TSX export for Mailchimp, SendGrid, Resend, or any ESP.' },
  { title: 'Brand profiles', desc: 'Save your colors, voice & logo. Every email stays on-brand, every time.' },
];

const FAQS = [
  { q: 'How does Emlet generate emails?', a: "You describe your campaign in plain English. Emlet's AI writes the copy, selects a layout, applies your brand colors, and outputs production-ready HTML and TSX, all in seconds." },
  { q: 'What email platforms does Emlet work with?', a: 'Any platform that accepts HTML. Export your email and drop it straight into Mailchimp, SendGrid, Resend, ConvertKit, HubSpot, or any other ESP.' },
  { q: 'Do I need design or coding skills?', a: 'Not at all. Type what you want and Emlet handles the design and code. Every block is also editable in the visual editor. No code required.' },
  { q: 'What do I get for free?', a: "No credit card required: 5 AI actions every month — generate, AI-edit, or regenerate a block, split however you like — plus 3 test sends every month and 1 active brand profile. Upgrade to Professional ($29/mo) any time for unlimited use of all of it." },
  { q: 'Do unused trial actions roll over or reset?', a: "AI actions and test sends reset to their full amount at the start of each month — unused ones don't roll over. Your brand profile slot is a capacity of 1, not a one-time trial: delete your current one and you can immediately create another. Upgrading is what unlocks unlimited use of everything." },
  { q: 'Can I use my own brand colors and logo?', a: 'Yes. Create a Brand Profile with your colors, typography, and logo. Every email you generate automatically stays on-brand.' },
  { q: 'Will my emails look right in every inbox?', a: 'Yes. Every email Emlet generates is production-ready HTML tested to render correctly in Gmail, Outlook, Apple Mail, and every major inbox.' },
  { q: 'Can I cancel anytime?', a: 'Yes. Manage or cancel your Professional subscription anytime from the billing portal. No long-term contract, no cancellation fee.' },
];

const PROFESSIONAL_FEATURES = [
  'Unlimited email generations',
  'All design styles',
  'Unlimited brand profiles',
  'Export HTML',
  'Unlimited AI edits & regenerations',
  'Unlimited test sends',
  'Priority support',
];

const TRIAL_ITEMS = [
  { label: 'Brand profile', desc: 'Keep 1 active — swap it anytime' },
  { label: 'AI actions', desc: '5/month — generate, edit & regenerate, your call' },
  { label: 'Test send', desc: '3 test emails to your own inbox every month' },
];

const PROFESSIONAL_PRICE_ID = process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID ?? null;
// Beta launch pricing — set in Paddle as a $10-off-forever recurring discount.
// Unset this env var (Vercel) once the beta window ends to revert every new
// checkout to the standard $29 price, with no further code changes needed.
const BETA_DISCOUNT_CODE = process.env.NEXT_PUBLIC_PADDLE_BETA_DISCOUNT_CODE || null;

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function Home() {
  const router = useRouter();
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);
  const [streamingText, setStreamingText] = useState('');
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [currentPlan, setCurrentPlan] = useState<PlanType>('free');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const isPaidUser = currentPlan === 'pro';

  const examples = [
    "Product launch with 40% discount...",
    "Customer thank you email...",
    "Black Friday sale announcement...",
    "Welcome email for new subscribers...",
    "Cart abandonment reminder...",
    "Webinar invite with countdown...",
    "Wholesale pricing for retail partners...",
    "Weekly newsletter with top tips...",
    "Free trial expiring in 3 days...",
    "Re-engagement email for lapsed users..."
  ];

  useEffect(() => {
    // Touch devices have no mouse to parallax against — skip attaching the
    // listener entirely rather than paying for it and doing nothing useful.
    // This was previously driven by React state (setMousePosition on every
    // pixel of movement), which re-rendered this entire ~800-line component
    // on every mousemove event and fought with the .animate-blob/.parallax-*
    // CSS (both also targeting `transform` on these same elements) — a big
    // contributor to forced reflows and non-composited animations on mobile.
    // Writing directly to the DOM via refs, throttled to one update per
    // animation frame, avoids all of that.
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let rafId: number | null = null;
    let pending: { x: number; y: number } | null = null;

    const applyTransform = () => {
      rafId = null;
      if (!pending) return;
      const dx = pending.x - window.innerWidth / 2;
      const dy = pending.y - window.innerHeight / 2;
      if (blob1Ref.current) blob1Ref.current.style.transform = `translate(${dx * 0.02}px, ${dy * 0.02}px)`;
      if (blob2Ref.current) blob2Ref.current.style.transform = `translate(${dx * -0.015}px, ${dy * -0.015}px)`;
      if (blob3Ref.current) blob3Ref.current.style.transform = `translate(${dx * 0.025}px, ${dy * 0.025}px)`;
    };

    const handleMouseMove = (e: MouseEvent) => {
      pending = { x: e.clientX, y: e.clientY };
      if (rafId === null) rafId = requestAnimationFrame(applyTransform);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (isUserTyping) return;

    const currentExample = examples[currentExampleIndex];
    let charIndex = 0;
    setStreamingText('');

    const typingInterval = setInterval(() => {
      if (charIndex < currentExample.length) {
        setStreamingText(currentExample.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        // Wait 2 seconds before moving to next example
        setTimeout(() => {
          setCurrentExampleIndex((prev) => (prev + 1) % examples.length);
        }, 2000);
      }
    }, 50); // Type speed: 50ms per character

    return () => clearInterval(typingInterval);
  }, [currentExampleIndex, isUserTyping]);

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
        setCurrentPlan((data?.plan_type as PlanType) ?? 'free');
      }
    });
  }, []);

  // Native browser anchor-scroll-on-load is unreliable on this page — the
  // hero, StarField, and hero screenshot all mount/settle after first paint,
  // shifting page height out from under whatever scroll position the browser
  // picked before that happened. Re-run the scroll ourselves once things have
  // settled, so links to e.g. "/#pricing" from other pages land correctly.
  useEffect(() => {
    if (!window.location.hash) return;
    const target = window.location.hash;
    const timer = setTimeout(() => {
      document.querySelector(target)?.scrollIntoView({ behavior: 'auto', block: 'start' });
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const handleGenerateEmail = () => {
    // Save the user's input to localStorage
    if (userInput.trim()) {
      localStorage.setItem('pendingEmailPrompt', userInput);
    }
    // Redirect to sign-in page
    router.push('/sign-in');
  };

  const handleUpgrade = async () => {
    if (!PROFESSIONAL_PRICE_ID) return;

    if (!user) {
      window.location.href = `/sign-in?next=/%23pricing`;
      return;
    }

    setCheckoutLoading(true);
    try {
      const paddle = await getPaddle();
      paddle.Checkout.open({
        items: [{ priceId: PROFESSIONAL_PRICE_ID, quantity: 1 }],
        customer: { email: user.email ?? '' },
        customData: { userId: user.id },
        ...(BETA_DISCOUNT_CODE ? { discountCode: BETA_DISCOUNT_CODE } : {}),
        settings: {
          successUrl: `${window.location.origin}/dashboard?upgraded=true`,
        },
      });
    } catch (err) {
      console.error('Paddle checkout error:', err);
    } finally {
      setCheckoutLoading(false);
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

  return (
<div className="landing-page relative min-h-screen bg-black text-zinc-50 font-sans overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Emlet',
            url: 'https://emlet.app',
            description: 'Generate high converting marketing emails in seconds with AI. Just describe your campaign and get beautiful, brand-matched HTML emails ready to send.',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: BETA_DISCOUNT_CODE ? '19' : '29',
              priceCurrency: 'USD',
              url: 'https://emlet.app/#pricing',
            },
          }),
        }}
      />
      <StarField />
      {/* ── Try for free announcement pill ──────────────────────────────────── */}
      <div className="relative z-50 flex items-center justify-center gap-3 bg-gradient-to-r from-[#00ffff]/10 via-[#00ff00]/10 to-[#ff00ff]/10 border-b border-white/5 px-4 py-2 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#00ffff]/10 border border-[#00ffff]/30 px-3 py-0.5 text-xs font-semibold text-[#00ffff] tracking-wide uppercase">Free</span>
        <span className="text-xs text-white/60">Try for free, no credit card required.</span>
        <a href="/sign-up" className="text-xs font-semibold text-white underline underline-offset-2 hover:text-[#00ffff] transition-colors whitespace-nowrap">Start free →</a>
      </div>
      {/* Animated gradient blobs with magnetic effect (desktop only — see effect above) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          ref={blob1Ref}
          className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-[#00ff00]/20 via-[#00ffff]/20 to-[#ff00ff]/20 rounded-full blur-3xl"
        />
        <div
          ref={blob2Ref}
          className="absolute top-1/2 -left-32 w-80 h-80 bg-gradient-to-br from-[#ff00ff]/20 via-[#00ffff]/20 to-[#00ff00]/20 rounded-full blur-3xl"
        />
        <div
          ref={blob3Ref}
          className="absolute -bottom-32 right-1/3 w-96 h-96 bg-gradient-to-br from-[#00ffff]/20 via-[#ff00ff]/20 to-[#00ff00]/20 rounded-full blur-3xl"
        />
      </div>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/5">
        <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-center px-4 py-3 md:grid-cols-3 md:px-6 md:py-4">
          <a href="/" className="flex items-center gap-2 group">
            <Image src="/logo.png" alt="Emlet" width={532} height={532} priority className="h-7 w-auto md:h-8" />
          </a>
          <nav className="hidden items-center justify-center gap-8 text-sm text-white/70 md:flex">
            <a href="#how-it-works" className="transition-colors hover:text-white">How it works</a>
            <a href="#features" className="transition-colors hover:text-white">Features</a>
            <a href="#pricing" className="transition-colors hover:text-white">Pricing</a>
            <a href="#faq" className="transition-colors hover:text-white">FAQ</a>
            <a href="/blog" className="transition-colors hover:text-white">Blog</a>
          </nav>
          {/* Desktop auth buttons */}
          <div className="hidden items-center justify-end gap-3 md:flex">
            {user ? (
              <>
                {isPaidUser && (
                  <button
                    onClick={handleManageBilling}
                    disabled={portalLoading}
                    className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/70 transition-all hover:border-white/40 hover:text-white disabled:opacity-50"
                  >
                    {portalLoading ? 'Loading…' : 'Manage billing'}
                  </button>
                )}
                <a href="/dashboard" className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-black transition-all hover:shadow-lg hover:shadow-white/20 hover:-translate-y-px">
                  Dashboard
                </a>
              </>
            ) : (
              <>
                <a href="/sign-in" className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white transition-all hover:border-[#00ffff] hover:text-[#00ffff]">
                  Sign in
                </a>
                <a href="/sign-up" className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-black transition-all hover:shadow-lg hover:shadow-white/20 hover:-translate-y-px">
                  Get started free
                </a>
              </>
            )}
          </div>
          {/* Mobile: sign-in/dashboard link + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            {user ? (
              <a href="/dashboard" className="rounded-full border border-white/20 px-3 py-1 text-xs text-white">
                Dashboard
              </a>
            ) : (
              <a href="/sign-in" className="rounded-full border border-white/20 px-3 py-1 text-xs text-white">
                Sign in
              </a>
            )}
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        {/* Mobile drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-white/8 bg-black/95 px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-1">
              {[
                { href: '#how-it-works', label: 'How it works' },
                { href: '#features', label: 'Features' },
                { href: '#pricing', label: 'Pricing' },
                { href: '#faq', label: 'FAQ' },
                { href: '/blog', label: 'Blog' },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-white/8 flex flex-col gap-2">
              {user ? (
                <a href="/dashboard" className="block w-full rounded-full bg-white py-2.5 text-center text-sm font-bold text-black">
                  Dashboard
                </a>
              ) : (
                <a href="/sign-up" className="block w-full rounded-full bg-white py-2.5 text-center text-sm font-bold text-black">
                  Get started free →
                </a>
              )}
              {isPaidUser && (
                <button onClick={handleManageBilling} className="block w-full rounded-full border border-white/20 py-2.5 text-center text-sm text-white/70">
                  Manage billing
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <main>
      {/* ── Hero / Generator ───────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto flex h-[calc(100vh-var(--hero-offset,88px))] max-w-4xl items-center justify-center px-4 sm:px-6 overflow-hidden">
        <div className="w-full space-y-5 text-center">
          <div className="space-y-3">
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
              Generate high-converting
              <br />
              marketing emails
              <br />
              <span className="bg-gradient-to-r from-[#00ffff] via-[#00ff00] to-[#ff00ff] bg-clip-text text-transparent">
                in seconds.
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-white/60 sm:text-base md:text-lg leading-relaxed">
              Describe your campaign. Emlet's AI writes copy that converts, designs the layout, and outputs
              production-ready HTML, faster than writing a single subject line.
            </p>
          </div>

          {/* Generator input */}
          <div className="relative group text-left">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00ff00] via-[#00ffff] to-[#ff00ff] rounded-2xl opacity-70 group-hover:opacity-100 blur transition duration-500 animate-gradient bg-[length:200%_auto]" />
            <div className="relative rounded-2xl border border-white/10 bg-black/90 p-1.5 shadow-2xl backdrop-blur-sm">
              <textarea
                aria-label="Describe the email you want to create"
                value={isUserTyping ? userInput : streamingText}
                placeholder={isUserTyping ? 'Describe the email you want to create...' : ''}
                onFocus={() => { setIsUserTyping(true); setStreamingText(''); }}
                onChange={(e) => { setIsUserTyping(true); setUserInput(e.target.value); setStreamingText(e.target.value); }}
                className="w-full resize-none rounded-xl border-0 bg-black/60 px-5 py-3 text-base text-white/60 placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#00ffff] focus:text-white min-h-[100px] max-h-[120px]"
              />
              <div className="flex flex-col gap-2 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <svg className="h-3.5 w-3.5 flex-shrink-0 text-[#00ffff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-[#00ffff]">AI-powered</span>
                  <span className="hidden sm:inline text-white/60">·</span>
                  <span className="hidden sm:inline">HTML export</span>
                </div>
                <button
                  onClick={handleGenerateEmail}
                  className="w-full rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition-all hover:shadow-xl hover:shadow-white/20 hover:-translate-y-px hover:scale-105 active:scale-100 sm:w-auto sm:py-2"
                >
                  Generate Email →
                </button>
              </div>
            </div>
          </div>

          {/* Quick prompts */}
          <div className="flex flex-wrap items-center gap-2 justify-center">
            <span className="text-xs text-white/60">Try:</span>
            {['Product launch + 40% off', 'Customer win-back', 'Holiday promotion', 'Welcome newsletter'].map((prompt, i) => (
              <button
                key={prompt}
                onClick={() => { setIsUserTyping(true); setUserInput(prompt); setStreamingText(prompt); }}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/50 transition-all hover:border-[#00ffff]/50 hover:text-white hover:bg-white/10"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {prompt}
              </button>
            ))}
          </div>

          <p className="text-xs text-white/60">
            No credit card required · 5 free AI actions every month · upgrade anytime
          </p>
        </div>
      </section>

      {/* ── Hero image (email editor screenshot) ──────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pb-24">
        <div className="relative rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/60">
          {/* Glow behind the image */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#00ffff]/20 via-[#00ff00]/10 to-[#ff00ff]/20 blur-2xl pointer-events-none" />
          <div className="relative aspect-[16/9] w-full bg-white/5 flex items-center justify-center">
            {/* ↓ Replace src with your actual screenshot/GIF */}
            <Image
              src="/images/editor-screenshot.png"
              alt="Emlet AI email editor: drag-and-drop blocks, live preview, one-click HTML export"
              fill
              sizes="(max-width: 1152px) 100vw, 1152px"
              className="object-cover object-top"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.querySelector('.placeholder')!.classList.remove('hidden');
              }}
            />
            <div className="placeholder hidden absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/20">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">Add your editor screenshot to <code className="text-white/40">/public/images/editor-screenshot.png</code></p>
            </div>
          </div>
        </div>
        {/* Caption */}
        <p className="mt-4 text-center text-xs text-white/60">
          The Emlet email editor: write once, deploy anywhere
        </p>
      </section>

      {/* ── How it works ───────────────────────────────────────────────────── */}
      <section id="how-it-works" className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-20 md:py-28 scroll-mt-24">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold tracking-widest text-[#00ffff]/60 uppercase mb-3">How it works</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            From idea to inbox in 3 steps
          </h2>
          <p className="text-base text-white/50 max-w-xl mx-auto">
            No design skills needed. No blank-page anxiety. Just describe your campaign and get a high-converting email, ready to send.
          </p>
        </div>

        <div className="space-y-20 md:space-y-28">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 md:gap-16`}
            >
              {/* Text */}
              <div className="flex-1 space-y-4">
                <span className="text-6xl font-black text-white/5">{step.number}</span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white -mt-4">{step.title}</h3>
                <p className="text-white/55 leading-relaxed">{step.description}</p>
              </div>

              {/* Video embed */}
              <div className="flex-1 w-full">
                <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-xl bg-black aspect-video">
                  {step.videoId === 'PLACEHOLDER_VIDEO_ID_1' || step.videoId === 'PLACEHOLDER_VIDEO_ID_2' || step.videoId === 'PLACEHOLDER_VIDEO_ID_3' ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/60 bg-white/[0.02]">
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-xs text-center px-6">
                        Replace <code className="text-white/80">PLACEHOLDER_VIDEO_ID_{i + 1}</code> in STEPS with your YouTube video ID
                      </p>
                    </div>
                  ) : (
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${step.videoId}?autoplay=1&mute=1&loop=1&playlist=${step.videoId}&controls=0&modestbranding=1&rel=0`}
                      title={step.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features grid ──────────────────────────────────────────────────── */}
      <section id="features" className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-20 md:py-28 scroll-mt-24">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-widest text-[#00ffff]/60 uppercase mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Everything you need to convert
          </h2>
          <p className="text-base text-white/50 max-w-xl mx-auto">
            High-converting emails, production-ready designs, and brand consistency, all generated in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 hover:border-white/15 hover:bg-white/[0.04] transition-all group">

              <h3 className="text-base font-bold text-white mb-1 group-hover:text-[#00ffff] transition-colors">{f.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────────────── */}
      <section id="pricing" className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 py-20 md:py-28 scroll-mt-36">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-widest text-[#00ffff]/60 uppercase mb-3">Pricing</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Try it free. Then go{' '}
            <span className="bg-gradient-to-r from-[#00ffff] via-[#00ff00] to-[#ff00ff] bg-clip-text text-transparent">unlimited</span>.
          </h2>
          <p className="text-base text-white/50 max-w-xl mx-auto">
            Start with a real, no-card-required trial. When you're ready for more, Professional removes
            every limit for one flat price.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-5 items-stretch">
          {/* Free Trial card */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-7 sm:p-8 flex flex-col gap-6">
            <div>
              <p className="text-white/50 text-sm font-semibold uppercase tracking-widest mb-2">Free Trial</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-3xl font-black text-white">$0</span>
                <span className="text-white/60 mb-0.5 text-sm">one-time, no card</span>
              </div>
              <p className="text-white/60 text-sm">Try the real product before you pay.</p>
            </div>

            <ul className="flex flex-col gap-3.5 flex-1">
              {TRIAL_ITEMS.map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  <CheckIcon className="w-4 h-4 mt-0.5 shrink-0 text-white/40" />
                  <div>
                    <p className="text-sm text-white/85 font-medium leading-tight">{item.label}</p>
                    <p className="text-xs text-white/60 leading-snug mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            {user ? (
              <a href="/dashboard" className="w-full py-2.5 rounded-xl border border-white/15 text-white/80 text-sm font-bold text-center transition-all hover:border-white/30 hover:text-white">
                Go to dashboard
              </a>
            ) : (
              <a href="/sign-up" className="w-full py-2.5 rounded-xl border border-white/15 text-white/80 text-sm font-bold text-center transition-all hover:border-white/30 hover:text-white">
                Start free trial
              </a>
            )}
          </div>

          {/* Professional card — the centerpiece */}
          <div className="relative rounded-2xl border border-[#00ffff]/40 bg-gradient-to-b from-[#00ffff]/[0.07] to-transparent shadow-lg shadow-[#00ffff]/10 p-7 sm:p-8 flex flex-col gap-6">
            <div className="absolute -top-3 left-7 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#00ffff] to-[#00ff00] text-black text-xs font-black uppercase tracking-wide">
              {isPaidUser ? 'Your plan' : BETA_DISCOUNT_CODE ? 'Beta pricing - locked in forever' : 'Unlock everything'}
            </div>

            <div>
              <p className="text-white/50 text-sm font-semibold uppercase tracking-widest mb-2">Professional</p>
              <div className="flex items-end gap-2 mb-1">
                {BETA_DISCOUNT_CODE && (
                  <span className="text-xl text-white/30 line-through mb-1.5">$29</span>
                )}
                <span className="text-4xl font-black text-white">{BETA_DISCOUNT_CODE ? '$19' : '$29'}</span>
                <span className="text-white/60 mb-1">/mo</span>
              </div>
              <p className="text-white/60 text-sm">
                {BETA_DISCOUNT_CODE
                  ? 'Beta price, locked in for as long as you stay subscribed.'
                  : 'No limits, no per-email cost. Cancel anytime.'}
              </p>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 flex-1">
              {PROFESSIONAL_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-2.5 text-sm text-white/85">
                  <CheckIcon className="w-4 h-4 shrink-0 text-[#00ff00]" />
                  {feature}
                </li>
              ))}
            </ul>

            {isPaidUser ? (
              <div className="w-full py-2.5 rounded-xl border border-white/10 text-white/60 text-sm font-bold text-center">
                Current plan
              </div>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={checkoutLoading}
                className="w-full py-3 rounded-xl text-sm font-bold transition-all bg-gradient-to-r from-[#00ffff] to-[#00ff00] text-black hover:shadow-lg hover:shadow-[#00ffff]/30 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {checkoutLoading ? 'Opening checkout…' : user ? 'Upgrade to Professional' : 'Sign up & upgrade'}
              </button>
            )}
          </div>
        </div>

        {isPaidUser && (
          <p className="text-center mt-6 text-white/60 text-sm">
            Need to cancel or update your payment method?{' '}
            <button onClick={handleManageBilling} disabled={portalLoading} className="text-white/70 underline hover:text-white transition-colors disabled:opacity-50">
              {portalLoading ? 'Loading…' : 'Manage billing'}
            </button>
          </p>
        )}
      </section>

      {/* ── About + FAQ ────────────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* About / founder note */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#00ffff]/60 uppercase mb-6">About</p>
            <div className="flex items-center gap-4 mb-6">
              {/* Photo — replace src with the real headshot at /public/images/founder-aarya.jpg */}
              <div className="relative flex-shrink-0 w-14 h-14">
                <img
                  src="/images/founder-aarya.jpg"
                  alt="Aarya, founder of Emlet"
                  className="w-14 h-14 rounded-full object-cover border-2 border-white/10"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.querySelector('.founder-placeholder')!.classList.remove('hidden');
                  }}
                />
                <div className="founder-placeholder hidden absolute inset-0 flex items-center justify-center rounded-full border-2 border-white/10 bg-gradient-to-br from-[#00ffff]/20 via-[#00ff00]/10 to-[#ff00ff]/20 text-lg font-black text-white">
                  A
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-white">
                Hi, I'm Aarya 👋🏻
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-base sm:text-lg text-white/70 leading-relaxed">
                I'm a founder myself, and I know the struggle of putting together a marketing email that actually looks good, fast.
              </p>
              <p className="text-base sm:text-lg text-white/70 leading-relaxed">
                Every time I needed one, I was either stuck fighting a clunky template builder for hours, or paying a designer just to change a headline.
              </p>
              <p className="text-base sm:text-lg text-white/70 leading-relaxed">
                I wanted a simple, affordable, and time-efficient way to go from an idea to a ready-to-send email, and that's how Emlet started.
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div id="faq" className="scroll-mt-24">
            <p className="text-xs font-semibold tracking-widest text-[#00ffff]/60 uppercase mb-6">FAQ</p>
            <div className="divide-y divide-white/8">
              {FAQS.map((faq, i) => (
                <div key={i}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between py-4 text-left gap-6 group"
                  >
                    <span className="text-sm sm:text-base font-semibold text-white group-hover:text-[#00ffff] transition-colors">{faq.q}</span>
                    <span className={`flex-shrink-0 text-[#00ffff]/60 transition-transform duration-200 ${openFaq === i ? 'rotate-45' : ''}`}>
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </span>
                  </button>
                  {openFaq === i && (
                    <p className="pb-4 text-sm text-white/55 leading-relaxed">{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 py-20 text-center">
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] px-8 py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00ffff]/5 via-transparent to-[#00ff00]/5 pointer-events-none" />
          <h2 className="relative text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Start generating high converting<br />
            <span className="bg-gradient-to-r from-[#00ffff] to-[#00ff00] bg-clip-text text-transparent">marketing emails today</span>
          </h2>
          <p className="relative text-base text-white/50 mb-8 max-w-lg mx-auto">
            Try it free - 5 AI actions every month, no credit card. Get your first high-converting email in under 60 seconds.
          </p>
          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/sign-up" className="rounded-full bg-white px-8 py-3 text-base font-bold text-black transition-all hover:shadow-2xl hover:shadow-white/20 hover:-translate-y-0.5">
              Get started free →
            </a>
            <a href="#pricing" className="rounded-full border border-white/20 px-8 py-3 text-base text-white/70 hover:border-white/40 hover:text-white transition-all">
              See pricing
            </a>
          </div>
        </div>
      </section>

      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/8 bg-black/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <a href="/" className="flex items-center gap-2 mb-4 w-fit">
                <Image src="/logo.png" alt="Emlet" width={532} height={532} className="h-8 w-auto" />
              </a>
              <p className="text-sm text-white/60 leading-relaxed">
                Generate high-converting marketing emails in seconds.<br />Idea to inbox, instantly.
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-xs font-semibold tracking-widest text-white/60 uppercase mb-4">Product</h3>
              <ul className="space-y-3 text-sm text-white/50">
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it works</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="/alternatives" className="hover:text-white transition-colors">Alternatives</a></li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h3 className="text-xs font-semibold tracking-widest text-white/60 uppercase mb-4">Account</h3>
              <ul className="space-y-3 text-sm text-white/50">
                <li><a href="/sign-in" className="hover:text-white transition-colors">Sign in</a></li>
                <li><a href="/sign-up" className="hover:text-white transition-colors">Sign up</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-xs font-semibold tracking-widest text-white/60 uppercase mb-4">Legal</h3>
              <ul className="space-y-3 text-sm text-white/50">
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/refunds" className="hover:text-white transition-colors">Refund Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/60">
              © {new Date().getFullYear()} Emlet. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://x.com" aria-label="X / Twitter" className="text-white/30 hover:text-white transition-colors">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
