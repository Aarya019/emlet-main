import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { editEmailWithInstruction } from '@/lib/ai/gemini';
import { getEmailGeneration, getBrandProfile, updateEmailGeneration } from '@/lib/db/queries';
import { generateEmailHtml } from '@/lib/email/renderer';
import { batchFetchPexelsImages, styleImageConfig } from '@/lib/images/pexels';
import type { GeneratedEmail, EmailSection } from '@/lib/ai/gemini';

export const maxDuration = 120;

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { emailGenerationId, instruction } = body;

    if (!emailGenerationId || typeof emailGenerationId !== 'string') {
      return NextResponse.json({ error: 'emailGenerationId is required' }, { status: 400 });
    }
    if (!instruction || typeof instruction !== 'string' || !instruction.trim()) {
      return NextResponse.json({ error: 'instruction is required' }, { status: 400 });
    }

    // Fetch email + brand profile
    const generation = await getEmailGeneration(emailGenerationId, user.id);
    if (!generation) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }

    const emailContent = generation.content_json as GeneratedEmail;
    if (!emailContent?.sections?.length) {
      return NextResponse.json({ error: 'Email has no sections' }, { status: 400 });
    }

    const effectiveDesignStyle = generation.design_style || 'minimalist';

    let brandProfile = null;
    if (generation.brand_profile_id) {
      brandProfile = await getBrandProfile(generation.brand_profile_id, user.id);
    }

    // Call Gemini — full edit, anything can change
    const aiResult = await editEmailWithInstruction(
      instruction.trim(),
      emailContent,
      brandProfile,
      effectiveDesignStyle,
    );

    // ── Image resolution ─────────────────────────────────────────────────────
    // Build rawKeyword → resolvedUrl cache from the ORIGINAL email so unchanged
    // images don't burn Pexels API quota.
    const imageCache = new Map<string, string>();
    for (const section of emailContent.sections) {
      if (section.imageKeyword && section.imageUrl)
        imageCache.set(`img:${section.imageKeyword}`, section.imageUrl);
      if (section.backgroundImageKeyword && section.backgroundImageUrl)
        imageCache.set(`bg:${section.backgroundImageKeyword}`, section.backgroundImageUrl);
      if (section.images) {
        for (const img of section.images) {
          if (img.keyword && img.url)
            imageCache.set(`img:${img.keyword}`, img.url);
        }
      }
    }

    const styleImg = styleImageConfig[effectiveDesignStyle] ?? styleImageConfig['minimalist'];
    const enrichKw = (kw: string) => `${kw} ${styleImg.modifier}`.trim();

    // Collect unique keywords that need a fresh Pexels fetch
    type FetchItem = { keyword: string; orientation: 'landscape' | 'portrait' | 'square'; color?: string; preferPanoramic?: boolean };
    const fetchBatch: FetchItem[] = [];
    const fetchSet = new Set<string>();
    const queueFetch = (key: string, opts: Omit<FetchItem, 'keyword'>) => {
      if (!fetchSet.has(key)) { fetchSet.add(key); fetchBatch.push({ keyword: key, ...opts }); }
    };

    for (const section of aiResult.sections) {
      if (section.imageKeyword && !imageCache.has(`img:${section.imageKeyword}`))
        queueFetch(enrichKw(section.imageKeyword), { orientation: 'landscape', color: styleImg.color });
      if (section.backgroundImageKeyword && !imageCache.has(`bg:${section.backgroundImageKeyword}`))
        queueFetch(section.backgroundImageKeyword, { orientation: 'landscape', preferPanoramic: true });
      if (section.images) {
        for (const img of section.images) {
          if (img.keyword && !imageCache.has(`img:${img.keyword}`))
            queueFetch(enrichKw(img.keyword), { orientation: 'landscape', color: styleImg.color });
        }
      }
    }

    const fetchedMap = fetchBatch.length > 0
      ? await batchFetchPexelsImages(fetchBatch)
      : {} as Record<string, string>;

    // Apply resolved image URLs to AI result sections
    const finalSections: EmailSection[] = aiResult.sections.map(section => {
      const s: EmailSection = { ...section };
      // Strip any CDN URLs the AI may have copied — we always re-resolve
      delete (s as unknown as Record<string, unknown>).imageUrl;
      delete (s as unknown as Record<string, unknown>).backgroundImageUrl;

      if (s.imageKeyword) {
        const url = imageCache.get(`img:${s.imageKeyword}`) ?? fetchedMap[enrichKw(s.imageKeyword)];
        if (url) s.imageUrl = url;
      }
      if (s.backgroundImageKeyword) {
        const url = imageCache.get(`bg:${s.backgroundImageKeyword}`) ?? fetchedMap[s.backgroundImageKeyword];
        if (url) s.backgroundImageUrl = url;
      }
      if (s.images) {
        s.images = s.images.map(img => {
          if (!img.keyword) return img;
          const url = imageCache.get(`img:${img.keyword}`) ?? fetchedMap[enrichKw(img.keyword)];
          return url ? { ...img, url } : img;
        });
      }
      return s;
    });

    const finalEmail: GeneratedEmail = {
      subject: aiResult.subject || emailContent.subject,
      previewText: aiResult.previewText || emailContent.previewText,
      emailType: aiResult.emailType || emailContent.emailType,
      sections: finalSections,
    };

    // Re-render HTML
    const { html: htmlCode, reactCode } = await generateEmailHtml(
      finalEmail,
      effectiveDesignStyle,
      brandProfile,
    );

    // Persist
    await updateEmailGeneration(emailGenerationId, user.id, {
      content_json: finalEmail as never,
      html_code: htmlCode,
      react_code: reactCode,
    });

    return NextResponse.json({
      success: true,
      content_json: finalEmail,
      html_code: htmlCode,
    });

  } catch (error) {
    console.error('Edit email error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to edit email' },
      { status: 500 },
    );
  }
}
