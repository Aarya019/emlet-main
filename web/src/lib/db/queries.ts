import { createClient } from '@/lib/supabase/server';
import type { 
  Profile, 
  BrandProfile, 
  BrandProfileInsert, 
  BrandProfileUpdate,
  EmailGeneration,
  EmailGenerationInsert,
  EmailGenerationUpdate,
  UserStats
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
  
  const { data, error } = await supabase
    .rpc('get_user_stats', { user_uuid: userId })
    .single();

  if (error) {
    console.error('Error fetching user stats:', error);
    return null;
  }

  return data as UserStats;
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

  return data || [];
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

  return data;
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
