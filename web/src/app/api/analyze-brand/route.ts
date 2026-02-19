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
    const colors = await extractColorsFromWebsite(websiteUrl);

    // Step 3: Call Jina AI Reader to get clean website content for text analysis
    const websiteContent = await fetchWebsiteContent(websiteUrl);

    // Step 4: Use Gemini to analyze brand information from content
    const geminiAnalysis = await analyzeBrandWithGemini(websiteContent, cleanDomain);

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
 * Extract colors directly from website HTML/CSS
 */
async function extractColorsFromWebsite(url: string): Promise<{ primaryColor?: string; secondaryColor?: string }> {
  try {
    // Ensure URL has protocol
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    
    const response = await fetch(fullUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      return {};
    }

    const html = await response.text();
    
    // Extract hex colors from the HTML/CSS
    const colorRegex = /#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})\b/g;
    const colors = html.match(colorRegex) || [];
    
    // Normalize and count color occurrences
    const colorCounts = new Map<string, number>();
    colors.forEach(color => {
      const normalized = color.toLowerCase();
      // Expand 3-digit hex to 6-digit
      const full = normalized.length === 4 
        ? `#${normalized[1]}${normalized[1]}${normalized[2]}${normalized[2]}${normalized[3]}${normalized[3]}`
        : normalized;
      
      // Filter out very light (nearly white) and very dark (nearly black) colors
      const r = parseInt(full.slice(1, 3), 16);
      const g = parseInt(full.slice(3, 5), 16);
      const b = parseInt(full.slice(5, 7), 16);
      
      // Skip if too light (avg > 240) or too dark (avg < 20)
      const avg = (r + g + b) / 3;
      if (avg > 240 || avg < 20) return;
      
      colorCounts.set(full, (colorCounts.get(full) || 0) + 1);
    });

    // Sort by frequency and get top colors
    const sortedColors = Array.from(colorCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([color]) => color);

    // Return most frequent colors
    return {
      primaryColor: sortedColors[0],
      secondaryColor: sortedColors[1],
    };
  } catch (error) {
    console.warn('Color extraction failed:', error);
    return {};
  }
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

  const prompt = `Analyze the following website content and extract comprehensive brand information.

WEBSITE DOMAIN: ${domain}
WEBSITE CONTENT:
${websiteContent}

Analyze and return ONLY a JSON object with this exact structure:
{
  "brandName": "The official brand/company name (extract from content or use domain)",
  "brandVoice": "Describe brand voice in 2-4 words (e.g., 'Professional and trustworthy', 'Casual and playful', 'Bold and innovative')",
  "industry": "Primary industry/sector (e.g., 'Technology', 'E-commerce', 'Finance', 'Healthcare')",
  "description": "A concise 1-2 sentence description of what the brand does and its positioning",
  "primaryColor": "Main brand color in hex format (look for recurring colors, or use #5c5cf0 as default)",
  "secondaryColor": "Secondary brand color in hex format if identifiable, or leave as empty string"
}

Focus on:
- Brand name from headers, titles, or prominent text
- Tone and personality in the copy
- Industry/sector from products/services mentioned
- Value proposition and positioning
- Any color references in the content (though this may be limited in text)

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
