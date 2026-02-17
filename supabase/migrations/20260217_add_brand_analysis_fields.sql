-- Add new columns for brand analysis from website
ALTER TABLE brand_profiles
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS secondary_color VARCHAR(7);

-- Add index on website_url for faster lookups
CREATE INDEX IF NOT EXISTS idx_brand_profiles_website_url 
ON brand_profiles(website_url);

-- Add comment explaining the new fields
COMMENT ON COLUMN brand_profiles.website_url IS 'Brand website URL used for auto-analysis';
COMMENT ON COLUMN brand_profiles.logo_url IS 'Brand logo URL extracted from Brandfetch';
COMMENT ON COLUMN brand_profiles.secondary_color IS 'Secondary brand color in hex format (#RRGGBB)';
