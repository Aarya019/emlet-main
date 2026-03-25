import { GoogleGenerativeAI } from '@google/generative-ai';
import type { BrandProfile } from '@/lib/db/types';
import { buildEmailPalette } from '@/lib/colors/palette';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Email content structure
export interface EmailSection {
  type: 'hero' | 'content' | 'cta' | 'footer' | 'testimonial' | 'testimonials' | 'feature-list' | 'pricing-table' | 'gallery' | 'stats' | 'announcement' | 'header' | 'image-text' | 'coupon' | 'social-links' | 'columns' | 'divider' | 'quote' | 'code-block';
  heading?: string;
  subheading?: string;
  /** Large lead paragraph rendered at a bigger, bolder size above the body text. Use for strong opening statements or key summaries. */
  intro?: string;
  /** Small uppercase category/topic label shown above the section heading. E.g. "New Feature", "Community Update", "Behind the Scenes" */
  eyebrow?: string;
  /** For feature-list: render numbered step badges (1, 2, 3…) instead of icon bullets */
  numbered?: boolean;
  /** For feature-list: 'grid' renders a centered 2-column card layout; omit for default vertical list */
  layout?: 'list' | 'grid';
  /** Optional secondary action text link rendered below the primary CTA button — e.g. "Learn more", "See pricing" */
  secondaryButtonText?: string;
  /** URL for the secondary action */
  secondaryButtonUrl?: string;
  text?: string;
  buttonText?: string;
  buttonUrl?: string;
  imageUrl?: string;
  imageAlt?: string;
  /**
   * 5–8 word photographic scene description for Pexels image search.
   * Describe SUBJECT + SETTING + MOOD/LIGHTING specifically — never single words or vague topics.
   * BAD: "team meeting", "technology", "business".
   * GOOD: "diverse team laughing around whiteboard office", "developer focused laptop dark screen glow", "woman presenting data modern glass conference room".
   * Match the visual to the section's actual content and brand industry.
   */
  imageKeyword?: string;
  // For testimonial sections
  quote?: string;
  author?: string;
  authorTitle?: string;
  authorImage?: string;
  // For testimonials (plural) sections — 2-column grid of multiple quote cards
  testimonials?: Array<{
    quote: string;
    author: string;
    authorTitle?: string;
    /** URL to a circular avatar image (40×40px) */
    authorImage?: string;
    /** Star rating 1–5 (defaults to 5) */
    rating?: number;
  }>;
  // For feature-list sections
  features?: Array<{
    icon?: string;
    /** Phosphor icon name for email clients — e.g. "rocket", "check-circle", "lightning", "chart-bar" */
    iconName?: string;
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
    /** 5–8 word photographic scene description for Pexels. Describe the specific visual: subject + setting + mood. BAD: "food". GOOD: "chef plating gourmet dish restaurant kitchen steam". */
    keyword?: string;
  }>;
  // For stats sections
  stats?: Array<{
    value: string;
    label: string;
    icon?: string;
    /** Phosphor icon name for email clients — e.g. "chart-bar", "users", "star", "trend-up" */
    iconName?: string;
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
    /** Phosphor icon name for email clients — e.g. "rocket", "shield-check", "lightning", "globe" */
    iconName?: string;
    imageUrl?: string;
    buttonText?: string;
    buttonUrl?: string;
  }>;
  // Per-section generation hints (used by the AI block-regeneration feature)
  /** Free-form instruction for AI block regeneration — e.g. 'make it more urgent', 'rewrite for startup founders', 'use bullet points' */
  sectionPrompt?: string;
  // Per-section color overrides
  /** Override the section background color (hex, e.g. "#f0f4ff") */
  backgroundColor?: string;
  /** Override the main text/heading color for this section */
  textColor?: string;
  /** Override the CTA button background color for this section */
  buttonColor?: string;
  /** CSS gradient string for section background — e.g. "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" — takes precedence over backgroundColor */
  backgroundGradient?: string;
  /**
   * 5–8 word cinematic wide-angle scene for the full-width Pexels background photo.
   * Describe SETTING + ATMOSPHERE + LIGHTING. Wide-angle/panoramic subjects work best.
   * BAD: "city", "nature", "abstract".
   * GOOD: "aerial city lights highway night long exposure", "misty mountain valley golden sunrise fog", "minimal concrete architecture wide angle overhead", "dark neon lit alley cyberpunk rain".
   * MUST be set on hero sections. Always pair with textColor: '#ffffff'.
   */
  backgroundImageKeyword?: string;
  /** Resolved Pexels URL for the section background image — populated by the server, not by the AI. */
  backgroundImageUrl?: string;
  /** Optional CSS color/rgba overlay rendered on top of the background image (e.g. "rgba(0,0,0,0.55)"). When omitted, a default cinematic dark gradient is applied automatically. */
  backgroundImageOverlay?: string;
}

