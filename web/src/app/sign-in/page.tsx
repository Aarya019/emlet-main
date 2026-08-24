'use client';

import { signIn, signInWithGoogle } from '@/app/actions/auth';
import { useState, useEffect, useRef } from 'react';
import Turnstile, { type TurnstileHandle } from '@/components/Turnstile';

const TURNSTILE_ENABLED = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function SignInPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasPendingPrompt, setHasPendingPrompt] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);

  useEffect(() => {
    // Check if there's a pending email prompt from the homepage
    const pendingPrompt = localStorage.getItem('pendingEmailPrompt');
    if (pendingPrompt) {
      setHasPendingPrompt(true);
    }
  }, []);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    const result = await signInWithGoogle();
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    const result = await signIn(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
      // Turnstile tokens are single-use — get a fresh one before the next attempt.
      setTurnstileToken(null);
      turnstileRef.current?.reset();
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-[#001a00]" />
        
        {/* Animated blobs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#00ff00]/20 rounded-full blur-3xl animate-pulse-slower" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#00ffff]/20 rounded-full blur-3xl animate-pulse-slow" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 py-12">
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <img src="/logo.png" alt="Emlet" className="h-12 w-auto" />
              </div>
              <h1 className="text-5xl font-bold text-white mb-4">
                Welcome back
              </h1>
              <p className="text-xl text-white/70">
                Sign in to continue creating emails that get read.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00ff00]/20 border border-[#00ff00] flex items-center justify-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-[#00ff00]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">AI-Powered Generation</h3>
                  <p className="text-white/60 text-sm">Create professional emails in seconds with AI</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00ffff]/20 border border-[#00ffff] flex items-center justify-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-[#00ffff]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Export Anywhere</h3>
                  <p className="text-white/60 text-sm">Download as HTML or TSX for any platform</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ff00ff]/20 border border-[#ff00ff] flex items-center justify-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-[#ff00ff]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Version History</h3>
                  <p className="text-white/60 text-sm">Never lose your work with automatic saves</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Sign in form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <img src="/logo.png" alt="Emlet" className="h-10 w-auto" />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white">Sign in to your account</h2>
            <p className="mt-2 text-sm text-white/60">
              {hasPendingPrompt ? (
                <span className="text-[#00ffff]">Sign in to generate your email</span>
              ) : (
                <>
                  Don't have an account?{' '}
                  <a href="/sign-up" className="font-medium text-[#00ffff] hover:text-[#00ffff]/80 transition-colors">
                    Sign up
                  </a>
                </>
              )}
            </p>
          </div>

          <div className="space-y-6">
            {/* Error message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-white/20 rounded-lg text-white bg-white/5 hover:bg-white/10 transition-all duration-200 hover:border-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-black text-white/60">Or continue with email</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form action={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00ffff] focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00ffff] focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#00ffff] focus:ring-[#00ffff] focus:ring-offset-0"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-white/70">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="/forgot-password" className="font-medium text-[#00ffff] hover:text-[#00ffff]/80 transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              <input type="hidden" name="turnstileToken" value={turnstileToken ?? ''} />
              <Turnstile
                ref={turnstileRef}
                onVerify={setTurnstileToken}
                onExpire={() => setTurnstileToken(null)}
                className="flex justify-center"
              />

              <button
                type="submit"
                disabled={loading || (TURNSTILE_ENABLED && !turnstileToken)}
                className="w-full flex justify-center py-3 px-4 rounded-lg text-black bg-white font-medium hover:shadow-xl hover:shadow-white/20 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
