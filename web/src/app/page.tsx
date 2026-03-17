'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// ── Replace these with your actual YouTube video IDs ──────────────────────────
const STEPS = [
  {
    number: '01',
    title: 'Describe your email',
    description: 'Type what you want in plain English — a product launch, Black Friday promo, welcome email, or newsletter. No templates to fill in, no design decisions upfront.',
    videoId: 'PLACEHOLDER_VIDEO_ID_1',
  },
  {
    number: '02',
    title: 'AI generates a stunning design',
    description: 'Emlet writes the copy and builds a fully designed, brand-matched email in seconds. Beautiful layouts, compelling headlines — production-ready out of the box.',
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
  { icon: '⚡', title: 'AI copywriting', desc: 'Brand-aware copy that converts, written in seconds.' },
  { icon: '🎨', title: '10+ design styles', desc: 'Minimalist, editorial, retro, brutalist, cyberpunk and more.' },
  { icon: '📦', title: 'Block-based editor', desc: 'Hero, CTA, testimonial, stats — every block fully editable.' },
  { icon: '🔧', title: 'React Email powered', desc: 'Production HTML that works in Gmail, Outlook, Apple Mail.' },
  { icon: '🚀', title: 'Export anywhere', desc: 'One-click HTML & TSX export for any ESP.' },
  { icon: '🏢', title: 'Brand profiles', desc: 'Save colors, voice & logo for consistent emails every time.' },
];

export default function Home() {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [streamingText, setStreamingText] = useState('');
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [userInput, setUserInput] = useState('');

  const examples = [
    "Product launch with 40% discount...",
    "Customer thank you email...",
    "Black Friday sale announcement...",
    "Welcome newsletter for subscribers...",
    "Cart abandonment reminder..."
  ];

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
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

  const handleGenerateEmail = () => {
    // Save the user's input to localStorage
    if (userInput.trim()) {
      localStorage.setItem('pendingEmailPrompt', userInput);
    }
    // Redirect to sign-in page
    router.push('/sign-in');
  };

  return (
<div className="relative min-h-screen bg-black text-zinc-50 font-sans overflow-x-hidden">
      {/* Animated gradient blobs with magnetic effect */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-[#00ff00]/20 via-[#00ffff]/20 to-[#ff00ff]/20 rounded-full blur-3xl animate-blob parallax-slow transition-transform duration-1000 ease-out"
          style={{ transform: windowSize.width ? `translate(${(mousePosition.x - windowSize.width / 2) * 0.02}px, ${(mousePosition.y - windowSize.height / 2) * 0.02}px)` : 'translate(0, 0)' }}
        />
        <div
          className="absolute top-1/2 -left-32 w-80 h-80 bg-gradient-to-br from-[#ff00ff]/20 via-[#00ffff]/20 to-[#00ff00]/20 rounded-full blur-3xl animate-blob animation-delay-2000 parallax-medium transition-transform duration-1000 ease-out"
          style={{ transform: windowSize.width ? `translate(${(mousePosition.x - windowSize.width / 2) * -0.015}px, ${(mousePosition.y - windowSize.height / 2) * -0.015}px)` : 'translate(0, 0)' }}
        />
        <div
          className="absolute -bottom-32 right-1/3 w-96 h-96 bg-gradient-to-br from-[#00ffff]/20 via-[#ff00ff]/20 to-[#00ff00]/20 rounded-full blur-3xl animate-blob animation-delay-4000 parallax-fast transition-transform duration-1000 ease-out"
          style={{ transform: windowSize.width ? `translate(${(mousePosition.x - windowSize.width / 2) * 0.025}px, ${(mousePosition.y - windowSize.height / 2) * 0.025}px)` : 'translate(0, 0)' }}
        />
      </div>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2 group">
            {/* Logo */}
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#00ffff] to-[#00ff00] text-sm font-black text-black select-none">
              e
            </span>
            <span className="text-base font-black tracking-tight text-white">
              emlet
            </span>
          </a>
          <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <a href="#how-it-works" className="transition-colors hover:text-white">How it works</a>
            <a href="#features" className="transition-colors hover:text-white">Features</a>
            <a href="/pricing" className="transition-colors hover:text-white">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="/sign-in" className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white transition-all hover:border-[#00ffff] hover:text-[#00ffff]">
              Sign in
            </a>
            <a href="/sign-up" className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-black transition-all hover:shadow-lg hover:shadow-white/20 hover:-translate-y-px">
              Get started free
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero / Generator ───────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full space-y-8 text-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00ffff]/30 bg-[#00ffff]/5 px-4 py-1.5 text-xs font-medium text-[#00ffff]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ffff] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ffff]" />
              </span>
              AI-powered email generation
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05]">
              Create better emails,
              <br />
              <span className="bg-gradient-to-r from-[#00ffff] via-[#00ff00] to-[#ff00ff] bg-clip-text text-transparent">
                10× faster.
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-base text-white/60 sm:text-lg md:text-xl leading-relaxed">
              Describe the email you want. Emlet's AI writes the copy, designs the layout, and outputs
              production-ready HTML — in seconds.
            </p>
          </div>

          {/* Generator input */}
          <div className="relative group text-left">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00ff00] via-[#00ffff] to-[#ff00ff] rounded-2xl opacity-70 group-hover:opacity-100 blur transition duration-500 animate-gradient bg-[length:200%_auto]" />
            <div className="relative rounded-2xl border border-white/10 bg-black/90 p-1.5 shadow-2xl backdrop-blur-sm">
              <textarea
                value={isUserTyping ? userInput : streamingText}
                placeholder={isUserTyping ? 'Describe the email you want to create...' : ''}
                onFocus={() => { setIsUserTyping(true); setStreamingText(''); }}
                onChange={(e) => { setIsUserTyping(true); setUserInput(e.target.value); setStreamingText(e.target.value); }}
                className="w-full resize-none rounded-xl border-0 bg-black/60 px-5 py-4 text-base text-white/60 placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#00ffff] focus:text-white min-h-[140px]"
              />
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <svg className="h-3.5 w-3.5 text-[#00ffff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-[#00ffff]">Gemini AI</span>
                  <span className="text-white/20">·</span>
                  <span>React Email</span>
                  <span className="text-white/20">·</span>
                  <span>HTML & TSX export</span>
                </div>
                <button
                  onClick={handleGenerateEmail}
                  className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-black transition-all hover:shadow-xl hover:shadow-white/20 hover:-translate-y-px hover:scale-105 active:scale-100 whitespace-nowrap"
                >
                  Generate Email →
                </button>
              </div>
            </div>
          </div>

          {/* Quick prompts */}
          <div className="flex flex-wrap items-center gap-2 justify-center">
            <span className="text-xs text-white/30">Try:</span>
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

          {/* Social proof */}
          <p className="text-xs text-white/25">
            No credit card required · 5 free emails per month · Cancel anytime
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
            <img
              src="/images/editor-screenshot.png"
              alt="Emlet AI email editor — drag-and-drop blocks, live preview, one-click HTML export"
              className="w-full h-full object-cover object-top"
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
        <p className="mt-4 text-center text-xs text-white/30">
          The Emlet email editor — write once, deploy anywhere
        </p>
      </section>

      {/* ── How it works ───────────────────────────────────────────────────── */}
      <section id="how-it-works" className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-20 md:py-28">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold tracking-widest text-[#00ffff]/60 uppercase mb-3">How it works</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            From idea to inbox in 3 steps
          </h2>
          <p className="text-base text-white/50 max-w-xl mx-auto">
            No design skills needed. No blank-page anxiety. Just describe what you need.
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
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/20 bg-white/[0.02]">
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-xs text-center px-6">
                        Replace <code className="text-white/40">PLACEHOLDER_VIDEO_ID_{i + 1}</code> in STEPS with your YouTube video ID
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
      <section id="features" className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-20 md:py-28">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-widest text-[#00ffff]/60 uppercase mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Everything you need to ship fast
          </h2>
          <p className="text-base text-white/50 max-w-xl mx-auto">
            Professional emails without the design headaches. Idea to inbox in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 hover:border-white/15 hover:bg-white/[0.04] transition-all group">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-base font-bold text-white mb-1 group-hover:text-[#00ffff] transition-colors">{f.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 py-20 text-center">
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] px-8 py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00ffff]/5 via-transparent to-[#00ff00]/5 pointer-events-none" />
          <h2 className="relative text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Start generating emails<br />
            <span className="bg-gradient-to-r from-[#00ffff] to-[#00ff00] bg-clip-text text-transparent">for free today</span>
          </h2>
          <p className="relative text-base text-white/50 mb-8 max-w-lg mx-auto">
            5 emails free every month. No credit card. Upgrade when you're ready.
          </p>
          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/sign-up" className="rounded-full bg-white px-8 py-3 text-base font-bold text-black transition-all hover:shadow-2xl hover:shadow-white/20 hover:-translate-y-0.5">
              Get started free →
            </a>
            <a href="/pricing" className="rounded-full border border-white/20 px-8 py-3 text-base text-white/70 hover:border-white/40 hover:text-white transition-all">
              See pricing
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/8 bg-black/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <a href="/" className="flex items-center gap-2 mb-4 w-fit">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#00ffff] to-[#00ff00] text-sm font-black text-black">
                  e
                </span>
                <span className="text-base font-black text-white">emlet</span>
              </a>
              <p className="text-sm text-white/40 leading-relaxed">
                AI-powered email studio.<br />Idea to inbox in seconds.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-xs font-semibold tracking-widest text-white/30 uppercase mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-white/50">
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it works</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="/pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="text-xs font-semibold tracking-widest text-white/30 uppercase mb-4">Account</h4>
              <ul className="space-y-3 text-sm text-white/50">
                <li><a href="/sign-in" className="hover:text-white transition-colors">Sign in</a></li>
                <li><a href="/sign-up" className="hover:text-white transition-colors">Sign up</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-semibold tracking-widest text-white/30 uppercase mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-white/50">
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/25">
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
