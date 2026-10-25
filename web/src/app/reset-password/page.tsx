'use client';

import { updatePassword } from '@/app/actions/auth';
import PasswordInput from '@/components/PasswordInput';
import { useState } from 'react';
import AuthBackground from '@/components/AuthBackground';

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);

    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirm-password') as string;

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    const result = await updatePassword(formData);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setDone(true);
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
          <h2 className="text-3xl font-bold text-white">Set a new password</h2>
          <p className="mt-2 text-sm text-white/60">Choose a new password for your account.</p>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
              {error.toLowerCase().includes('session') && (
                <>
                  {' '}
                  <a href="/forgot-password" className="underline font-medium">
                    Request a new reset link
                  </a>
                  .
                </>
              )}
            </div>
          )}

          {done ? (
            <div className="space-y-5">
              <div className="p-3 rounded-lg bg-[#00ff00]/10 border border-[#00ff00]/20 text-[#00ff00] text-sm">
                Your password has been updated.
              </div>
              <a
                href="/dashboard"
                className="w-full flex justify-center py-3 px-4 rounded-lg text-black bg-white font-medium hover:shadow-xl hover:shadow-white/20 hover:-translate-y-0.5 transition-all duration-200"
              >
                Continue to dashboard
              </a>
            </div>
          ) : (
            <form action={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  New password
                </label>
                <PasswordInput
                  id="password"
                  name="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00ffff] focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-white mb-2">
                  Confirm new password
                </label>
                <PasswordInput
                  id="confirm-password"
                  name="confirm-password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00ffff] focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 rounded-lg text-black bg-white font-medium hover:shadow-xl hover:shadow-white/20 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
