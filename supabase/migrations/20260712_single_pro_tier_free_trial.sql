-- Collapse pricing to a single "Professional" (pro) tier + one-time free trial.
-- Free-plan users now get exactly one brand, one email generation, and one use
-- each of AI-edit / block-regenerate / send-test-email, ever (not monthly).

ALTER TABLE profiles
  ALTER COLUMN credits_remaining SET DEFAULT 1,
  ADD COLUMN IF NOT EXISTS free_brand_used boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS free_ai_edit_used boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS free_block_regenerate_used boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS free_test_email_used boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN profiles.free_brand_used IS 'Free-plan users get exactly one brand profile, ever — not reset by deleting it.';
COMMENT ON COLUMN profiles.free_ai_edit_used IS 'Free-plan users get exactly one "Edit with AI" action, ever.';
COMMENT ON COLUMN profiles.free_block_regenerate_used IS 'Free-plan users get exactly one per-block regenerate action, ever.';
COMMENT ON COLUMN profiles.free_test_email_used IS 'Free-plan users get exactly one "Send Test Email" action, ever.';
