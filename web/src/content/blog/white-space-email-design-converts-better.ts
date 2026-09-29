import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'white-space-email-design-converts-better',
  title: 'White Space in Email Design: Why More Empty Space Usually Converts Better',
  description:
    "Cramming more into an email feels like getting more value out of the send. The data points the other way: whitespace measurably improves comprehension, and one well-known case study saw a 232% conversion lift from removing clutter around a single CTA.",
  date: '2026-09-29',
  readTime: '6 min read',
  category: 'Design',
  image: 'https://images.pexels.com/photos/8092466/pexels-photo-8092466.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'A minimalist white desk with a small flower vase, chair, and phone, surrounded by empty space',
};

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "There's a specific instinct behind a cluttered email: more space feels like wasted space, so a second offer, a third CTA, and one more paragraph all get added because leaving room empty feels like leaving value on the table. The data on this runs the other way. Empty space isn't wasted, it's what makes the content around it legible enough to actually register.",
  },
  {
    type: 'h2',
    text: 'What whitespace actually does to comprehension',
  },
  {
    type: 'p',
    text: "A frequently cited study (Lin, 2004, via Human Factors International) found that adding whitespace between paragraphs and in the left and right margins increased reading comprehension by almost 20%. Separately, a 2012 MIT study found that people rate clean, balanced interfaces as more credible than cluttered ones, a trust effect, not just a readability one. Neither finding is about email specifically, but the mechanism transfers directly: an inbox is already a low-attention environment, and anything that makes the content easier to process in the few seconds someone gives it works in your favor twice, once for comprehension and once for how trustworthy the message feels.",
  },
  {
    type: 'h2',
    text: 'The case study worth knowing, with the caveat attached',
  },
  {
    type: 'p',
    text: "The number that gets cited most in this conversation is a VWO case study where reducing clutter and adding white space around a call to action produced a 232% increase in conversions. That's a genuinely large result, and it's also a single case study on a single page, not a universal multiplier you can expect to replicate. What it does demonstrate reliably is the direction of the effect and roughly the scale it can reach when a CTA was previously buried in visual noise. Treat 232% as \"this can matter more than it sounds like it should,\" not as a number to promise in a deck.",
  },
  {
    type: 'h2',
    text: 'Two kinds of whitespace, and both matter',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Micro whitespace: the space inside and between lines of text.',
        text: "Line height in the 1.4 to 1.6x font-size range is the commonly cited sweet spot for body copy. Tighter than that strains the eye; looser starts to feel disconnected rather than airy.",
      },
      {
        bold: 'Macro whitespace: the space between sections, images, and blocks.',
        text: "This is what actually lets a skimming reader's eyes jump cleanly from one section to the next. Cramped section spacing makes an email read as one undifferentiated wall even if the content itself is well organized.",
      },
      {
        bold: 'Padding around anything clickable.',
        text: "A commonly used baseline is at least 24px of padding on all sides of a CTA button, with 40 to 60px of margin separating it from surrounding content. Beyond aesthetics, more space around a tap target measurably reduces mis-clicks on mobile, which is a conversion factor in its own right.",
      },
    ],
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/8146213/pexels-photo-8146213.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A spacious, minimally furnished room with light wood floors and white walls',
    caption: "The same principle scales up: a layout with room to breathe reads as more considered, not less complete.",
  },
  {
    type: 'h2',
    text: "The instinct to fill space is usually about the sender, not the reader",
  },
  {
    type: 'p',
    text: "Worth naming directly: the pressure to fill an email edge-to-edge almost always comes from the sender's side of the relationship, one more product to feature, one more link in case the first one doesn't land, one more paragraph to make the send feel substantial enough to justify writing it. None of that pressure comes from the reader, who's giving the email a handful of seconds and benefits from less to process, not more. A shorter email with one clear ask and real room around it usually outperforms a denser one covering more ground, because the denser version is optimizing for what the sender wants to include, not for what the reader can actually take in.",
  },
  {
    type: 'p',
    text: "None of this is an argument for a mostly-blank email as a design flex. The point isn't emptiness for its own sake, it's that space is doing real work: it's what separates one idea from the next clearly enough that a skimming reader can tell them apart, and what makes a single CTA read as the obvious next step instead of one option competing with four others for the same few seconds of attention.",
  },
];
