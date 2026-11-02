import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'product-launch-email-examples',
  title: 'Product Launch Email Examples: 5 Patterns to Adapt',
  description:
    "Five product launch email examples with subject lines, preview text and copy: a teaser, launch day, a founder's note, a limited run and a follow-up.",
  date: '2026-11-02',
  readTime: '7 min read',
  category: 'Copywriting',
  image: 'https://images.pexels.com/photos/6567546/pexels-photo-6567546.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'A woman looking at her phone while holding a credit card near a laptop',
};

export const cta = {
  heading: 'Turn a launch idea into a designed email',
  body: 'Describe your product and Emlet builds the email in your brand colors, ready to edit and export. Free to try, no credit card.',
};

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "A launch email is easier to write when you can see one. The five below are for made-up small businesses, each at a different point in a launch, with the subject line, preview text, copy and button written out. Treat them as patterns to adapt. The words will not fit your product, but the order of ideas usually will.",
  },
  {
    type: 'p',
    text: "If you are planning the whole launch, start with our guide to [the three-email launch sequence](/blog/product-launch-email-sequence-small-business). This post is the other half: what the individual emails can actually say.",
  },
  {
    type: 'h2',
    text: '1. The teaser, a few days before',
  },
  {
    type: 'p',
    text: "Kiln & Co. is a two-person ceramics studio about to launch a range of speckled mugs. The teaser does not sell anything. It makes the launch feel real and gives people a reason to look out for it.",
  },
  {
    type: 'ul',
    items: [
      { bold: 'Subject:', text: 'Something new is coming from the kiln' },
      { bold: 'Preview text:', text: 'First look inside, and a date for your diary.' },
      {
        bold: 'Copy:',
        text: "We have spent the autumn on something new: a small run of speckled mugs, glazed by hand and fired in our own kiln. They arrive on Friday 20 November. Until then, here is a first look at the glaze test tiles, and why we threw away forty versions to get to this one.",
      },
      { bold: 'Button:', text: 'See the first look' },
    ],
  },
  {
    type: 'p',
    text: "Why it works: it is specific (hand-glazed, forty versions, a date) and it asks for nothing. Anyone who opens it knows exactly when to come back.",
  },
  {
    type: 'h2',
    text: '2. Launch day',
  },
  {
    type: 'p',
    text: "Fieldnote Press makes stationery, and today it is opening sales on a refillable notebook. Someone who skipped the teaser should still understand the email in five seconds.",
  },
  {
    type: 'ul',
    items: [
      { bold: 'Subject:', text: 'The refillable notebook is here' },
      { bold: 'Preview text:', text: 'Buy the cover once, swap the pages forever. $24 with the first refill included.' },
      {
        bold: 'Copy:',
        text: "Most notebooks end up in a drawer when the pages run out. This one does not. The cover is vegetable-tanned leather that softens with use, and the pages clip in and out, so you buy the cover once and swap in a new refill when you need one. It is $24 with the first refill included, and it ships within three working days.",
      },
      { bold: 'Button:', text: 'Get the notebook' },
    ],
  },
  {
    type: 'p',
    text: "Why it works: the first sentence names a problem the reader recognizes, the product is described by what changes for the buyer, and the price, delivery time and next step are all visible without scrolling.",
  },
  {
    type: 'h2',
    text: "3. The founder's note",
  },
  {
    type: 'p',
    text: "Little Loaf is a neighborhood bakery launching a weekend bread subscription. For a small, personal brand, a plain first-person email can beat a heavily designed one, because it reads like a message from a person.",
  },
  {
    type: 'ul',
    items: [
      { bold: 'Subject:', text: 'A note from Marta about weekend bread' },
      { bold: 'Preview text:', text: 'Sign-ups open today, with 40 places for the first month.' },
      {
        bold: 'Copy:',
        text: "Hello, it's Marta. For years you have asked if we could save you a loaf before it sells out by ten. Starting this Saturday we can. Choose a sourdough or a seeded loaf, and we will have it wrapped and waiting every weekend. I am starting with 40 places so I can bake every one properly. If it goes well, I will open more.",
      },
      { bold: 'Button:', text: 'Save my loaf' },
    ],
  },
  {
    type: 'p',
    text: "Why it works: it begins with something customers actually said, the limit is real and explained, and the button uses the language of the product instead of \"Submit\". Our post on [CTA button copy](/blog/cta-button-copy-that-isnt-learn-more) goes further on that last point.",
  },
  {
    type: 'h2',
    text: '4. The limited run',
  },
  {
    type: 'p',
    text: "Northline makes waxed canvas bags and has made 120 of a new color. Scarcity only persuades when it is true, so say exactly what is limited and why.",
  },
  {
    type: 'ul',
    items: [
      { bold: 'Subject:', text: '120 made: the Harbour Tote in rust' },
      { bold: 'Preview text:', text: 'No restock planned. Ships from the workshop on Monday.' },
      {
        bold: 'Copy:',
        text: "We cut enough rust-colored canvas for 120 totes, and that is all we have. There is no restock planned, because the dye lot will not be repeated. Each bag is waxed by hand and numbered inside the lining, so yours will be one of 120. They start shipping on Monday.",
      },
      { bold: 'Button:', text: 'Shop the rust tote' },
    ],
  },
  {
    type: 'p',
    text: "Why it works: the number sits in the subject line, the reason for the limit is believable, and a small detail (the numbering) makes the scarcity feel real. If you later re-run a \"limited\" product, you teach readers to ignore the word.",
  },
  {
    type: 'h2',
    text: '5. The follow-up, a day or two later',
  },
  {
    type: 'p',
    text: "Most buyers do not act on the first email. A follow-up works when it adds something, and the most useful thing to add is the answer to a question people have been asking. Here Fieldnote Press writes to people who clicked on launch day but did not buy.",
  },
  {
    type: 'ul',
    items: [
      { bold: 'Subject:', text: 'Your questions about the refillable notebook' },
      { bold: 'Preview text:', text: 'Page size, refill prices and how long shipping takes.' },
      {
        bold: 'Copy:',
        text: "Since Friday, the same three questions have come up. The pages are A5 and lie flat when the notebook is open. Refills cost $9 for a pack of two. And orders placed before Sunday evening still ship this week.",
      },
      { bold: 'Button:', text: 'Get the notebook' },
    ],
  },
  {
    type: 'p',
    text: "Why it works: it goes only to people who showed interest, it reads as help instead of pressure, and the deadline is a real shipping cut-off. Our post on [reply rate](/blog/reply-rate-underused-email-metric) explains why the questions people send back are worth collecting in the first place.",
  },
  {
    type: 'h2',
    text: 'Subject line patterns for launches',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Say what it is.',
        text: "\"The refillable notebook is here\" works because the reader knows what they are opening. \"Big news!\" does not.",
      },
      {
        bold: 'Add a number or a date when it is true.',
        text: "\"120 made\" or \"opens Friday\" gives a reason to act now, as long as it is real.",
      },
      {
        bold: 'Keep the key words in the first 40 characters.',
        text: "Phones cut subjects off early, which we cover in [how many characters of a subject line actually show](/blog/email-subject-line-length-how-many-characters).",
      },
      {
        bold: 'Try a few versions.',
        text: "The free [Subject Line Tester](/tools/subject-line-tester) lets you compare alternatives side by side and see a phone-style preview.",
      },
    ],
  },
  {
    type: 'h2',
    text: 'Before you send a launch email',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Check the price, the date and the link on your phone.',
        text: "A wrong price or a dead link in a launch email is the most expensive typo you can make.",
      },
      {
        bold: 'Keep to one button.',
        text: "Repeat it once at most. A launch email with five different links splits attention.",
      },
      {
        bold: 'Write the preview text on purpose.',
        text: "If you leave it blank, the inbox shows whatever text comes first, often \"View in browser\". Our guide to [preview text](/blog/email-preview-text-guide) shows how to set it.",
      },
      {
        bold: 'Send yourself a test.',
        text: "Read it as a customer would, on a phone, with images turned off.",
      },
      {
        bold: 'Plan for replies.',
        text: "Someone will answer with a question. Answering within a day is part of the launch.",
      },
    ],
  },
  {
    type: 'p',
    text: "If you would rather start from a draft than a blank page, the [Email Prompt Library](/tools/email-prompt-library) has launch and teaser prompts you can edit, and Emlet can turn one into a designed email in your brand colors.",
  },
];
