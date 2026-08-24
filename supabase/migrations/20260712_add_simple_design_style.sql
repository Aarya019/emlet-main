-- Add 'simple' to the allowed design_style values
ALTER TABLE email_generations
DROP CONSTRAINT IF EXISTS email_generations_design_style_check;

ALTER TABLE email_generations
ADD CONSTRAINT email_generations_design_style_check
CHECK (design_style IN (
  'simple',
  'minimalist',
  'editorial',
  'retro',
  'brutalist',
  'cyberpunk',
  'handwritten',
  'bauhaus'
));

COMMENT ON COLUMN email_generations.design_style IS 'Design style/theme applied to the email (simple, minimalist, editorial, retro, brutalist, cyberpunk, handwritten, bauhaus)';
