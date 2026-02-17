-- =====================================================
-- EMLET DATABASE SCHEMA - PHASE 1
-- Run this in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: profiles
-- Extends auth.users with app-specific user data
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  plan_type TEXT NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'enterprise')),
  credits_remaining INTEGER NOT NULL DEFAULT 10,
  total_credits_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_plan_type ON public.profiles(plan_type);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- TABLE: brand_profiles
-- Stores brand identity information for email generation
-- =====================================================
CREATE TABLE IF NOT EXISTS public.brand_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL,
  industry TEXT,
  brand_voice TEXT NOT NULL DEFAULT 'professional' CHECK (brand_voice IN ('professional', 'friendly', 'casual', 'formal')),
  primary_color TEXT NOT NULL DEFAULT '#5c5cf0',
  secondary_color TEXT,
  brand_description TEXT,
  logo_url TEXT,
  website_url TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_brand_profiles_user_id ON public.brand_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_brand_profiles_is_default ON public.brand_profiles(user_id, is_default);

-- Enable RLS
ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for brand_profiles
CREATE POLICY "Users can view their own brand profiles"
  ON public.brand_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own brand profiles"
  ON public.brand_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own brand profiles"
  ON public.brand_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own brand profiles"
  ON public.brand_profiles
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- TABLE: email_generations
-- Stores generated emails (AI output)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.email_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_profile_id UUID REFERENCES public.brand_profiles(id) ON DELETE SET NULL,
  prompt TEXT NOT NULL,
  email_type TEXT CHECK (email_type IN ('promotional', 'newsletter', 'educational', 'transactional', 'other')),
  subject_line TEXT,
  preview_text TEXT,
  content_json JSONB,
  react_code TEXT,
  html_code TEXT,
  status TEXT NOT NULL DEFAULT 'generating' CHECK (status IN ('generating', 'completed', 'failed')),
  credits_used INTEGER NOT NULL DEFAULT 1,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_email_generations_user_id ON public.email_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_email_generations_brand_profile_id ON public.email_generations(brand_profile_id);
CREATE INDEX IF NOT EXISTS idx_email_generations_status ON public.email_generations(user_id, status);
CREATE INDEX IF NOT EXISTS idx_email_generations_created_at ON public.email_generations(user_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.email_generations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for email_generations
CREATE POLICY "Users can view their own email generations"
  ON public.email_generations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own email generations"
  ON public.email_generations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own email generations"
  ON public.email_generations
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own email generations"
  ON public.email_generations
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- TABLE: usage_logs
-- Tracks user activity and credit usage
-- =====================================================
CREATE TABLE IF NOT EXISTS public.usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN ('email_generation', 'credit_purchase', 'credit_refund', 'plan_upgrade')),
  credits_used INTEGER NOT NULL DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON public.usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON public.usage_logs(user_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for usage_logs
CREATE POLICY "Users can view their own usage logs"
  ON public.usage_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTION: Auto-create profile on user signup
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- FUNCTION: Update updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_brand_profiles_updated_at ON public.brand_profiles;
CREATE TRIGGER update_brand_profiles_updated_at
  BEFORE UPDATE ON public.brand_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_email_generations_updated_at ON public.email_generations;
CREATE TRIGGER update_email_generations_updated_at
  BEFORE UPDATE ON public.email_generations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- FUNCTION: Deduct credits when generating email
-- =====================================================
CREATE OR REPLACE FUNCTION public.deduct_credits(user_uuid UUID, credits INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  current_credits INTEGER;
BEGIN
  -- Get current credits
  SELECT credits_remaining INTO current_credits
  FROM public.profiles
  WHERE id = user_uuid;

  -- Check if user has enough credits
  IF current_credits >= credits THEN
    -- Deduct credits
    UPDATE public.profiles
    SET 
      credits_remaining = credits_remaining - credits,
      total_credits_used = total_credits_used + credits
    WHERE id = user_uuid;
    
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: Get user stats
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_user_stats(user_uuid UUID)
RETURNS TABLE (
  total_emails INTEGER,
  emails_this_month INTEGER,
  credits_remaining INTEGER,
  plan_type TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(eg.id)::INTEGER as total_emails,
    COUNT(eg.id) FILTER (WHERE eg.created_at >= DATE_TRUNC('month', NOW()))::INTEGER as emails_this_month,
    p.credits_remaining,
    p.plan_type
  FROM public.profiles p
  LEFT JOIN public.email_generations eg ON eg.user_id = p.id AND eg.status = 'completed'
  WHERE p.id = user_uuid
  GROUP BY p.credits_remaining, p.plan_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- DONE!
-- =====================================================
-- You can now test by running:
-- SELECT * FROM public.profiles;
-- SELECT * FROM public.brand_profiles;
-- =====================================================