export interface EmailStyleOverrides {
  /** Background color of the outer email page/gutter — the area around the card. Uses palette color. */
  outerBackground?: string;
  /** Background color of the email content card itself. Uses palette color. */
  containerBackground?: string;
  /** Border color for the email container card. Empty string = no border. */
  containerBorderColor?: string;
  /** Border width in px for the email container card (default: 1). */
  containerBorderWidth?: number;
  /** Color for the top accent bar. Empty string = hide it. Default: brand primary. */
  accentBarColor?: string;
}

export interface GeneratedEmail {
  subject: string;
  previewText: string;
  emailType: 'promotional' | 'newsletter' | 'educational' | 'transactional' | 'other';
  /**
   * Index into the font pair variants for this design style (0–3).
   * Legacy field — superseded by fontPairing when present.
   */
  fontVariant?: number;
  /**
   * Explicit font selection. When set, overrides fontVariant entirely.
   * heading/body must be keys of FONT_REGISTRY exported from renderer.tsx.
   */
  fontPairing?: { heading: string; body: string };
  /** Email-level visual overrides for outer background, container, border, and accent bar. */
  emailStyle?: EmailStyleOverrides;
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
const MODEL_PRIMARY  = 'gemini-2.5-pro';
const MODEL_FALLBACK = 'gemini-2.5-flash';

async function tryGenerateWithModel(modelName: string, fullPrompt: string): Promise<GeneratedEmail> {
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 1.0,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
    }
  });

  const result = await model.generateContent(fullPrompt);
  const text = result.response.text();

  const stripped = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
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

  if (!emailData.subject || !emailData.sections || emailData.sections.length === 0) {
    throw new Error('Invalid email structure returned');
  }

  return emailData;
}

function isRetryableError(error: unknown): boolean {
  if (error && typeof error === 'object' && 'status' in error) {
    const status = (error as { status: number }).status;
    return status === 503 || status === 429 || status === 500;
  }
  return false;
}

