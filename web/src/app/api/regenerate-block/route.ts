import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { regenerateSingleSection } from '@/lib/ai/claude';
import { getEmailGeneration, getBrandProfile, updateEmailGeneration, claimFreeAction, releaseFreeAction } from '@/lib/db/queries';
import { generateEmailHtml } from '@/lib/email/renderer';
import { batchFetchPexelsImages, styleImageConfig } from '@/lib/images/pexels';
import { checkRateLimit, rateLimitResponse } from '@/lib/rateLimit';
import type { GeneratedEmail, EmailSection } from '@/lib/ai/claude';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!(await checkRateLimit(user.id, 'regenerate-block', 60, 10))) {
    return rateLimitResponse();
  }

  let claimed = false;
  try {
    const body = await request.json();
    const { emailGenerationId, sectionIndex, designStyle, currentContent } = body;

    if (!emailGenerationId || typeof emailGenerationId !== 'string') {
      return NextResponse.json({ error: 'emailGenerationId is required' }, { status: 400 });
    }
    if (typeof sectionIndex !== 'number') {
      return NextResponse.json({ error: 'sectionIndex is required' }, { status: 400 });
    }

    const { allowed } = await claimFreeAction(user.id, 'free_block_regenerate_used');
    if (!allowed) {
      return NextResponse.json(
        { error: "You've used your free block regeneration — upgrade to Professional for unlimited regenerations." },
        { status: 402 }
      );
    }
    claimed = true;

    // Fetch the email generation record
    const generation = await getEmailGeneration(emailGenerationId, user.id);
    if (!generation) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }

    // Prefer the editor's current in-memory content over the last-saved DB row —
    // otherwise the regenerated section gets persisted on top of stale content,
    // silently dropping any other unsaved edits the next time the page reloads.
    const emailContent = (currentContent?.sections?.length ? currentContent : generation.content_json) as GeneratedEmail;
    if (!emailContent?.sections || sectionIndex < 0 || sectionIndex >= emailContent.sections.length) {
      return NextResponse.json({ error: 'Invalid section index' }, { status: 400 });
    }

    const effectiveDesignStyle = designStyle || generation.design_style || 'minimalist';

    // Get brand profile if attached
    let brandProfile = null;
    if (generation.brand_profile_id) {
      brandProfile = await getBrandProfile(generation.brand_profile_id, user.id);
    }

    const targetSection = emailContent.sections[sectionIndex];

    // Call Claude to regenerate just this section's content fields
    const rewrittenFields = await regenerateSingleSection(
      targetSection,
      emailContent.subject,
      emailContent.sections,
      brandProfile,
      effectiveDesignStyle,
    );

    // Merge rewritten fields back — preserve all non-content fields (images, colors, hints)
    const contentOnlyKeys = new Set([
      'eyebrow', 'heading', 'subheading', 'intro', 'text',
      'buttonText', 'secondaryButtonText',
      'quote', 'author', 'authorTitle',
      'tagline', 'expiryText',
      'features', 'stats', 'testimonials', 'columns', 'plans',
    ]);

    // Also allow rewriting per-item text inside features/stats/testimonials/columns/plans
    // but strip any keys the AI should not override
    const sanitized: Partial<EmailSection> = {};
    for (const [key, value] of Object.entries(rewrittenFields)) {
      if (contentOnlyKeys.has(key)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (sanitized as any)[key] = value;
      }
    }

    const updatedSection: EmailSection = { ...targetSection, ...sanitized };

    // Re-resolve Pexels images if imageKeyword changed (unlikely but handled)
    const styleImg = styleImageConfig[effectiveDesignStyle] || styleImageConfig['minimalist'];
    const enrichKeyword = (kw: string) => `${kw} ${styleImg.modifier}`.trim();

    if (updatedSection.imageKeyword && !updatedSection.imageUrl) {
      const map = await batchFetchPexelsImages([{
        keyword: enrichKeyword(updatedSection.imageKeyword),
        orientation: 'landscape',
        color: styleImg.color,
      }]);
      const resolved = map[enrichKeyword(updatedSection.imageKeyword)];
      if (resolved) updatedSection.imageUrl = resolved;
    }

    if (updatedSection.backgroundImageKeyword && !updatedSection.backgroundImageUrl) {
      const map = await batchFetchPexelsImages([{
        keyword: updatedSection.backgroundImageKeyword,
        orientation: 'landscape',
        preferPanoramic: true,
      }]);
      const resolved = map[updatedSection.backgroundImageKeyword];
      if (resolved) updatedSection.backgroundImageUrl = resolved;
    }

    // Rebuild the full sections array with the updated block
    const updatedSections = emailContent.sections.map((s, i) =>
      i === sectionIndex ? updatedSection : s
    );
    const updatedEmailContent: GeneratedEmail = { ...emailContent, sections: updatedSections };

    // Re-render HTML
    const { html: htmlCode, reactCode } = await generateEmailHtml(
      updatedEmailContent,
      effectiveDesignStyle,
      brandProfile,
    );

    // Persist updated content + HTML
    await updateEmailGeneration(emailGenerationId, user.id, {
      content_json: updatedEmailContent as any,
      html_code: htmlCode,
      react_code: reactCode,
    });

    return NextResponse.json({
      success: true,
      section: updatedSection,
      html_code: htmlCode,
    });

  } catch (error) {
    if (claimed) await releaseFreeAction(user.id, 'free_block_regenerate_used');
    console.error('Regenerate block error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to regenerate block' },
      { status: 500 },
    );
  }
}
