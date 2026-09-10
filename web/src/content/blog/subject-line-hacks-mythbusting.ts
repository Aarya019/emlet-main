import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'subject-line-hacks-mythbusting',
  title: 'Subject Line "Hacks" That Work vs. the Ones That Don\'t (Mythbusting)',
  description:
    "Add an emoji. Keep it under 50 characters. Never write \"free.\" Every one of these gets repeated as settled fact, and every one of them has a study contradicting it. Here's what actually holds up across the research and what doesn't.",
  date: '2026-09-11',
  readTime: '7 min read',
  category: 'Copywriting',
  image: 'https://images.pexels.com/photos/6684798/pexels-photo-6684798.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'Close-up of hands typing an email on a laptop keyboard',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "Search \"subject line best practices\" and you'll get a list of confident rules: add an emoji, keep it under 50 characters, never use the word \"free.\" Search again and you'll find a study contradicting almost every single one of them. That's not because email marketers can't agree on anything, it's because a lot of these \"hacks\" were never really general rules to begin with, they were results from one list, one industry, one moment in time, generalized into advice that gets repeated long after the nuance got dropped.",
  },
  {
    type: 'h2',
    text: "Emoji: does it help? Depends who you ask",
  },
  {
    type: 'p',
    text: "This is the least settled question in the list. Experian found 56% of brands using an emoji saw higher open rates, and Return Path found emoji subject lines for New Year's campaigns averaged a 22% open rate against an 18% baseline. Search Engine Journal's data runs the other way, no-emoji subject lines beat emoji ones 52.9% to 47.1% in their sample. And Nielsen Norman Group's usability research found emoji in subject lines actually increased negative sentiment toward the email without improving open likelihood at all. Three credible sources, three different conclusions. The honest read: emoji impact depends heavily on your audience, industry, and whether the emoji is relevant or just decoration, which means the only way to know if it helps your list is to actually test it on your list, not import someone else's answer.",
  },
  {
    type: 'h2',
    text: 'Character length: the "50 characters" rule has surprisingly weak evidence behind it',
  },
  {
    type: 'p',
    text: "Everyone repeats a version of \"keep it under 50 characters\" or \"41 characters is optimal,\" usually citing one specific study each. But Return Path ran a large-scale correlation analysis between subject line length and read rate and found a correlation of -0.03, statistically close to no relationship at all. Meanwhile other analyses have found short subject lines (under 20 characters) outperforming everything else, and at least one large dataset found subject lines of 90-plus characters produced the highest response rates. Taken together, these don't describe a length sweet spot, they describe length mattering far less than the specific advice implies. The one length-related thing worth actually doing: know where your subject line gets cut off on mobile (commonly somewhere in the 30 to 40 character range) and make sure the part that gets cut off isn't the part carrying the message, not because a specific character count is magic, but because a truncated sentence reads worse than a shorter one.",
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/7662059/pexels-photo-7662059.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A smartphone screen showing a notification for a new email',
    caption: "On a phone screen, what gets cut off matters more than the total character count ever did.",
  },
  {
    type: 'h2',
    text: '"Spam trigger words": mostly a myth today, but not entirely',
  },
  {
    type: 'p',
    text: "This one has the clearest mythbusting story. A decade ago, spam filters really did work close to a keyword blocklist, and avoiding words like \"free\" or \"act now\" was genuinely protective. Modern filters at Gmail, Outlook, and the rest run on machine learning models trained on billions of messages, weighing sender reputation, authentication records, recipient engagement history, and sending patterns far more heavily than individual words in the subject line. A single flagged word is now treated as a weak signal, not an automatic penalty; it's the combination and the pattern, \"free,\" \"act now,\" and \"limited time\" stacked together in one message from a low-reputation sender, that actually resembles historical spam. A trusted sender with a clean engagement history can use the word \"free\" without consequence. A cold, unverified sender might land in spam with completely clean copy, because the words were never really the deciding factor, the reputation was.",
  },
  {
    type: 'table',
    headers: ['The "hack"', 'What the research actually shows'],
    rows: [
      ['Add an emoji', 'Conflicting results across studies; test on your own list'],
      ['Keep it under ~50 characters', 'Near-zero correlation with open rate in large analyses'],
      ['Avoid "spam trigger words"', 'Mostly outdated; sender reputation matters far more than word choice'],
      ['Use the recipient\'s first name', 'Positive in most studies, though not universally'],
      ['Ask a question / create a curiosity gap', 'One of the more consistently positive tactics, when the payoff is real'],
    ],
  },
  {
    type: 'h2',
    text: 'What actually does hold up, with honest caveats',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'First-name personalization, most of the time.',
        text: "Multiple studies put the lift from including a first name somewhere between 26% and 50%, which is a real effect size. Worth noting one recent study found the opposite, a slightly lower open rate with a first name included, so treat this as \"usually helps, not guaranteed\" rather than a universal law.",
      },
      {
        bold: 'Genuine curiosity, especially phrased as a question.',
        text: "Question-based subject lines have shown gains as high as 50% in some analyses. The mechanism makes sense: a real, specific question creates a gap the reader wants closed, and opening the email is the only way to close it. This only works when the email actually answers the question; a curiosity gap with no real payoff trains people to stop trusting your subject lines.",
      },
      {
        bold: 'Real urgency and scarcity, not manufactured urgency.',
        text: "Subject lines with genuine time or quantity limits have shown gains around 22% in some studies, and retail and event campaigns consistently perform better with real deadlines. The catch, repeated across every source on this: overuse erodes it fast. If every email claims something is ending soon, none of them read as true, and the tactic stops working for reasons that have nothing to do with the subject line itself.",
      },
    ],
  },
  {
    type: 'p',
    text: "The pattern underneath all of this: the tactics that hold up across studies are the ones tied to something real, an actual question with an actual answer, an actual deadline, a name you actually have permission to use. The tactics that don't hold up, a fixed character count, a banned word list, are the ones that got treated as universal rules despite being observations from one specific dataset. Test what you can on your own list. For everything else, the honest answer from the research is \"it depends,\" and that's a more useful answer than a confident rule that half the studies disagree with.",
  },
];
