import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'html-email-font-family-stacks',
  title: 'The Right Font-Family Stack for HTML Email (and Why the Order Matters)',
  description:
    "Copy-paste font-family stacks for HTML email, plus the actual mechanism that decides which font in your stack shows up in a given recipient's inbox and which ones never get a chance.",
  date: '2026-09-09',
  readTime: '6 min read',
  category: 'Design',
  image: 'https://images.pexels.com/photos/14553705/pexels-photo-14553705.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'Lines of HTML and CSS code displayed on a dark code editor screen',
};

export const cta = {
  heading: 'Skip hand-writing the stack',
  body: 'Emlet writes a complete, correctly quoted, correctly ordered font-family stack into every email it generates, matched to your brand, so there\'s nothing to copy from a blog post.',
};

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "Most email templates start with font-family: Arial, Helvetica, sans-serif, and nobody on the team could tell you why those three names, in that order, over any other combination. The order isn't decoration. It's a fallback sequence, and getting it wrong is exactly why some emails render in Times New Roman for no reason anyone can immediately explain.",
  },
  {
    type: 'h2',
    text: 'How a font stack actually resolves',
  },
  {
    type: 'p',
    text: "A font-family declaration is a priority list, not a single choice. Whichever rendering engine a given client happens to use reads the first name, checks whether a font by that exact name is installed or already loaded, and if not, moves to the next name, and the next, until it either finds a match or reaches the final generic keyword (sans-serif, serif, or monospace), which every client maps to some default installed font of that general shape. Leave off the generic keyword at the end and you're gambling on the recipient's device having at least one of your named fonts installed, which for an older Android phone or a Linux desktop running a non-Google mail app is a real risk, not a theoretical one.",
  },
  {
    type: 'h2',
    text: 'Ready-to-use stacks',
  },
  {
    type: 'table',
    headers: ['Goal', 'Stack', 'Use it for'],
    rows: [
      ['Neutral, safest option', 'Arial, Helvetica, sans-serif', 'Body copy, transactional emails, anywhere you want zero rendering surprises.'],
      ['Editorial, premium feel', "Georgia, 'Times New Roman', Times, serif", 'Newsletters and long-form writing that wants to read as considered rather than templated.'],
      ['Friendly, slightly rounded', "'Trebuchet MS', Verdana, Arial, sans-serif", 'Consumer brands that want a bit more personality than Arial without leaving web-safe territory.'],
      ['System-native, feels like the OS', "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", 'Product and transactional emails that want to feel native rather than like a marketing send.'],
      ['Monospace, technical tone', "'Courier New', Courier, monospace", 'Code snippets, changelogs, developer-facing product updates.'],
    ],
    caption: 'Every stack here ends in a generic keyword on purpose. That\'s the line that actually guarantees a fallback exists.',
  },
  {
    type: 'h2',
    text: 'If you want a real custom font in that first slot',
  },
  {
    type: 'p',
    text: "Nothing stops you from putting a web font first in any of these stacks, for example 'Poppins', Arial, Helvetica, sans-serif. Just treat everything after the first name as what most of your list will actually see. Roughly a third to over half of email opens, depending on whose methodology you trust, will render a correctly embedded web font; the rest render whichever fallback comes next. Which clients actually render a custom font and which silently substitute is its own mechanism, different enough from plain font-family stacking that it's worth understanding on its own before you commit a brand headline to a font a large part of your list will never see.",
  },
  {
    type: 'h2',
    text: 'The naming detail that breaks stacks silently',
  },
  {
    type: 'p',
    text: "Multi-word font names need quotes: 'Times New Roman', not Times New Roman unquoted. Without quotes, some rendering engines read Times, New, and Roman as three separate, mostly nonexistent font names, and quietly skip straight to the next entry in the stack. It's a one-character fix that's easy to miss, because the email still renders, it just renders one step further down the fallback list than intended, which is the kind of bug that never throws an error and just makes an email look slightly off in a way nobody can immediately name.",
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/574069/pexels-photo-574069.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A hand typing on a laptop keyboard with lines of code visible on the screen',
    caption: "The stack is a list of fallbacks, but the syntax around each name, quotes, commas, the generic keyword, decides whether a client ever reads past the first entry correctly.",
  },
  {
    type: 'p',
    text: "One more thing worth checking before a send goes out: the stack should be identical across every element that shares a visual style, headers, body text, buttons. A stack that's quoted correctly in one place and unquoted in another will render consistently in some clients and inconsistently in others, and the inconsistency is the kind of thing a recipient notices without being able to say exactly why.",
  },
];
