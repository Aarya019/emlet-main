import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Consumes the password-recovery token_hash from the email link and starts a
 * short session so /reset-password can call updateUser. `type` is hardcoded to
 * 'recovery' so this endpoint can't be used to verify other token types.
 * 303 so the browser follows the redirect with a GET.
 */
export async function POST(request: Request) {
  const { origin } = new URL(request.url);
  const formData = await request.formData();
  const tokenHash = formData.get('token_hash');

  if (typeof tokenHash === 'string' && tokenHash) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'recovery' });
    if (!error) {
      return NextResponse.redirect(`${origin}/reset-password`, 303);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`, 303);
}
