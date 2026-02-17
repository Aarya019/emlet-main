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
    const domain = websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

    console.log('Analyzing brand for domain:', domain);

    // Step 1: Get logo from Clearbit (free, no auth)
    const logoUrl = `https://logo.clearbit.com/${domain}`;

    // Step 2: Call Jina AI Reader to get clean website content
    const websiteContent = await fetchWebsiteContent(websiteUrl);

    // Step 3: Use Gemini to analyze everything from content
    const geminiAnalysis = await analyzeBrandWithGemini(websiteContent, domain);

    // Combine all data
    const result: BrandAnalysisResult = {
      brandName: geminiAnalysis.brandName || extractDomainName(domain),
      industry: geminiAnalysis.industry,
      brandVoice: geminiAnalysis.brandVoice,
      primaryColor: geminiAnalysis.primaryColor || '#5c5cf0',
      secondaryColor: geminiAnalysis.secondaryColor,
      logoUrl: logoUrl,
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
  brandVoice: string; 
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
    
    return {
      brandName: analysis.brandName || extractDomainName(domain),
      brandVoice: analysis.brandVoice || 'Professional and engaging',
      industry: analysis.industry || 'Not specified',
      description: analysis.description || 'Brand description not available',
      primaryColor: analysis.primaryColor || '#5c5cf0',
      secondaryColor: analysis.secondaryColor || undefined,
    };
  } catch (error) {
    console.warn('Gemini analysis failed:', error);
    return {
      brandName: extractDomainName(domain),
      brandVoice: 'Professional and engaging',
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
