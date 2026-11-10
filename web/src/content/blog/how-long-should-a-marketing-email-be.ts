import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'how-long-should-a-marketing-email-be',
  title: 'How Long Should a Marketing Email Be? A Practical Answer',
  description:
    "Short emails and long emails both win, depending on what they are for. Here is how to decide the right length for the message in front of you, and how to cut a draft without losing the point.",
  date: '2026-11-01',
  readTime: '6 min read',
  category: 'Copywriting',
  image: 'https://images.pexels.com/photos/6958526/pexels-photo-6958526.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'A hand highlighting text in a printed document with a teal highlighter',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "\"Keep emails short\" is advice almost everyone has heard, and it is only half true. A three-line email can be perfect for a flash sale and useless for a product people need to understand before they buy. The better question is not how long an email should be, but how much it needs to say to get one specific thing done.",
  },
  {
    type: 'h2',
    text: 'Length follows the job',
  },
  {
    type: 'p',
    text: "Start from what you want the reader to do, and from how much they already know and trust you. The more effort or money the ask involves, and the less the reader knows, the more you usually need to explain. The shorter the ask and the warmer the relationship, the less you need.",
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Short (a few lines):',
        text: "reminders, flash sales to a warm list, event day-of notes, shipping updates, and replies. One idea, one action.",
      },
      {
        bold: 'Medium (roughly 100 to 250 words):',
        text: "most promotional emails, product announcements and welcome emails. A hook, the main benefit, a bit of proof, and a clear button.",
      },
      {
        bold: 'Long (several hundred words or more):',
        text: "a higher-priced product, something people are unsure about, a story that builds trust, or an educational newsletter people signed up for. Length works when each paragraph earns its place.",
      },
    ],
  },
  {
    type: 'p',
    text: "Those word counts are rules of thumb, not research findings. Studies on email length point in different directions and depend heavily on the audience and the offer, so treat any single number with caution and test with your own list.",
  },
  {
    type: 'h2',
    text: 'Why people say short wins, and when it does not',
  },
  {
    type: 'p',
    text: "Most emails are read quickly and on a phone, so a message that is easy to scan has an advantage. Our post on [writing for skimmers](/blog/writing-for-skimmers-how-people-read-email) covers how people actually read. But a short email that leaves the important question unanswered does not save the reader time, it just moves the work to a click, or to a decision not to bother. A long email that is clearly structured, with short paragraphs and a button near the top, can still be quick to skim and complete when someone wants detail.",
  },
  {
    type: 'h2',
    text: 'A way to cut a draft',
  },
  {
    type: 'p',
    text: "If you are not sure whether a draft is too long, try this before sending:",
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Write the one-sentence point.',
        text: "If you cannot say what the email is for in one sentence, it is probably trying to do too much.",
      },
      {
        bold: 'Delete the warm-up.',
        text: "The first paragraph often restates the subject line or apologises for emailing. Start where the real message starts.",
      },
      {
        bold: 'Keep one idea per paragraph.',
        text: "If a paragraph has two ideas, split it, or cut the weaker one.",
      },
      {
        bold: 'Cut what the reader already knows.',
        text: "Anything a regular customer would skip is a candidate for removal or a link.",
      },
      {
        bold: 'Move the extra to a link.',
        text: "Specs, long FAQs and history can live on a page. The email's job is to get the reader there.",
      },
    ],
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/7596911/pexels-photo-7596911.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A person marking up a printed document with a red pen',
    caption: "Editing is mostly deleting: read your draft as the reader and mark everything they would skip.",
  },
  {
    type: 'h2',
    text: 'And when you should add instead',
  },
  {
    type: 'p',
    text: "If your emails are short and results are weak, the problem may be missing substance, not extra words. Look for a missing reason to believe you (a quote, a number, a guarantee), a missing detail the reader will otherwise email about (price, delivery, what is included), or a missing next step. Those are worth adding even if they make the email longer.",
  },
  {
    type: 'h2',
    text: 'Test it on your own list',
  },
  {
    type: 'p',
    text: "The most reliable answer is the one your own audience gives. Send a short and a longer version of the same message to two halves of your list and compare clicks and replies, not just opens. With a small list, run the test a few times before drawing a conclusion, which our post on [testing with small lists](/blog/ab-testing-small-list-statistical-significance) explains. Over time, you will learn whether your readers prefer a quick note or a fuller story, and you can stop guessing.",
  },
];
