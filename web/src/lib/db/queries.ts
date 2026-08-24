import { createClient } from '@/lib/supabase/server';
import type {
  Profile,
  BrandProfile,
  BrandProfileInsert,
  BrandProfileUpdate,
  EmailGeneration,
  EmailGenerationInsert,
  EmailGenerationUpdate,
  UserStats,
  PlanType,
  FreeActionFlag
} from './types';

// =====================================================
// PROFILE QUERIES
// =====================================================

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

/**
 * Like `getProfile`, but self-heals if the row is missing — e.g. an auth.users
 * row whose public.profiles row was deleted directly (rather than through
 * account deletion). The signup trigger that creates this row only fires once,
 * on the original auth.users INSERT, so without this a user in that state
 * would be permanently locked out of every credit/plan-gated action. RLS
 * allows a user to insert their own profile row, so this is safe to call with
 * the request-scoped (non-admin) Supabase client.
 */
export async function getOrCreateProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();

  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (data) return data;

  const { data: created, error: insertError } = await supabase
    .from('profiles')
    .insert({ id: userId })
    .select('*')
    .single();

  if (insertError) {
    console.error('Error creating missing profile for', userId, insertError);
    return null;
  }
  return created;
}

export async function updateProfile(
  userId: string, 
  updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
): Promise<Profile | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }

  return data;
}

export async function getUserStats(userId: string): Promise<UserStats | null> {
  const supabase = await createClient();

  // Query profiles directly (self-healing a missing row — e.g. deleted
  // independently of auth.users — rather than faking zeroed stats, which
  // never actually fixes the underlying account) instead of the get_user_stats
  // RPC, which predates the free-trial flags and doesn't return them.
  const profile = await getOrCreateProfile(userId);

  if (!profile) {
    console.error('Error fetching user stats: no profile for', userId);
    return {
      total_emails: 0,
      emails_this_month: 0,
      credits_remaining: 0,
      plan_type: 'free',
      free_brand_used: false,
      free_ai_edit_used: false,
      free_block_regenerate_used: false,
      free_test_email_used: false,
      cancel_at: null,
    };
  }

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [{ count: totalEmails }, { count: emailsThisMonth }] = await Promise.all([
    supabase.from('email_generations').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'completed'),
    supabase.from('email_generations').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'completed').gte('created_at', startOfMonth.toISOString()),
  ]);

  return {
    total_emails: totalEmails || 0,
    emails_this_month: emailsThisMonth || 0,
    credits_remaining: profile.credits_remaining || 0,
    plan_type: profile.plan_type || 'free',
    free_brand_used: profile.free_brand_used,
    free_ai_edit_used: profile.free_ai_edit_used,
    free_block_regenerate_used: profile.free_block_regenerate_used,
    free_test_email_used: profile.free_test_email_used,
    cancel_at: profile.cancel_at,
  };
}

// =====================================================
// BRAND PROFILE QUERIES
// =====================================================

export async function getBrandProfiles(userId: string): Promise<BrandProfile[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('brand_profiles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching brand profiles:', error);
    return [];
  }

  return data || [];
}

export async function getBrandProfile(id: string, userId: string): Promise<BrandProfile | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('brand_profiles')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching brand profile:', error);
    return null;
  }

  return data;
}

export async function getDefaultBrandProfile(userId: string): Promise<BrandProfile | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('brand_profiles')
    .select('*')
    .eq('user_id', userId)
    .eq('is_default', true)
    .single();

  if (error) {
    // No default brand profile is okay
    return null;
  }

  return data;
}

export async function createBrandProfile(profile: BrandProfileInsert): Promise<BrandProfile | null> {
  const supabase = await createClient();
  
  // If this is set as default, unset all other defaults first
  if (profile.is_default) {
    await supabase
      .from('brand_profiles')
      .update({ is_default: false })
      .eq('user_id', profile.user_id);
  }
  
  const { data, error } = await supabase
    .from('brand_profiles')
    .insert(profile)
    .select()
    .single();

  if (error) {
    console.error('Error creating brand profile:', error);
    return null;
  }

  return data;
}

export async function updateBrandProfile(
  id: string, 
  userId: string, 
  updates: BrandProfileUpdate
): Promise<BrandProfile | null> {
  const supabase = await createClient();
  
  // If setting as default, unset all other defaults first
  if (updates.is_default === true) {
    await supabase
      .from('brand_profiles')
      .update({ is_default: false })
      .eq('user_id', userId);
  }
  
  const { data, error } = await supabase
    .from('brand_profiles')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating brand profile:', error);
    return null;
  }

  return data;
}

export async function deleteBrandProfile(id: string, userId: string): Promise<boolean> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('brand_profiles')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting brand profile:', error);
    return false;
  }

  return true;
}

// =====================================================
// EMAIL GENERATION QUERIES
// =====================================================

export async function getEmailGenerations(userId: string, limit = 50): Promise<EmailGeneration[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('email_generations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching email generations:', error);
    return [];
  }

  return Promise.all((data || []).map(reapIfStale));
}

