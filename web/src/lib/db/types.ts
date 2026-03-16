// Database types matching Supabase schema

export type PlanType = 'free' | 'pro' | 'enterprise';
export type BrandVoice = 'professional' | 'friendly' | 'casual' | 'formal';
export type EmailType = 'promotional' | 'newsletter' | 'educational' | 'transactional' | 'other';
export type GenerationStatus = 'generating' | 'completed' | 'failed';
export type ActionType = 'email_generation' | 'credit_purchase' | 'credit_refund' | 'plan_upgrade';
export type DesignStyle = 'minimalist' | 'editorial' | 'retro' | 'brutalist' | 'cyberpunk' | 'handwritten' | 'bauhaus';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  plan_type: PlanType;
  credits_remaining: number;
  total_credits_used: number;
  paddle_customer_id: string | null;
  paddle_subscription_id: string | null;
  subscription_status: 'active' | 'canceled' | 'past_due' | 'paused' | 'trialing' | null;
  created_at: string;
  updated_at: string;
}

export interface BrandProfile {
  id: string;
  user_id: string;
  brand_name: string;
  industry: string | null;
  brand_voice: BrandVoice;
  primary_color: string;
  secondary_color: string | null;
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
}

// Insert types (without auto-generated fields)
export type BrandProfileInsert = Omit<BrandProfile, 'id' | 'created_at' | 'updated_at'>;
export type BrandProfileUpdate = Partial<Omit<BrandProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

export type EmailGenerationInsert = Omit<EmailGeneration, 'id' | 'created_at' | 'updated_at'>;
export type EmailGenerationUpdate = Partial<Omit<EmailGeneration, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
