'use client';

import { signUp, signInWithGoogle } from '@/app/actions/auth';
import { useState, useEffect } from 'react';

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasPendingPrompt, setHasPendingPrompt] = useState(false);

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
    setSuccess(null);
    
    // Validate password confirmation
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirm-password') as string;
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const result = await signUp(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.message) {
      setSuccess(result.message);
      setLoading(false);
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
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg font-semibold text-black">
                  e
                </span>
                <span className="text-2xl font-semibold text-white">emlet</span>
              </div>
              <h1 className="text-5xl font-bold text-white mb-4">
                Start creating today
              </h1>
              <p className="text-xl text-white/70">
                Join thousands of teams creating better emails, faster.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00ff00]/20 border border-[#00ff00] flex items-center justify-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-[#00ff00]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Free to start</h3>
                  <p className="text-white/60 text-sm">No credit card required. Start creating instantly.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00ffff]/20 border border-[#00ffff] flex items-center justify-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-[#00ffff]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Cancel anytime</h3>
                  <p className="text-white/60 text-sm">Flexible plans that grow with your needs</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ff00ff]/20 border border-[#ff00ff] flex items-center justify-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-[#ff00ff]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Expert support</h3>
                  <p className="text-white/60 text-sm">Get help whenever you need it</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Sign up form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-base font-semibold text-black">
              e
            </span>
            <span className="text-xl font-semibold text-white">emlet</span>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white">Create your account</h2>
            <p className="mt-2 text-sm text-white/60">
              {hasPendingPrompt ? (
                <span className="text-[#00ffff]">Sign up to generate your email</span>
              ) : (
                <>
                  Already have an account?{' '}
                  <a href="/sign-in" className="font-medium text-[#00ffff] hover:text-[#00ffff]/80 transition-colors">
                    Sign in
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

            {/* Success message */}
            {success && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                {success}
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
                  autoComplete="new-password"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00ffff] focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <p className="mt-1 text-xs text-white/50">Must be at least 6 characters</p>
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-white mb-2">
                  Confirm password
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00ffff] focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 rounded-lg text-black bg-white font-medium hover:shadow-xl hover:shadow-white/20 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>

              <p className="text-xs text-white/50 text-center">
                By signing up, you agree to our{' '}
                <a href="/terms" className="text-[#00ffff] hover:text-[#00ffff]/80">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-[#00ffff] hover:text-[#00ffff]/80">
                  Privacy Policy
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
