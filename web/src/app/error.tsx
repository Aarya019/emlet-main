'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-xl border border-red-500/30 bg-red-500/10 text-center">
        <h2 className="text-xl font-bold text-red-400 mb-2">Something went wrong</h2>
        <p className="text-red-300 mb-6">
          An unexpected error occurred. You can try again, or head back to the dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-full bg-[#00ffff] text-black font-semibold hover:bg-[#00ffff]/80 transition-all"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-full border border-white/20 text-white font-medium hover:bg-white/10 transition-all"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