export async function getEmailGeneration(id: string, userId: string): Promise<EmailGeneration | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('email_generations')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching email generation:', error);
    return null;
  }

  return reapIfStale(data);
}

// A generation stuck in 'generating' past every route's maxDuration (60-120s)
// means the request that was supposed to complete it crashed or timed out
// without ever reaching its own failure handler — otherwise it would already
// be 'completed' or 'failed'. Flip it lazily whenever it's read next, rather
// than running a cron job, so the dashboard/editor never show a row spinning
// forever.
const STALE_GENERATING_MS = 5 * 60 * 1000;

async function reapIfStale(row: EmailGeneration): Promise<EmailGeneration> {
  const isStale = row.status === 'generating' &&
    (Date.now() - new Date(row.created_at).getTime()) > STALE_GENERATING_MS;
  if (!isStale) return row;

  const supabase = await createClient();
  const { data } = await supabase
    .from('email_generations')
    .update({ status: 'failed', error_message: 'Generation timed out or was interrupted' })
    .eq('id', row.id)
    .eq('status', 'generating')
    .select()
    .single();

  return data ?? row;
}

export async function createEmailGeneration(generation: EmailGenerationInsert): Promise<EmailGeneration | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('email_generations')
    .insert(generation)
    .select()
    .single();

  if (error) {
    console.error('Error creating email generation:', error);
    return null;
  }

  return data;
}

export async function updateEmailGeneration(
  id: string, 
  userId: string, 
  updates: EmailGenerationUpdate
): Promise<EmailGeneration | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('email_generations')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating email generation:', error);
    return null;
  }

  return data;
}

export async function deleteEmailGeneration(id: string, userId: string): Promise<boolean> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('email_generations')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting email generation:', error);
    return false;
  }

  return true;
}

// =====================================================
// CREDIT MANAGEMENT
// =====================================================

export async function deductCredits(userId: string, credits: number): Promise<boolean> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .rpc('deduct_credits', { 
      user_uuid: userId, 
      credits: credits 
    });

  if (error || !data) {
    console.error('Error deducting credits:', error);
    return false;
  }

  return data;
}

/**
 * Atomically claims a free-plan user's one-time use of `flag` (pro users
 * always pass, no mutation). This claims the use BEFORE the gated action
 * runs, via a single DB-side UPDATE ... WHERE ... flag = false, closing the
 * check-then-act race where two concurrent requests could both read
 * "not used yet" and both proceed. If the gated action subsequently fails,
 * call `releaseFreeAction` to give the claim back so a failed request
 * doesn't burn the user's one shot.
 */
export async function claimFreeAction(userId: string, flag: FreeActionFlag): Promise<{ allowed: boolean; planType: PlanType }> {
  const supabase = await createClient();

  const [{ data: claimed, error }, profile] = await Promise.all([
    supabase.rpc('try_use_free_action', { user_uuid: userId, flag_name: flag }),
    getOrCreateProfile(userId),
  ]);

  if (error) {
    console.error('Error claiming free action:', error);
    return { allowed: false, planType: profile?.plan_type ?? 'free' };
  }

  return { allowed: !!claimed, planType: profile?.plan_type ?? 'free' };
}

/** Gives back a claimed one-time free action after the gated work it guarded fails. */
export async function releaseFreeAction(userId: string, flag: FreeActionFlag): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc('release_free_action', { user_uuid: userId, flag_name: flag });
  if (error) console.error('Error releasing free action:', error);
}

// =====================================================
// PADDLE BILLING QUERIES
// =====================================================

export async function setUserPlan(
  userId: string,
  planType: 'free' | 'pro' | 'enterprise',
  creditsRemaining: number,
  paddleCustomerId?: string,
  paddleSubscriptionId?: string,
  subscriptionStatus?: string
): Promise<boolean> {
  const supabase = await createClient();

  const updates: Record<string, unknown> = {
    plan_type: planType,
    credits_remaining: creditsRemaining,
    updated_at: new Date().toISOString(),
  };
  if (paddleCustomerId !== undefined) updates.paddle_customer_id = paddleCustomerId;
  if (paddleSubscriptionId !== undefined) updates.paddle_subscription_id = paddleSubscriptionId;
  if (subscriptionStatus !== undefined) updates.subscription_status = subscriptionStatus;

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) {
    console.error('Error setting user plan:', error);
    return false;
  }
  return true;
}

export async function getUserByPaddleSubscriptionId(subscriptionId: string): Promise<{ id: string; plan_type: string } | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('id, plan_type')
    .eq('paddle_subscription_id', subscriptionId)
    .single();

  if (error) {
    console.error('Error fetching user by paddle subscription ID:', error);
    return null;
  }
  return data;
}

export async function getUserByPaddleCustomerId(customerId: string): Promise<{ id: string; plan_type: string } | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('id, plan_type')
    .eq('paddle_customer_id', customerId)
    .single();

  if (error) {
    console.error('Error fetching user by paddle customer ID:', error);
    return null;
  }
  return data;
}

export async function resetMonthlyCredits(userId: string, credits: number): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('profiles')
    .update({ credits_remaining: credits, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) {
    console.error('Error resetting credits:', error);
    return false;
  }
  return true;
}
