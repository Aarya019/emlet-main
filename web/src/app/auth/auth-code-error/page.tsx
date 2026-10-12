'use client';

import { useEffect, useState } from 'react';
import AuthBackground from '@/components/AuthBackground';

function describeError(errorCode: string | null, description: string | null): string {
  if (errorCode === 'otp_expired') {
    return "This link has expired, or has already been used. Links from Emlet are single-use and only valid for a limited time.";
  }
  if (description) {
    return description.replace(/\+/g, ' ');
  }
  return 'This link is invalid or has expired.';
}

export default function AuthCodeErrorPage() {
  const [message, setMessage] = useState('This link is invalid or has expired.');

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const search = new URLSearchParams(window.location.search);
    const errorCode = hash.get('error_code') || search.get('error_code');
    const description = hash.get('error_description') || search.get('error_description');
    setMessage(describeError(errorCode, description));
  }, []);

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
      <AuthBackground />

      <div className="relative z-10 w-full max-w-md space-y-8 text-center">
        <div className="flex items-center justify-center mb-8">
          <img src="/logo.png" alt="Emlet" className="h-10 w-auto" />
        </div>

        <div>
          <h2 className="text-3xl font-bold text-white">Link expired</h2>
          <p className="mt-2 text-sm text-white/60">{message}</p>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href="/forgot-password"
            className="w-full flex justify-center py-3 px-4 rounded-lg text-black bg-white font-medium hover:shadow-xl hover:shadow-white/20 hover:-translate-y-0.5 transition-all duration-200"
          >
            Request a new reset link
          </a>
          <a
            href="/sign-in"
            className="w-full flex justify-center py-3 px-4 rounded-lg text-white/70 hover:text-white transition-colors text-sm"
          >
            Back to sign in
          </a>
        </div>
      </div>
    </div>
  );
}
