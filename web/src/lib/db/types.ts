// Database types matching Supabase schema

export type PlanType = 'free' | 'pro' | 'enterprise';
export type BrandVoice = 'professional' | 'friendly' | 'casual' | 'formal';
export type EmailType = 'promotional' | 'newsletter' | 'educational' | 'transactional' | 'other';
export type GenerationStatus = 'generating' | 'completed' | 'failed';
export type ActionType = 'email_generation' | 'credit_purchase' | 'credit_refund' | 'plan_upgrade';
export type DesignStyle = 'simple' | 'minimalist' | 'editorial' | 'retro' | 'brutalist' | 'cyberpunk' | 'handwritten' | 'bauhaus';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  plan_type: PlanType;
  /** Pooled free-plan AI-actions allowance (email generation + AI edit + block regeneration) — 5/month, see refresh_monthly_credits() in the DB. Unlimited for pro/enterprise. */
  credits_remaining: number;
  /** Free-plan credits_remaining refills whenever this crosses into a new calendar month — see refresh_monthly_credits() in the DB. Null/pro/enterprise: not used for gating. */
  credits_reset_at: string | null;
  /** Separate free-plan test-send allowance — 3/month, not pooled with credits_remaining since test sends have no AI cost. See refresh_monthly_test_sends() in the DB. */
  test_send_credits_remaining: number;
  /** Free-plan test_send_credits_remaining refills whenever this crosses into a new calendar month. Null/pro/enterprise: not used for gating. */
  test_send_reset_at: string | null;
  total_credits_used: number;
  paddle_customer_id: string | null;
  paddle_subscription_id: string | null;
  subscription_status: 'active' | 'canceled' | 'past_due' | 'paused' | 'trialing' | null;
  /** Free-plan users get at most one brand profile at a time — deleting one frees the slot back up (see DELETE /api/brand-profiles/[id]). */
  free_brand_used: boolean;
  /** No longer read by the app — AI edit is gated by credits_remaining instead (pooled with generation/regeneration). Left in place as a harmless historical column. */
  free_ai_edit_used: boolean;
  /** No longer read by the app — block regeneration is gated by credits_remaining instead (pooled with generation/AI edit). Left in place as a harmless historical column. */
  free_block_regenerate_used: boolean;
  /** No longer read by the app — test send is gated by test_send_credits_remaining instead. Left in place as a harmless historical column. */
  free_test_email_used: boolean;
  /** Set when a subscription is scheduled to cancel at period end; cleared on renewal/reactivation. */
  cancel_at: string | null;
  created_at: string;
  updated_at: string;
}

export type FreeActionFlag = 'free_brand_used';

export interface BrandProfile {
  id: string;
  user_id: string;
  brand_name: string;
  industry: string | null;
  brand_voice: BrandVoice;
  primary_color: string;
  secondary_color: string | null;
  background_color: string | null;
  brand_description: string | null;
  logo_url: string | null;
  website_url: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmailGeneration {
  id: string;
  user_id: string;
  brand_profile_id: string | null;
  prompt: string;
  email_type: EmailType | null;
  design_style: DesignStyle;
  subject_line: string | null;
  preview_text: string | null;
  content_json: any | null;
  react_code: string | null;
  html_code: string | null;
  status: GenerationStatus;
  credits_used: number;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface UsageLog {
  id: string;
  user_id: string;
  action_type: ActionType;
  credits_used: number;
  metadata: any | null;
  created_at: string;
}

export interface UserStats {
  total_emails: number;
  emails_this_month: number;
  /** Pooled AI-actions allowance remaining (generation + AI edit + block regeneration). */
  credits_remaining: number;
  /** Separate test-send allowance remaining. */
  test_send_credits_remaining: number;
  plan_type: PlanType;
  free_brand_used: boolean;
  cancel_at: string | null;
}

// Insert types (without auto-generated fields)
export type BrandProfileInsert = Omit<BrandProfile, 'id' | 'created_at' | 'updated_at'>;
export type BrandProfileUpdate = Partial<Omit<BrandProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

export type EmailGenerationInsert = Omit<EmailGeneration, 'id' | 'created_at' | 'updated_at'>;
export type EmailGenerationUpdate = Partial<Omit<EmailGeneration, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
