import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'mobile-email-design-what-still-breaks',
  title: 'Mobile Email Design: The Specific Things That Still Break on Phones',
  description:
    "Most opens happen on a phone, and most email design still gets built and approved on a desktop monitor. The gap between those two things shows up in a handful of specific, fixable spots.",
  date: '2026-10-15',
  readTime: '7 min read',
  category: 'Design',
  image: 'https://images.pexels.com/photos/7679634/pexels-photo-7679634.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'A person holding a smartphone in one hand while typing on a laptop',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "More than half of all email opens happen on a phone, and have for years. Most emails still get designed, reviewed, and approved on a desktop monitor, by someone looking at a 600px-wide preview that renders nothing like what actually shows up on the device most recipients are actually using. The gap between those two things isn't abstract, it shows up in a short list of specific, repeatable failures.",
  },
  {
    type: 'h2',
    text: "Tap targets sized for a cursor, not a thumb",
  },
  {
    type: 'p',
    text: "A mouse cursor is a single precise pixel. A thumb is not. Apple's own interface guidelines recommend a minimum touch target around 44x44 points, and a button or link designed at desktop scale, a small text link, a tightly-padded button, a row of social icons crammed together, regularly falls well under that on a phone screen. The result isn't that the link doesn't work, it's that the wrong link works: a recipient aiming for \"Shop Now\" taps the icon next to it instead, gets frustrated, and closes the email. This is one of the easiest things to check and one of the most commonly skipped, because it looks completely fine from the reviewer's desktop view.",
  },
  {
    type: 'h2',
    text: 'Multi-column layouts that force horizontal scrolling or pinch-zoom',
  },
  {
    type: 'p',
    text: "A two- or three-column product grid that looks clean at 600px wide often doesn't scale down gracefully on a 375px phone screen unless the email was actually built with responsive breakpoints, media queries that collapse columns into a single stack below a certain width. Without that, columns either shrink to the point of being unreadable or force the recipient to scroll sideways or pinch-zoom, both of which are enough friction that most people just stop reading instead. This is the single biggest structural difference between an email that was actually built mobile-first and one that was built for desktop and just \"should probably still work.\"",
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/17801590/pexels-photo-17801590.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A close-up of a thumb tapping a smartphone screen',
    caption: "The gap between a cursor click and a thumb tap is where a surprising share of mobile email friction actually lives.",
  },
  {
    type: 'h2',
    text: 'Body text set at desktop-reading sizes',
  },
  {
    type: 'p',
    text: "Text that's comfortably readable at 13-14px on a 24-inch monitor is noticeably smaller on a phone held at arm's length, and most mobile clients won't auto-scale it the way a mobile web page does. A body font under roughly 14px, and ideally closer to 16px for the main message, reads as genuinely small on a phone, which pushes recipients toward skimming even faster than they already do, the behavior covered in the piece on writing for skimmers. This is a one-line CSS fix, and it's astonishing how often it just never gets checked on an actual device.",
  },
  {
    type: 'h2',
    text: "Preview text that gets cut off at a different length than you tested",
  },
  {
    type: 'p',
    text: "Preview text length limits differ meaningfully between clients and between desktop and mobile versions of the same client, iOS Mail shows noticeably less preview text than the Gmail desktop web view does, for instance. Copy written and approved by checking how it looks in one client's desktop preview can get truncated mid-sentence, or in a way that changes the meaning, on the mobile client most recipients are actually using. The fix isn't a universal character count, it's checking the specific preview text on an actual phone before sending, not just trusting how it rendered in whatever tool built the email.",
  },
  {
    type: 'h2',
    text: 'A short, practical checklist',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Buttons and links at least 44x44px, with real spacing around them.',
        text: "Especially anywhere multiple tappable elements sit close together, like social icons or a row of secondary links.",
      },
      {
        bold: 'Single-column layout below roughly 480-600px, built with actual responsive breakpoints.',
        text: "Not a layout that merely shrinks proportionally and hopes for the best.",
      },
      {
        bold: 'Body text at 16px, headers meaningfully larger, nothing load-bearing under 14px.',
        text: "If a size looks fine on a monitor, assume it needs to go up, not stay the same, for a phone screen.",
      },
      {
        bold: 'Send a real test to a real phone before every send, not just a desktop preview tool.',
        text: "Most ESPs and email builders have a one-click test-send feature. Using it on the actual device most of your list reads on catches problems a desktop preview simply can't show.",
      },
    ],
  },
  {
    type: 'p',
    text: "None of these are new ideas, mobile-responsive email design has been standard advice for a decade. What's still true in 2026 is that a meaningful share of commercially sent email doesn't actually follow it, not because the advice is unknown, but because the person approving the email is looking at a desktop screen, where everything already looks fine. The fix isn't more design opinions, it's testing on the device the majority of your list is actually using.",
  },
];
