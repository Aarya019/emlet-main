'use client';

import { useFormStatus } from 'react-dom';

interface SubmitButtonProps {
  children: React.ReactNode;
  /** Label shown while the form action is running. */
  pendingText: string;
  className: string;
  /** Extra reasons to disable the button (e.g. CAPTCHA not solved yet). */
  disabled?: boolean;
  /** Page-level loading state, kept for flows that set it themselves. */
  loading?: boolean;
}

/**
 * Submit button for <form action={fn}> forms. useFormStatus reports "pending"
 * the instant the form is submitted, so the button disables and dims right
 * away. Relying on a useState flag set inside the async action doesn't do
 * that: React holds state updates made in a form action until the action
 * finishes, so the button stayed clickable (and un-dimmed) the whole time.
 */
export default function SubmitButton({ children, pendingText, className, disabled, loading }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const busy = pending || !!loading;
  return (
    <button
      type="submit"
      disabled={busy || disabled}
      aria-busy={busy}
      className={`${className} disabled:hover:translate-y-0 disabled:hover:shadow-none`}
    >
      {busy ? pendingText : children}
    </button>
  );
}
