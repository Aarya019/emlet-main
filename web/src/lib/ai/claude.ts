import Anthropic from '@anthropic-ai/sdk';
import type { BrandProfile } from '@/lib/db/types';
import { buildEmailPalette } from '@/lib/colors/palette';

// Shared Anthropic client — reused by analyze-brand/route.ts too.
// Resolves ANTHROPIC_API_KEY from the environment automatically.
export const anthropic = new Anthropic();

// Email content structure
export interface EmailSection {
  type: 'hero' | 'content' | 'cta' | 'footer' | 'testimonial' | 'testimonials' | 'feature-list' | 'pricing-table' | 'gallery' | 'image-block' | 'stats' | 'announcement' | 'header' | 'image-text' | 'coupon' | 'social-links' | 'columns' | 'divider' | 'quote' | 'code-block';
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
    buttonUrl?: string;
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
  sections: EmailSection[];
}

export interface EmailContext {
  audience?: string;
  goal?: string;
  campaignType?: string;
}

/**
 * Generate email content using Claude
 */
const MODEL_PRIMARY  = 'claude-sonnet-5';
const MODEL_FALLBACK = 'claude-haiku-4-5';

async function tryGenerateWithModel(modelName: string, systemPrompt: Anthropic.TextBlockParam[], userPrompt: string): Promise<GeneratedEmail> {
  const response = await anthropic.messages.create({
    model: modelName,
    max_tokens: 8192,
    thinking: { type: 'disabled' },
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text');
  const text = textBlock?.text ?? '';

  const stripped = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
  const jsonMatch = stripped.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error(`Claude raw response (no JSON found, stop_reason: ${response.stop_reason}):`, text.slice(0, 500));
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

const RETRYABLE_PARSE_ERRORS = new Set([
  'Failed to extract JSON from response',
  'Failed to parse JSON from response',
  'Invalid email structure returned',
]);

function isRetryableError(error: unknown): boolean {
  if (error instanceof Anthropic.APIError && typeof error.status === 'number') {
    return error.status === 429 || error.status === 529 || error.status >= 500;
  }
  // Malformed/incomplete JSON is usually a one-off sampling quirk, not a systemic
  // failure — retry on the same (better) model instead of immediately downgrading
  // to the fallback model, which was silently eating these on the first miss.
  if (error instanceof Error && RETRYABLE_PARSE_ERRORS.has(error.message)) {
    return true;
  }
  return false;
}

export async function generateEmailContent(
  prompt: string,
  brandProfile: BrandProfile | null,
  designStyle: string = 'minimalist'
): Promise<GeneratedEmail> {
  const systemPrompt = buildSystemPrompt(brandProfile, designStyle);
  const userPrompt = `Generate an email for the following request:

${prompt}

Remember to:
- Use the brand voice and identity specified
- Include appropriate sections (hero, content blocks, CTA, footer)
- Make it engaging and conversion-focused
- Do NOT use emojis anywhere — not in subject lines, headings, body copy, or CTAs
- Return ONLY valid JSON matching the schema — no markdown, no code fences, no explanation`;

  // Try primary model with up to 2 attempts (exponential backoff on 429/5xx/overloaded)
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      if (attempt > 0) {
        const delay = Math.pow(2, attempt) * 1000; // 2s, 4s
        console.log(`Retrying with ${MODEL_PRIMARY} (attempt ${attempt + 1}) after ${delay}ms...`);
        await new Promise(res => setTimeout(res, delay));
      }
      return await tryGenerateWithModel(MODEL_PRIMARY, systemPrompt, userPrompt);
    } catch (error) {
      console.error(`Error with ${MODEL_PRIMARY} (attempt ${attempt + 1}):`, error);
      if (!isRetryableError(error) || attempt === 2) {
        // Non-retryable error or exhausted retries — fall through to fallback
        break;
      }
    }
  }

  // Fallback to fast/cheap model
  console.log(`Falling back to ${MODEL_FALLBACK}...`);
  try {
    return await tryGenerateWithModel(MODEL_FALLBACK, systemPrompt, userPrompt);
  } catch (error) {
    console.error('Error generating email with Claude:', error);
    throw error instanceof Error ? error : new Error('Failed to generate email content');
  }
}

/**
 * Build system prompt with brand context and design style
 */
function buildSystemPrompt(brandProfile: BrandProfile | null, designStyle: string): Anthropic.TextBlockParam[] {
  const currentYear = new Date().getFullYear();
  const palette = buildEmailPalette(
    brandProfile?.primary_color ?? '#5c5cf0',
    brandProfile?.background_color ?? null,
    brandProfile?.secondary_color ?? null,
  );
  // Randomized per request (not left to the model's own judgment) — the model was
  // reliably defaulting to PHOTO HERO regardless of "vary this" instructions, so
  // every email opened with the same "photo background + overlaid text" look. See
  // the HERO TREATMENT rule below, which still lets the prompt override this when
  // one treatment is clearly the better fit.
  const heroHint = Math.random() < 0.5 ? 'PHOTO HERO (treatment a)' : 'GRADIENT HERO (treatment b)';
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
- Use the brand logo URL in the header section (logoUrl) and footer section (logoUrl) only. NEVER set the hero's imageUrl to the logo, and never use it as a gallery/image-text/image-block photo — the hero and every other photo slot must use imageKeyword/backgroundImageKeyword to fetch a real photo. The logo is a small mark, not a hero visual, and it already appears in the header directly above — repeating it large in the hero reads as a mistake, not a design choice.
- Use primary color for main CTAs, headings, and key elements
${brandProfile.secondary_color ? '- Secondary color is available as the ACCENT role in the palette below — use it there, not as a raw standalone hex, so it stays contrast-checked and harmonious' : ''}
${brandProfile.background_color ? `- Use background_color (${brandProfile.background_color}) for the email body background and light section backgrounds — keeps the email visually on-brand` : ''}
${brandProfile.website_url ? `- Set all CTA button URLs to ${brandProfile.website_url} (or relevant subpages like ${brandProfile.website_url}/pricing)` : '- Use # for button URLs'}
- Maintain consistent brand voice (${brandProfile.brand_voice}) throughout all copy
- Reference the brand name naturally in content
`
    : `
BRAND PROFILE:
- No brand profile selected — write for a modern, professional company with confident, benefit-led copy. Do not sound generic or placeholder-y.
- Primary Color: #5c5cf0 (a refined indigo — use it exactly as provided in the palette below)
- Do not invent a company name. Write CTAs and copy that work without naming the sender directly — lean on second-person framing ("you", "your team", "your inbox") instead of a placeholder brand name.
- Use # for button URLs.
`;

  // Define style-specific design rules
  const styleRules: Record<string, string> = {
    simple: `
DESIGN STYLE (Simple):
- The quietest style available — reads like a well-written letter or a Stripe/Basecamp-style update, not a marketing email
- One plain sans-serif font for both headings and body — no font pairing, no decorative typefaces
- No badges, pills, tags, icon containers, card borders, or drop shadows anywhere — copy and whitespace carry the whole design
- Icons (when used) render as bare small glyphs with no colored box or border around them
- Flat buttons: solid single-color fill, no shadow, no gradient, modest corner radius
- Prefer a plain solid or very subtle gradient hero over a full-bleed photo hero — this style should almost never use a photo background; let the headline do the work
- One accent color used sparingly (links, buttons only) — everything else stays black/white/gray
- Left-aligned text throughout, including the hero — nothing centered like a marketing banner
- Generous line-height (1.6-1.7) and generous section spacing instead of visual dividers or boxes
- Feature lists and stats read as plain rows separated by a hairline, not cards
- This is the style to reach for when the brief just says "keep it simple" or "nothing fancy"`,

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
    simple:       ['Inter (neutral default)', 'IBM Plex Sans (technical plain)', 'Source Sans 3 (humanist plain)', 'Work Sans (quiet grotesque)'],
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

  // ── Static block: universal instructions, identical across every user/request/brand/color.
  // Cached with cache_control so it's read at ~0.1x cost after the first write within the TTL
  // window — shared across ALL users since Emlet calls Claude with one service-level API key.
  const staticBlock = `You are an expert email marketing copywriter and designer. Your task is to generate email content in the specified design style.

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
- Vary the HERO treatment: photo background vs. gradient-only (see HERO TREATMENT rule below) — don't default to the same one every time
- Vary feature-list presentation: grid layout vs. vertical list, icon bullets vs. numbered steps — pick based on whether the content is sequential (numbered) or parallel benefits (icons/grid)
- Alternate imagePosition ("left"/"right") across multiple image-text sections in the same email
- Vary which optional sections you include (gallery, quote, columns, code-block, testimonials vs. single testimonial) based on what actually fits the prompt's content — don't reuse the same section mix for every email of a given type

ICONS: For every feature in feature-list, every stat in stats, and every column in columns, set BOTH fields:
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
5. MINIMUM TWO IMAGES PER EMAIL — every email must contain at least two real photographic images total, counted across all sections' imageKeyword, backgroundImageKeyword, and gallery/image-block image entries (a single gallery/image-block section with 2+ images satisfies this on its own). A sparse or text-only email reads as unfinished.
   - If the HERO TREATMENT rule or the chosen design style calls for a gradient/photo-free hero, add both images elsewhere instead — two image-text sections, or one gallery/image-block section with 2+ images, are the lightest-touch options and fit even the quietest styles (Simple, Minimalist).
   - For a MINIMAL-length email (normally just header + hero + footer), still make room for two images: give the hero a photo (backgroundImageKeyword) AND add one compact image-text section (or a 2-image gallery) rather than staying at header+hero+footer only.
   - Never end up with fewer than two imageKeyword/backgroundImageKeyword/gallery/image-block values across the sections array.

COPY QUALITY RULES (non-negotiable):
1. Use SPECIFIC numbers, percentages, and timeframes — never vague claims. Write "Reduce churn by 34%" not "reduce churn significantly".
2. Every hero heading must be outcome-focused and under 8 words.
3. Every content section intro must open with a compelling hook — a surprising fact, bold claim, or direct benefit statement.
4. Every CTA button must use a value-verb: "Start Free Trial", "Claim Your Discount", "See Live Demo", "Get Instant Access" — never just "Click Here" or "Learn More" alone.
5. eyebrow labels must be 2–4 words: "New Release", "Case Study", "Limited Offer", "Just Launched", "Behind The Scenes".
6. Avoid spam-filter trigger language: no ALL-CAPS words, no excessive punctuation (!!!, ???), and avoid overused spam-flagged phrases ("FREE!!!", "Act now!!!", "100% guaranteed", "Click here", "Earn $$$", "Risk-free"). Urgency and offers are fine — write them like a real marketer, not a spam email.

FONT VARIANT — pick the pairing that best fits the email topic and brand personality. Output a "fontVariant" number (0–3) in the root JSON object.
Available variants for ${designStyle}:
${variantList}
Choose thoughtfully — consider the brand industry, campaign tone, and email content. Avoid always picking 0.

OUTPUT FORMAT:
Return a JSON object with this exact structure:
{
  "subject": "Short punchy subject line (30 characters max, ideally under 20)",
  "previewText": "Preview text shown in inbox (80-100 characters)",
  "emailType": "promotional|newsletter|educational|transactional|other",
  "fontVariant": 0,
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
          "buttonText": "Get Started",
          "buttonUrl": "#"
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
      "type": "image-block",
      "subheading": "Optional single caption line, or omit entirely",
      "images": [
        {
          "keyword": "minimal product flat lay soft studio light",
          "alt": "Image description"
        },
        {
          "keyword": "product in use lifestyle natural setting",
          "alt": "Image description"
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
        { "platform": "Twitter", "url": "https://twitter.com", "icon": "🐦" },
        { "platform": "Instagram", "url": "https://instagram.com", "icon": "📸" },
        { "platform": "LinkedIn", "url": "https://linkedin.com", "icon": "💼" }
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
- hero: Main banner — the first thing readers see. Two treatments (see HERO TREATMENT rule): PHOTO HERO sets backgroundImageKeyword + a minimal eyebrow/heading/subheading/one button (no imageKeyword — the background photo is the visual). GRADIENT HERO sets backgroundGradient (e.g. "linear-gradient(135deg, #0d1117 0%, #1a1a2e 100%)") + textColor: "#ffffff" and the full eyebrow + heading + intro + subheading + buttonText + buttonUrl, optionally with secondaryButtonText+secondaryButtonUrl for a ghost/text secondary action, and optionally imageKeyword for a small supporting image rendered above the copy (use sparingly — see HERO TREATMENT rule).
- content: Text content block. Add 'eyebrow' (e.g. "Behind The Scenes") for a small coloured label above the heading.
- testimonial: Single customer quote with author info. Include 'authorImage' URL to render a side-by-side avatar layout instead of centered card.
- testimonials: Grid of 2–4 customer quote cards (2 per row). Each item has 'quote' (required), 'author' (required), 'authorTitle', optional 'rating' (1–5 stars, default 5), and optional 'authorImage' URL. Use this instead of a single testimonial when you have multiple quotes to showcase. Add an optional 'subheading' below the main heading.
- feature-list: List of product/service features with icons and descriptions. Set 'numbered: true' for step-by-step numbered badges. Set 'layout: "grid"' for a 2-column centered card grid.
- pricing-table: Pricing tiers with features, highlight one as recommended (set 'highlighted: true' — the renderer adds a "Recommended" badge automatically). Each plan's 'buttonUrl' should point at the brand's website_url (or a relevant subpage like /pricing) same as any other CTA — do not leave it as '#' when a website_url is available.
- gallery: Padded grid of images (own thumbnail cards, own captions) — use for 3+ images, or whenever each image needs its own caption/context
- image-block: Full-bleed, edge-to-edge photo section with NO padding or card styling — a pure visual breather. Set 'images' with exactly 1, 2, or 4 entries: 1 = one large full-width photo, 2 = a side-by-side pair (great for before/after, two colorways, two lifestyle shots), 4 = a 2×2 mosaic (great for a product-variant grid, a 4-photo lifestyle story, team/location shots). Do NOT use any other count. Optionally set 'subheading' for one short caption line centered below the whole block — omit for a purely visual moment with zero text. Never put a heading or CTA on this section; that's what image-text and hero are for.
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

SECTION USAGE GUIDELINES (full-length templates for a STANDARD/RICH email — trim down per the LENGTH rule below when the request calls for something shorter):
- Product launch: header + hero + announcement (launch news) + feature-list + image-text + image-text (reversed) + stats + testimonials + pricing-table + cta + social-links + footer
- Newsletter: header + hero + content + divider + content + image-text + announcement + columns + cta + social-links + footer
- Promotional/Sale: header + hero + announcement + coupon + stats + feature-list + testimonials + pricing-table + cta + footer
- Educational: header + hero + content + quote + columns + image-text + feature-list + stats + testimonial + cta + footer
- Software/Dev: header + hero + content + code-block + feature-list + image-text + quote + stats + testimonial + cta + footer
- Social proof: header + hero + stats + testimonials + gallery + image-text + columns + cta + footer
- Product spotlight: header + hero + content + image-text + image-text (reversed) + feature-list + testimonials + cta + footer
- Welcome email: header + hero + content + columns + feature-list + testimonial + cta + social-links + footer

RULES:
1. Always include: 1 header (first section), 1 hero, at least 1 CTA, 1 footer (last section)
2. LENGTH — match the section count to the scope of the request. Do not default to the maximum every time; a short, focused ask should produce a short, focused email, not a padded one. Read the prompt for length cues (how much ground it actually covers; words like "quick"/"brief"/"simple"/"one-line" vs. "full"/"detailed"/"comprehensive") and pick one tier:
   - MINIMAL (4-5 sections total, 0-1 middle sections): a single short, focused message — a quick update, a one-line announcement, a simple confirmation/receipt-style note, or an explicit request to keep it brief. Header + hero + footer, optionally one content section. Don't force in extra sections just to pad it out.
   - STANDARD (7-9 sections total, 3-5 middle sections): the default for a typical single-purpose marketing email (one promo, one update, one feature) when the request doesn't clearly signal "minimal" or "comprehensive."
   - RICH (9-12 sections total, 5-8 middle sections): the request explicitly describes a broad campaign, multiple features/products, or asks for something detailed/comprehensive — use the SECTION USAGE GUIDELINES templates above at full length.
3. FOOTER COPYRIGHT: Always use the current year given in the CONTEXT FOR THIS EMAIL section below in footer text (e.g. "© <year> Company Name")
4. COPY QUALITY (CRITICAL — this is what separates great emails from mediocre ones):
   - hero heading: 5-10 words max, bold and punchy. Open with power words: "Finally", "Introducing", "Unlock", "Transform", "The #1", "Stop", "Discover"
   - hero subheading: 1-2 sentences, name a specific, concrete benefit. No vague filler like "take your business to the next level"
   - hero button (buttonText + buttonUrl): always add a CTA button on the hero — use the brand's website_url. Button text should be punchy ("Get started free", "Start building", "Claim your spot")
   - eyebrow field (content/hero): use sparingly for variety — 2-4 word category or section label in small caps. E.g. "What's new", "Built for teams", "Case Study", "Why it works". Provides visual hierarchy.
   - content intro field: use for a single powerful lead sentence (1 sentence max) that punches above the body text. Then use 'text' for 2-4 paragraphs separated by double-newlines (\n\n). Each paragraph should be 2-3 sentences. Total content block should feel like a magazine article — no filler.
   - secondaryButtonText: use on hero or CTA to offer a softer action alongside the primary — e.g. "Watch demo" next to "Start free trial", or "See all features" next to "Get started"
   - quote sections: the quote 'text' should be a pithy, memorable statement — either from a real-sounding customer, a thought leader, or a key insight distilled into one sentence. Make it quotable.
   - code-block sections: provide clean, real, runnable code relevant to the email topic. No pseudocode. Comment the key parts.
   - testimonials: include a specific, credible outcome in the quote (e.g. "We cut our email production time from 2 hours to 8 minutes") with a realistic name, title, and company
   - stats: use impressive but realistic numbers with context labels ("10,000+ teams trust us", "$2M+ saved by customers", "4.9 / 5 average rating")
   - feature-list: every feature needs a compelling 1-sentence benefit description — not just a label
   - columns: each column should have an icon emoji, a punchy 2-4 word heading, and a 1-2 sentence benefit description
   - CTA heading: create urgency or FOMO ("Limited time", "Join 10,000+ teams", "Don't miss out"). Button text: 2-4 words, start with an action verb
   - announcement: be specific about what's new, why it matters, and when ("Launching March 21 — early access now open")
5. BRAND PERSONALIZATION (CRITICAL):
   - Include logo in the header and footer sections only when logo_url is provided. Do NOT put the logo in the hero's imageUrl or any other photo field (imageKeyword/backgroundImageKeyword fields must describe a real photographic scene, never the logo) — the hero needs its own photo or gradient treatment, not a repeat of the header's logo.
   - Use primary_color for all main CTAs and primary design elements
   - Use the ACCENT palette role (below) for small accents, borders, and highlights — never as a large section background
   - Use background_color (if provided) as a cue for the overall email tone — the renderer will apply it as the body background automatically
   - Set all button URLs to the brand's website_url or relevant subpages
   - Weave the brand_name naturally into copy (headlines, content, CTAs)
   - Match the brand_voice tone in all written content
6. Keep subject lines as short as possible — ideally under 20 characters, hard max 30. No filler words. Punchy, direct, curiosity-driving.
7. Make CTAs clear and action-oriented
8. For sections that need photos (hero, image-text, gallery, image-block), output an "imageKeyword" (or "keyword" per entry for gallery/image-block images) — a short, specific 2-4 word English search phrase describing the ideal photo (e.g. "team meeting office", "coffee shop morning", "product packaging minimal"). Do NOT output imageUrl for non-logo images — the system will fetch real photos from Pexels using the keyword.
9. Return ONLY the JSON object, no markdown formatting
10. Adapt all content and structure to match the design style given in the CONTEXT FOR THIS EMAIL section below, perfectly
11. CRITICAL: ALL string values in the JSON must be PLAIN TEXT ONLY. Never use HTML tags, <span>, <b>, <i>, CSS styles, or any markup inside JSON string fields. The renderer will handle all styling — your job is content only.
12. NO EMOJIS anywhere in the output — not in subject lines, headings, body text, button labels, or any other field.`;

  // ── Dynamic block: brand identity, resolved color palette, and per-style rules — changes
  // every request (or at least every distinct brand/style/color combination), so it is NOT
  // cached. Always placed after staticBlock so the cached prefix stays byte-identical.
  const dynamicBlock = `${brandContext}

${designRules}

COLOR PALETTE — use ONLY these exact hex values for backgroundColor, textColor, buttonColor. NEVER invent or use any other hex colors. Every text/button role listed here (ON_DARK, ON_PRIMARY, ON_ACCENT) has already been contrast-checked against its paired background, so pairing them exactly as labeled always produces readable text — do not swap them or guess your own:
- SURFACE        (default light section bg):    "${palette.surface}"
- SURFACE_ALT    (alternate light section bg):  "${palette.surfaceAlt}"
- ACCENT_LIGHT   (feature / highlight bg):      "${palette.accentLight}"
- PRIMARY        (CTA buttons, key accents):    "${palette.primary}"
- PRIMARY_DARK   (dark/dramatic section bg):    "${palette.primaryDark}"
- ON_DARK        (text + buttons on dark bg):   "${palette.onDark}"
- ON_PRIMARY     (text + buttons on PRIMARY bg):"${palette.onPrimary}"
- ACCENT         (small highlight pops only — badges, icon backgrounds, borders, dividers, star ratings; NEVER a full section background): "${palette.accent}"
- ON_ACCENT      (text + icons on ACCENT bg):   "${palette.onAccent}"
- ACCENT_DARK    (accent hue at near-black lightness — for duotone gradients only, paired with PRIMARY_DARK; NEVER used flat as a text/badge/section color): "${palette.accentDark}"
- BODY_TEXT      (default body text):           "${palette.bodyText}"

MANDATORY EMAIL COMPOSITION RULES (non-negotiable — role names below refer to the palette above; use the matching hex value from it):
1. STRUCTURE: Required sequence: header → hero → [body sections, count per the LENGTH tier chosen above] → cta → footer. For STANDARD/RICH emails, body sections must include a mix of at least one feature-list or stats, one content or image-text, and optionally a testimonials grid (preferred over single testimonial when showing multiple quotes) or quote. An image-block section is a good optional addition for a STANDARD/RICH email that names a strong visual subject — use it as a breather between denser sections, not as a replacement for hero. For a MINIMAL email, a single content section (or none) is fine — don't force in feature-list/stats/testimonials sections that don't fit a short, focused message.
2. VISUAL RHYTHM — set backgroundColor on EVERY section using ONLY the palette above, following the 60-30-10 color-distribution principle (roughly 60% of sections read as neutral/surface, ~30% as primary-toned, ~10% — small elements only, never a full section — as the accent pop):
   - Default sections (~60% of the email): SURFACE. Alternate sections: SURFACE_ALT. Feature/highlight sections: ACCENT_LIGHT.
   - Dark dramatic sections (~30%, used sparingly for weight and contrast): PRIMARY_DARK — ALWAYS also set textColor and buttonColor to ON_DARK.
   - CTA section: PRIMARY — ALWAYS also set textColor and buttonColor to ON_PRIMARY.
   - ACCENT/ON_ACCENT (~10%): reserve for small isolated elements within an otherwise SURFACE/ACCENT_LIGHT section — a stat icon circle, a badge, a divider line, star-rating icons, a thin left border on a quote. Using ACCENT as a full section background muddies the palette — don't.
   Ideal rhythm for a 7-section email: SURFACE → SURFACE_ALT → PRIMARY_DARK → SURFACE → ACCENT_LIGHT → PRIMARY → SURFACE
   NEVER use a hex value not listed in the palette above.
3. HERO TREATMENT — this request's assigned default is ${heroHint}. Use that default unless the prompt clearly overrides it: a strongly, specifically visual prompt (names a concrete physical scene/place/product) calls for PHOTO HERO regardless of the default; a clearly SaaS/B2B/technical/financial prompt calls for GRADIENT HERO regardless of the default. If the prompt doesn't obviously call for one or the other, go with the assigned default rather than picking your own — this is what keeps hero treatment varied across different emails instead of always converging on the same look.
   a) PHOTO HERO — cinematic full-bleed background photo with an overlay. Set backgroundImageKeyword (see rule 7) and follow the MINIMAL OVERLAY TEXT RULE in rule 7.
   b) GRADIENT HERO — no full-bleed photo, a rich brand-colored gradient background — a genuinely different look, not just a smaller photo. Set backgroundGradient to a duotone blend of the two dark roles: "linear-gradient(135deg, ${palette.primaryDark} 0%, ${palette.accentDark} 100%)" — two distinct hues, both already pinned to a near-black lightness, so ON_DARK text stays readable across the whole gradient while the result looks like a genuine two-tone gradient instead of one hue fading into itself. Include the FULL hero: eyebrow + heading + intro (2 sentences) + subheading + buttonText + buttonUrl + secondaryButtonText/secondaryButtonUrl where it fits. Most of the time leave imageKeyword unset entirely (typography-led, gradient only) — only add it, as a small supporting image above the copy, when the prompt's content genuinely benefits from one. Never let that supporting image dominate the hero the way a PHOTO HERO's background does.
   Both treatments always set textColor to ON_DARK. The same duotone gradient formula (PRIMARY_DARK → ACCENT_DARK, 135deg) may also be used as backgroundGradient on a PRIMARY_DARK dramatic section or the CTA section for extra visual punch — use it occasionally, not on every dark section, so it stays a deliberate accent rather than the default.
4. CTA section must always set backgroundColor to PRIMARY and textColor to ON_PRIMARY.
5. Use feature-list with layout: "grid" and at least 4 features for product/feature emails.
6. Use stats section with 3–4 concrete metric numbers for emails about growth, performance, or social proof.
7. BACKGROUND IMAGES: When you choose the PHOTO HERO treatment (rule 3a), set backgroundImageKeyword — a cinematic 5–8 word wide-angle descriptor (e.g. "aerial city lights highway night exposure", "misty mountain valley golden sunrise fog", "minimal concrete office architecture overhead"). CTA sections MAY also include backgroundImageKeyword for visual/lifestyle brands. When set, ALWAYS pair with textColor: '#ffffff'. The renderer applies a dark gradient overlay automatically. Do NOT also set backgroundGradient.
   MINIMAL OVERLAY TEXT RULE: When a section has a background image, keep ALL overlaid content to an absolute minimum — the photo must breathe. Limit to: eyebrow (optional, 2–3 words max) + heading (5 words max) + one single-sentence subheading OR intro (not both) + one CTA button. Do NOT include secondaryButtonText on photo backgrounds. No long paragraphs, no lists, no extra fields — the image carries the visual weight, text is just a caption.

FONT VARIANT — pick the pairing that best fits the email topic and brand personality. Output a "fontVariant" number (0–3) in the root JSON object.
Available variants for ${designStyle}:
${variantList}
Choose thoughtfully — consider the brand industry, campaign tone, and email content. Avoid always picking 0.

CONTEXT FOR THIS EMAIL:
- Current year (for footer copyright): ${currentYear}
- Design style for this email: ${designStyle}`;

  return [
    { type: 'text', text: staticBlock, cache_control: { type: 'ephemeral' } },
    { type: 'text', text: dynamicBlock },
  ];
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
    'feature-list': 'heading, features (each: title, description)',
    testimonial:    'quote',
    testimonials:   'heading, subheading, testimonials (each: quote)',
    stats:          'heading, stats (each: value, label)',
    gallery:        'heading',
    'image-block':  'subheading',
    'pricing-table':'heading',
    coupon:         'heading, text, expiryText',
    columns:        'heading, columns (each: heading, text)',
    'social-links': 'heading',
    header:         'tagline',
    footer:         'text',
    divider:        'text',
    quote:          'text, author, authorTitle',
    'code-block':   'heading, subheading',
  };

  const fieldsToReturn = typeFieldGuide[section.type] || 'heading, text';

  const fullPrompt = `You are an expert email copywriter. Rewrite the content fields of a single "${section.type}" email block.

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

  async function callModel(modelName: string): Promise<Partial<EmailSection>> {
    const response = await anthropic.messages.create({
      model: modelName,
      max_tokens: 2048,
      thinking: { type: 'disabled' },
      messages: [{ role: 'user', content: fullPrompt }],
    });
    const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text');
    const text = textBlock?.text ?? '';
    const stripped = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
    const jsonMatch = stripped.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    return JSON.parse(jsonMatch[0]) as Partial<EmailSection>;
  }

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      if (attempt > 0) await new Promise(res => setTimeout(res, 2000));
      return await callModel(MODEL_PRIMARY);
    } catch {
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
 * Strip server-resolved image URLs before an email JSON goes into a prompt.
 * The model works from imageKeyword/backgroundImageKeyword only (URLs are
 * re-resolved server-side afterward regardless of what it returns — see
 * edit-email/route.ts), so sending Pexels CDN URLs (80-120+ chars each,
 * often several per email) is pure token cost with no benefit.
 */
function stripResolvedImageUrls(email: GeneratedEmail): unknown {
  return {
    ...email,
    sections: email.sections.map(({ imageUrl, backgroundImageUrl, images, ...rest }) => ({
      ...rest,
      ...(images ? { images: images.map(({ url, ...img }) => img) } : {}),
    })),
  };
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
${JSON.stringify(stripResolvedImageUrls(currentEmail))}

TASK:
Apply the user instruction to the email. You may modify ANY field — copy, colors (backgroundColor, textColor, buttonColor, backgroundGradient), layout, structure, section types, URLs (buttonUrl, secondaryButtonUrl), section order, imagePosition, numbered, layout, etc.

RULES:
1. Return the COMPLETE GeneratedEmail JSON with ALL sections (unless the instruction asks to remove some). You may add, remove, or reorder sections.
2. IMAGE KEYWORDS ONLY: output only imageKeyword / backgroundImageKeyword / gallery image keyword fields to describe desired photos — NEVER output imageUrl / backgroundImageUrl / gallery image url (those are server-resolved). To keep an existing image, copy its keyword exactly as-is from the input.
3. Preserve logoUrl and authorImage values exactly as they appear in the input.
4. Copy sectionPrompt fields exactly from the input.
5. NO emojis anywhere. Plain text only.
6. Return ONLY the JSON object — no markdown, no code fences, no explanation.`;

  async function callModel(modelName: string): Promise<GeneratedEmail> {
    const response = await anthropic.messages.create({
      model: modelName,
      max_tokens: 8192,
      thinking: { type: 'disabled' },
      messages: [{ role: 'user', content: prompt }],
    });
    const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text');
    const text = textBlock?.text ?? '';
    const stripped = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
    const jsonMatch = stripped.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    const parsed = JSON.parse(jsonMatch[0]) as GeneratedEmail;
    if (!parsed.subject || !parsed.sections?.length) throw new Error('Invalid email structure returned');
    return parsed;
  }

  // Haiku-first for this endpoint specifically: high-volume, cost-sensitive,
  // and the task is a constrained JSON edit rather than open-ended creative
  // generation, so Haiku 4.5 is usually sufficient. Sonnet 5 (MODEL_PRIMARY)
  // is the fallback on failure, not the default — the reverse of every other
  // generation function in this file, which stay Sonnet-first for quality.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      if (attempt > 0) await new Promise(res => setTimeout(res, 2000));
      return await callModel(MODEL_FALLBACK);
    } catch {
      if (attempt === 1) break;
    }
  }

  return await callModel(MODEL_PRIMARY);
}

/**
 * Test the Claude API connection
 */
export async function testClaudeConnection(): Promise<boolean> {
  try {
    const response = await anthropic.messages.create({
      model: MODEL_FALLBACK,
      max_tokens: 16,
      messages: [{ role: 'user', content: 'Say "Hello"' }],
    });
    const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text');
    return (textBlock?.text.length ?? 0) > 0;
  } catch (error) {
    console.error('Claude connection test failed:', error);
    return false;
  }
}
