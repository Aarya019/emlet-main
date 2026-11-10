import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'email-subject-line-length-how-many-characters',
  title: 'Email Subject Line Length: How Many Characters Show',
  description:
    "How many characters of a subject line show on a phone and on desktop, why there is no single number, and how to write one that survives the cut.",
  date: '2026-11-02',
  readTime: '5 min read',
  category: 'Copywriting',
  image: 'https://images.pexels.com/photos/7662059/pexels-photo-7662059.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'A smartphone screen showing a notification for a new email',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "The short answer: keep the words that matter inside the first 40 characters, and treat about 60 as the most you can count on in a desktop inbox. Phones often cut a subject line off at around 35 to 45 characters, and desktop inboxes start trimming at roughly 60 to 70. Those figures are approximate. They move with the screen, the app, the font size and the length of the sender name, so the useful habit is not hitting a number but putting the point first.",
  },
  {
    type: 'h2',
    text: 'Why there is no single number',
  },
  {
    type: 'p',
    text: "An inbox does not count characters. It fits as much text as the width allows, and a subject line shares that row with the sender name and the preview text. A narrow letter like \"i\" takes less room than a wide one like \"W\", emoji often take more room than a letter, and people change their own font size. A phone in portrait gives you far less width than a laptop, and different apps (the Gmail app, Apple Mail, Outlook) make different choices.",
  },
  {
    type: 'p',
    text: "That is why you will see \"40 characters\", \"50 characters\" and \"70 characters\" all quoted as the right length. Each is true somewhere. The only advice that holds everywhere is that the start of the line is read by everyone and the end is read by some.",
  },
  {
    type: 'h2',
    text: 'What different lengths look like',
  },
  {
    type: 'table',
    headers: ['Subject line', 'Characters', 'On a phone (approximate)'],
    rows: [
      ['Autumn menu is live', '19', '✓ Shown in full'],
      ['Listening night, Friday 13 November', '35', '✓ Shown in full on most phones'],
      ['Pre-orders open: the refillable notebook', '40', '✓ Usually shown in full'],
      ['Weekend sale: everything in the shop, 25% off', '45', '~ The end may be cut, but the key words come first'],
      ['Pre-orders open: the refillable notebook, 120 made', '50', '~ The last words may be cut, so keep them optional'],
      ['A quick note about something we have been working on: pre-orders open Friday', '76', '✗ The actual news comes after the cut'],
      ['Our biggest sale of the year starts this weekend and everything in the shop is included', '87', '✗ Cut early on a phone, and trimmed on desktop too'],
    ],
    caption: 'Counts include spaces and punctuation. Where a phone cuts the line depends on the app and the screen, so treat the last column as a guide.',
  },
  {
    type: 'p',
    text: "Notice that length alone is not the problem. The 50-character line is fine because the news arrives early. The 76-character line is the worst of the set even though it is shorter than the last one, because everything useful sits at the end.",
  },
  {
    type: 'h2',
    text: 'Put the point first',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Lead with what the email is about.',
        text: "\"Pre-orders open: the refillable notebook\" names the news in the first two words. \"A quick note about something we have been working on\" spends the whole visible line on warm-up.",
      },
      {
        bold: 'Move dates and numbers forward.',
        text: "A specific detail (a day, a price, a quantity) is a reason to open, and it is the first thing to disappear when a line is cut at the end.",
      },
      {
        bold: 'Make the ending optional.',
        text: "Write so the subject still makes sense if the last few words are cut. If it reads as complete at 40 characters, the rest is a bonus.",
      },
    ],
  },
  {
    type: 'h2',
    text: 'Subject line and preview text work as a pair',
  },
  {
    type: 'p',
    text: "The preview text sits right next to the subject and gets the same treatment: plenty of room on a wide screen, much less on a phone. A good pair splits the work. The subject says what it is, and the preview adds the reason to open. Put the most useful part of the preview in its first 40 to 50 characters, and do not repeat the subject.",
  },
  {
    type: 'table',
    headers: ['Subject line', 'Preview text', 'What the pair does'],
    rows: [
      ['Listening night, Friday 13 November', 'Doors at 7, free entry, and Mara plays her new record start to finish.', 'The subject gives the what and when. The preview adds the reason to go.'],
      ['Pre-orders open: the refillable notebook', 'Only 120 made. Ships the first week of December.', 'The two things a buyer asks next: how many, and when.'],
      ['Last call: 6 seats left for Thursday', 'Bring a friend. The workshop starts at 6:30 and tea is on us.', 'Urgency first, practical detail and warmth after.'],
      ['Autumn menu is live', 'The squash soup is back, and the cinnamon buns are not going anywhere.', 'A short subject leaves room for a preview with personality.'],
      ['Your table for Saturday is confirmed', 'Saturday 7 November, 7:30 pm. Need to change it? Just reply.', 'A confirmation whose preview already answers the next question.'],
    ],
  },
  {
    type: 'p',
    text: "Our guide to [preview text](/blog/email-preview-text-guide) covers how much of it each app shows, and how to set it on purpose so the inbox does not fall back to \"View this email in your browser\".",
  },
  {
    type: 'h2',
    text: 'When a longer subject line is fine',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'A personal-sounding email.',
        text: "A line like \"Quick question before Thursday\" can run on a little without looking like marketing, because the reader recognizes the sender and the context.",
      },
      {
        bold: 'A confirmation or receipt.',
        text: "Clarity beats brevity. \"Your table for Saturday is confirmed\" is long enough to be unmistakable.",
      },
      {
        bold: 'A list that has learned to expect it.',
        text: "Some newsletters use a longer, headline-style subject and their readers like it. That is something to test on your own list, not assume. Our post on [A/B testing with a small list](/blog/ab-testing-small-list-statistical-significance) explains how to do it with limited volume.",
      },
    ],
  },
  {
    type: 'p',
    text: "The sender name matters here too, because it shares the same row and decides whether anyone reads the subject at all. See [why the from name matters more than the subject line](/blog/from-name-matters-more-than-subject-line), and our post on [subject line myths](/blog/subject-line-hacks-mythbusting) for the tricks that do not hold up.",
  },
  {
    type: 'h2',
    text: 'Check yours before you send',
  },
  {
    type: 'p',
    text: "The free [Email Subject Line Tester](/tools/subject-line-tester) shows your subject and preview text in a desktop inbox and a phone-style inbox, counts the characters, and flags things like all capitals, heavy punctuation and a missing preview. It runs in your browser, so what you type stays with you.",
  },
];
