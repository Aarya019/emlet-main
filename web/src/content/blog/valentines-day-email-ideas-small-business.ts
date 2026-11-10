import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'valentines-day-email-ideas-small-business',
  title: "Valentine's Day Email Ideas for Small Businesses",
  description:
    "Valentine's Day email ideas beyond 'be mine': gift guides, order-by dates, customer love notes and Galentine's events, with subject lines to adapt.",
  date: '2026-11-10',
  readTime: '6 min read',
  category: 'Copywriting',
  image: 'https://images.pexels.com/photos/9050619/pexels-photo-9050619.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'Two people having an animated conversation over coffee, seen through a window',
};

export const cta = {
  heading: "Turn a Valentine's idea into a designed email",
  body: 'Describe your offer and Emlet builds the email in your brand colors, ready to edit and export. Free to try, no credit card.',
};

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "Valentine's Day 2027 falls on a Sunday, which changes the plan. Anything that has to be ordered, shipped or baked needs a deadline well before the 14th, so for many businesses the real date is the week before. And not every customer is in a romantic relationship, or wants to be reminded of it. The best Valentine's emails give people a reason to be kind: to a partner, a friend, a parent or themselves.",
  },
  {
    type: 'h2',
    text: 'A send plan for 2027',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Sun 17 Jan: plan.',
        text: "Decide the offer, the order-by date and the delivery or collection details. Check your carrier's last dates before you promise anything.",
      },
      {
        bold: 'Mon 25 Jan: the gift guide or teaser.',
        text: "Give people time to browse. This is the email that does the quiet work.",
      },
      {
        bold: 'Mon 1 Feb: the offer.',
        text: "Your main email: what it is, the price, the order-by date and one button.",
      },
      {
        bold: 'Mon 8 Feb: the last order date.',
        text: "The most useful email of the campaign for anything that ships, and one people are glad to get.",
      },
      {
        bold: 'Fri 12 Feb: last minute.',
        text: "Only for options that still work: gift cards, in-store pickup or same-day. Do not promise what you cannot deliver.",
      },
      {
        bold: 'Sun 14 Feb: optional.',
        text: "A short note is fine. Many businesses skip the day itself.",
      },
    ],
  },
  {
    type: 'p',
    text: "The Super Bowl is currently scheduled for the same Sunday, so if you sell to a US audience, avoid sending your biggest email that evening. Our [email marketing calendar for 2027](/blog/email-marketing-calendar-2027) lists the other dates worth planning around.",
  },
  {
    type: 'h2',
    text: "Seven ideas that are not \"be mine\"",
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'A gift guide by budget.',
        text: "Under $25, under $50 and one splurge. Grouping by price makes it easy to scan on a phone.",
      },
      {
        bold: 'The order-by date.',
        text: "Pure utility, and usually the email with the best reason to open it.",
      },
      {
        bold: 'A love note to your customers.',
        text: "No sale. Thank them for the year, in your own voice. It stands out in an inbox full of offers.",
      },
      {
        bold: "Galentine's or Palentine's.",
        text: "An invitation to a gathering on Saturday 13 February. Our [event invitation email examples](/blog/event-invitation-email-examples) show the wording.",
      },
      {
        bold: 'Gifts for people who are not partners.',
        text: "Friends, parents, teachers, neighbors. It widens the audience without losing the theme.",
      },
      {
        bold: 'A treat-yourself offer.',
        text: "A small, kind nudge for people who would rather buy something for themselves.",
      },
      {
        bold: 'Nothing at all.',
        text: "If it does not suit your brand, skip it. Not every date needs an email.",
      },
    ],
  },
  {
    type: 'h2',
    text: 'Subject lines to adapt',
  },
  {
    type: 'table',
    headers: ['Subject line', 'Characters', 'What it does'],
    rows: [
      ["Valentine's boxes: pre-order by Sunday 7 Feb", '44', 'Names the offer first. The date may be cut on a phone, so repeat it in the preview text.'],
      ['Say it with something sweet', '27', 'Short and warm, shown in full on any phone. It needs a preview text to carry the details.'],
      ["Last order date for Valentine's: Mon 8 Feb", '42', 'Pure utility, with the key words first.'],
      ["Valentine's gifts under $30, none of them cheesy", '48', 'A clear promise. The tail is optional if it gets cut.'],
      ['A small thank you from us', '25', 'For a love note with no sale. It reads like a person wrote it.'],
      ["Galentine's night: Saturday 13 February, 7 pm", '45', 'The event first, then the date and time.'],
      ["Order by Monday, arrives before Valentine's", '43', 'Only works if your delivery promise is true.'],
    ],
    caption: 'Counts include spaces and punctuation. Phones often cut a subject at around 35 to 45 characters.',
  },
  {
    type: 'p',
    text: "Our post on [subject line length](/blog/email-subject-line-length-how-many-characters) explains why the point should come first, and our guide to [preview text](/blog/email-preview-text-guide) covers the line that sits next to it.",
  },
  {
    type: 'h2',
    text: 'Three short examples',
  },
  {
    type: 'p',
    text: "A bookshop's gift guide, for people who are not buying for a partner:",
  },
  {
    type: 'ul',
    items: [
      { bold: 'Subject:', text: 'Books for everyone you love, under $25' },
      { bold: 'Preview text:', text: 'Partners, friends, parents and you. Order by Monday 8 Feb for delivery before the 14th.' },
      {
        bold: 'Copy:',
        text: "Valentine's Day is not only for couples. We picked twelve books under $25 for partners, friends, parents and anyone who could use a good evening in, with a line on each about who it suits. Order by Monday 8 February and they will arrive before Sunday the 14th.",
      },
      { bold: 'Button:', text: 'See the gift guide' },
    ],
  },
  {
    type: 'p',
    text: "A bag maker's order-by reminder:",
  },
  {
    type: 'ul',
    items: [
      { bold: 'Subject:', text: "Last order date for Valentine's: Mon 8 Feb" },
      { bold: 'Preview text:', text: 'Orders placed by Monday evening arrive before Sunday 14 February.' },
      {
        bold: 'Copy:',
        text: "Quick reminder: orders placed by Monday 8 February at 6 pm will arrive before Valentine's Day. After that we cannot promise it, but our gift cards are instant. Every bag is waxed by hand, numbered inside the lining, and wrapped for free.",
      },
      { bold: 'Button:', text: 'Order by Monday' },
    ],
  },
  {
    type: 'p',
    text: "A bakery's love note to its customers:",
  },
  {
    type: 'ul',
    items: [
      { bold: 'Subject:', text: 'A small thank you from us' },
      { bold: 'Preview text:', text: 'Thanks for a year of Saturday mornings, and a free cookie.' },
      {
        bold: 'Copy:',
        text: "We do not usually send an email like this, but it is the week for it. Thank you for buying bread from us on a wet Tuesday, for the notes on the pre-order form, and for telling your neighbors. There is a free heart cookie with any order this week. Just mention this email.",
      },
      { bold: 'Button:', text: 'Come and say hello' },
    ],
  },
  {
    type: 'h2',
    text: 'Mistakes to avoid',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Assuming everyone is romantic.',
        text: "Offer a way in for friends, family and people who are single, or the email will quietly leave them out.",
      },
      {
        bold: 'Urgency that is not true.',
        text: "A deadline should be a real one: the date your baker stops taking orders, or the last day your courier guarantees. Our post on [CTA button copy](/blog/cta-button-copy-that-isnt-learn-more) has more on honest calls to action.",
      },
      {
        bold: 'Hiding the delivery dates.',
        text: "If people have to click to find out whether it will arrive in time, many will not.",
      },
      {
        bold: 'Pale text on pink.',
        text: "Valentine's colors look lovely and fail contrast checks easily. Keep text strong enough to read, as our [email accessibility guide](/blog/email-accessibility-guide) explains.",
      },
    ],
  },
  {
    type: 'p',
    text: "The free [Subject Line Tester](/tools/subject-line-tester) previews your subject in a phone-style inbox, and the [Email Prompt Library](/tools/email-prompt-library) has seasonal prompts you can edit into a first draft.",
  },
];
