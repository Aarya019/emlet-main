import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface BrandAnalysisResult {
  brandName: string;
  industry: string;
  brandVoice: string;
  primaryColor: string;
  secondaryColor?: string;
  logoUrl?: string;
  brandDescription: string;
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { websiteUrl } = body;

    if (!websiteUrl) {
      return NextResponse.json(
        { error: 'Website URL is required' },
        { status: 400 }
      );
    }

    // Clean the URL (remove protocol if present)
    const domain = websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0];
    // Remove www. prefix
    const cleanDomain = domain.replace(/^www\./, '');

    console.log('Analyzing brand for domain:', cleanDomain);

    // Step 1: Get logo/favicon using Google's service (free, reliable)
    // This works for most websites and returns their favicon/logo
    const logoUrl = `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${cleanDomain}&size=256`;

    // Step 2: Extract colors directly from the website HTML/CSS
    const { css: websiteCSS, colors } = await extractColorsFromWebsite(websiteUrl);

    // Step 3: Call Jina AI Reader to get clean website content for text analysis
    const websiteContent = await fetchWebsiteContent(websiteUrl);

    // Step 4: Use Gemini to analyze brand information from content + CSS
    const geminiAnalysis = await analyzeBrandWithGemini(websiteContent, websiteCSS, cleanDomain);

    // Combine all data
    const result: BrandAnalysisResult = {
      brandName: geminiAnalysis.brandName || extractDomainName(cleanDomain),
      industry: geminiAnalysis.industry,
      brandVoice: geminiAnalysis.brandVoice,
      primaryColor: colors.primaryColor || geminiAnalysis.primaryColor || '#5c5cf0',
      secondaryColor: colors.secondaryColor || geminiAnalysis.secondaryColor,
      logoUrl: logoUrl, // Google's favicon service - works for virtually all websites
      brandDescription: geminiAnalysis.description,
    };

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error analyzing brand:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze brand',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Fetch the website HTML, extract inline <style> blocks, and fetch up to 4 external
 * CSS stylesheets so we have real brand CSS to analyse.
 */
