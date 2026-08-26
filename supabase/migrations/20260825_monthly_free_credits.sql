-- =====================================================
-- Free plan: switch email-generation credits from a one-time
-- lifetime grant (1, ever) to a recurring monthly allowance (3/month).
-- =====================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS credits_reset_at TIMESTAMPTZ;

ALTER TABLE public.profiles
  ALTER COLUMN credits_remaining SET DEFAULT 3;

-- Existing free-plan rows: give them the new monthly allowance and anchor
-- their reset date at now(), so they don't get a bonus mid-cycle top-up on
-- their very next request.
UPDATE public.profiles
SET credits_remaining = 3, credits_reset_at = now()
WHERE plan_type = 'free';

-- Refills a free user's credits back to 3 if their last reset was in a prior
-- calendar month. No-op for pro/enterprise (never gated on credits_remaining)
-- and for anyone already reset this month.
CREATE OR REPLACE FUNCTION public.refresh_monthly_credits(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET credits_remaining = 3, credits_reset_at = now()
  WHERE id = user_uuid
    AND plan_type = 'free'
    AND (credits_reset_at IS NULL OR date_trunc('month', credits_reset_at) < date_trunc('month', now()));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- deduct_credits now refreshes the monthly allowance first, in the same
-- transaction, so a free user's first request of a new month is checked
-- against the fresh 3 rather than whatever was left over at the end of last
-- month's cycle.
CREATE OR REPLACE FUNCTION public.deduct_credits(user_uuid UUID, credits INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  did_update BOOLEAN;
BEGIN
  PERFORM public.refresh_monthly_credits(user_uuid);

  UPDATE public.profiles
  SET
    credits_remaining = credits_remaining - credits,
    total_credits_used = total_credits_used + credits
  WHERE id = user_uuid
    AND credits_remaining >= credits
  RETURNING true INTO did_update;

  RETURN COALESCE(did_update, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
