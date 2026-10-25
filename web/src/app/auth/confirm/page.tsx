import AuthBackground from '@/components/AuthBackground';
import ContinueForm from './ContinueForm';

/**
 * Landing page for the password-reset email link
 * (`/auth/confirm?token_hash=...&type=recovery`). The token is deliberately
 * NOT consumed here: some mail providers prefetch links to scan them, which
 * would burn the single-use token before the person ever clicks. Verification
 * happens in /auth/confirm/verify, only when the button is pressed.
 */
export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token_hash?: string }>;
}) {
  const { token_hash } = await searchParams;

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
      <AuthBackground />

      <div className="relative z-10 w-full max-w-md space-y-8 text-center">
        <div className="flex items-center justify-center mb-8">
          <img src="/logo.png" alt="Emlet" className="h-10 w-auto" />
        </div>

        {token_hash ? (
          <>
            <div>
              <h2 className="text-3xl font-bold text-white">Reset your password</h2>
              <p className="mt-2 text-sm text-white/60">
                Continue to choose a new password for your account.
              </p>
            </div>
            <ContinueForm tokenHash={token_hash} />
          </>
        ) : (
          <>
            <div>
              <h2 className="text-3xl font-bold text-white">Link invalid</h2>
              <p className="mt-2 text-sm text-white/60">This reset link is missing or incomplete.</p>
            </div>
            <a
              href="/forgot-password"
              className="w-full flex justify-center py-3 px-4 rounded-lg text-black bg-white font-medium hover:shadow-xl hover:shadow-white/20 hover:-translate-y-0.5 transition-all duration-200"
            >
              Request a new reset link
            </a>
          </>
        )}
      </div>
    </div>
  );
}
