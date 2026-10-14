import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'ps-line-email-copywriting',
  title: 'The P.S. Line: An Old Direct-Mail Trick, Does It Still Work in Email?',
  description:
    "Direct-mail copywriters leaned on the postscript for decades because readers skip straight to it. The mechanism behind that habit is still true in an inbox, it just shows up in a slightly different place.",
  date: '2026-10-14',
  readTime: '6 min read',
  category: 'Copywriting',
  image: 'https://images.pexels.com/photos/11341894/pexels-photo-11341894.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'A handwritten note reading "Thank you" next to a pen',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "Direct-mail copywriters have leaned on the P.S. line for most of a century, and the reasoning behind it was never really about the letters \"P.S.\" It was about reading behavior: when someone skims a printed letter, their eye jumps to the signature and whatever sits right below it before it ever commits to the body copy. A postscript sitting in that exact spot gets read by people who were never going to read the rest.",
  },
  {
    type: 'h2',
    text: 'Why it worked in direct mail specifically',
  },
  {
    type: 'p',
    text: "A printed letter is scanned top to bottom and bottom to top almost simultaneously. Readers check the opening line to see if it's worth their time, then the signature to see who it's from, and the P.S. sits close enough to the signature that it gets caught in that same glance. Classic direct-mail testing, going back to copywriters like John Caples, consistently found the P.S. among the most-read lines on the entire page, often beating lines buried in the middle of the body copy by a wide margin, simply because of where it physically sat.",
  },
  {
    type: 'h2',
    text: "Why the mechanism doesn't transfer directly to email",
  },
  {
    type: 'p',
    text: "Email doesn't have the same physical scan pattern a printed page does. There's no signature sitting at a fixed, scannable position the way there is on paper, and most recipients never reach the actual bottom of a marketing email at all, they decide whether to keep reading within the first couple of sentences, closer to the behavior covered in the piece on writing for skimmers. A P.S. buried at the very bottom of a long promotional email is invisible to anyone who already stopped reading two paragraphs up, which is most people.",
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/15873606/pexels-photo-15873606.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A pile of vintage airmail envelopes with colorful striped borders',
    caption: "The P.S. line earned its reputation on paper, where a reader's eye had a predictable place to land.",
  },
  {
    type: 'h2',
    text: "Where the same underlying idea still earns its keep",
  },
  {
    type: 'p',
    text: "The P.S. line was never really about those two letters, it was a device for putting the single most important point somewhere a skimming reader would actually see it, separate from a dense wall of body copy. That underlying idea still holds in email, it just needs a different placement to work. A short, visually distinct line, set apart from the surrounding paragraph, placed near the top rather than buried at the bottom, does the same job a P.S. did on paper: it catches someone who's skimming rather than reading in full.",
  },
  {
    type: 'h2',
    text: 'How to actually use it in an email',
  },
  {
    type: 'ul',
    items: [
      {
        bold: "A literal \"P.S.\" can still work, but only right above or right below the main CTA, never at the true bottom.",
        text: "If a promotional email is short enough that a P.S. after the sign-off is still visible without scrolling past where most readers stop, it works close to the original mechanism. In anything longer, that placement is functionally invisible.",
      },
      {
        bold: 'A one-line callout near the top does the same job for longer emails.',
        text: "A short, visually set-apart sentence restating the single most important point, a deadline, the core offer, what happens if they do nothing, placed where a skimmer's eye actually lands, not at the bottom of content they'll never scroll to.",
      },
      {
        bold: "Use it for the one thing that matters most, not a second CTA.",
        text: "The original P.S. worked because it carried the single most persuasive point in the letter, not an afterthought. A line that just repeats \"buy now\" in different words wastes the position; a line that adds the one fact most likely to tip a skimmer's decision, a guarantee, a scarcity detail, a concrete number, is doing what the device was actually for.",
      },
      {
        bold: "Test placement before assuming it doesn't work.",
        text: "Because the direct-mail version relied on a scan pattern email doesn't replicate, the honest answer for any specific list is to test a near-top callout against no callout at all, rather than assuming either the old trick or its absence is correct by default.",
      },
    ],
  },
  {
    type: 'p',
    text: "The P.S. line, taken literally, is a print-era habit that doesn't automatically carry over, and plenty of \"always add a P.S. to your emails\" advice skips that distinction entirely. The actual insight behind it, that a skimming reader needs the single best point placed somewhere they'll actually see it, is still completely valid. It just needs to move to wherever your specific audience's eyes actually go, and for most inboxes, that's closer to the top than the bottom.",
  },
];
