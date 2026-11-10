import type { GeneratedEmail } from '@/lib/ai/claude';
import type { BrandProfile } from '@/lib/db/types';
import { generateEmailHtml } from '@/lib/email/renderer';
import type { TemplateMeta } from './templates';

/** The fictional brand a template is previewed with on the public site. */
function previewBrand(meta: TemplateMeta): BrandProfile {
  return {
    id: 'template-preview',
    user_id: '',
    brand_name: meta.brand.name,
    industry: null,
    brand_voice: 'friendly',
    primary_color: meta.brand.primaryColor,
    secondary_color: meta.brand.secondaryColor ?? null,
    background_color: meta.brand.backgroundColor ?? null,
    brand_description: null,
    logo_url: null,
    website_url: null,
    is_default: false,
    created_at: '',
    updated_at: '',
  };
}

/** Final, exportable HTML of a template with its preview brand: the same renderer the editor and exports use. */
export async function renderTemplateHtml(meta: TemplateMeta, email: GeneratedEmail): Promise<string> {
  const { html } = await generateEmailHtml(email, meta.style, previewBrand(meta));
  return html;
}