export async function generateEmailContent(
  prompt: string,
  brandProfile: BrandProfile | null,
  designStyle: string = 'minimalist',
  userEmailType?: string
): Promise<GeneratedEmail> {
  const systemPrompt = buildSystemPrompt(brandProfile, designStyle);
  const emailTypeInstruction = userEmailType
    ? `- This must be a ${userEmailType} email — use the tone, structure, and copy conventions typical of ${userEmailType} emails`
    : '';
  const userPrompt = `Generate an email for the following request:

${prompt}

Remember to:
- Use the brand voice and identity specified
- Include appropriate sections (hero, content blocks, CTA, footer)
- Make it engaging and conversion-focused${emailTypeInstruction ? `\n${emailTypeInstruction}` : ''}
- Do NOT use emojis anywhere — not in subject lines, headings, body copy, or CTAs
- Return ONLY valid JSON matching the schema — no markdown, no code fences, no explanation`;

  const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

  // Try primary model with up to 2 attempts (exponential backoff on 503/429/500)
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      if (attempt > 0) {
        const delay = Math.pow(2, attempt) * 1000; // 2s, 4s
        console.log(`Retrying with ${MODEL_PRIMARY} (attempt ${attempt + 1}) after ${delay}ms...`);
        await new Promise(res => setTimeout(res, delay));
      }
      return await tryGenerateWithModel(MODEL_PRIMARY, fullPrompt);
    } catch (error) {
      console.error(`Error with ${MODEL_PRIMARY} (attempt ${attempt + 1}):`, error);
      if (!isRetryableError(error) || attempt === 2) {
        // Non-retryable error or exhausted retries — fall through to fallback
        break;
      }
    }
  }

  // Fallback to stable model
  console.log(`Falling back to ${MODEL_FALLBACK}...`);
  try {
    return await tryGenerateWithModel(MODEL_FALLBACK, fullPrompt);
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
  const palette = buildEmailPalette(
    brandProfile?.primary_color ?? '#5c5cf0',
    brandProfile?.background_color ?? null,
  );
  const brandContext = brandProfile
    ? `
BRAND PROFILE:
- Brand Name: ${brandProfile.brand_name}
- Industry: ${brandProfile.industry || 'Not specified'}
- Brand Voice: ${brandProfile.brand_voice}
- Primary Color: ${brandProfile.primary_color}
${brandProfile.secondary_color ? `- Secondary Color: ${brandProfile.secondary_color}` : ''}
${brandProfile.background_color ? `- Background Color: ${brandProfile.background_color}` : ''}
${brandProfile.logo_url ? `- Logo URL: ${brandProfile.logo_url}` : ''}
${brandProfile.website_url ? `- Website URL: ${brandProfile.website_url}` : ''}
- Brand Description: ${brandProfile.brand_description || 'Not provided'}

BRAND PERSONALIZATION INSTRUCTIONS:
- Use the brand logo URL in the header section and footer section only
- Do NOT place the brand logo as a hero image — the hero should use a contextual background image via backgroundImageKeyword
- Use primary color for main CTAs, headings, and key elements
${brandProfile.secondary_color ? '- Use secondary color for accents, borders, and secondary CTAs' : ''}
${brandProfile.background_color ? `- Use background_color (${brandProfile.background_color}) for the email body background and light section backgrounds — keeps the email visually on-brand` : ''}
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

  // Per-style font variant labels for the AI prompt
  const fontVariantLabels: Record<string, string[]> = {
    minimalist:   ['Plus Jakarta Sans (clean geometric)', 'Inter + DM Sans (neutral precision)', 'Outfit (rounded modern)', 'Manrope + Syne (editorial sans)'],
    editorial:    ['Lora + Playfair Display (classic)', 'Crimson Pro + Cormorant (luxury)', 'EB Garamond + DM Serif (scholarly)', 'Libre Baskerville (timeless)'],
    retro:        ['Nunito + DM Serif (warm vintage)', 'Josefin Sans + Abril Fatface (poster)', 'Raleway + Lobster Two (art deco)', 'Karla + Fredoka (friendly retro)'],
    brutalist:    ['Space Grotesk (techy raw)', 'Archivo Black (maximum impact)', 'Barlow Condensed (industrial)', 'Teko (ultra-compressed)'],
    cyberpunk:    ['Share Tech Mono + Orbitron (classic cyber)', 'Exo 2 + Russo One (futuristic)', 'Rajdhani + Audiowide (tech)', 'Oxanium (digital mono)'],
    handwritten:  ['Nunito + Caveat (casual sketch)', 'Quicksand + Patrick Hand (soft)', 'Comfortaa + Pacifico (playful)', 'Lato + Kalam (personal note)'],
    bauhaus:      ['Work Sans + Bebas Neue (bauhaus classic)', 'Raleway + Anton (bold grid)', 'Montserrat + Black Han Sans (geometric)', 'Fjalla One (condensed impact)'],
  };
  const variantList = (fontVariantLabels[designStyle] || fontVariantLabels.minimalist)
    .map((label, i) => `  ${i}: ${label}`).join('\n');

  return `You are an expert email marketing copywriter and designer. Your task is to generate email content in the specified design style.

${brandContext}

${designRules}

BEFORE WRITING ANYTHING, answer these three questions about the user's prompt:
1. THE ONE ACTION — What is the single thing the reader should do after reading this email? (Not two things. One.)
2. THE READER — Who exactly is this for? What do they already know, fear, or want?
3. THE HOOK — What is the first sentence that would make this specific reader stop scrolling?

Use those answers to drive every decision: tone, structure, copy, CTA, and section count.

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

ONE GOAL STRATEGY (CRITICAL):
- Every email must have exactly ONE goal. Pick the most important action and build everything around it.
- Identify a single emotional driver: urgency, curiosity, relief, pride, FOMO, or belonging — and thread it through every section.
- Cut anything that dilutes that main message. Two competing CTAs = zero conversions.
- Vary the approach per email: storytelling, proof-led, contrast (before/after), scarcity, or insider reveal — but always in service of the one goal.

COLOR PALETTE — use ONLY these exact hex values for backgroundColor, textColor, buttonColor. NEVER invent or use any other hex colors:
- SURFACE        (default light section bg):    "${palette.surface}"
- SURFACE_ALT    (alternate light section bg):  "${palette.surfaceAlt}"
- ACCENT_LIGHT   (feature / highlight bg):      "${palette.accentLight}"
- PRIMARY        (CTA buttons, key accents):    "${palette.primary}"
- PRIMARY_DARK   (dark/dramatic section bg):    "${palette.primaryDark}"
- ON_DARK        (text + buttons on dark bg):   "${palette.onDark}"
- BODY_TEXT      (default body text):           "${palette.bodyText}"

MANDATORY EMAIL COMPOSITION RULES (non-negotiable):
1. STRUCTURE: 6–9 total sections, quality over quantity. Required sequence: header → hero → [2–5 body sections] → cta → footer. Body sections must include a mix of at least one feature-list or stats, one content or image-text, and optionally a testimonials grid (preferred over single testimonial when showing multiple quotes) or quote. Every section must earn its place — cut anything that doesn't advance the single email goal.
2. VISUAL RHYTHM — set backgroundColor on EVERY section using ONLY the palette above:
   - Default light sections:        "${palette.surface}"
   - Alternate light sections:      "${palette.surfaceAlt}"
   - Feature / highlight sections:  "${palette.accentLight}"
   - Dark dramatic sections:        "${palette.primaryDark}" — ALWAYS also set textColor: "${palette.onDark}" and buttonColor: "${palette.onDark}"
   - CTA section:                   "${palette.primary}" — ALWAYS also set textColor: "${palette.onPrimary}" and buttonColor: "${palette.onPrimary}"
   Ideal rhythm for a 7-section email: SURFACE → SURFACE_ALT → PRIMARY_DARK → SURFACE → ACCENT_LIGHT → PRIMARY → SURFACE
   NEVER use raw '#ffffff', '#f5f9ff', '#f8f8f8', '#0d1117', '#1a1a2e' or any other value not in the palette.
3. HERO must always include: eyebrow + heading + intro (2 sentences) + subheading + buttonText + buttonUrl + backgroundGradient + textColor: "${palette.onDark}".
   Use backgroundGradient incorporating the brand palette: "linear-gradient(135deg, ${palette.primaryDark} 0%, ${palette.primary}cc 100%)".
4. CTA section must always set backgroundColor: "${palette.primary}" and textColor: "${palette.onPrimary}".
5. Use feature-list with layout: "grid" and at least 4 features for product/feature emails.
6. Use stats section with 3–4 concrete metric numbers for emails about growth, performance, or social proof.
7. BACKGROUND IMAGES: Hero sections MUST set backgroundImageKeyword — a cinematic 5–8 word wide-angle descriptor (e.g. "aerial city lights highway night exposure", "misty mountain valley golden sunrise fog", "minimal concrete office architecture overhead"). CTA sections MAY include backgroundImageKeyword for visual/lifestyle brands. When set, ALWAYS pair with textColor: '#ffffff'. The renderer applies a dark gradient overlay automatically. Do NOT also set backgroundGradient.
   MINIMAL OVERLAY TEXT RULE: When a section has a background image, keep ALL overlaid content to an absolute minimum — the photo must breathe. Limit to: eyebrow (optional, 2–3 words max) + heading (5 words max) + one single-sentence subheading OR intro (not both) + one CTA button. Do NOT include secondaryButtonText on photo backgrounds. No long paragraphs, no lists, no extra fields — the image carries the visual weight, text is just a caption.
8. EMAIL STYLE: Always output an "emailStyle" object at the root level. Set it using palette colors only:
   - outerBackground: the gutter/page color wrapping the email card. Usually "${palette.surfaceAlt}" or "${palette.primaryDark}" for dark themes.
   - containerBackground: the email card background. Usually "${palette.surface}" for light themes or "${palette.primaryDark}" for dark.
   - containerBorderColor: the card border color. Use a subtle palette value or empty string "" for no border.
   - containerBorderWidth: integer 1–4 (default 1). Use 2–4 only for brutalist/retro styles.
   - accentBarColor: the 4px top accent strip color. Usually "${palette.primary}". Use empty string "" to hide it.
   Match these to the design style: dark cyberpunk emails → dark outerBackground + no border; minimalist → light grey outer + thin border; brutalist → white container + thick black border.
9. ICONS: For every feature in feature-list, every stat in stats, and every column in columns, set BOTH fields:
   - "icon": an emoji fallback (renders in basic clients)
   - "iconName": a Phosphor Icons name (renders as a crisp SVG in modern clients)
   Valid Phosphor icon names are lowercase kebab-case, e.g.: rocket, check-circle, lightning, chart-bar, users, shield-check, clock, star, arrow-right, code, globe, lock, chat-circle, gear, trophy, chart-line-up, currency-dollar, envelope, bell, image-square, device-mobile, hand-heart, leaf, magnifying-glass, paint-brush, person, planet, plug, question, sparkle, tag, target, thumbs-up, timer, translate, vault, warning, wifi, wrench
   Full icon set: https://phosphoricons.com (use the base name without weight suffix, lowercase kebab-case)

IMAGE KEYWORD RULES (non-negotiable):
1. All imageKeyword and gallery image keyword values MUST be 5–8 specific, descriptive words: subject + setting + mood/lighting. NEVER use single words or vague category names.
2. Match the visual to the section content and brand industry:
   - SaaS / software email → "developer focused dual monitor dark office", "woman typing laptop bright minimal desk"
   - Fitness / wellness → "athlete trail running sunrise forest path", "yoga pose beach golden hour soft light"
   - Food / restaurant → "chef plating gourmet dish restaurant kitchen steam", "fresh ingredients wooden table natural light"
   - Finance / B2B → "business handshake modern glass lobby", "charts analysis laptop coffee desk morning"
   - E-commerce / fashion → "model wearing product natural outdoor light", "product flat lay minimal white surface"
3. Include human subjects when the section is about people, results, community, or testimonials.
4. backgroundImageKeyword must describe wide-angle atmospheric scenes: landscapes, architecture, cityscapes, or abstract textures with strong perspective — NOT close-up portraits.

COPY QUALITY RULES (non-negotiable):
1. Use SPECIFIC numbers, percentages, and timeframes — never vague claims. Write "Reduce churn by 34%" not "reduce churn significantly".
2. Every hero heading must be outcome-focused and under 8 words. The first two lines of the email are the hook — make them impossible to ignore.
3. Every content section intro must open with a compelling hook — a surprising fact, bold claim, or direct benefit statement.
4. Every CTA button must use a value-verb: "Start Free Trial", "Claim Your Discount", "See Live Demo", "Get Instant Access" — never just "Click Here" or "Learn More" alone.
5. eyebrow labels must be 2–4 words: "New Release", "Case Study", "Limited Offer", "Just Launched", "Behind The Scenes".
6. Write like a human, not a press release. Use contractions. Write in second person ("you", "your"). Be direct. Avoid: "leverage", "robust", "seamless", "synergy", "game-changing", "best-in-class", "world-class", "innovative", "cutting-edge", "revolutionary".
7. Place a trust signal (social proof stat, customer name, "used by X companies", or money-back guarantee) within one section above or adjacent to the main CTA.
8. Keep body paragraphs to 2–3 sentences maximum. Long walls of text get skipped.
9. Create a through-line of tension or curiosity from the subject line → hero heading → first CTA — each feels like the next step in a single narrative.

DESIGN PRINCIPLES (non-negotiable):
1. Use whitespace generously — every section needs breathing room, never stack dense content blocks back-to-back.
2. One visual focus per email — either a single hero image or a single strong stats/feature section, not both fighting for attention.
3. Mobile-first: all section content must be intelligible at 375px width. No side-by-side text columns with more than 3 words each.
4. Section budget: 6–8 sections hits the sweet spot. 9 is the ceiling unless the campaign type genuinely requires it (e.g. product launch with pricing).
5. Dark mode safe: use palette colors only (never raw whites or blacks). The renderer handles dark mode — trust the palette system.

FONT VARIANT — pick the pairing that best fits the email topic and brand personality. Output a "fontVariant" number (0–3) in the root JSON object.
Available variants for ${designStyle}:
${variantList}
Choose thoughtfully — consider the brand industry, campaign tone, and email content. Avoid always picking 0.

EMAIL FONT RULES (these are enforced by the renderer — trust them):
- Custom fonts are loaded via Google Fonts and fall back automatically to safe system fonts on Gmail and Outlook Windows.
- Never reference a font not in the variant list — the renderer handles font-family and fallback stacks.
- Do NOT output inline font-family styles — all typography is controlled by the chosen fontVariant.
- Font sizes in the body sections should not need overriding; the renderer applies correct sizing with line-height for all clients.

OUTPUT FORMAT:
Return a JSON object with this exact structure:
{
  "subject": "Short punchy subject line (30 characters max, ideally under 20)",
  "previewText": "Preview text shown in inbox (80-100 characters)",
  "emailType": "promotional|newsletter|educational|transactional|other",
  "fontVariant": 0,
  "emailStyle": {
    "outerBackground": "#f0f0f5",
    "containerBackground": "#ffffff",
    "containerBorderColor": "#e0e0e8",
    "containerBorderWidth": 1,
    "accentBarColor": "#5c5cf0"
  },
  "sections": [
    {
      "type": "hero",
      "eyebrow": "New Release",
      "heading": "Outcome-focused headline under 8 words",
      "intro": "A compelling 1-2 sentence hook that states the core benefit or insight directly.",
      "subheading": "Supporting detail that reinforces the heading value prop.",
      "backgroundImageKeyword": "aerial city highway lights night long exposure",
      "textColor": "#ffffff",
      "buttonText": "Start Free Trial",
      "buttonUrl": "#",
      "secondaryButtonText": "See how it works",
      "secondaryButtonUrl": "#"
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
      "type": "testimonials",
      "heading": "Loved by thousands of teams",
      "subheading": "Here's what our customers have to say",
      "testimonials": [
        {
          "quote": "We cut our email production time from 2 hours to 8 minutes. The ROI was clear within the first week.",
          "author": "Sarah Chen",
          "authorTitle": "Head of Marketing, Acme Corp",
          "rating": 5
        },
        {
          "quote": "Finally an email tool that actually understands our brand. Every email looks like our designers made it.",
          "author": "Marcus Lee",
          "authorTitle": "Founder, GrowthLab",
          "rating": 5
        }
      ]
    },
    {
      "type": "feature-list",
      "heading": "Features heading",
      "features": [
        {
          "icon": "✓",
          "iconName": "check-circle",
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
          "keyword": "fresh product displayed wooden table natural window light",
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
          "icon": "👥",
          "iconName": "users"
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
      "imageKeyword": "developer focused laptop dual screen dark office glow",
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
        { "icon": "🚀", "iconName": "rocket", "heading": "Fast", "text": "Quick and reliable service" },
        { "icon": "🔒", "iconName": "lock", "heading": "Secure", "text": "Your data is always protected" },
        { "icon": "💡", "iconName": "lightbulb", "heading": "Smart", "text": "Intelligent solutions for your needs" }
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
      "buttonText": "Get Started Free",
      "buttonUrl": "#",
      "backgroundColor": "#1a1a2e",
      "textColor": "#ffffff"
    },
    {
      "type": "footer",
      "text": "Company Name · 123 Street, City, Country"
    }
  ]
}

SECTION TYPES:
- header: Brand logo bar with optional tagline — ALWAYS the very first section. Optionally supply 'columns' as an array of nav links [{heading:'About', buttonUrl:'/about'}, ...] to add a centered nav row below the logo.
- hero: Main banner. MUST include: eyebrow + heading + intro + subheading + buttonText + buttonUrl. MUST set backgroundGradient (e.g. "linear-gradient(135deg, #0d1117 0%, #1a1a2e 100%)") and textColor: "#ffffff". Add secondaryButtonText+secondaryButtonUrl for a ghost/text secondary action. Always include imageKeyword for a contextual image.
- content: Text content block. Add 'eyebrow' (e.g. "Behind The Scenes") for a small coloured label above the heading.
- testimonial: Single customer quote with author info. Include 'authorImage' URL to render a side-by-side avatar layout instead of centered card.
- testimonials: Grid of 2–4 customer quote cards (2 per row). Each item has 'quote' (required), 'author' (required), 'authorTitle', optional 'rating' (1–5 stars, default 5), and optional 'authorImage' URL. Use this instead of a single testimonial when you have multiple quotes to showcase. Add an optional 'subheading' below the main heading.
- feature-list: List of product/service features with icons and descriptions. Set 'numbered: true' for step-by-step numbered badges. Set 'layout: "grid"' for a 2-column centered card grid.
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
- cta: Call-to-action with heading + button. MUST set backgroundColor (brand primary or dark color) and textColor: "#ffffff". Add secondaryButtonText+secondaryButtonUrl for a secondary link below the main button.
- footer: Footer with company details, address, and unsubscribe notice

SECTION USAGE GUIDELINES (starting templates — trim ruthlessly, every section must earn its place):
- Product launch: header + hero + feature-list + image-text + stats + testimonials + cta + footer (8 sections)
- Newsletter: header + hero + content + image-text + columns + cta + footer (7 sections)
- Promotional/Sale: header + hero + coupon + stats + testimonials + cta + footer (7 sections)
- Educational: header + hero + content + quote + feature-list + image-text + cta + footer (8 sections)
- Software/Dev: header + hero + code-block + feature-list + stats + testimonial + cta + footer (8 sections)
- Social proof: header + hero + stats + testimonials + image-text + cta + footer (7 sections)
- Product spotlight: header + hero + image-text + feature-list + testimonials + cta + footer (7 sections)
- Welcome email: header + hero + columns + feature-list + cta + footer (6 sections)

RULES:
1. Always include: 1 header (first section), 1 hero, at least 1 CTA, 1 footer (last section)
2. Include 4–7 body sections — aim for 6–9 total sections. Fewer, sharper sections outperform bloated emails. Cut any section that doesn't directly serve the email's one goal.
3. FOOTER COPYRIGHT: Always use the current year ${currentYear} in footer text (e.g. "© ${currentYear} Company Name")
4. COPY QUALITY (CRITICAL — this is what separates great emails from mediocre ones):
   - hero heading: 5–8 words, outcome-focused. The first two lines are the hook — make them impossible to ignore.
   - hero subheading: 1–2 sentences, name a concrete specific benefit. Never: "take your business to the next level", "leverage our robust platform", "seamless experience".
   - hero button: always present, punchy action verb. Use brand website_url. E.g. "Start free", "Claim your spot", "Get instant access".
   - eyebrow: 2–4 words, small label for context. E.g. "New Release", "Case Study", "For Founders". Use sparingly.
   - content intro: one powerful lead sentence above the body. Then 'text': 2–3 short paragraphs (2–3 sentences each). No filler.
   - secondaryButtonText: softer parallel action — "Watch demo" beside "Start free trial", "See pricing" beside "Get started".
   - testimonials: specific outcome in the quote ("Cut email time from 2 hours to 8 minutes"), realistic name + title + company.
   - stats: impressive but credible numbers with context ("10,000+ teams", "$2M+ saved", "4.9/5 avg rating").
   - feature-list: every feature needs a 1-sentence benefit description, not just a label.
   - CTA heading: urgency or FOMO. Button text: 2–4 words, action verb first.
   - BANNED WORDS: "leverage", "robust", "seamless", "synergy", "game-changing", "best-in-class", "world-class", "innovative", "cutting-edge", "revolutionary", "transformative", "solution", "empower", "unlock your potential". Write like a person, not a press release.
   - HUMAN VOICE: Use contractions. Use second person ("you", "your"). Be direct. One idea per sentence.
5. BRAND PERSONALIZATION (CRITICAL):
   - Include logo in hero imageUrl and footer sections when logo_url is provided
   - Use primary_color for all main CTAs and primary design elements
   - Use secondary_color (if provided) for accents, borders, and highlights
   - Use background_color (if provided) as a cue for the overall email tone — the renderer will apply it as the body background automatically
   - Set all button URLs to the brand's website_url or relevant subpages
   - Weave the brand_name naturally into copy (headlines, content, CTAs)
   - Match the brand_voice tone in all written content
6. Keep subject lines as short as possible — ideally under 20 characters, hard max 30. No filler words. Punchy, direct, curiosity-driving.
7. Make CTAs clear and action-oriented
8. For sections that need photos (hero, image-text, gallery), output an "imageKeyword" (or "keyword" for gallery images) — a short, specific 2-4 word English search phrase describing the ideal photo (e.g. "team meeting office", "coffee shop morning", "product packaging minimal"). Do NOT output imageUrl for non-logo images — the system will fetch real photos from Pexels using the keyword.
9. Return ONLY the JSON object, no markdown formatting
10. Adapt all content and structure to match the ${designStyle} style perfectly
11. CRITICAL: ALL string values in the JSON must be PLAIN TEXT ONLY. Never use HTML tags, <span>, <b>, <i>, CSS styles, or any markup inside JSON string fields. The renderer will handle all styling — your job is content only.
12. NO EMOJIS anywhere in the output — not in subject lines, headings, body text, button labels, or any other field.`;
}

// ─────────────────────────────────────────────
// Block regeneration
// ─────────────────────────────────────────────

/**
 * Rewrite the content fields of a single email section using tone/style hints.
 * Returns only the writable content fields (never images, colors, or hints).
 */
export async function regenerateSingleSection(
  section: EmailSection,
  emailSubject: string,
  allSections: EmailSection[],
  brandProfile: BrandProfile | null,
  designStyle: string,
): Promise<Partial<EmailSection>> {
  const userInstruction = section.sectionPrompt?.trim() || null;

  const palette = buildEmailPalette(
    brandProfile?.primary_color ?? '#5c5cf0',
    brandProfile?.background_color ?? null,
  );
  const brandContext = brandProfile
    ? `Brand: ${brandProfile.brand_name}. Voice: ${brandProfile.brand_voice}. Industry: ${brandProfile.industry || 'not specified'}.`
    : 'No brand profile — use a neutral professional tone.';

  // Give the AI lightweight context about surrounding sections
  const surroundingContext = allSections
    .filter((_, i) => allSections[i] !== section)
    .map(s => `${s.type}${s.heading ? ` ("${s.heading}")` : ''}`)
    .join(', ');

  // Build the per-type content field list so the AI knows exactly what to return
  const typeFieldGuide: Record<string, string> = {
    hero:           'eyebrow, heading, subheading, intro, text, buttonText, secondaryButtonText',
    content:        'eyebrow, heading, intro, text',
    cta:            'eyebrow, heading, intro, text, buttonText, secondaryButtonText',
    announcement:   'eyebrow, heading, text',
    'image-text':   'eyebrow, heading, subheading, text, buttonText',
    'feature-list': 'heading, subheading, features (each: title, description)',
    testimonial:    'quote',
    testimonials:   'heading, subheading, testimonials (each: quote)',
    stats:          'heading, stats (each: value, label)',
    gallery:        'heading',
    'pricing-table':'heading',
    coupon:         'heading, text, expiryText',
    columns:        'heading, columns (each: heading, text)',
    'social-links': 'text',
    header:         'tagline',
    footer:         'text',
    divider:        'text',
    quote:          'text, author, authorTitle',
    'code-block':   'heading, subheading',
  };

  const fieldsToReturn = typeFieldGuide[section.type] || 'heading, text';

  const prompt = `You are an expert email copywriter. Rewrite the content fields of a single "${section.type}" email block.

EMAIL SUBJECT: "${emailSubject}"
SURROUNDING SECTIONS: ${surroundingContext}
DESIGN STYLE: ${designStyle}
${brandContext}
${userInstruction ? `\nUSER INSTRUCTIONS: ${userInstruction}` : ''}

CURRENT BLOCK (JSON):
${JSON.stringify(section, null, 2)}

INSTRUCTIONS:
1. Rewrite ONLY these fields: ${fieldsToReturn}
2. Keep the exact same JSON field names — do not rename or add/remove fields
3. Do NOT change: type, imageUrl, imageKeyword, backgroundImageKeyword, backgroundColor, textColor, buttonColor, backgroundGradient, buttonUrl, secondaryButtonUrl, sectionPrompt, or any URL/color/image fields
4. If USER INSTRUCTIONS are provided above, follow them closely — they take priority over everything else
5. Keep within the same general topic — do not change the subject matter
6. Return ONLY a valid JSON object containing the rewritten fields — no markdown, no explanation
7. NO emojis anywhere. Plain text only.
8. Short, punchy copy wins over verbose prose

Return ONLY the JSON object with the rewritten content fields.`;

  const fullPrompt = `${prompt}`;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      if (attempt > 0) await new Promise(res => setTimeout(res, 2000));
      const result = await tryGenerateWithModel(MODEL_PRIMARY, fullPrompt);
      // tryGenerateWithModel returns a GeneratedEmail, but we passed a section prompt
      // We'll call the model directly instead
      throw new Error('use-direct');
    } catch {
      break;
    }
  }

  // Call model directly (not via tryGenerateWithModel which expects GeneratedEmail shape)
  async function callModel(modelName: string): Promise<Partial<EmailSection>> {
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: { temperature: 1.0, topP: 0.95, topK: 40, maxOutputTokens: 2048 },
    });
    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();
    const stripped = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
    const jsonMatch = stripped.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    return JSON.parse(jsonMatch[0]) as Partial<EmailSection>;
  }

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      if (attempt > 0) await new Promise(res => setTimeout(res, 2000));
      return await callModel(MODEL_PRIMARY);
    } catch (err) {
      if (attempt === 1) break;
    }
  }

  try {
    return await callModel(MODEL_FALLBACK);
  } catch (err) {
    throw err instanceof Error ? err : new Error('Failed to regenerate section');
  }
}

/**
 * Apply a free-form instruction to an entire email — anything can be changed:
 * copy, colors, images, URLs, structure, section types, order, etc.
 */
export async function editEmailWithInstruction(
  instruction: string,
  currentEmail: GeneratedEmail,
  brandProfile: BrandProfile | null,
  designStyle: string,
): Promise<GeneratedEmail> {
  const brandContext = brandProfile
    ? `Brand: ${brandProfile.brand_name}. Voice: ${brandProfile.brand_voice}. Industry: ${brandProfile.industry || 'not specified'}. Primary color: ${brandProfile.primary_color}.`
    : 'No brand profile — use neutral professional tone.';

  const prompt = `You are an expert email designer and copywriter editing an existing email.

USER INSTRUCTION: "${instruction}"

BRAND: ${brandContext}
DESIGN STYLE: ${designStyle}

CURRENT EMAIL JSON:
${JSON.stringify(currentEmail, null, 2)}

TASK:
Apply the user instruction to the email. You may modify ANY field — copy, colors (backgroundColor, textColor, buttonColor, backgroundGradient), layout, structure, section types, URLs (buttonUrl, secondaryButtonUrl), section order, imagePosition, numbered, layout, etc.

RULES:
1. Return the COMPLETE GeneratedEmail JSON with ALL sections (unless the instruction asks to remove some). You may add, remove, or reorder sections.
2. IMAGE KEYWORDS ONLY: output only imageKeyword / backgroundImageKeyword / gallery image keyword fields to describe desired photos — NEVER output imageUrl / backgroundImageUrl / gallery image url (those are server-resolved). To keep an existing image, copy its keyword exactly as-is from the input.
3. Preserve logoUrl and authorImage values exactly as they appear in the input.
4. Copy sectionPrompt fields exactly from the input.
5. NO emojis anywhere. Plain text only.
6. Return ONLY the JSON object — no markdown, no code fences, no explanation.
7. COPY QUALITY: Write like a human, not a press release. Use contractions. Use second person ("you", "your"). Be direct. BANNED WORDS: "leverage", "robust", "seamless", "synergy", "game-changing", "best-in-class", "world-class", "innovative", "cutting-edge", "revolutionary", "transformative", "empower". Use specific numbers, not vague claims.
8. Keep paragraphs to 2–3 sentences max. CTAs must use action verbs ("Start free", "Claim your spot", "Get instant access") — never "Click Here" or "Learn More" alone.`;

  async function callModel(modelName: string): Promise<GeneratedEmail> {
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: { temperature: 0.9, topP: 0.95, topK: 40, maxOutputTokens: 8192 },
    });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const stripped = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
    const jsonMatch = stripped.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    const parsed = JSON.parse(jsonMatch[0]) as GeneratedEmail;
    if (!parsed.subject || !parsed.sections?.length) throw new Error('Invalid email structure returned');
    return parsed;
  }

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      if (attempt > 0) await new Promise(res => setTimeout(res, 2000));
      return await callModel(MODEL_PRIMARY);
    } catch {
      if (attempt === 1) break;
    }
  }

  return await callModel(MODEL_FALLBACK);
}

/**
 * Test the Gemini API connection
 */
export async function testGeminiConnection(): Promise<boolean> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-pro-preview' });
    const result = await model.generateContent('Say "Hello"');
    const response = result.response.text();
    return response.length > 0;
  } catch (error) {
    console.error('Gemini connection test failed:', error);
    return false;
  }
}
