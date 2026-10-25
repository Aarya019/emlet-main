'use client';

import { useState } from 'react';

/**
 * The "Continue" form on the password-reset landing page. The token in the link
 * is single-use, so a second submit (double-click) would fail with "expired".
 * This disables the button as soon as the form is submitted.
 */
export default function ContinueForm({ tokenHash }: { tokenHash: string }) {
  const [submitting, setSubmitting] = useState(false);

  return (
    <form method="POST" action="/auth/confirm/verify" onSubmit={() => setSubmitting(true)}>
      <input type="hidden" name="token_hash" value={tokenHash} />
      <button
        type="submit"
        disabled={submitting}
        aria-busy={submitting}
        className="w-full flex justify-center py-3 px-4 rounded-lg text-black bg-white font-medium hover:shadow-xl hover:shadow-white/20 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
      >
        {submitting ? 'Continuing...' : 'Continue'}
      </button>
    </form>
  );
}
