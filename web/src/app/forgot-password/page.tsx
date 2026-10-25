'use client';

import { requestPasswordReset } from '@/app/actions/auth';
import SubmitButton from '@/components/SubmitButton';
import { useState, useRef } from 'react';
import Turnstile, { type TurnstileHandle } from '@/components/Turnstile';
import AuthBackground from '@/components/AuthBackground';

const TURNSTILE_ENABLED = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    setMessage(null);
    const result = await requestPasswordReset(formData);
    setLoading(false);
    setTurnstileToken(null);
    turnstileRef.current?.reset();
    if (result?.error) {
      setError(result.error);
    } else if (result?.message) {
      setMessage(result.message);
    }
  };

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
      <AuthBackground />

      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="flex items-center justify-center mb-8">
          <img src="/logo.png" alt="Emlet" className="h-10 w-auto" />
        </div>

        <div>
          <h2 className="text-3xl font-bold text-white">Reset your password</h2>
          <p className="mt-2 text-sm text-white/60">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {message ? (
            <div className="p-3 rounded-lg bg-[#00ff00]/10 border border-[#00ff00]/20 text-[#00ff00] text-sm">
              {message}
            </div>
          ) : (
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

              <input type="hidden" name="turnstileToken" value={turnstileToken ?? ''} />
              <Turnstile
                ref={turnstileRef}
                onVerify={setTurnstileToken}
                onExpire={() => setTurnstileToken(null)}
                className="flex justify-center"
              />

              <SubmitButton loading={loading} disabled={(TURNSTILE_ENABLED && !turnstileToken)} pendingText="Sending..." className="w-full flex justify-center py-3 px-4 rounded-lg text-black bg-white font-medium hover:shadow-xl hover:shadow-white/20 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">Send reset link</SubmitButton>
            </form>
          )}

          <p className="text-sm text-white/60 text-center">
            Remembered it after all?{' '}
            <a href="/sign-in" className="font-medium text-[#00ffff] hover:text-[#00ffff]/80 transition-colors">
              Back to sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