async function extractColorsFromWebsite(
  url: string,
): Promise<{ css: string; colors: { primaryColor?: string; secondaryColor?: string } }> {
  try {
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    const baseUrl = new URL(fullUrl);

    const response = await fetch(fullUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    });
    if (!response.ok) return { css: '', colors: {} };

    const html = await response.text();

    // --- Inline <style> blocks ---
    const inlineStyles = (html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) ?? [])
      .map(s => s.replace(/<\/?style[^>]*>/gi, ''))
      .join('\n');

    // --- External stylesheet <link> tags ---
    const linkRegex = /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']|<link[^>]+href=["']([^"']+)["'][^>]+rel=["']stylesheet["']/gi;
    const cssUrls: string[] = [];
    let m: RegExpExecArray | null;
    while ((m = linkRegex.exec(html)) !== null) {
      const href = m[1] || m[2];
      if (!href) continue;
      try {
        const abs = href.startsWith('http') ? href : `${baseUrl.origin}${href.startsWith('/') ? '' : '/'}${href}`;
        cssUrls.push(abs);
      } catch { /* skip invalid */ }
    }

    // Fetch up to 4 external CSS files in parallel
    const externalSheets = await Promise.all(
      cssUrls.slice(0, 4).map(async cssUrl => {
        try {
          const res = await fetch(cssUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
          });
          if (!res.ok) return '';
          const text = await res.text();
          return text.slice(0, 60_000);
        } catch { return ''; }
      }),
    );

    const allCSS = [inlineStyles, ...externalSheets].join('\n');

    // --- Score colors ---
    const scores = new Map<string, number>();

    // High weight: CSS custom-property declarations that smell like brand/primary tokens
    const varRegex = /--([a-z0-9-]*(primary|secondary|brand|accent|main|cta|highlight|button)[a-z0-9-]*):\s*(#[0-9a-fA-F]{3,6})/gi;
    let vMatch: RegExpExecArray | null;
    while ((vMatch = varRegex.exec(allCSS)) !== null) {
      const hex = normalizeHex(vMatch[3]);
      if (hex && isSaturatedColor(hex)) scores.set(hex, (scores.get(hex) ?? 0) + 15);
    }

    // Medium weight: any hex color inside a CSS block whose selector contains button/nav/header/cta/hero
    const blockRegex = /([a-z0-9 ,:.#[\]_-]*(?:button|\.btn|nav|header|cta|hero|link)[a-z0-9 ,:.#[\]_-]*)\s*\{([^}]+)\}/gi;
    let bMatch: RegExpExecArray | null;
    while ((bMatch = blockRegex.exec(allCSS)) !== null) {
      const hexesInBlock = bMatch[2].match(/#[0-9a-fA-F]{3,6}/g) ?? [];
      hexesInBlock.forEach(h => {
        const hex = normalizeHex(h);
        if (hex && isSaturatedColor(hex)) scores.set(hex, (scores.get(hex) ?? 0) + 5);
      });
    }

    // Low weight: every other hex color in the CSS
    const allHex = allCSS.match(/#[0-9a-fA-F]{3,6}/g) ?? [];
    allHex.forEach(h => {
      const hex = normalizeHex(h);
      if (hex && isSaturatedColor(hex)) scores.set(hex, (scores.get(hex) ?? 0) + 1);
    });

    // Sort by score → then by saturation for tie-breaking
    const ranked = Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1] || getSaturation(b[0]) - getSaturation(a[0]))
      .map(([color]) => color);

    // Pick top-2 colors that are visually distinct from each other
    const picks: string[] = [];
    for (const color of ranked) {
      if (picks.length === 0) { picks.push(color); continue; }
      if (picks.length === 1 && colorDistance(color, picks[0]) > 40) { picks.push(color); break; }
    }

    return {
      css: allCSS.slice(0, 12_000), // trim for Gemini prompt
      colors: { primaryColor: picks[0], secondaryColor: picks[1] },
    };
  } catch (error) {
    console.warn('Color extraction failed:', error);
    return { css: '', colors: {} };
  }
}

function normalizeHex(color: string): string | null {
  const c = color.toLowerCase();
  if (c.length === 4) return `#${c[1]}${c[1]}${c[2]}${c[2]}${c[3]}${c[3]}`;
  return c.length === 7 ? c : null;
}

function isSaturatedColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const avg = (r + g + b) / 3;
  if (avg > 235 || avg < 20) return false; // near-white or near-black
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  return max === 0 ? false : (max - min) / max >= 0.18; // not a gray
}

function getSaturation(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  return max === 0 ? 0 : (max - min) / max;
}

function colorDistance(a: string, b: string): number {
  const [ar, ag, ab_] = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
  const [br, bg, bb_] = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
  return Math.sqrt((ar - br) ** 2 + (ag - bg) ** 2 + (ab_ - bb_) ** 2);
}

/**
 * Fetch clean website content using Jina AI Reader
 */
async function fetchWebsiteContent(url: string): Promise<string> {
  try {
    const jinaUrl = `https://r.jina.ai/${url}`;
    const response = await fetch(jinaUrl, {
      headers: {
        'Accept': 'text/plain',
      },
    });

    if (!response.ok) {
      console.warn('Jina AI Reader failed:', response.status);
      return '';
    }

    const content = await response.text();
    
    // Limit content to first 4000 characters to avoid token limits
    return content.substring(0, 4000);
  } catch (error) {
    console.warn('Jina AI fetch failed:', error);
    return '';
  }
}

/**
 * Analyze brand using Gemini - extracts all brand information
 */
async function analyzeBrandWithGemini(
  websiteContent: string,
  websiteCSS: string,
  domain: string
): Promise<{ 
  brandName: string;
  brandVoice: 'professional' | 'friendly' | 'casual' | 'formal'; 
  industry: string; 
  description: string;
  primaryColor: string;
  secondaryColor?: string;
}> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const cssSection = websiteCSS
    ? `\nWEBSITE CSS (first 12,000 chars — use this to identify real brand colors):\n${websiteCSS}\n`
    : '';

  const prompt = `Analyze the following website content and CSS to extract comprehensive brand information.

WEBSITE DOMAIN: ${domain}
WEBSITE CONTENT:
${websiteContent}
${cssSection}
Analyze and return ONLY a JSON object with this exact structure:
{
  "brandName": "The official brand/company name (extract from content or use domain)",
  "brandVoice": "Describe brand voice in 2-4 words (e.g., 'Professional and trustworthy', 'Casual and playful', 'Bold and innovative')",
  "industry": "Primary industry/sector (e.g., 'Technology', 'E-commerce', 'Finance', 'Healthcare')",
  "description": "A concise 1-2 sentence description of what the brand does and its positioning",
  "primaryColor": "Main brand color in hex format. PRIORITY ORDER: (1) CSS custom properties like --primary, --brand-color, --color-primary in the CSS; (2) background-color or color of nav/header/button/CTA selectors; (3) most-used saturated non-gray color. Return '#5c5cf0' if nothing identifiable.",
  "secondaryColor": "Secondary/accent brand color in hex if clearly distinct from primary (min 40 RGB distance), or empty string"
}

COLOR EXTRACTION RULES (critical):
- Look at CSS custom properties first: --primary, --secondary, --brand, --accent, --color-primary, --theme-color, etc.
- Then look at: button { background-color }, .btn { background }, a { color }, nav/header background
- Ignore pure white (#ffffff, near-whites), pure black (#000000, near-blacks), and grays (where R≈G≈B)
- The primary color should be the most distinctive, saturated brand color
- Return actual hex values found in the CSS, not guesses

Focus on:
- Brand name from headers, titles, or prominent text
- Tone and personality in the copy
- Industry/sector from products/services mentioned
- Value proposition and positioning

Return ONLY valid JSON, no markdown formatting or explanations.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const analysis = JSON.parse(jsonMatch[0]);
    
    // Map brand voice to valid database values
    const brandVoiceText = (analysis.brandVoice || '').toLowerCase();
    let mappedBrandVoice: 'professional' | 'friendly' | 'casual' | 'formal' = 'professional';
    
    if (brandVoiceText.includes('friendly') || brandVoiceText.includes('warm')) {
      mappedBrandVoice = 'friendly';
    } else if (brandVoiceText.includes('casual') || brandVoiceText.includes('playful') || brandVoiceText.includes('relaxed')) {
      mappedBrandVoice = 'casual';
    } else if (brandVoiceText.includes('formal') || brandVoiceText.includes('serious') || brandVoiceText.includes('corporate')) {
      mappedBrandVoice = 'formal';
    }
    
    return {
      brandName: analysis.brandName || extractDomainName(domain),
      brandVoice: mappedBrandVoice,
      industry: analysis.industry || 'Not specified',
      description: analysis.description || 'Brand description not available',
      primaryColor: analysis.primaryColor || '#5c5cf0',
      secondaryColor: analysis.secondaryColor || undefined,
    };
  } catch (error) {
    console.warn('Gemini analysis failed:', error);
    return {
      brandName: extractDomainName(domain),
      brandVoice: 'professional',
      industry: 'Not specified',
      description: 'Brand description not available',
      primaryColor: '#5c5cf0',
    };
  }
}

/**
 * Extract a readable name from domain
 */
function extractDomainName(domain: string): string {
  const name = domain.split('.')[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
}
