-- Add background_color column to brand_profiles table
ALTER TABLE brand_profiles ADD COLUMN IF NOT EXISTS background_color VARCHAR(7);

COMMENT ON COLUMN brand_profiles.background_color IS 'Brand background color in hex format (#RRGGBB). Used as the email body/section background to match brand identity.';
