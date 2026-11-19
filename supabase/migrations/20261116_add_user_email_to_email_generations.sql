-- =====================================================
-- USER EMAIL ON email_generations
-- Keeps a copy of the owner's email address on every generated email, so it can be read straight from the
-- Table Editor without a join. The address still lives in auth.users; this column is a convenience copy.
--
-- How it behaves:
--   * Filled automatically on INSERT, so the app needs no change.
--   * Re-filled whenever user_id or user_email is written to, so a user can never set it to anything other
--     than their own address. (The existing UPDATE policy lets a user write to any column of their own row.)
--   * Visible only to the row's owner through the API (existing RLS) and to you in the dashboard.
--   * Removed with the row when an account is deleted (user_id has ON DELETE CASCADE).
--
-- Known limit: if a user later changes their email, their old rows keep the old address until you run the
-- RESYNC statement at the bottom. It is personal data: be careful with exports and screenshots.
--
-- Run this in the Supabase SQL Editor (safe to run more than once). Nothing in the app code needs to change.
-- =====================================================

ALTER TABLE public.email_generations
  ADD COLUMN IF NOT EXISTS user_email TEXT;

-- Looks the address up in auth.users. SECURITY DEFINER because ordinary users cannot read auth.users;
-- search_path is emptied so the function cannot be tricked into calling something else.
CREATE OR REPLACE FUNCTION public.set_email_generation_user_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  SELECT u.email INTO NEW.user_email FROM auth.users u WHERE u.id = NEW.user_id;
  RETURN NEW;
END;
$$;

-- Only the trigger should ever call it.
REVOKE ALL ON FUNCTION public.set_email_generation_user_email() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS set_email_generation_user_email ON public.email_generations;
CREATE TRIGGER set_email_generation_user_email
  BEFORE INSERT OR UPDATE OF user_id, user_email ON public.email_generations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_email_generation_user_email();

-- Backfill the rows that already exist. The updated_at trigger is paused for this one statement so the
-- backfill does not stamp every old email as "edited just now"; it is switched straight back on.
BEGIN;
ALTER TABLE public.email_generations DISABLE TRIGGER update_email_generations_updated_at;

UPDATE public.email_generations eg
SET user_email = u.email
FROM auth.users u
WHERE u.id = eg.user_id
  AND eg.user_email IS DISTINCT FROM u.email;

ALTER TABLE public.email_generations ENABLE TRIGGER update_email_generations_updated_at;
COMMIT;


-- =====================================================
-- CHECKS (optional, read-only: run them separately afterwards)
-- =====================================================
-- Rows that have no address (should be 0 unless a user's auth record has no email):
--   SELECT count(*) FROM public.email_generations WHERE user_email IS NULL;
--
-- Look at the result:
--   SELECT user_email, status, subject_line, created_at
--   FROM public.email_generations ORDER BY created_at DESC LIMIT 20;
--
-- The updated_at trigger is back on (should show 'O' = enabled):
--   SELECT tgname, tgenabled FROM pg_trigger
--   WHERE tgrelid = 'public.email_generations'::regclass AND NOT tgisinternal;


-- =====================================================
-- RESYNC (optional): run after a user changes their email address
-- =====================================================
-- BEGIN;
-- ALTER TABLE public.email_generations DISABLE TRIGGER update_email_generations_updated_at;
-- UPDATE public.email_generations eg SET user_email = u.email
--   FROM auth.users u WHERE u.id = eg.user_id AND eg.user_email IS DISTINCT FROM u.email;
-- ALTER TABLE public.email_generations ENABLE TRIGGER update_email_generations_updated_at;
-- COMMIT;


-- =====================================================
-- UNDO (optional): remove the column and the trigger again
-- =====================================================
-- DROP TRIGGER IF EXISTS set_email_generation_user_email ON public.email_generations;
-- DROP FUNCTION IF EXISTS public.set_email_generation_user_email();
-- ALTER TABLE public.email_generations DROP COLUMN IF EXISTS user_email;
