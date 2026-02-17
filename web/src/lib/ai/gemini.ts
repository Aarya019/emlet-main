import { GoogleGenerativeAI } from '@google/generative-ai';
import type { BrandProfile } from '@/lib/db/types';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Email content structure
export interface EmailSection {
  type: 'hero' | 'content' | 'cta' | 'footer';
  heading?: string;
  subheading?: string;
  text?: string;
  buttonText?: string;
  buttonUrl?: string;
  imageUrl?: string;
  imageAlt?: string;
}

export interface GeneratedEmail {
  subject: string;
  previewText: string;
  emailType: 'promotional' | 'newsletter' | 'educational' | 'transactional' | 'other';
  sections: EmailSection[];
}

/**
 * Generate email content using Gemini 2.0 Flash
 */
export async function generateEmailContent(
  prompt: string,
  brandProfile: BrandProfile | null
): Promise<GeneratedEmail> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  // Build system prompt with brand context
  const systemPrompt = buildSystemPrompt(brandProfile);
  
  // Build user prompt
  const userPrompt = `Generate an email for the following request:

${prompt}

Remember to:
- Use the brand voice and identity specified
- Create a neobrutalist design (thick borders, bold text, high contrast)
- Include appropriate sections (hero, content blocks, CTA, footer)
- Make it engaging and conversion-focused
- Return ONLY valid JSON matching the schema`;

  const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

  try {
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from response');
    }

    const emailData = JSON.parse(jsonMatch[0]) as GeneratedEmail;

    // Validate required fields
    if (!emailData.subject || !emailData.sections || emailData.sections.length === 0) {
      throw new Error('Invalid email structure returned');
    }

    return emailData;
  } catch (error) {
    console.error('Error generating email with Gemini:', error);
    throw new Error('Failed to generate email content');
  }
}

/**
 * Build system prompt with brand context
 */
function buildSystemPrompt(brandProfile: BrandProfile | null): string {
  const brandContext = brandProfile
    ? `
BRAND PROFILE:
- Brand Name: ${brandProfile.brand_name}
- Industry: ${brandProfile.industry || 'Not specified'}
- Brand Voice: ${brandProfile.brand_voice}
- Primary Color: ${brandProfile.primary_color}
- Brand Description: ${brandProfile.brand_description || 'Not provided'}
`
    : `
BRAND PROFILE:
- No brand profile provided. Use professional, neutral tone.
- Primary Color: #5c5cf0
`;

  return `You are an expert email marketing copywriter and designer. Your task is to generate email content in a neobrutalist design style.

${brandContext}

DESIGN STYLE (Neobrutalist):
- Heavy borders (4px solid borders)
- Bold, high-contrast colors
- Large, bold typography (font-weight: 900)
- Strong box shadows (6-8px offsets)
- High-contrast color combinations
- Clean, geometric layouts
- Sans-serif fonts (Inter, Arial, Helvetica)

OUTPUT FORMAT:
Return a JSON object with this exact structure:
{
  "subject": "Email subject line (50-60 characters)",
  "previewText": "Preview text shown in inbox (80-100 characters)",
  "emailType": "promotional|newsletter|educational|transactional|other",
  "sections": [
    {
      "type": "hero",
      "heading": "Main headline",
      "subheading": "Supporting text",
      "imageUrl": "https://placehold.co/600x400",
      "imageAlt": "Image description"
    },
    {
      "type": "content",
      "heading": "Section heading",
      "text": "Section content text"
    },
    {
      "type": "cta",
      "heading": "Call to action heading",
      "text": "Supporting text for CTA",
      "buttonText": "Action Button",
      "buttonUrl": "#"
    },
    {
      "type": "footer",
      "text": "Footer text with company info and unsubscribe link"
    }
  ]
}

SECTION TYPES:
- hero: Main banner with heading, optional image
- content: Text content block with optional heading
- cta: Call-to-action with button
- footer: Footer information

RULES:
1. Always include at least: 1 hero, 1-2 content blocks, 1 CTA, 1 footer
2. Use the brand voice consistently
3. Keep subject lines under 60 characters
4. Make CTAs clear and action-oriented
5. Use placeholder images (https://placehold.co/WIDTHxHEIGHT)
6. Return ONLY the JSON object, no markdown formatting`;
}

/**
 * Test the Gemini API connection
 */
export async function testGeminiConnection(): Promise<boolean> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent('Say "Hello"');
    const response = result.response.text();
    return response.length > 0;
  } catch (error) {
    console.error('Gemini connection test failed:', error);
    return false;
  }
}
