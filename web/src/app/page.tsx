'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
          style={{
            transform: windowSize.width ? `translate(${(mousePosition.x - windowSize.width / 2) * 0.02}px, ${(mousePosition.y - windowSize.height / 2) * 0.02}px)` : 'translate(0, 0)'
          }}
        />
        <div 
          className="absolute top-1/2 -left-32 w-80 h-80 bg-gradient-to-br from-[#ff00ff]/20 via-[#00ffff]/20 to-[#00ff00]/20 rounded-full blur-3xl animate-blob animation-delay-2000 parallax-medium transition-transform duration-1000 ease-out" 
          style={{
            transform: windowSize.width ? `translate(${(mousePosition.x - windowSize.width / 2) * -0.015}px, ${(mousePosition.y - windowSize.height / 2) * -0.015}px)` : 'translate(0, 0)'
          }}
        />
        <div 
          className="absolute -bottom-32 right-1/3 w-96 h-96 bg-gradient-to-br from-[#00ffff]/20 via-[#ff00ff]/20 to-[#00ff00]/20 rounded-full blur-3xl animate-blob animation-delay-4000 parallax-fast transition-transform duration-1000 ease-out" 
          style={{
            transform: windowSize.width ? `translate(${(mousePosition.x - windowSize.width / 2) * 0.025}px, ${(mousePosition.y - windowSize.height / 2) * 0.025}px)` : 'translate(0, 0)'
          }}
        />
      </div>
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:py-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-semibold text-black">
              e
            </span>
            <span className="text-base font-semibold tracking-tight text-white md:text-lg">
              emlet
            </span>
          </div>
          <nav className="hidden items-center gap-8 text-base text-white md:flex">
            <a href="#product" className="transition-colors hover:text-[#00ffff]">
              Product
            </a>
            <a href="#samples" className="transition-colors hover:text-[#00ffff]">
              Samples
            </a>
            <a href="#pricing" className="transition-colors hover:text-[#00ffff]">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-3 text-base">
            <a href="/sign-in" className="rounded-full border border-white/20 px-5 py-2 text-white transition-all hover:border-[#00ffff] hover:text-[#00ffff] hover:shadow-lg hover:shadow-[#00ffff]/30">
              Sign in
            </a>
            <a href="/sign-up" className="hidden rounded-full bg-white px-5 py-2 text-base font-medium text-black transition-all hover:shadow-xl hover:shadow-white/20 hover:-translate-y-0.5 md:inline-flex">
              Get started
            </a>
          </div>
        </div>
      </header>

      {/* Conversational Email Generator UI */}
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-4xl items-center justify-center px-4 py-8 sm:px-6 md:py-12 animate-scroll-fade-up">
        <div className="w-full space-y-6 md:space-y-8">
          <div className="text-center space-y-2 md:space-y-3">
            <h2 className="text-3xl font-semibold text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Create better emails, faster.
            </h2>
            <p className="text-base text-white/70 sm:text-lg md:text-xl">
              Generate and send engaging emails in minutes.
            </p>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00ff00] via-[#00ffff] to-[#ff00ff] rounded-xl sm:rounded-2xl opacity-80 group-hover:opacity-100 blur transition duration-500 animate-gradient bg-[length:200%_auto]" />
            <div className="relative rounded-xl sm:rounded-2xl border border-white/10 bg-black/80 p-1 sm:p-1.5 shadow-2xl backdrop-blur-sm">
              <textarea
                value={isUserTyping ? userInput : streamingText}
                placeholder={isUserTyping ? "Describe the email you want to create..." : ""}
                onFocus={() => {
                  setIsUserTyping(true);
                  setStreamingText('');
                }}
                onChange={(e) => {
                  setIsUserTyping(true);
                  setUserInput(e.target.value);
                  setStreamingText(e.target.value);
                }}
                className="w-full resize-none rounded-lg sm:rounded-xl border-0 bg-black/60 px-4 py-3 sm:px-5 sm:py-4 text-sm sm:text-base text-white/50 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00ffff] focus:text-white min-h-[140px] sm:min-h-[160px]"
              />
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-3 py-2 sm:px-4 sm:py-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-white/60 justify-center sm:justify-start">
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#00ffff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-[#00ffff]">AI-powered</span>
                  </span>
                  <span className="text-white/30">·</span>
                  <span className="hidden xs:inline">Export to HTML & TSX</span>
                  <span className="xs:hidden">HTML & TSX</span>
                </div>
                <button 
                  onClick={handleGenerateEmail}
                  className="w-full sm:w-auto rounded-full bg-white px-5 sm:px-6 py-2.5 text-sm font-medium text-black transition-all duration-300 hover:shadow-2xl hover:shadow-white/30 hover:-translate-y-1 hover:scale-105 active:scale-100"
                >
                  Generate Email
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 justify-center">
            <span className="text-xs sm:text-sm text-white/60 w-full sm:w-auto text-center">Try:</span>
            {[
              'Product launch announcement',
              'Customer follow-up',
              'Holiday promotion',
              'Newsletter welcome'
            ].map((prompt, i) => (
              <button
                key={prompt}
                className="rounded-full border border-white/20 bg-black/60 px-3 sm:px-4 py-1.5 text-xs sm:text-sm text-white/70 transition-all duration-300 hover:border-[#00ffff] hover:bg-black/80 hover:text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#00ffff]/40 animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-24 overflow-hidden">
        <div className="text-center mb-16 md:mb-24 animate-scroll-fade-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-4">
            Everything you need to ship fast
          </h2>
          <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto">
            From idea to inbox in minutes. Professional emails without the design headaches.
          </p>
        </div>

        <div className="space-y-24 md:space-y-32">
          {/* Feature 1 - Image on Right */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 animate-scroll-fade-up">
            <div className="flex-1 space-y-4 w-full">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
                AI-Powered Generation
              </h3>
              <p className="text-base sm:text-lg text-white/70 leading-relaxed">
                Describe your email in plain English. Our AI writes compelling copy that converts, understanding your brand voice and target audience. No more staring at blank pages.
              </p>
            </div>
            <div className="flex-1 w-full">
              <div className="aspect-[4/3] w-full rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm flex items-center justify-center overflow-hidden animate-image-reveal stagger-1">
                <span className="text-white/30 text-sm">Image placeholder</span>
              </div>
            </div>
          </div>

          {/* Feature 2 - Image on Left */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16 animate-scroll-fade-up" style={{animationDelay: "0.1s"}}>
            <div className="flex-1 space-y-4 w-full">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
                React Email Templates
              </h3>
              <p className="text-base sm:text-lg text-white/70 leading-relaxed">
                Production-ready templates built with React Email. Compatible with all major email clients including Gmail, Outlook, and Apple Mail. Export to HTML or TSX with one click.
              </p>
            </div>
            <div className="flex-1 w-full">
              <div className="aspect-[4/3] w-full rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm flex items-center justify-center overflow-hidden animate-image-reveal stagger-2">
                <span className="text-white/30 text-sm">Image placeholder</span>
              </div>
            </div>
          </div>

          {/* Feature 3 - Image on Right */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 animate-scroll-fade-up" style={{animationDelay: "0.2s"}}>
            <div className="flex-1 space-y-4 w-full">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
                Block-Based Editor
              </h3>
              <p className="text-base sm:text-lg text-white/70 leading-relaxed">
                Fine-tune every element with our intuitive visual editor. Drag, drop, and edit blocks to create the perfect email layout. Full control without touching code.
              </p>
            </div>
            <div className="flex-1 w-full">
              <div className="aspect-[4/3] w-full rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm flex items-center justify-center overflow-hidden animate-image-reveal stagger-3">
                <span className="text-white/30 text-sm">Image placeholder</span>
              </div>
            </div>
          </div>

          {/* Feature 4 - Image on Left */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16 animate-scroll-fade-up" style={{animationDelay: "0.3s"}}>
            <div className="flex-1 space-y-4 w-full">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
                Export Anywhere
              </h3>
              <p className="text-base sm:text-lg text-white/70 leading-relaxed">
                Download as HTML or TSX. Copy-paste ready for Mailchimp, SendGrid, Resend, or your custom email setup. Works with any email service provider.
              </p>
            </div>
            <div className="flex-1 w-full">
              <div className="aspect-[4/3] w-full rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm flex items-center justify-center overflow-hidden animate-image-reveal stagger-4">
                <span className="text-white/30 text-sm">Image placeholder</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/80 backdrop-blur-sm mt-16 md:mt-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-semibold text-black">
                  e
                </span>
                <span className="text-lg font-semibold text-white">emlet</span>
              </div>
              <p className="text-sm text-white/60">
                AI-powered email studio for modern teams.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#features" className="hover:text-[#00ffff] transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-[#00ffff] transition-colors">Pricing</a></li>
                <li><a href="#templates" className="hover:text-[#00ffff] transition-colors">Templates</a></li>
                <li><a href="#docs" className="hover:text-[#00ffff] transition-colors">Documentation</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#about" className="hover:text-[#00ffff] transition-colors">About</a></li>
                <li><a href="#blog" className="hover:text-[#00ffff] transition-colors">Blog</a></li>
                <li><a href="#careers" className="hover:text-[#00ffff] transition-colors">Careers</a></li>
                <li><a href="#contact" className="hover:text-[#00ffff] transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#privacy" className="hover:text-[#00ffff] transition-colors">Privacy</a></li>
                <li><a href="#terms" className="hover:text-[#00ffff] transition-colors">Terms</a></li>
                <li><a href="#security" className="hover:text-[#00ffff] transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/40">
              © 2026 Emlet. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#twitter" className="text-white/40 hover:text-[#00ffff] transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#github" className="text-white/40 hover:text-[#00ffff] transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                </svg>
              </a>
              <a href="#linkedin" className="text-white/40 hover:text-[#00ffff] transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
