import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { anthropic } from '@/lib/ai/claude';
import type Anthropic from '@anthropic-ai/sdk';
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { checkRateLimit, rateLimitResponse } from '@/lib/rateLimit';

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

    if (!(await checkRateLimit(user.id, 'analyze-brand', 60, 5))) {
      return rateLimitResponse();
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

    // Step 4: Use Claude to analyze brand information from content + CSS
    const brandAnalysis = await analyzeBrandWithClaude(websiteContent, websiteCSS, cleanDomain);

    // Combine all data
    const result: BrandAnalysisResult = {
      brandName: brandAnalysis.brandName || extractDomainName(cleanDomain),
      industry: brandAnalysis.industry,
      brandVoice: brandAnalysis.brandVoice,
      primaryColor: colors.primaryColor || brandAnalysis.primaryColor || '#5c5cf0',
      secondaryColor: colors.secondaryColor || brandAnalysis.secondaryColor,
      logoUrl: logoUrl, // Google's favicon service - works for virtually all websites
      brandDescription: brandAnalysis.description,
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

// ── SSRF guard ──────────────────────────────────────────────────────────────
// websiteUrl (and every stylesheet URL discovered inside its own HTML) is
// attacker-controlled: a malicious site could point a <link rel=stylesheet>
// at http://169.254.169.254/... (cloud metadata) or an internal 10.x host and
// have our server dutifully fetch it. Resolve and validate the host before
// every fetch, and re-validate on each redirect hop instead of letting
// fetch() follow redirects blindly.

function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some(n => Number.isNaN(n))) return true; // fail closed
  const [a, b] = parts;
  if (a === 10 || a === 127 || a === 0) return true;
  if (a === 169 && b === 254) return true; // link-local, incl. cloud metadata
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
  return false;
}

function isPrivateIPv6(ip: string): boolean {
  const lower = ip.toLowerCase();
  if (lower === '::1' || lower === '::') return true;
  if (lower.startsWith('fe80:') || lower.startsWith('fc') || lower.startsWith('fd')) return true;
  if (lower.startsWith('::ffff:')) {
    const v4 = lower.split(':').pop() ?? '';
    if (v4.includes('.')) return isPrivateIPv4(v4);
  }
  return false;
}

async function assertPublicHttpUrl(rawUrl: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error('Invalid URL');
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('Only http/https URLs are allowed');
  }

  const hostname = url.hostname.toLowerCase();
  if (hostname === 'localhost' || hostname.endsWith('.localhost') || hostname === '0.0.0.0') {
    throw new Error('URL host is not allowed');
  }

  const literalIpVersion = isIP(hostname);
  const addresses: string[] = [];
  if (literalIpVersion) {
    addresses.push(hostname);
  } else {
    try {
      const results = await lookup(hostname, { all: true });
      addresses.push(...results.map(r => r.address));
    } catch {
      throw new Error('Could not resolve host');
    }
  }

  for (const addr of addresses) {
    const blocked = isIP(addr) === 4 ? isPrivateIPv4(addr) : isPrivateIPv6(addr);
    if (blocked) throw new Error('URL resolves to a disallowed private address');
  }

  return url;
}

/** fetch() with SSRF validation on the initial URL and on every redirect hop, plus a timeout. */
async function safeFetch(rawUrl: string, init: RequestInit = {}, timeoutMs = 8000, maxRedirects = 3): Promise<Response> {
  let currentUrl = rawUrl;
  for (let hop = 0; hop <= maxRedirects; hop++) {
    const url = await assertPublicHttpUrl(currentUrl);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    let res: Response;
    try {
      res = await fetch(url.toString(), { ...init, signal: controller.signal, redirect: 'manual' });
    } finally {
      clearTimeout(timer);
    }
    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location');
      if (!location) return res;
      currentUrl = new URL(location, url).toString();
      continue;
    }
    return res;
  }
  throw new Error('Too many redirects');
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

    const response = await safeFetch(fullUrl, {
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
          const res = await safeFetch(cssUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
          }, 5000);
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
      css: allCSS.slice(0, 12_000), // trim for prompt
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
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);
    let response: Response;
    try {
      response = await fetch(jinaUrl, {
        headers: { 'Accept': 'text/plain' },
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }

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
 * Analyze brand using Claude - extracts all brand information
 */
async function analyzeBrandWithClaude(
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
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      thinking: { type: 'disabled' },
      messages: [{ role: 'user', content: prompt }],
    });
    const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text');
    const text = textBlock?.text ?? '';

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
    console.warn('Claude analysis failed:', error);
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
