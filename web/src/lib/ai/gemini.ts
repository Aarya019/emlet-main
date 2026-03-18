import { GoogleGenerativeAI } from '@google/generative-ai';
import type { BrandProfile } from '@/lib/db/types';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Email content structure
export interface EmailSection {
  type: 'hero' | 'content' | 'cta' | 'footer' | 'testimonial' | 'feature-list' | 'pricing-table' | 'gallery' | 'stats' | 'announcement' | 'header' | 'image-text' | 'coupon' | 'social-links' | 'columns' | 'divider' | 'quote' | 'code-block';
  heading?: string;
  subheading?: string;
  /** Large lead paragraph rendered at a bigger, bolder size above the body text. Use for strong opening statements or key summaries. */
  intro?: string;
  text?: string;
  buttonText?: string;
  buttonUrl?: string;
  imageUrl?: string;
  imageAlt?: string;
  /** Short search keyword used to fetch a real image from Pexels (e.g. "coffee shop interior"). Set instead of imageUrl. */
  imageKeyword?: string;
  // For testimonial sections
  quote?: string;
  author?: string;
  authorTitle?: string;
  authorImage?: string;
  // For feature-list sections
  features?: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
  // For pricing-table sections
  plans?: Array<{
    name: string;
    price: string;
    period?: string;
    features: string[];
    highlighted?: boolean;
    buttonText?: string;
  }>;
  // For gallery sections
  images?: Array<{
    url: string;
    alt: string;
    caption?: string;
    /** Short search keyword for Pexels (e.g. "product display"). Used instead of url when present. */
    keyword?: string;
  }>;
  // For stats sections
  stats?: Array<{
    value: string;
    label: string;
    icon?: string;
  }>;
  // For header sections
  logoUrl?: string;
  logoAlt?: string;
  tagline?: string;
  // For image-text sections
  imagePosition?: 'left' | 'right';
  // For coupon sections
  code?: string;
  expiryText?: string;
  // For code-block sections
  /** Programming language for syntax highlighting: 'javascript', 'typescript', 'python', 'bash', 'json', 'html', 'css', 'sql', 'yaml', 'rust', 'go' */
  language?: string;
  // For footer sections
  unsubscribeUrl?: string;
  // For social-links sections
  socialLinks?: Array<{
    platform: string;
    url: string;
    icon?: string;
    iconUrl?: string;
  }>;
  // For columns sections
  columns?: Array<{
    heading?: string;
    text?: string;
    icon?: string;
    imageUrl?: string;
    buttonText?: string;
    buttonUrl?: string;
  }>;
}

export interface GeneratedEmail {
  subject: string;
  previewText: string;
  emailType: 'promotional' | 'newsletter' | 'educational' | 'transactional' | 'other';
  sections: EmailSection[];
}

export interface EmailContext {
  audience?: string;
  goal?: string;
  campaignType?: string;
}

/**
 * Generate email content using Gemini 2.0 Flash
 */
export async function generateEmailContent(
  prompt: string,
  brandProfile: BrandProfile | null,
  designStyle: string = 'minimalist'
): Promise<GeneratedEmail> {
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 1.0, // Balanced creativity — high enough for varied copy, low enough for reliable JSON
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192, // Ensure long, multi-section emails are never cut short
    }
  });

  // Build system prompt with brand context
  const systemPrompt = buildSystemPrompt(brandProfile, designStyle);
  
  // Build user prompt
  const userPrompt = `Generate an email for the following request:

${prompt}

Remember to:
- Use the brand voice and identity specified
- Include appropriate sections (hero, content blocks, CTA, footer)
- Make it engaging and conversion-focused
- Return ONLY valid JSON matching the schema — no markdown, no code fences, no explanation`;

  const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

  try {
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();

    // Strip markdown code fences if Gemini wrapped the JSON
    const stripped = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();

    // Try to extract the outermost JSON object
    const jsonMatch = stripped.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Gemini raw response (no JSON found):', text.slice(0, 500));
      throw new Error('Failed to extract JSON from response');
    }

    let emailData: GeneratedEmail;
    try {
      emailData = JSON.parse(jsonMatch[0]) as GeneratedEmail;
    } catch (parseErr) {
      console.error('JSON parse error:', parseErr, '\nRaw match:', jsonMatch[0].slice(0, 500));
      throw new Error('Failed to parse JSON from response');
    }

    // Validate required fields
    if (!emailData.subject || !emailData.sections || emailData.sections.length === 0) {
      throw new Error('Invalid email structure returned');
    }

    return emailData;
  } catch (error) {
    console.error('Error generating email with Gemini:', error);
    throw error instanceof Error ? error : new Error('Failed to generate email content');
  }
}

