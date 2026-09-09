import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'web-fonts-in-email-what-actually-renders',
  title: 'Web Fonts in Email: What Actually Renders, and What Silently Falls Back',
  description:
    "Drop a Google Font into an email and a meaningful share of your list will never see it. Here's exactly which clients render custom fonts, which ones fake it, and how to build a fallback stack that still looks intentional.",
  date: '2026-09-09',
  readTime: '7 min read',
  category: 'Design',
  image: 'https://images.pexels.com/photos/4348369/pexels-photo-4348369.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'An open calligraphy type specimen book next to a laptop showing a colorful lettering design',
};

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "Every few months someone on a design team notices the brand's Google Font looks perfect on the website and asks why the email still ships in Arial. The honest answer is that email HTML rendering hasn't caught up to the browser, and for a meaningful share of your list it never will, no matter what you put in the CSS. Litmus's opens-based tracking puts Apple's share of all email opens at roughly 65%, Gmail around 24%, and Outlook near 6%, though a separate survey-based methodology that counts by account rather than by open puts Apple closer to 45% and Gmail closer to 24%. Either number tells you the same thing: what happens inside Apple Mail specifically decides whether most of your list ever sees a custom font at all.",
  },
  {
    type: 'h2',
    text: 'What actually happens when you load a web font in an email',
  },
  {
    type: 'p',
    text: "In a browser, an @font-face rule fetches a font file and every modern browser complies without a second thought. Email clients aren't browsers, and several of them don't even use a browser engine to render your HTML in the first place. Outlook for Windows is the clearest example: it hands the whole job to Word's rendering engine, the same one that's been generating Outlook's HTML output since Outlook 2007, and that engine parses an @font-face declaration but never fetches the font file it points to. It just falls straight through to the next name in your font-family list.",
  },
  {
    type: 'p',
    text: "Gmail causes a more specific kind of confusion. Set font-family: 'Roboto', Arial, sans-serif and plenty of people will swear the email rendered in Roboto in Gmail, then conclude Gmail supports custom fonts. It doesn't render your @font-face rule at all. Gmail's own webmail interface already uses Roboto and a short list of other Google-owned fonts in its own stylesheet, so on the narrow occasion where the font you asked for happens to match one Gmail already ships, it looks like support that isn't actually there. Ask for a font Gmail doesn't already use internally, and the illusion disappears immediately.",
  },
  {
    type: 'h2',
    text: 'Where custom fonts actually render',
  },
  {
    type: 'table',
    headers: ['Client', 'Renders @font-face', "What's really going on"],
    rows: [
      ['Apple Mail, macOS 12.2+', '✓ Full', 'Genuine support since 2022. The most reliable client for custom fonts by a wide margin.'],
      ['Mail app, iOS 10.3+', '✓ Full', 'Same rendering engine as macOS. Covers the single largest slice of opens on most lists.'],
      ['Outlook for Windows (desktop)', '✗ None', "Rendered by Word's engine. The rule is parsed but the font file is never fetched."],
      ['New Outlook / Outlook.com', '✗ None', 'A modern rebuild that still strips remote font files.'],
      ['Gmail, web and app', '✗ None', 'Only appears to work when the requested font name happens to match one Gmail already uses internally.'],
      ['Yahoo Mail / AOL', '~ Partial', 'Works in some app versions, inconsistent enough to treat as unreliable.'],
      ['Samsung Email', '~ Partial', 'Works in some configurations, known to break entirely on Microsoft-hosted accounts.'],
    ],
    caption: "Support data compiled from Caniemail's @font-face compatibility tracking, current as of 2026.",
  },
  {
    type: 'h2',
    text: 'Build the fallback stack like the custom font is a bonus, not a requirement',
  },
  {
    type: 'p',
    text: "Because a large share of your list will never see the custom font no matter what you do, the only workable approach is to write every font-family declaration as an ordered stack: the web font first, one or two widely installed fonts that share a similar width and personality next, then a generic keyword (sans-serif or serif) as the true last resort. A stack like 'Poppins', Arial, Helvetica, sans-serif tells every client: try Poppins, if that's not available try Arial, if that's not available try Helvetica, and if none of those exist, fall back to whatever sans-serif the system defaults to.",
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/9017615/pexels-photo-9017615.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: "Wooden letterpress type blocks arranged next to a page stamped with the word 'truthful'",
    caption: 'A fallback stack works the same way an old type case did: if the exact letter you want isn\'t in the drawer, you reach for the closest one that still reads clearly.',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Outlook needs one extra line to behave.',
        text: "Add mso-font-alt: 'Arial'; next to the font-family declaration on the same element. Outlook for Windows will then use Arial as its specific substitute instead of silently defaulting to Times New Roman, which is what it does when it can't resolve a font and isn't told otherwise.",
      },
      {
        bold: "Check your own list's client mix before deciding.",
        text: "Most ESPs report an opens-by-client breakdown. A consumer list skewing heavily toward Apple Mail will actually render a custom font for a real majority of opens; a B2B list running through corporate Outlook mostly won't, no matter how carefully you build the stack.",
      },
      {
        bold: 'Reserve the custom font for headlines, not body copy.',
        text: "A headline that falls back to a different sans-serif is barely noticeable. A full paragraph that swaps typefaces mid-read looks like something broke, even though it didn't.",
      },
    ],
  },
  {
    type: 'h2',
    text: 'So is it worth bothering with at all',
  },
  {
    type: 'p',
    text: "The advice that circulates most is a blanket \"never use custom fonts in email,\" and that overcorrects. If your list genuinely skews Apple-heavy, which is common for consumer and lifestyle brands and less common for lists dominated by corporate Outlook accounts, a well-chosen web font will render correctly for a real majority of opens, not a rounding error. The mistake isn't using a custom font, it's using one without a fallback stack that was actually written on purpose, and finding that out for the first time when a customer screenshots an email that rendered in Times New Roman.",
  },
];
