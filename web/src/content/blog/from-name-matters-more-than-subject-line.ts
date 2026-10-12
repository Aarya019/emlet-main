import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'from-name-matters-more-than-subject-line',
  title: "The \"From\" Name: Why Who It's From Matters More Than the Subject Line",
  description:
    "Subject lines get endless attention. The sender name sitting right next to it, often in a heavier font, barely gets mentioned, despite being the thing a recognizing eye catches before it ever reads the subject at all.",
  date: '2026-10-12',
  readTime: '6 min read',
  category: 'Email Marketing',
  image: 'https://images.pexels.com/photos/7648020/pexels-photo-7648020.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'Conference name tag badges on lanyards laid out on a table',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "Subject line advice is everywhere, length, wording, personalization, mythbusting about what actually works. The sender name sitting directly next to it in every inbox view, often rendered in a heavier weight than the subject line itself, barely gets mentioned anywhere near as often. That's backwards relative to how people actually scan an inbox.",
  },
  {
    type: 'h2',
    text: 'Recognition happens before evaluation',
  },
  {
    type: 'p',
    text: "In most inbox list views, the sender name is the first thing a scanning eye catches, not because it's more interesting than the subject line, but because recognition is faster than reading. A subscriber who's seen your name before doesn't need to evaluate the subject line's wording to decide whether to open, the name alone already answers \"do I want this.\" A subject line has to work hard to earn attention from a stranger. A recognized sender name skips that step entirely.",
  },
  {
    type: 'h2',
    text: "Why consistency is the actual lever, not the words you pick",
  },
  {
    type: 'p',
    text: "That shortcut only exists because it was built over repeated sends. A from name that changes, sometimes a generic \"Team,\" sometimes a person's name, sometimes \"Customer Support,\" never lets that pattern form, since there's nothing consistent to recognize. The specific words in the from name matter far less than whether the same one shows up every time. Inconsistency is the actual mistake, more than any particular naming choice.",
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/8284724/pexels-photo-8284724.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A laptop showing a list of email messages with sender names visible',
    caption: "The sender column is doing more work than most senders give it credit for.",
  },
  {
    type: 'h2',
    text: "Person vs brand: there isn't one right answer",
  },
  {
    type: 'p',
    text: "\"Sarah from Emlet\" often outperforms a plain company name because it reads as a person wrote it, not a system, the same instinct behind writing like a person instead of a brand more broadly. That's not a universal rule, though. A well-known, trusted brand name can carry more immediate recognition on its own than an individual name the recipient has no context for yet. The right choice depends on which name already carries more trust with that specific audience, a brand-new business with no name recognition yet usually benefits more from the person framing, while an established brand often doesn't need it.",
  },
  {
    type: 'h2',
    text: 'The mistakes that quietly undercut all of this',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Switching the from name between sends.',
        text: "Breaks the recognition pattern before it has a chance to form, the single most common way this gets undermined.",
      },
      {
        bold: 'A from name that reads as automated.',
        text: "\"no-reply\" or anything that sounds like a one-way system suppresses both opens and replies, since it signals upfront that a response isn't actually wanted.",
      },
      {
        bold: "A from name that doesn't match what the domain and content actually represent.",
        text: "Beyond the trust problem, this can interact badly with the alignment checks DMARC relies on, where the visible sender and the authenticated domain are supposed to line up.",
      },
    ],
  },
  {
    type: 'p',
    text: "Pick one from-name strategy, whichever actually carries more trust with your specific list, and hold it steady. Subject line testing is worth doing, but it's the second lever, not the first, changing the words next to a name that's already been given the chance to become recognizable is a very different kind of test than changing both at once and never finding out which one actually moved the number.",
  },
];
