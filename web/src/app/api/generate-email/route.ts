import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateEmailContent } from '@/lib/ai/gemini';
import { getDefaultBrandProfile, getBrandProfile } from '@/lib/db/queries';
import { deductCredits } from '@/lib/db/queries';
import { createEmailGeneration } from '@/lib/db/queries';
import { generateEmailHtml } from '@/lib/email/renderer';
import { batchFetchPexelsImages, styleImageConfig } from '@/lib/images/pexels';

// Vercel max function duration (Pro plan allows up to 300s; target well under that)
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  
  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { prompt, designStyle = 'minimalist', brandProfileId, userEmailType } = body;

    // Validate prompt
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required' }, 
        { status: 400 }
      );
    }

    if (prompt.length > 1000) {
      return NextResponse.json(
        { error: 'Prompt is too long (max 1000 characters)' }, 
        { status: 400 }
      );
    }

    // Check user has credits
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits_remaining, plan_type')
      .eq('id', user.id)
      .single();

    const isEnterprise = profile?.plan_type === 'enterprise';

    if (!isEnterprise && (!profile || profile.credits_remaining < 1)) {
      return NextResponse.json(
        { error: 'Insufficient credits. Please upgrade your plan.' }, 
        { status: 402 }
      );
    }

    // Get user's brand profile:
    // - brandProfileId = a UUID  → use that specific profile
    // - brandProfileId = null (explicitly sent) → user chose "No brand", generate generic
    // - brandProfileId = undefined (key absent) → use default brand profile
    const brandProfile = brandProfileId
      ? await getBrandProfile(brandProfileId, user.id)
      : brandProfileId === undefined
        ? await getDefaultBrandProfile(user.id)
        : null;

    // Create initial generation record with 'generating' status
    const initialGeneration = await createEmailGeneration({
      user_id: user.id,
      brand_profile_id: brandProfile?.id || null,
      prompt: prompt.trim(),
      email_type: null,
      design_style: designStyle as any,
      subject_line: null,
      preview_text: null,
      content_json: null,
      react_code: null,
      html_code: null,
      status: 'generating',
      credits_used: 1,
      error_message: null
    });

    if (!initialGeneration) {
      return NextResponse.json(
        { error: 'Failed to create generation record' }, 
        { status: 500 }
      );
    }

    try {
      // Generate email content with Gemini
      const emailContent = await generateEmailContent(
        prompt.trim(), 
        brandProfile, 
        designStyle,
        typeof userEmailType === 'string' ? userEmailType : undefined
      );

      // Strip any HTML tags Gemini may have injected into plain text fields
      const stripHtml = (str?: string | null): string | undefined => str ? str.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, (m) => ({ '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" }[m] || m)) : undefined;
      emailContent.subject = stripHtml(emailContent.subject) || emailContent.subject;
      emailContent.previewText = stripHtml(emailContent.previewText) || emailContent.previewText;
      emailContent.sections = emailContent.sections.map(s => ({
        ...s,
        heading: stripHtml(s.heading),
        subheading: stripHtml(s.subheading),
        text: stripHtml(s.text),
        buttonText: stripHtml(s.buttonText),
        quote: stripHtml(s.quote),
        author: stripHtml(s.author),
        authorTitle: stripHtml(s.authorTitle),
        features: s.features?.map(f => ({ ...f, title: stripHtml(f.title) || f.title, description: stripHtml(f.description) || f.description })),
        stats: s.stats?.map(st => ({ ...st, value: stripHtml(st.value) || st.value, label: stripHtml(st.label) || st.label })),
      }));

      // Normalize and validate email_type — prefer user-supplied value over AI's
      const validEmailTypes = ['promotional', 'newsletter', 'educational', 'transactional', 'other'];
      const userSuppliedType = typeof userEmailType === 'string' && validEmailTypes.includes(userEmailType.toLowerCase()) ? userEmailType.toLowerCase() : null;
      let normalizedEmailType = userSuppliedType ?? emailContent.emailType?.toLowerCase().trim() ?? 'other';
      
      if (!validEmailTypes.includes(normalizedEmailType)) {
        console.warn(`Invalid email_type returned: "${emailContent.emailType}", defaulting to "other"`);
        normalizedEmailType = 'other';
      }

      // ── Pexels image resolution ──────────────────────────────────────────
      // Collect all imageKeyword / gallery image keywords from sections
      const styleImg = styleImageConfig[designStyle] || styleImageConfig['minimalist'];

      // Enrich the keyword with a 1-2 word style modifier so Pexels results
      // match the aesthetic (e.g. "team meeting" → "team meeting dark neon")
      const enrichKeyword = (kw: string) => `${kw} ${styleImg.modifier}`.trim();

      type KeywordEntry = { keyword: string; orientation?: 'landscape' | 'portrait' | 'square'; color?: string; preferPanoramic?: boolean };
      const keywordsToFetch: KeywordEntry[] = [];

      for (const section of emailContent.sections) {
        if (section.imageKeyword) {
          keywordsToFetch.push({
            keyword: enrichKeyword(section.imageKeyword),
            orientation: section.type === 'hero' ? 'landscape' : 'landscape',
            color: styleImg.color,
          });
        }
        if (section.images) {
          for (const img of section.images) {
            if (img.keyword) {
              keywordsToFetch.push({
                keyword: enrichKeyword(img.keyword),
                orientation: 'square',
                color: styleImg.color,
              });
            }
          }
        }
      }

      // Collect background image keywords
      const bgKeywordsToFetch: KeywordEntry[] = [];
      for (const section of emailContent.sections) {
        if (section.backgroundImageKeyword) {
          bgKeywordsToFetch.push({
            keyword: section.backgroundImageKeyword,
            orientation: 'landscape',
            preferPanoramic: true,
          });
        }
      }

      // ── Fetch both sets in parallel ──────────────────────────────────────
      const [pexelsMap, bgPexelsMap] = await Promise.all([
        keywordsToFetch.length > 0
          ? batchFetchPexelsImages(keywordsToFetch)
          : Promise.resolve({} as Record<string, string | null>),
        bgKeywordsToFetch.length > 0
          ? batchFetchPexelsImages(bgKeywordsToFetch)
          : Promise.resolve({} as Record<string, string | null>),
      ]);

      // Inject resolved content image URLs back into sections
      emailContent.sections = emailContent.sections.map(section => {
        const updated = { ...section };

        if (updated.imageKeyword) {
          const resolved = pexelsMap[enrichKeyword(updated.imageKeyword)];
          if (resolved) {
            updated.imageUrl = resolved;
          }
        }

        if (updated.images) {
          updated.images = updated.images.map(img => {
            if (img.keyword) {
              const resolved = pexelsMap[enrichKeyword(img.keyword)];
              return resolved ? { ...img, url: resolved } : img;
            }
            return img;
          });
        }

        // Inject background image URL
        if (updated.backgroundImageKeyword) {
          const resolved = bgPexelsMap[updated.backgroundImageKeyword];
          if (resolved) updated.backgroundImageUrl = resolved;
        }

        return updated;
      });

      // Generate HTML and React code from JSON
      const { html: htmlCode, reactCode } = await generateEmailHtml(
        emailContent,
        designStyle,
        brandProfile
      );

      // Deduct credits (skip for enterprise — unlimited)
      if (!isEnterprise) {
        const creditsDeducted = await deductCredits(user.id, 1);

        if (!creditsDeducted) {
          await supabase
            .from('email_generations')
            .update({ status: 'failed', error_message: 'Failed to deduct credits' })
            .eq('id', initialGeneration.id);

          return NextResponse.json(
            { error: 'Failed to deduct credits' },
            { status: 500 }
          );
        }
      }

      // Update generation record with completed status
      const { data: completedGeneration, error: updateError } = await supabase
        .from('email_generations')
        .update({
          email_type: normalizedEmailType,
          subject_line: emailContent.subject,
          preview_text: emailContent.previewText,
          content_json: emailContent,
          react_code: reactCode,
          html_code: htmlCode,
          design_style: designStyle,
          status: 'completed',
          error_message: null
        })
        .eq('id', initialGeneration.id)
        .select()
        .single();

      if (updateError || !completedGeneration) {
        console.error('Error updating generation:', updateError);
        return NextResponse.json(
          { error: 'Failed to save generated email' }, 
          { status: 500 }
        );
      }

      // Get updated credits
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('credits_remaining')
        .eq('id', user.id)
        .single();

      return NextResponse.json({
        success: true,
        generation: completedGeneration,
        creditsRemaining: isEnterprise ? null : (updatedProfile?.credits_remaining || 0)
      }, { status: 201 });

    } catch (generationError) {
      console.error('Email generation error:', generationError);

      // Update generation with error status
      await supabase
        .from('email_generations')
        .update({
          status: 'failed',
          error_message: generationError instanceof Error ? generationError.message : 'Unknown error'
        })
        .eq('id', initialGeneration.id);

      return NextResponse.json(
        { 
          error: 'Failed to generate email', 
          details: generationError instanceof Error ? generationError.message : 'Unknown error'
        }, 
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in POST /api/generate-email:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
