-- Add design_style column to email_generations table
ALTER TABLE email_generations
ADD COLUMN IF NOT EXISTS design_style VARCHAR(50) DEFAULT 'minimalist';

-- Add check constraint for valid design styles
ALTER TABLE email_generations
ADD CONSTRAINT email_generations_design_style_check 
CHECK (design_style IN (
  'minimalist',
  'editorial',
  'retro',
  'brutalist',
  'cyberpunk',
  'handwritten',
  'bauhaus'
));

-- Add comment explaining the field
COMMENT ON COLUMN email_generations.design_style IS 'Design style/theme applied to the email (minimalist, editorial, retro, brutalist, cyberpunk, handwritten, bauhaus)';
