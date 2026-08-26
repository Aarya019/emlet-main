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
  credits_remaining: number;
  /** Free-plan credits refill to 3 whenever this crosses into a new calendar month — see refresh_monthly_credits() in the DB. Null/pro/enterprise: not used for gating. */
  credits_reset_at: string | null;
  total_credits_used: number;
  paddle_customer_id: string | null;
  paddle_subscription_id: string | null;
  subscription_status: 'active' | 'canceled' | 'past_due' | 'paused' | 'trialing' | null;
  /** Free-plan users get exactly one brand profile, ever — not reset by deleting it. */
  free_brand_used: boolean;
  /** Free-plan users get exactly one "Edit with AI" action, ever. */
  free_ai_edit_used: boolean;
  /** Free-plan users get exactly one per-block regenerate action, ever. */
  free_block_regenerate_used: boolean;
  /** Free-plan users get exactly one "Send Test Email" action, ever. */
  free_test_email_used: boolean;
  /** Set when a subscription is scheduled to cancel at period end; cleared on renewal/reactivation. */
  cancel_at: string | null;
  created_at: string;
  updated_at: string;
}

export type FreeActionFlag = 'free_brand_used' | 'free_ai_edit_used' | 'free_block_regenerate_used' | 'free_test_email_used';

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
  credits_remaining: number;
  plan_type: PlanType;
  free_brand_used: boolean;
  free_ai_edit_used: boolean;
  free_block_regenerate_used: boolean;
  free_test_email_used: boolean;
  cancel_at: string | null;
}

// Insert types (without auto-generated fields)
export type BrandProfileInsert = Omit<BrandProfile, 'id' | 'created_at' | 'updated_at'>;
export type BrandProfileUpdate = Partial<Omit<BrandProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

export type EmailGenerationInsert = Omit<EmailGeneration, 'id' | 'created_at' | 'updated_at'>;
export type EmailGenerationUpdate = Partial<Omit<EmailGeneration, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
