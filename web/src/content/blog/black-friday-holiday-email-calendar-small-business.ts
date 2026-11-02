import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'black-friday-holiday-email-calendar-small-business',
  title: 'A Black Friday and Holiday Email Plan for Small Businesses (Without Burning Out Your List)',
  description:
    "The busiest inbox weeks of the year reward a plan, not a panic. Here is a simple calendar of what to send and when, how to stand out when everyone is discounting, and how to protect your list's goodwill.",
  date: '2026-11-01',
  readTime: '8 min read',
  category: 'Small Business',
  image: 'https://images.pexels.com/photos/6214365/pexels-photo-6214365.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'Shopping bag, credit card, and letter tiles spelling SHOPPING on a laptop keyboard',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "From late November to the end of December, your subscribers' inboxes fill with sales, countdowns and \"last chance\" messages. A small business cannot out-shout the big retailers, and trying to usually ends with a burned-out list and a pile of unsubscribes. What works better is a small, honest plan that decides in advance what you will send, to whom, and when to stop.",
  },
  {
    type: 'h2',
    text: 'Start before the rush',
  },
  {
    type: 'p',
    text: "The most useful work happens in the weeks before the sale. Decide your offer, check that your list is clean (our post on [list hygiene](/blog/email-list-hygiene-cleaning-stale-list) covers how), confirm your sending domain is authenticated, and prepare your emails while you still have time to proofread them. Sending volume spikes at this time of year, and a rushed email with a broken link or the wrong price is the most expensive mistake you can make.",
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Choose one clear offer.',
        text: "A single strong deal is easier to explain than five small ones. Decide what is included, the dates, and any limits.",
      },
      {
        bold: 'Check stock and shipping cut-offs.',
        text: "Promising delivery by a date you cannot meet leads to refunds and angry replies. Know your last order date before you email anyone.",
      },
      {
        bold: 'Build a separate early-access group.',
        text: "A short form that says \"get the sale first\" gives you a warm audience and costs nothing.",
      },
    ],
  },
  {
    type: 'h2',
    text: 'A simple calendar',
  },
  {
    type: 'p',
    text: "Adjust the dates to your own sale, but this shape works for many small businesses. Four to six emails across the period is plenty for most lists.",
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'One to two weeks before: the teaser.',
        text: "Tell people a sale is coming and invite them to join the early-access group. No discount details yet if you want to keep it exciting, or share the dates so they can plan.",
      },
      {
        bold: 'Early access (the day before, or the morning of): the VIP email.',
        text: "Send the deal first to your most engaged subscribers or the early-access group. It rewards loyalty and gives you early sales and early feedback.",
      },
      {
        bold: 'The main send.',
        text: "The full announcement to everyone, with the offer, the dates, and one clear button. Lead with what people get, not with the word SALE in capitals.",
      },
      {
        bold: 'A mid-sale reminder.',
        text: "Short and useful: a bestseller, a gift idea, or a note about what is selling out. Only send it to people who have not bought.",
      },
      {
        bold: 'The final-hours email.',
        text: "Send it if the deadline is real. A countdown that is honest builds trust, and one that resets teaches people to ignore you.",
      },
      {
        bold: 'The thank-you.',
        text: "After the sale, thank buyers, confirm what happens next, and tell them how to reach you. This is where repeat customers start.",
      },
    ],
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/6567546/pexels-photo-6567546.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A woman looking at her phone while holding a credit card near a laptop',
    caption: "Most holiday shoppers read on their phones, so check every email there before it goes out.",
  },
  {
    type: 'h2',
    text: 'How to stand out when everyone is discounting',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Be specific.',
        text: "\"30% off our winter candles until Sunday\" is clearer than \"Huge savings!\" and sets honest expectations.",
      },
      {
        bold: 'Segment lightly.',
        text: "Customers who bought recently, people who browsed but did not buy, and new subscribers do not need the same email. Even two versions help.",
      },
      {
        bold: 'Lead with a reason, not just a price.',
        text: "Gift guides, bundles and \"for the person who has everything\" ideas give people a way to decide, not just a discount.",
      },
      {
        bold: 'Keep the design simple.',
        text: "A single image, a clear heading, and one button load quickly and read well on a phone.",
      },
    ],
  },
  {
    type: 'h2',
    text: 'Protect your list while you do it',
  },
  {
    type: 'p',
    text: "The temptation in busy season is to email everyone every day. The cost shows up later, in January, as unsubscribes, spam complaints, and lower open rates that hang around for months. A few guardrails help:",
  },
  {
    type: 'ul',
    items: [
      {
        text: "Let people choose. A \"send me fewer emails during sales\" link in the footer keeps subscribers who would otherwise leave.",
      },
      {
        text: "Suppress buyers from reminder emails as soon as they have purchased. Nothing annoys a customer more than a \"don't miss out\" message after they already bought.",
      },
      {
        text: "Watch the numbers during the sale. If complaints or unsubscribes jump, pause and rethink the next send instead of pushing on.",
      },
      {
        text: "Make unsubscribing easy. Our post on [one-click unsubscribe](/blog/one-click-unsubscribe-what-it-is-and-how-to-set-it-up) explains why it protects your deliverability when volume is high.",
      },
    ],
  },
  {
    type: 'h2',
    text: 'After the season',
  },
  {
    type: 'p',
    text: "The weeks after are the most valuable. Send a thank-you, ask what people thought, and welcome the new customers properly. Then look at what worked: which email earned the most, which subject line was opened, and which offer was ignored. Write it down now. Next year's plan should start from this year's notes, not from a blank page.",
  },
];
