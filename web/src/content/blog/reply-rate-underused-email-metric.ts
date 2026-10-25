import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'reply-rate-underused-email-metric',
  title: 'Reply Rate: The Email Metric Most Small Businesses Never Look At',
  description:
    "Opens are fuzzy and clicks only tell you about links. Replies are the clearest sign that a real person read your email and cared enough to answer. Here is why they matter and how to write an email that invites one.",
  date: '2026-10-25',
  readTime: '7 min read',
  category: 'Copywriting',
  image: 'https://images.pexels.com/photos/7439136/pexels-photo-7439136.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'A laptop open on a desk showing an email inbox interface',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "Most email dashboards lead with opens and clicks. Almost none of them show you replies, which is strange, because a reply is the one engagement signal that is hard to fake. An open can be a mail client preloading images. A click can be a security scanner following every link. A reply means a person read the message, formed a thought, and typed something back.",
  },
  {
    type: 'h2',
    text: 'Why replies are worth caring about',
  },
  {
    type: 'p',
    text: "There are two reasons, and they pull in the same direction. The first is business value: a reply is a conversation, and conversations are where questions get answered, objections surface, and sales happen. The second is deliverability. Mailbox providers have said publicly that they look at how recipients interact with a sender, and replying is generally treated as a strong positive signal. Nobody outside those companies knows the exact weighting, so treat this as likely rather than proven, but the direction is hard to argue with: mail people answer looks wanted.",
  },
  {
    type: 'p',
    text: "For a small business there is a third reason. Your list is small enough that you can actually read the replies. Each one is free market research from someone in your target audience, in their own words.",
  },
  {
    type: 'h2',
    text: 'Make replying possible first',
  },
  {
    type: 'p',
    text: "This is the unglamorous part, and it is where many senders lose before they start. If your email comes from a no-reply address, you have told the reader not to answer. Fix that before anything else:",
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Send from a real address that a person reads.',
        text: "Something like hello@ or a first name at your domain. If replies land in a black hole, you lose the conversation and the signal.",
      },
      {
        bold: 'Set a human reply-to.',
        text: "If your sending platform uses a different address, point reply-to at a monitored inbox.",
      },
      {
        bold: 'Decide who answers and how fast.',
        text: "A reply that sits unanswered for a week teaches the reader not to bother next time.",
      },
    ],
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/9050619/pexels-photo-9050619.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'Two people having an animated conversation over coffee, seen through a window',
    caption: "An email that invites a reply reads like the start of a conversation, not the end of a broadcast.",
  },
  {
    type: 'h2',
    text: 'How to write an email that invites an answer',
  },
  {
    type: 'p',
    text: "Replies do not happen by accident. They happen when the email makes answering easy and gives the reader a reason to.",
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Ask one specific question.',
        text: "\"Any thoughts?\" is too open. \"Which of these two sizes would you actually buy?\" can be answered in four words. One question, placed near the end, is plenty.",
      },
      {
        bold: 'Make the answer cheap.',
        text: "Offer a choice (A or B), a number from one to five, or a yes or no. The less effort the reply takes, the more of them you get.",
      },
      {
        bold: 'Write like one person to another.',
        text: "Short paragraphs, plain words, a signature with a real name. A heavily designed template with a banner and four columns signals a broadcast, and people do not reply to broadcasts.",
      },
      {
        bold: 'Tell them why you are asking.',
        text: "\"I am picking next month's flavors and want to hear from customers first\" gives the question a purpose and makes the reader feel their answer matters.",
      },
      {
        bold: 'Reply to the replies.',
        text: "Answer quickly and personally, even briefly. People who get an answer once tend to write back again.",
      },
    ],
  },
  {
    type: 'h2',
    text: 'How to measure it',
  },
  {
    type: 'p',
    text: "Most email platforms do not report replies, because replies go to your inbox, not to the platform. The simple approach works fine at small scale: count the replies to each send, divide by the number of people who received it, and note the result in a spreadsheet next to the subject line. Do not obsess over the percentage. Typical reply rates for marketing email are low, often well under one percent for a broadcast, and they vary a lot by audience, so compare your own sends to each other rather than to someone else's benchmark.",
  },
  {
    type: 'p',
    text: "The patterns are what to look for. Which emails get answered? Which questions? Which subject lines? After ten or twenty sends you will know more about what your audience wants than a pile of open rates could tell you.",
  },
  {
    type: 'h2',
    text: 'When this approach does not fit',
  },
  {
    type: 'p',
    text: "Not every email should ask for a reply. A shipping confirmation or a receipt is there to inform, and a question would be noise. And if your list is large and replies would swamp one person, you may need a shared inbox or a process before you invite them. But for newsletters, welcome emails, and check-ins from a small business, one honest question at the end is among the cheapest experiments you can run.",
  },
];
