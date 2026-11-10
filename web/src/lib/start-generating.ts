/**
 * Hand a prompt to the email generator from a public page (client-side only). The prompt waits in
 * localStorage, the same hand-off the homepage uses, and the dashboard pre-fills it once the visitor is in.
 * Signed-in visitors go straight to the dashboard; everyone else goes to sign-up first.
 */
export async function startGenerating(prompt: string): Promise<void> {
  try {
    if (prompt.trim()) window.localStorage.setItem('pendingEmailPrompt', prompt.trim());
  } catch {
    // storage blocked: they just land on an empty prompt box
  }

  let signedIn = false;
  try {
    const res = await fetch('/api/user/stats', { cache: 'no-store' });
    signedIn = res.ok;
  } catch {
    // treat as signed out
  }
  window.location.assign(signedIn ? '/dashboard' : '/sign-up');
}
