'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createEmailGeneration, getDefaultBrandProfile } from '@/lib/db/queries';
import { checkRateLimit } from '@/lib/rateLimit';
import { generateEmailHtml } from '@/lib/email/renderer';
import { loadTemplate } from '@/lib/content/templates-registry';

export type StartTemplateState = { error?: string } | null;

/**
 * "Use this template": copy a library template into the signed-in user's emails (in their default brand's
 * colours, costing no AI credit) and open it in the editor. Signed-out visitors are sent to sign-up with
 * the template remembered, which the dashboard picks up after they get in.
 */
export async function startTemplate(_prev: StartTemplateState, formData: FormData): Promise<StartTemplateState> {
  const slug = String(formData.get('slug') ?? '');
  const template = await loadTemplate(slug);
  if (!template) redirect('/templates');

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/sign-up?template=${encodeURIComponent(slug)}`);

  if (!(await checkRateLimit(user.id, 'start-template', 60, 20))) {
    return { error: 'Too many requests. Please wait a moment and try again.' };
  }

  const brand = await getDefaultBrandProfile(user.id);
  const { html, reactCode } = await generateEmailHtml(template.email, template.meta.style, brand);

  const generation = await createEmailGeneration({
    user_id: user.id,
    brand_profile_id: brand?.id ?? null,
    prompt: `From template: ${template.meta.title}`,
    email_type: template.email.emailType,
    design_style: template.meta.style,
    subject_line: template.email.subject,
    preview_text: template.email.previewText,
    content_json: template.email,
    react_code: reactCode,
    html_code: html,
    status: 'completed',
    credits_used: 0,
    error_message: null,
  });
  if (!generation) return { error: "Couldn't create your email. Please try again." };

  redirect(`/dashboard/email/${generation.id}`);
}