/**
 * Build system prompt with brand context and design style
 */
function buildSystemPrompt(brandProfile: BrandProfile | null, designStyle: string): string {
  const currentYear = new Date().getFullYear();
  const brandContext = brandProfile
    ? `
BRAND PROFILE:
- Brand Name: ${brandProfile.brand_name}
- Industry: ${brandProfile.industry || 'Not specified'}
- Brand Voice: ${brandProfile.brand_voice}
- Primary Color: ${brandProfile.primary_color}
${brandProfile.secondary_color ? `- Secondary Color: ${brandProfile.secondary_color}` : ''}
${brandProfile.logo_url ? `- Logo URL: ${brandProfile.logo_url}` : ''}
${brandProfile.website_url ? `- Website URL: ${brandProfile.website_url}` : ''}
- Brand Description: ${brandProfile.brand_description || 'Not provided'}

BRAND PERSONALIZATION INSTRUCTIONS:
- Use the brand logo URL in hero sections and footer sections
- Use primary color for main CTAs, headings, and key elements
${brandProfile.secondary_color ? '- Use secondary color for accents, borders, and secondary CTAs' : ''}
${brandProfile.website_url ? `- Set all CTA button URLs to ${brandProfile.website_url} (or relevant subpages like ${brandProfile.website_url}/pricing)` : '- Use # for button URLs'}
- Maintain consistent brand voice (${brandProfile.brand_voice}) throughout all copy
- Reference the brand name naturally in content
`
    : `
BRAND PROFILE:
- No brand profile provided. Use professional, neutral tone.
- Primary Color: #5c5cf0
- Use placeholder values for logos and URLs
`;

  // Define style-specific design rules
  const styleRules: Record<string, string> = {
    minimalist: `
DESIGN STYLE (Minimalist):
- Ultra-clean layouts with abundant whitespace
- Thin borders (1px) or no borders
- Light, muted color palette with subtle accents
- Elegant typography with generous line-height (1.6-1.8)
- Sans-serif fonts (Inter, Helvetica Neue, SF Pro)
- Subtle shadows (0-2px, low opacity)
- Minimal visual elements - focus on content
- Single-column layouts preferred
- Restrained use of color - mostly neutral with 1-2 accent colors`,

    editorial: `
DESIGN STYLE (Editorial/Magazine):
- Multi-column layouts with clear grid structure
- Serif fonts for headings (Georgia, Times, Playfair Display)
- Pull quotes with decorative elements
- Image captions and bylines
- Large, attention-grabbing headlines
- Editorial spacing with clear content hierarchy
- Sophisticated color palette with earth tones
- Dropcaps for article starts
- Use of dividers and ornamental separators`,

    retro: `
DESIGN STYLE (Retro/Vintage):
- Warm, nostalgic color palette (burnt orange, mustard yellow, brown)
- Rounded corners (8-16px border-radius)
- Vintage-inspired fonts (consider retro feel)
- Badges, stamps, and decorative elements
- Textured backgrounds (subtle patterns)
- High saturation colors with aged feel
- Playful, friendly tone in design
- Use of icons and illustrations
- Slightly increased letter-spacing for headers`,

    brutalist: `
DESIGN STYLE (Brutalist):
- Heavy, bold borders (4-6px solid)
- Extremely bold typography (font-weight: 900)
- High-contrast black and white base with bold accent colors
- Strong, dramatic box shadows (6-10px offsets)
- Raw, unpolished aesthetic - embrace asymmetry
- Sans-serif fonts (Inter, Arial Black, Helvetica Bold)
- Geometric shapes and hard edges
- Overlapping elements for depth
- Monospace fonts for technical elements`,

    cyberpunk: `
DESIGN STYLE (Cyberpunk):
- Neon color palette (electric blue, hot pink, acid green)
- Dark backgrounds (black or dark blue/purple)
- Glowing text effects and borders
- Futuristic, tech-inspired fonts
- Grid overlays and scan-line effects
- Angular, sharp geometric shapes
- High contrast with vibrant accents
- Holographic gradient effects
- Tech/circuit board inspired decorative elements`,

    handwritten: `
DESIGN STYLE (Handwritten/Sketch):
- Organic, irregular shapes and borders
- Script/handwritten-style fonts for emphasis
- Sketch-like decorative elements
- Soft, irregular spacing
- Natural, warm color palette
- Hand-drawn style dividers and underlines
- Imperfect alignment for authenticity
- Textured backgrounds (paper-like)
- Casual, personal, friendly tone`,

    bauhaus: `
DESIGN STYLE (Bauhaus/Geometric Modern):
- Primary colors (red, blue, yellow) with black and white
- Perfect geometric shapes (circles, squares, triangles)
- Asymmetric but balanced layouts
- Bold sans-serif typography
- Flat colors - no gradients
- Strong grid-based composition
- Functional, purposeful design
- High contrast between elements
- Minimal decoration - form follows function`
  };

  const designRules = styleRules[designStyle] || styleRules.minimalist;

  return `You are an expert email marketing copywriter and designer. Your task is to generate email content in the specified design style.

${brandContext}

${designRules}

IMPORTANT: Analyze the user's prompt to identify:
- Target audience (e.g., existing customers, new leads, enterprise clients)
- Campaign goal (e.g., announce, nurture, convert, educate)
- Campaign type (e.g., welcome series, product launch, newsletter, promotional)

Use these insights to tailor the content, tone, and structure appropriately.

COPYWRITING FRAMEWORKS (Use appropriate framework based on goal):

1. AIDA (Attention, Interest, Desire, Action):
   - Attention: Bold headline that stops scrolling
   - Interest: Hook them with a compelling benefit or story
   - Desire: Build emotional connection, show value
   - Action: Clear, urgent CTA

2. PAS (Problem, Agitate, Solution):
   - Problem: Identify the pain point
   - Agitate: Make them feel the urgency
   - Solution: Present your offer as the answer

3. BAB (Before, After, Bridge):
   - Before: Current frustrating situation
   - After: Dream outcome/transformation
   - Bridge: Your product/service as the path

4. FOMO (Fear of Missing Out):
   - Scarcity: Limited time, limited quantity
   - Urgency: Deadlines, countdowns
   - Social proof: "Join 10,000+ customers"
   - Exclusive access: "VIP members only"

VARIETY GUIDELINES (CRITICAL - Make each email unique):
- Vary headline styles: questions, statements, numbers, power words
- Mix content structures: storytelling, data-driven, benefit-focused
- Alternate CTA approaches: direct ("Buy Now"), curiosity ("Discover How"), value ("Get Started Free")
- Change tone intensity: excited, empathetic, authoritative, playful
- Vary section lengths: some short and punchy, others detailed
- Use different emotional triggers: excitement, relief, curiosity, belonging, achievement

OUTPUT FORMAT:
Return a JSON object with this exact structure:
{
  "subject": "Short punchy subject line (30 characters max, ideally under 20)",
  "previewText": "Preview text shown in inbox (80-100 characters)",
  "emailType": "promotional|newsletter|educational|transactional|other",
  "sections": [
    {
      "type": "hero",
      "heading": "Main headline",
      "subheading": "Supporting text",
      "imageKeyword": "relevant search keyword for hero image (e.g. 'modern office team')",
      "imageAlt": "Descriptive alt text for the image"
    },
    {
      "type": "content",
      "heading": "Section heading",
      "text": "Section content text"
    },
    {
      "type": "testimonial",
      "quote": "Customer testimonial quote",
      "author": "Customer Name",
      "authorTitle": "Job Title, Company",
      "authorImage": "https://placehold.co/80x80"
    },
    {
      "type": "feature-list",
      "heading": "Features heading",
      "features": [
        {
          "icon": "✓",
          "title": "Feature name",
          "description": "Feature description"
        }
      ]
    },
    {
      "type": "pricing-table",
      "heading": "Pricing heading",
      "plans": [
        {
          "name": "Plan name",
          "price": "$99",
          "period": "per month",
          "features": ["Feature 1", "Feature 2"],
          "highlighted": true,
          "buttonText": "Get Started"
        }
      ]
    },
    {
      "type": "gallery",
      "heading": "Gallery heading",
      "images": [
        {
          "keyword": "relevant search keyword for this image (e.g. 'product on shelf')",
          "alt": "Image description",
          "caption": "Optional caption"
        }
      ]
    },
    {
      "type": "stats",
      "heading": "Stats heading",
      "stats": [
        {
          "value": "10K+",
          "label": "Happy Customers",
          "icon": "👥"
        }
      ]
    },
    {
      "type": "announcement",
      "heading": "Announcement heading",
      "text": "Announcement text",
      "buttonText": "Learn More",
      "buttonUrl": "#"
    },
    {
      "type": "header",
      "logoUrl": "https://brand-logo-url.com/logo.png",
      "logoAlt": "Brand Name",
      "tagline": "Tagline or slogan"
    },
    {
      "type": "image-text",
      "imageKeyword": "relevant search keyword for this section image (e.g. 'laptop workspace')",
      "imageAlt": "Descriptive alt text",
      "imagePosition": "left",
      "heading": "Feature or product headline",
      "text": "Description of the feature or product benefit",
      "buttonText": "Learn More",
      "buttonUrl": "#"
    },
    {
      "type": "coupon",
      "heading": "Exclusive offer for you",
      "code": "SAVE20",
      "text": "Use this code at checkout for 20% off your order",
      "expiryText": "Expires December 31, 2025"
    },
    {
      "type": "social-links",
      "heading": "Follow us",
      "socialLinks": [
        { "platform": "Twitter", "url": "https://twitter.com", "icon": "\uD83D\uDC26" },
        { "platform": "Instagram", "url": "https://instagram.com", "icon": "\uD83D\uDCF8" },
        { "platform": "LinkedIn", "url": "https://linkedin.com", "icon": "\uD83D\uDCBC" }
      ]
    },
    {
      "type": "columns",
      "heading": "Why choose us",
      "columns": [
        { "icon": "\uD83D\uDE80", "heading": "Fast", "text": "Quick and reliable service" },
        { "icon": "\uD83D\uDD12", "heading": "Secure", "text": "Your data is always protected" },
        { "icon": "\uD83D\uDCA1", "heading": "Smart", "text": "Intelligent solutions for your needs" }
      ]
    },
    {
      "type": "quote",
      "text": "This is the most memorable insight or pull-quote of the email.",
      "author": "Jane Smith",
      "authorTitle": "CEO, Acme Corp"
    },
    {
      "type": "code-block",
      "heading": "Quick start",
      "text": "npm install @acme/sdk\n\nconst client = require('@acme/sdk');\nconst result = await client.run({ prompt: 'Hello world' });\nconsole.log(result.output);",
      "language": "javascript",
      "subheading": "Install the SDK and make your first API call in under 2 minutes."
    },
    {
      "type": "divider",
      "text": "optional label"
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
      "text": "Company Name · 123 Street, City, Country"
    }
  ]
}

SECTION TYPES:
- header: Brand logo bar with optional tagline — ALWAYS the very first section
- hero: Main banner with heading, subheading, optional image
- content: Text content block with optional heading
- testimonial: Customer quote with author info and optional avatar image
- feature-list: List of product/service features with icons and descriptions
- pricing-table: Pricing tiers with features, highlight one as recommended
- gallery: Grid of images with optional captions
- stats: Key metrics and numbers (e.g., customers, growth, ratings)
- announcement: Time-sensitive updates or news callout box
- image-text: Split layout — image on one side, heading+text+button on the other (imagePosition: "left" or "right")
- coupon: Promo code highlight box with dashed border, code, description, expiry
- columns: 2–4 equal-width blocks each with icon/heading/text/optional button
- social-links: Row of social media icons/links (use emoji as icon)
- divider: Decorative separator with optional centered label text
- quote: Pull-quote block — a memorable single sentence or excerpt set in large italic type with a coloured left border. Use 'text' for the quote text (no explicit quotation marks needed), and optionally 'author' + 'authorTitle' for attribution.
- code-block: Syntax-highlighted code snippet. Use 'text' for the raw code, 'language' for the language (e.g. 'javascript', 'typescript', 'python', 'bash', 'json', 'html', 'sql'), 'heading' for an optional label above the block, and 'subheading' for an optional caption/explanation below.
- cta: Call-to-action with button
- footer: Footer with company details, address, and unsubscribe notice

SECTION USAGE GUIDELINES (use as starting templates — always build a full, rich email, never a sparse one):
- Product launch: header + hero + announcement (launch news) + feature-list + image-text + image-text (reversed) + stats + testimonial + pricing-table + cta + social-links + footer
- Newsletter: header + hero + content + divider + content + image-text + announcement + columns + cta + social-links + footer
- Promotional/Sale: header + hero + announcement + coupon + stats + feature-list + testimonial + pricing-table + cta + footer
- Educational: header + hero + content + quote + columns + image-text + feature-list + stats + testimonial + cta + footer
- Software/Dev: header + hero + content + code-block + feature-list + image-text + quote + stats + testimonial + cta + footer
- Social proof: header + hero + stats + testimonial + gallery + image-text + columns + cta + footer
- Product spotlight: header + hero + content + image-text + image-text (reversed) + feature-list + testimonial + cta + footer
- Welcome email: header + hero + content + columns + feature-list + testimonial + cta + social-links + footer

RULES:
1. Always include: 1 header (first section), 1 hero, at least 1 CTA, 1 footer (last section)
2. Include 5-8 middle sections — aim for 9-12 total sections. Never produce a sparse or short email. More sections = more professional and engaging.
3. FOOTER COPYRIGHT: Always use the current year ${currentYear} in footer text (e.g. "© ${currentYear} Company Name")
4. COPY QUALITY (CRITICAL — this is what separates great emails from mediocre ones):
   - hero heading: 5-10 words max, bold and punchy. Open with power words: "Finally", "Introducing", "Unlock", "Transform", "The #1", "Stop", "Discover"
   - hero subheading: 1-2 sentences, name a specific, concrete benefit. No vague filler like "take your business to the next level"
   - hero button (buttonText + buttonUrl): always add a CTA button on the hero — use the brand's website_url. Button text should be punchy ("Get started free", "Start building", "Claim your spot")
   - content intro field: use for a single powerful lead sentence (1 sentence max) that punches above the body text. Then use 'text' for 2-4 paragraphs separated by double-newlines (\n\n). Each paragraph should be 2-3 sentences. Total content block should feel like a magazine article — no filler.
   - quote sections: the quote 'text' should be a pithy, memorable statement — either from a real-sounding customer, a thought leader, or a key insight distilled into one sentence. Make it quotable.
   - code-block sections: provide clean, real, runnable code relevant to the email topic. No pseudocode. Comment the key parts.
   - testimonials: include a specific, credible outcome in the quote (e.g. "We cut our email production time from 2 hours to 8 minutes") with a realistic name, title, and company
   - stats: use impressive but realistic numbers with context labels ("10,000+ teams trust us", "$2M+ saved by customers", "4.9 / 5 average rating")
   - feature-list: every feature needs a compelling 1-sentence benefit description — not just a label
   - columns: each column should have an icon emoji, a punchy 2-4 word heading, and a 1-2 sentence benefit description
   - CTA heading: create urgency or FOMO ("Limited time", "Join 10,000+ teams", "Don't miss out"). Button text: 2-4 words, start with an action verb
   - announcement: be specific about what's new, why it matters, and when ("Launching March 21 — early access now open")
5. BRAND PERSONALIZATION (CRITICAL):
   - Include logo in hero imageUrl and footer sections when logo_url is provided
   - Use primary_color for all main CTAs and primary design elements
   - Use secondary_color (if provided) for accents, borders, and highlights
   - Set all button URLs to the brand's website_url or relevant subpages
   - Weave the brand_name naturally into copy (headlines, content, CTAs)
   - Match the brand_voice tone in all written content
6. Keep subject lines as short as possible — ideally under 20 characters, hard max 30. No filler words. Punchy, direct, curiosity-driving.
7. Make CTAs clear and action-oriented
8. For sections that need photos (hero, image-text, gallery), output an "imageKeyword" (or "keyword" for gallery images) — a short, specific 2-4 word English search phrase describing the ideal photo (e.g. "team meeting office", "coffee shop morning", "product packaging minimal"). Do NOT output imageUrl for non-logo images — the system will fetch real photos from Pexels using the keyword.
9. Return ONLY the JSON object, no markdown formatting
10. Adapt all content and structure to match the ${designStyle} style perfectly
11. CRITICAL: ALL string values in the JSON must be PLAIN TEXT ONLY. Never use HTML tags, <span>, <b>, <i>, CSS styles, or any markup inside JSON string fields. The renderer will handle all styling — your job is content only.`;
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
