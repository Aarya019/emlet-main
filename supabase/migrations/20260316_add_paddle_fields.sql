-- =====================================================
-- PADDLE BILLING INTEGRATION
-- Adds Paddle customer/subscription fields to profiles
-- =====================================================

-- Add Paddle fields to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS paddle_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS paddle_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS subscription_status TEXT CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'paused', 'trialing'));

-- Change default credits for new signups: 10 → 5
ALTER TABLE public.profiles
  ALTER COLUMN credits_remaining SET DEFAULT 5;

-- Index for webhook lookups by Paddle subscription ID
CREATE INDEX IF NOT EXISTS idx_profiles_paddle_subscription_id
  ON public.profiles(paddle_subscription_id);

-- Index for webhook lookups by Paddle customer ID
CREATE INDEX IF NOT EXISTS idx_profiles_paddle_customer_id
  ON public.profiles(paddle_customer_id);
