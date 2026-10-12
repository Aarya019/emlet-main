'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { verifyTurnstileToken } from '@/lib/turnstile';

async function getRequestIp(): Promise<string | undefined> {
  const headersList = await headers();
  return headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || headersList.get('x-real-ip') || undefined;
}

function getSiteUrl() {
  // SITE_URL is a server-only env var (set in Vercel without NEXT_PUBLIC_ prefix)
  // Falls back to NEXT_PUBLIC_SITE_URL for local dev
  return process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

export async function signIn(formData: FormData) {
  const turnstileToken = formData.get('turnstileToken') as string | null;
  const verified = await verifyTurnstileToken(turnstileToken, await getRequestIp());
  if (!verified) {
    return { error: 'Verification failed. Please refresh the page and try again.' };
  }

  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signUp(formData: FormData) {
  const turnstileToken = formData.get('turnstileToken') as string | null;
  const verified = await verifyTurnstileToken(turnstileToken, await getRequestIp());
  if (!verified) {
    return { error: 'Verification failed. Please refresh the page and try again.' };
  }

  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${getSiteUrl()}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // If email confirmation is required, user won't be logged in yet
  if (authData.user && !authData.session) {
    return { 
      success: true, 
      message: 'Check your email to confirm your account!' 
    };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function requestPasswordReset(formData: FormData) {
  const turnstileToken = formData.get('turnstileToken') as string | null;
  const verified = await verifyTurnstileToken(turnstileToken, await getRequestIp());
  if (!verified) {
    return { error: 'Verification failed. Please refresh the page and try again.' };
  }

  const email = formData.get('email') as string;
  const supabase = await createClient();

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getSiteUrl()}/auth/callback?next=/reset-password`,
  });

  // Always report success, whether or not the email exists — otherwise this
  // endpoint becomes a way to check which emails have an Emlet account.
  return { success: true, message: "If an account exists for that email, we've sent a password reset link." };
}

export async function updatePassword(formData: FormData) {
  const password = formData.get('password') as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function resendConfirmationEmail(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: `${getSiteUrl()}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: 'Confirmation email sent — check your inbox.' };
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/sign-in');
}

export async function signInWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${getSiteUrl()}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
}
