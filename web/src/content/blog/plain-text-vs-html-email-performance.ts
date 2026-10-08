import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'plain-text-vs-html-email-performance',
  title: 'Plain Text vs HTML Email: Does Format Actually Change Performance?',
  description:
    "\"Plain text gets better deliverability\" is repeated so often it's treated as settled. The mechanism behind it is mostly outdated. Here's what the format actually changes, and what it doesn't.",
  date: '2026-10-08',
  readTime: '6 min read',
  category: 'Email Marketing',
  image: 'https://images.pexels.com/photos/32836045/pexels-photo-32836045.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'A close-up of typewriter keys',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "\"Switch to plain text, it gets better deliverability\" is one of the most repeated pieces of email advice, and it's mostly built on a mechanism that doesn't work the way people think it does anymore. It's worth separating what format actually changes from what it used to change, since those aren't the same list.",
  },
  {
    type: 'h2',
    text: "Why the deliverability claim exists, and why it's weaker than it sounds",
  },
  {
    type: 'p',
    text: "Older spam filters leaned heavily on surface-level signals: heavy HTML, lots of links, embedded tracking pixels, all patterns that correlated with spam at the time. A plain-text email naturally avoided most of those triggers, so the association between plain text and better inbox placement had a real mechanism behind it. Modern filtering, the kind Gmail and Outlook actually run today, weighs engagement history and sender authentication (the SPF, DKIM, and DMARC setup covered in a separate guide) far more heavily than raw format. A well-authenticated HTML email from a sender with strong engagement will out-deliver a plain-text email from a sender with neither, every time. Format alone is a weak signal next to those.",
  },
  {
    type: 'h2',
    text: 'What format actually changes: how it reads, not whether it arrives',
  },
  {
    type: 'p',
    text: "Where format genuinely matters is perception, not the spam filter. A plain-text-looking email reads as something a person wrote to another person, which is exactly why founder updates, B2B outreach, and personal-feeling newsletters tend to perform well in that format: it doesn't visually announce itself as a marketing blast before a word is read. HTML buys you something plain text structurally can't: visual hierarchy, bold and color used deliberately, a real button instead of a bare link, all the scannable-skeleton techniques that help a reader get the gist in a few seconds. For a product launch or anything that depends on actually showing something, a photo, a layout, a price, plain text isn't a stylistic choice, it's a missing capability.",
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/4252518/pexels-photo-4252518.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'Layered translucent colored shapes forming a geometric pattern',
    caption: "HTML buys visual hierarchy. Plain text buys the feeling that a person wrote it. Neither is free.",
  },
  {
    type: 'h2',
    text: "The middle ground most senders actually use",
  },
  {
    type: 'p',
    text: "Strictly plain text, the literal text/plain MIME type with zero markup, is rarer in practice than the term suggests. Most of what gets called \"plain text\" from a real ESP is simple, minimally styled HTML designed to look like plain text: a single column, one font, no images, often still carrying a tracking pixel so opens and clicks stay measurable. That's not a compromise worth feeling bad about, it's usually the right default: most of the authenticity benefit of plain text, without giving up the ability to see whether anyone's actually reading.",
  },
  {
    type: 'h2',
    text: "The actual decision: match format to the relationship, not a universal rule",
  },
  {
    type: 'p',
    text: "Neither format is categorically better, which is exactly why the debate keeps resurfacing in absolute terms it was never going to resolve in. A newsletter built around one person's voice usually benefits from staying close to plain text, since the format matches the relationship it's trying to build. A visual or product-led campaign needs real HTML, because the thing being sold depends on being seen, not just described. If you're genuinely unsure which your audience responds to, this is exactly the kind of test worth running: format is a large enough difference to show a real signal even on a smaller list, unlike a lot of the smaller tweaks that need far more volume to trust.",
  },
];
