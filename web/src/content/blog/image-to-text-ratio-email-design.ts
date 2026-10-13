import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'image-to-text-ratio-email-design',
  title: 'Image-to-Text Ratio in Email Design: Does the Old Rule Still Matter?',
  description:
    "The 80/20 rule, mostly text with a little image, got repeated for years as a spam-filter workaround. Filters mostly moved past it, but the ratio still matters for a completely different reason now.",
  date: '2026-10-13',
  readTime: '6 min read',
  category: 'Design',
  image: 'https://images.pexels.com/photos/7439136/pexels-photo-7439136.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'A laptop open on a desk showing an email inbox interface',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "The 80/20 rule shows up in nearly every \"email design best practices\" list: keep your email at least 80% text and no more than 20% image. It gets repeated so often it reads like settled law. The reasoning behind it is mostly outdated, but the rule itself still points at something real, just not the thing most people think.",
  },
  {
    type: 'h2',
    text: 'Where the rule actually came from',
  },
  {
    type: 'p',
    text: "The 80/20 guidance is a holdover from an era when spam filters leaned on keyword and pattern scanning, covered in more depth in the piece on spam trigger words. An email that was almost entirely one large image, with little or no real text for a filter to scan, looked a lot like the junk mail that era was full of: a picture of a product with no readable copy around it, designed to dodge keyword filters rather than communicate anything. Filters at the time couldn't read the text baked into an image, so an image-heavy email was, structurally, close to invisible to content-based scanning, and that opacity itself became suspicious.",
  },
  {
    type: 'h2',
    text: "Why that specific mechanism mostly doesn't apply anymore",
  },
  {
    type: 'p',
    text: "Modern filtering at Gmail, Outlook, and Yahoo weighs sender reputation and recipient engagement far more heavily than content scanning, the same shift covered in the deliverability pieces on this blog. A well-authenticated sender with an engaged list can send an image-heavy email without the ratio itself triggering a spam flag the way it might have fifteen years ago. The image-to-text rule, as a deliverability rule specifically, has mostly lost the mechanism that made it true.",
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/7014941/pexels-photo-7014941.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A camera resting on a table next to a scattered stack of printed photographs',
    caption: "An email is a lot like a photo you only get to look at once, briefly, before deciding what to do next.",
  },
  {
    type: 'h2',
    text: 'The reason the ratio still matters, just not the one on the old lists',
  },
  {
    type: 'p',
    text: "Images don't load by default in most email clients, Outlook and Gmail both block remote images until a recipient explicitly chooses to display them, and a meaningful share of recipients never bother. An email that's mostly one large image, with the actual message and call to action baked into the graphic, is functionally blank to anyone who doesn't click \"display images.\" They see a gray box, maybe a vague filename, and whatever real text happens to sit outside the image. If that's just a greeting and a footer, the recipient never actually encounters the message at all. This is the real reason the ratio still earns its keep: not spam filtering, but whether the email actually works when images are off, which happens more often than most senders assume.",
  },
  {
    type: 'h2',
    text: "What to actually check instead of counting percentages",
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Alt text on every image, written as real copy.',
        text: "Not \"image1.jpg\" or a blank tag, actual sentences that convey what the image was going to say, so a blocked-image view still communicates something.",
      },
      {
        bold: "The subject line, preview text, and opening sentence can't live inside an image.",
        text: "These are the only guaranteed-visible real estate in an inbox. If the core message only exists as text baked into a graphic, it's invisible to anyone with images off, and to anyone using a screen reader.",
      },
      {
        bold: 'The CTA should be a real button or hyperlinked text, not a flat image.',
        text: "A graphic \"Shop Now\" button with no underlying link text is unclickable and unreadable the moment images don't load, a dead end rather than a weak version of the email.",
      },
      {
        bold: 'Preview the email with images blocked before sending.',
        text: "Most email clients default to blocking remote images for senders not yet in a recipient's contacts. If the email reads as empty or confusing in that state, that's the real problem the 80/20 rule was always gesturing at.",
      },
    ],
  },
  {
    type: 'p',
    text: "Counting a literal percentage of pixels is the wrong unit, it was never really about images instead. The actual guidance, stripped of the invalid spam-filter logic that produced it, still holds: make sure your email has a real message in real text that survives the image getting blocked, which happens to a meaningful share of every send whether a filter is involved or not.",
  },
];
