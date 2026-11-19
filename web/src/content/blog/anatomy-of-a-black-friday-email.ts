import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

// Images live in web/public/images/blog/anatomy-of-a-black-friday-email/ (file names below).
const IMG = '/images/blog/anatomy-of-a-black-friday-email';

export const meta: BlogPostMeta = {
  slug: 'anatomy-of-a-black-friday-email',
  title: 'Anatomy of a Black Friday email: 7 parts and what each one does',
  description:
    "Your email is dead before anyone opens it. The seven parts of a Black Friday email, three in the inbox and four inside, and the one job each has.",
  date: '2026-11-18',
  readTime: '3 min read',
  category: 'Email Marketing',
  image: `${IMG}/01-subject-line-inbox.png`,
  imageAlt: 'A screenshot of an email subject line reading “my best friend says hello” in an inbox list.',
  imageCaption: 'No offer, no deadline. It’s still one of the best subject lines I’ve seen.',
  imageNatural: true,
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "Your email is judged twice. First in the inbox, in a glance. Then inside, in two seconds. Fail at first and the second never happens.",
  },
  {
    type: 'p',
    text: "Seven parts. Three in the inbox, four inside. Each has one job.",
  },
  {
    type: 'h2',
    text: 'In the inbox',
  },
  {
    type: 'h3',
    text: '1. Sender name. Job: who is this?',
  },
  {
    type: 'p',
    text: "A real name plus the brand: “Aarya from Emlet”. Never “no-reply”. Keep it identical every send, keep it honest. A misleading sender name is illegal in some places.",
  },
  {
    type: 'h3',
    text: '2. Subject line. Job: one promise.',
  },
  {
    type: 'p',
    text: "Gmail on phone shows about 35 characters. 20–50 characters is the reliable range, the key words go first. The clever offer goes first. Everything else in the bin.",
  },
  {
    type: 'image',
    src: `${IMG}/02-weak-vs-strong-subject-lines.png`,
    alt: 'A table comparing weak and strong subject lines.',
    natural: true,
  },
  {
    type: 'p',
    text: "Judge your subject lines on clicks, not opens. Apple Mail counts emails as opened when they weren’t, which [Mailchimp calls inflated and inaccurate](https://mailchimp.com/help/apple-privacy-faq/).",
  },
  {
    type: 'h3',
    text: '3. Preview text. Job: Finish the thought.',
  },
  {
    type: 'p',
    text: "Aim for 40–90 characters, key message in the first 40. Leave it blank and the inbox shows “View this email in your browser”. Don’t repeat the subject. Add the next best fact: the code, free shipping, what’s left.",
  },
  {
    type: 'image',
    src: `${IMG}/03-inbox-sender-subject-preview.png`,
    alt: 'A phone inbox showing a sales email, with the sender name, subject line and the preview text circled and labelled as 1,2 and 3.',
    natural: true,
  },
  {
    type: 'h2',
    text: 'Inside the email',
  },
  {
    type: 'p',
    text: "One column, about 600px wide, one main call to action, a simple footer. That’s [Campaign Monitor’s advice](https://www.campaignmonitor.com/blog/simple-email-design), and it holds up. Test on your phone before every send.",
  },
  {
    type: 'h3',
    text: '4. Headline and offer. Job: what, how much, until when.',
  },
  {
    type: 'p',
    text: "“30% off everything until Sunday midnight.” Not “Our biggest event of the year is here.” Put the offer in real text, not only in an image. Some inboxes don’t load images until the reader allows them.",
  },
  {
    type: 'h3',
    text: '5. Proof. Job: a reason to act now.',
  },
  {
    type: 'p',
    text: "Two or three best items, or one customer line. Not twelve products. More choices, more hesitation.",
  },
  {
    type: 'h3',
    text: '6. Button. Job: the next step.',
  },
  {
    type: 'p',
    text: "One button. Verb first: “Claim 30% off”, not “Click here”. Big enough for a thumb; a common guideline is 44 by 44 pixels. A second link goes in plain text under it.",
  },
  {
    type: 'h3',
    text: '7. Footer. Job: stay legal, keep trust.',
  },
  {
    type: 'p',
    text: "Accurate sender, honest subject line, a physical address, and an unsubscribe link you honor promptly. That’s the usual summary of the US CAN-SPAM rules. Other countries differ, and I’m not a lawyer, so read [the FTC’s guide](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business) before a big send.",
  },
  {
    type: 'p',
    text: "Repeat the deadline on the last line. And never hide the unsubscribe link. People who can’t find it hit “spam” instead.",
  },
  {
    type: 'image',
    src: `${IMG}/04-candle-email-weak-vs-strong.png`,
    alt: 'Two versions of the same candle sale email side by side: a weak one with a vague subject and no clear offer, and a strong one with the offer and deadline up front.',
    natural: true,
  },
  {
    type: 'h2',
    text: 'Check before you send',
  },
  {
    type: 'ul',
    items: [
      { bold: 'Sender:', text: 'accurate and familiar?' },
      { bold: 'Subject:', text: 'offer and deadline in the first 35 characters?' },
      { bold: 'Preview text:', text: 'set, and adds something new?' },
      { bold: 'Headline:', text: 'what, how much and until when in two seconds?' },
      { bold: 'Proof:', text: 'two or three items?' },
      { bold: 'Button:', text: 'one, starting with a verb?' },
      { bold: 'Footer:', text: 'address, unsubscribe link, deadline?' },
    ],
  },
  {
    type: 'p',
    text: "Then send a test to your phone.",
  },
  {
    type: 'image',
    src: `${IMG}/05-black-friday-checklist.png`,
    alt: 'Seven-point checklist to run through before sending a Black Friday email.',
    natural: true,
  },
  {
    type: 'h2',
    text: 'Do this today',
  },
  {
    type: 'p',
    text: "Open your last sale email. Label the seven parts. Fix the weakest one. If it’s 2 or 3, it takes five minutes.",
  },
  {
    type: 'p',
    text: "I write about email, marketing and building Emlet in public. If this was useful, follow along. There’s more every week.",
  },
];
