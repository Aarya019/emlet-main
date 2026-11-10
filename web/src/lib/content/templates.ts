import type { DesignStyle, EmailType } from '@/lib/db/types';

/**
 * Template library: shared types, taxonomy and URL helpers. Safe to import from client code (no fs, no
 * template bodies). The template files themselves live in src/content/templates/ and are loaded only by
 * the server-only registry (templates-registry.ts).
 */

export interface TemplateMeta {
  /** URL slug and file name (src/content/templates/<slug>.ts). Lowercase letters, digits and hyphens. */
  slug: string;
  /** Page title and card title, e.g. "Retro welcome email for a record store". */
  title: string;
  /** Meta description and intro paragraph: what it is and who it suits (1-2 sentences). */
  description: string;
  /** Key into TEMPLATE_TYPES. */
  emailType: string;
  /** Key into TEMPLATE_INDUSTRIES. */
  industry: string;
  style: DesignStyle;
  /** ISO date of the last meaningful change (sitemap lastModified). */
  date: string;
  /** Fictional brand the public preview is rendered with. Users get their own brand colours when they use it. */
  brand: { name: string; primaryColor: string; secondaryColor?: string; backgroundColor?: string };
  /** Human-written guidance shown on the page: unique content, not boilerplate. */
  whenToSend: string;
  whyItWorks: string[];
  subjectIdeas: string[];
  /** Hidden from production (lists, sitemap, static pages) while true. Use for work in progress. */
  draft?: boolean;
}

interface TaxonomyEntry {
  label: string;
  /** One or two sentences for the category page (unique copy beats a generic fallback). */
  blurb: string;
}

/** Starter taxonomy. Replace/extend from reference/email-types.md; a template whose key is missing here still works (the key is humanised). */
export const TEMPLATE_TYPES: Record<string, TaxonomyEntry & { group: EmailType }> = {
  welcome: { label: 'Welcome emails', group: 'promotional', blurb: 'The first message a new subscriber or customer gets. It sets the tone, says what to expect, and gives them one thing to do next.' },
  'event-invitation': { label: 'Event invitation emails', group: 'promotional', blurb: 'Invite people to a gig, launch night, workshop or festival, with the date, place and one clear way to say yes.' },
  'product-launch': { label: 'Product launch emails', group: 'promotional', blurb: 'Announce something new: what it is, who it is for, the price and where to get it.' },
  newsletter: { label: 'Newsletter templates', group: 'newsletter', blurb: 'A regular update people look forward to, built around a few strong stories rather than a wall of links.' },
  announcement: { label: 'Announcement emails', group: 'other', blurb: 'News that is not a sale: new opening hours, a move, a milestone, a change you want people to hear from you first.' },
  'abandoned-cart': { label: 'Abandoned cart emails', group: 'promotional', blurb: 'A friendly nudge for someone who left something behind, without the guilt trip.' },
  'order-confirmation': { label: 'Order confirmation emails', group: 'transactional', blurb: 'Clear receipts and confirmations that answer "did it work?" and "when does it arrive?" at a glance.' },
  'password-reset': { label: 'Password reset emails', group: 'transactional', blurb: 'The one email nobody wants to wait for. Short, obvious, and safe.' },
};

export const TEMPLATE_INDUSTRIES: Record<string, TaxonomyEntry> = {
  'independent-retail': { label: 'Independent retail', blurb: 'Record shops, bookshops, boutiques and makers selling directly to a loyal local and online crowd.' },
  'music-and-culture': { label: 'Music and culture', blurb: 'Venues, labels, festivals, galleries and community events.' },
  'food-and-drink': { label: 'Food and drink', blurb: 'Cafes, bars, bakeries, restaurants and small food brands.' },
  'saas-and-apps': { label: 'SaaS and apps', blurb: 'Product and lifecycle emails for software, from welcome to receipts.' },
  'creators-and-newsletters': { label: 'Creators and newsletters', blurb: 'Writers, educators and solo businesses with an audience of their own.' },
};

export function humanize(key: string): string {
  const spaced = key.replace(/-/g, ' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export const typeLabel = (key: string) => TEMPLATE_TYPES[key]?.label ?? humanize(key);
export const industryLabel = (key: string) => TEMPLATE_INDUSTRIES[key]?.label ?? humanize(key);
export const typeBlurb = (key: string) =>
  TEMPLATE_TYPES[key]?.blurb ?? 'Ready-made, editable email templates you can adapt to your brand.';
export const industryBlurb = (key: string) =>
  TEMPLATE_INDUSTRIES[key]?.blurb ?? 'Ready-made, editable email templates you can adapt to your brand.';

/** A category page with fewer templates than this is "thin": kept out of search results and the sitemap. */
export const MIN_INDEXABLE_CATEGORY = 3;

/**
 * Show Templates in the site nav and footer. Off in production until the library is ready to launch
 * (about 6 good templates); flip to true in the launch commit.
 */
export const SHOW_TEMPLATES_IN_NAV = process.env.NODE_ENV !== 'production';

export const SITE_URL = 'https://www.emlet.app';

/** Static preview images made by scripts/render-template-previews.ts into public/template-previews/. */
export const previewImage = (slug: string, kind: 'thumb' | 'full') => `/template-previews/${slug}-${kind}.webp`;

export interface PreviewSize { thumbW: number; thumbH: number; fullW: number; fullH: number }
