-- =====================================================
-- SUBSCRIPTION CANCELLATION TRACKING
-- Tracks scheduled (end-of-period) cancellation so the
-- dashboard can show "your plan ends on <date>" instead
-- of relying on an external Paddle portal round-trip.
-- =====================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS cancel_at TIMESTAMPTZ;
