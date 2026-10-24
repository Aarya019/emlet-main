import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'ai-written-emails-all-sound-the-same',
  title: 'Why AI-Written Marketing Emails All Sound the Same (and the Edits That Fix It)',
  description:
    "More small businesses are drafting emails with AI, and inboxes are filling up with the same rhythm, the same openers, and the same vague enthusiasm. Here is why it happens and the specific edits that make a draft sound like you.",
  date: '2026-10-24',
  readTime: '7 min read',
  category: 'Copywriting',
  image: 'https://images.pexels.com/photos/7968063/pexels-photo-7968063.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'A hand marking up a printed manuscript with red and green pen',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "Open a few promotional emails from different brands this week and you will probably notice it: the same friendly-but-empty opener, the same three-beat rhythm, the same closing line about being \"excited to share\" something. Different companies, one voice. Surveys of small business owners, including Constant Contact's 2026 small business report, suggest that a bit over half now use AI to help produce content, so this is not a niche problem anymore. It is the default texture of a lot of marketing email.",
  },
  {
    type: 'h2',
    text: 'Why it happens',
  },
  {
    type: 'p',
    text: "A language model writes the most statistically likely next phrase. Asked for a marketing email, it produces the most typical marketing email, an average of everything it has seen. That average is smooth, positive, and grammatical, and it is also nobody in particular. Every business that asks for \"a friendly email announcing our spring sale\" gets a close cousin of the same draft.",
  },
  {
    type: 'p',
    text: "The prompt matters too. A prompt with no specifics (who you are, who is reading, what actually happened this week) leaves the model nothing to work with except generalities. The sameness is mostly a symptom of the draft containing no information that only you have.",
  },
  {
    type: 'h2',
    text: 'The tells readers pick up on',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'The throat-clearing opener.',
        text: "\"We hope this email finds you well\" and \"In today's fast-paced world\" say nothing and delay the point.",
      },
      {
        bold: 'Rule-of-three lists everywhere.',
        text: "\"Fresh, bold, and delicious.\" Three adjectives in a row, in every paragraph, is a pattern, and readers feel it even when they cannot name it.",
      },
      {
        bold: 'Adjectives instead of facts.',
        text: "\"Stunning,\" \"game-changing,\" \"seamless.\" None of these can be checked. A real detail can.",
      },
      {
        bold: 'Contrast framing.',
        text: "\"It's not just a candle, it's an experience.\" One of these is charming. Six per month is a tic.",
      },
      {
        bold: 'Uniform sentence length.',
        text: "Human writing is lumpy. Some sentences run long and wander, some stop short. Drafts that are all medium-length sentences read as flat.",
      },
    ],
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/34511909/pexels-photo-34511909.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'Two pencils, one orange and one black, lying on contrasting orange and black backgrounds',
    caption: "The goal of editing an AI draft is contrast: something that could only have come from your business.",
  },
  {
    type: 'h2',
    text: 'The edits that actually fix it',
  },
  {
    type: 'p',
    text: "You do not need to avoid AI. You need to treat its output as a rough first draft and edit it the way you would edit a freelancer's. These changes do most of the work:",
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Add one thing only you could know.',
        text: "A customer's comment, a supplier delay, the weather in your town, the reason you picked this product. One specific detail changes the whole email.",
      },
      {
        bold: 'Cut the first paragraph.',
        text: "In most AI drafts the real email starts in paragraph two. Delete the warm-up and see if it reads better. It usually does.",
      },
      {
        bold: 'Replace adjectives with evidence.',
        text: "Swap \"our incredibly soft towels\" for \"the same cotton hotels use, and it still gets softer after 50 washes.\" Only keep claims you can stand behind.",
      },
      {
        bold: 'Break the rhythm on purpose.',
        text: "Make one sentence very short. Let another run long. Start a sentence with \"And\" or \"But.\" Read it aloud: anywhere you would not say it that way, rewrite it.",
      },
      {
        bold: 'Use your own words for the ask.',
        text: "The call to action is where generic copy hurts most. Say what you would say to a customer standing in your shop.",
      },
      {
        bold: 'Give the model a sample of your voice.',
        text: "Paste in two or three emails you wrote yourself and say \"match this tone.\" Then still edit, but the starting point improves a lot.",
      },
    ],
  },
  {
    type: 'h2',
    text: 'A quick test before you hit send',
  },
  {
    type: 'p',
    text: "Remove your company name from the email and ask whether a competitor could send it unchanged. If yes, it is not finished. A good small business email has at least one sentence a competitor could not send: a name, a number, a story, an opinion.",
  },
  {
    type: 'p',
    text: "AI is a perfectly reasonable way to get past a blank page. The risk is stopping there. The businesses that will stand out in the next couple of years are not the ones that avoid the tools, they are the ones that spend ten extra minutes making each draft sound like a person with something specific to say.",
  },
];
