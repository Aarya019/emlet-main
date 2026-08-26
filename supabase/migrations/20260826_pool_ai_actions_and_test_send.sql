-- =====================================================
-- Free plan restructure:
-- 1. Pool email generation + AI edit + block regeneration into a single
--    shared monthly allowance (was: generation alone at 3/month, edit/regen
--    each a separate one-time-per-account grant). Bumped to 5/month total
--    since pooling three actions into the same budget as one would otherwise
--    be a large cut versus what free users had (up to 9/month across the
--    three separate buckets).
-- 2. Test send gets its own separate monthly allowance (3/month) instead of
--    a one-time-per-account grant — it has no AI cost, so there's no reason
--    to tie it to the AI-actions budget or make it a lifetime grant.
-- =====================================================

-- ── AI actions pool (generate + edit + regenerate): 3/month → 5/month ──────
ALTER TABLE public.profiles
  ALTER COLUMN credits_remaining SET DEFAULT 5;

UPDATE public.profiles
SET credits_remaining = 5, credits_reset_at = now()
WHERE plan_type = 'free';

CREATE OR REPLACE FUNCTION public.refresh_monthly_credits(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET credits_remaining = 5, credits_reset_at = now()
  WHERE id = user_uuid
    AND plan_type = 'free'
    AND (credits_reset_at IS NULL OR date_trunc('month', credits_reset_at) < date_trunc('month', now()));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── Test send: separate pool, 3/month, recurring ────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS test_send_credits_remaining INTEGER NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS test_send_reset_at TIMESTAMPTZ;

UPDATE public.profiles
SET test_send_credits_remaining = 3, test_send_reset_at = now()
WHERE plan_type = 'free';

CREATE OR REPLACE FUNCTION public.refresh_monthly_test_sends(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET test_send_credits_remaining = 3, test_send_reset_at = now()
  WHERE id = user_uuid
    AND plan_type = 'free'
    AND (test_send_reset_at IS NULL OR date_trunc('month', test_send_reset_at) < date_trunc('month', now()));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.deduct_test_send_credit(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  did_update BOOLEAN;
BEGIN
  PERFORM public.refresh_monthly_test_sends(user_uuid);

  UPDATE public.profiles
  SET test_send_credits_remaining = test_send_credits_remaining - 1
  WHERE id = user_uuid
    AND test_send_credits_remaining >= 1
  RETURNING true INTO did_update;

  RETURN COALESCE(did_update, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: free_ai_edit_used, free_block_regenerate_used, and free_test_email_used
-- are no longer read by the application (superseded by the pooled counters
-- above) but are left in place rather than dropped — harmless dead columns,
-- not worth a destructive migration to remove mid-beta.
