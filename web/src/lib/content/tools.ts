/**
 * The tools. One entry per tool: used by the header's Tools dropdown, the /tools hub, each tool page's "related" blocks and the
 * sitemap. Every tool runs entirely in the visitor's browser (no account, no AI, no server
 * cost), so there is nothing to abuse and nothing to rate-limit.
 */

export interface ToolMeta {
  slug: string;
  name: string;
  /** One sentence for cards and the page intro. */
  tagline: string;
  /** Meta description. */
  description: string;
  /** Blog post slugs worth reading next (looked up in the blog registry at build time). */
  blogSlugs: string[];
}

export const TOOLS: ToolMeta[] = [
  {
    slug: 'subject-line-tester',
    name: 'Email Subject Line Tester',
    tagline: 'See how your subject line and preview text look in an inbox, and what might get them cut off or flagged.',
    description:
      'Free email subject line tester. Preview your subject and preview text in desktop and phone inboxes, check length, spam-sounding words, caps and punctuation, and compare alternatives.',
    blogSlugs: ['email-subject-line-length-how-many-characters', 'email-preview-text-guide', 'subject-line-hacks-mythbusting', 'spam-trigger-words-outdated-advice', 'from-name-matters-more-than-subject-line'],
  },
  {
    slug: 'email-prompt-library',
    name: 'Email Prompt Library',
    tagline: 'Ready-to-edit prompts for welcome emails, launches, events, win-backs and more. Copy one or turn it into an email.',
    description:
      'Free library of prompts for writing emails with AI: welcome emails, product launches, event invitations, abandoned carts, newsletters and more. Edit a prompt, copy it, or generate the email.',
    blogSlugs: ['product-launch-email-examples', 'event-invitation-email-examples', 'write-like-a-person-not-a-brand', 'ai-written-emails-all-sound-the-same', 'copywriting-frameworks-aida-pas-bab', 'welcome-email-sequence-what-to-send'],
  },
  {
    slug: 'email-footer-generator',
    name: 'Email Footer Generator',
    tagline: 'Build a compliant email footer with your address and an unsubscribe link, as HTML and plain text.',
    description:
      'Free email footer generator for CAN-SPAM, GDPR and CASL basics. Add your business name, postal address and unsubscribe link, then copy the HTML and plain-text footer.',
    blogSlugs: ['what-to-put-in-an-email-footer', 'gdpr-can-spam-basics-first-campaign', 'one-click-unsubscribe-what-it-is-and-how-to-set-it-up', 'gmail-yahoo-microsoft-bulk-sender-rules-small-list', 'email-deliverability-spf-dkim-dmarc-explained'],
  },
  {
    slug: 'email-signature-generator',
    name: 'Email Signature Generator',
    tagline: 'Make a clean, email-safe signature in a minute and paste it into Gmail, Outlook or Apple Mail.',
    description:
      'Free email signature generator. Choose a layout, add your details, and copy an email-safe HTML signature that works in Gmail, Outlook and Apple Mail. No account needed.',
    blogSlugs: ['email-accessibility-guide', 'html-email-font-family-stacks', 'why-your-emails-look-broken-in-gmail-outlook', 'dark-mode-email-design-what-breaks'],
  },
  {
    slug: 'html-email-checker',
    name: 'HTML Email Checker and CSS Inliner',
    tagline: 'Paste your email HTML to find what breaks in Gmail and Outlook, and inline your CSS in one click.',
    description:
      'Free HTML email checker. Paste your email code to spot Outlook and Gmail problems (flexbox, background images, web fonts, size clipping), then inline your CSS. Runs in your browser.',
    blogSlugs: ['why-your-emails-look-broken-in-gmail-outlook', 'send-html-emails-from-react-app', 'dark-mode-email-design-what-breaks', 'mobile-email-design-what-still-breaks'],
  },
];

export const toolUrl = (slug: string) => `/tools/${slug}`;

export function getTool(slug: string): ToolMeta {
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) throw new Error(`Unknown tool: ${slug}`);
  return tool;
}
