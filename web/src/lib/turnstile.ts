/**
 * Cloudflare Turnstile server-side verification.
 * Docs: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 *
 * Set TURNSTILE_SECRET_KEY in .env.local to enable. Until it's set, verification
 * is a no-op (always passes) so sign-in/sign-up keep working before Cloudflare
 * is configured.
 */
export async function verifyTurnstileToken(token: string | null, remoteIp?: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) return true;
  if (!token) return false;

  try {
    const body = new URLSearchParams();
    body.append('secret', secretKey);
    body.append('response', token);
    if (remoteIp) body.append('remoteip', remoteIp);

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    });

    if (!res.ok) {
      console.error('Turnstile siteverify request failed:', res.status);
      return false;
    }

    const data = await res.json();
    return data.success === true;
  } catch (err) {
    console.error('Turnstile verification error:', err);
    return false;
  }
}
