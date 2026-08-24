-- =====================================================
-- Scaling/concurrency fixes (all zero-cost, code-level closures of races)
-- =====================================================

-- ── 1. Make credit deduction atomic ─────────────────────────────────────
-- The original version did SELECT credits_remaining then a separate UPDATE,
-- which is not atomic across concurrent requests: two simultaneous calls can
-- both read credits_remaining = 1, both pass the check, and both deduct —
-- letting a free user get two generations out of one credit. A single
-- UPDATE ... WHERE ... RETURNING is atomic per-row in Postgres (the second
-- concurrent UPDATE blocks on the row lock, then re-evaluates WHERE against
-- the already-decremented value).
CREATE OR REPLACE FUNCTION public.deduct_credits(user_uuid UUID, credits INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  did_update BOOLEAN;
BEGIN
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

-- ── 2. Atomic claim/release for one-time free-trial actions ────────────
-- Previously: canUseFreeAction (read) then markFreeActionUsed (write) were
-- two separate round trips, so two concurrent requests (double-click, retry)
-- could both read "not used yet" and both proceed. try_use_free_action claims
-- the flag atomically in one UPDATE; release_free_action gives the claim back
-- if the gated action fails afterward, preserving "a failed request never
-- burns the user's one shot."
CREATE OR REPLACE FUNCTION public.try_use_free_action(user_uuid UUID, flag_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  is_pro BOOLEAN;
  claimed BOOLEAN;
BEGIN
  IF flag_name NOT IN ('free_brand_used', 'free_ai_edit_used', 'free_block_regenerate_used', 'free_test_email_used') THEN
    RAISE EXCEPTION 'invalid flag_name: %', flag_name;
  END IF;

  SELECT (plan_type = 'pro') INTO is_pro FROM public.profiles WHERE id = user_uuid;
  IF is_pro THEN
    RETURN true;
  END IF;

  EXECUTE format(
    'UPDATE public.profiles SET %I = true WHERE id = $1 AND %I = false RETURNING true',
    flag_name, flag_name
  ) INTO claimed USING user_uuid;

  RETURN COALESCE(claimed, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.release_free_action(user_uuid UUID, flag_name TEXT)
RETURNS VOID AS $$
BEGIN
  IF flag_name NOT IN ('free_brand_used', 'free_ai_edit_used', 'free_block_regenerate_used', 'free_test_email_used') THEN
    RAISE EXCEPTION 'invalid flag_name: %', flag_name;
  END IF;

  EXECUTE format('UPDATE public.profiles SET %I = false WHERE id = $1', flag_name)
  USING user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── 3. Lightweight per-user rate limiting for expensive endpoints ──────
-- Fixed-window counter, one row per (user, route, window). Each call also
-- deletes that user+route's previous window row, so the table never grows
-- beyond ~1 row per active user per route — no cron cleanup needed.
CREATE TABLE IF NOT EXISTS public.rate_limit_hits (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  route TEXT NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (user_id, route, window_start)
);

ALTER TABLE public.rate_limit_hits ENABLE ROW LEVEL SECURITY;
-- No direct policies: all access goes through the SECURITY DEFINER function below.

CREATE OR REPLACE FUNCTION public.check_rate_limit(user_uuid UUID, route_name TEXT, window_seconds INTEGER, max_requests INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  window_ts TIMESTAMPTZ;
  current_count INTEGER;
BEGIN
  window_ts := to_timestamp(floor(extract(epoch FROM now()) / window_seconds) * window_seconds);

  DELETE FROM public.rate_limit_hits
  WHERE user_id = user_uuid AND route = route_name AND window_start < window_ts;

  INSERT INTO public.rate_limit_hits (user_id, route, window_start, request_count)
  VALUES (user_uuid, route_name, window_ts, 1)
  ON CONFLICT (user_id, route, window_start)
  DO UPDATE SET request_count = rate_limit_hits.request_count + 1
  RETURNING request_count INTO current_count;

  RETURN current_count <= max_requests;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
