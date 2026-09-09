import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'email-preview-text-guide',
  title: 'Preview Text: The 40 Characters Most Senders Leave to Chance',
  description:
    "The line of text sitting next to your subject line in the inbox is either doing work or leaking your logo's alt text. How preview text actually gets pulled, the character limits by client, and the hidden-preheader trick that fixes it.",
  date: '2026-09-09',
  readTime: '6 min read',
  category: 'Copywriting',
  image: 'https://images.pexels.com/photos/20716656/pexels-photo-20716656.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'A smartphone displaying the Gmail app logo, resting on a wooden desk',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "Open an inbox and look at what's actually sitting next to a subject line: a second line of gray text, the preview text, sometimes called the preheader. Most senders never touch it on purpose, which means most inboxes are currently showing something like \"View this email in your browser\" or a stray line of a logo's alt text, right there in the one moment a recipient decides whether to open the email at all.",
  },
  {
    type: 'h2',
    text: 'Where that text actually comes from',
  },
  {
    type: 'p',
    text: "Unless you tell it otherwise, an email client pulls preview text from the first visible text it finds in the HTML body, in document order. That's usually whatever sits at the very top of your template: a \"view in browser\" link, a logo's alt text if images are blocked, or the first line of body copy if the template has no header at all. None of that was written to be read as a standalone sentence next to a subject line. It just happens to come first in the markup.",
  },
  {
    type: 'h2',
    text: 'How much of it actually shows',
  },
  {
    type: 'table',
    headers: ['Client', 'Approx. characters shown'],
    rows: [
      ['Gmail, desktop', '90 to 119'],
      ['Gmail, mobile app', '40 to 90'],
      ['Apple Mail, macOS', 'Up to 140'],
      ['Apple Mail, iPhone', 'Up to 90'],
      ['Outlook, desktop', '35 to 55'],
      ['Yahoo Mail', '40 to 50'],
    ],
    caption: 'Ranges vary by screen width, font size settings, and subject line length, so treat these as approximate, not exact.',
  },
  {
    type: 'p',
    text: "The ranges are wide because preview text length isn't set by a fixed character count. It's set by however many characters fit in the pixel width a client allocates, which shifts with screen size and the recipient's own font-size settings. The practical implication holds regardless of the exact number: write the part that matters in the first 40 to 50 characters, since that's the range that survives almost everywhere, and treat anything past that as a bonus for the clients with more room.",
  },
  {
    type: 'h2',
    text: 'The hidden-preheader trick',
  },
  {
    type: 'p',
    text: "The fix most senders reach for is a small block of text, styled to stay invisible in the email body itself but positioned first in the HTML, so the client picks it up as preview text instead of a browser link or a logo's alt text. It's usually hidden with a stack of properties rather than a single one, font-size:1px; line-height:1px; max-height:0; overflow:hidden; opacity:0, since a few clients ignore any single property on its own and need the combination to actually suppress it.",
  },
  {
    type: 'p',
    text: "That alone doesn't fully solve it. If the hidden preview text is shorter than the character count a given client displays, the client keeps reading past it into whatever comes next in the HTML, usually surfacing that same \"view in browser\" line right after the sentence someone actually wrote. The standard patch is padding the hidden block with a repeating chain of invisible characters, non-breaking spaces and zero-width non-joiners (&nbsp; and &zwnj;), long enough to fill the remaining character allowance so the client runs out of room before reaching anything else. One widely cited version of this pattern also adds two additional entities, figure spaces and soft hyphens, specifically because those still render as invisible in Yahoo and in iOS Mail versions where some of the more common entities stopped being reliable.",
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/5253856/pexels-photo-5253856.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A woman smiling while reading a message on her smartphone',
    caption: 'The preview line is competing for maybe a second and a half of attention before someone decides to open, skip, or delete.',
  },
  {
    type: 'h2',
    text: 'What to actually put there',
  },
  {
    type: 'ul',
    items: [
      {
        bold: "Don't restate the subject line.",
        text: "If the subject already said it, repeating it in the preview wastes the only other line of text you get before someone decides. Use it to add the detail the subject line didn't have room for.",
      },
      {
        bold: 'Front-load the specific detail.',
        text: "Since the visible portion gets cut off inconsistently across clients, put the concrete part, a number, a name, a deadline, in the first 40 to 50 characters rather than easing into it.",
      },
      {
        bold: 'Treat it like a second, shorter subject line, not a caption.',
        text: "A caption describes the email. A second subject line gives someone a new reason to open it. Write for the second one.",
      },
    ],
  },
  {
    type: 'p',
    text: "One caveat worth knowing and not overreacting to: recent versions of Apple Mail can replace preview text entirely with an AI-generated summary of the email's content, and there's no reliable per-email way to opt out of it today. That's a reason to keep the actual opening line of body copy clear and front-loaded too, not just the hidden preheader, since on a growing share of iPhones, the preview text someone wrote might not be what actually shows.",
  },
];
