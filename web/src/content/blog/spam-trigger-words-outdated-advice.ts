import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'spam-trigger-words-outdated-advice',
  title: '"Spam Trigger Words": Why the Avoid-These-Words Advice Is Mostly Outdated',
  description:
    "Lists telling you to avoid \"free,\" \"guarantee,\" and \"act now\" still circulate widely. The filters that made those words risky mostly don't work that way anymore, and chasing the list distracts from what actually decides inbox placement now.",
  date: '2026-10-10',
  readTime: '6 min read',
  category: 'Deliverability',
  image: 'https://images.pexels.com/photos/5491019/pexels-photo-5491019.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'A magnifying glass held over newspaper text',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "Lists of \"spam trigger words\" still circulate constantly: avoid \"free,\" avoid \"guarantee,\" avoid \"act now,\" avoid dollar signs and exclamation points. The advice persists because it's simple and actionable, a word list feels like something you can control in a system that otherwise feels opaque. The filtering it was built around mostly doesn't work that way anymore.",
  },
  {
    type: 'h2',
    text: 'Why the advice was once genuinely true',
  },
  {
    type: 'p',
    text: "Early spam filtering, the Bayesian and rule-based systems common in the 2000s and early 2010s, leaned heavily on keyword and pattern matching. Spam content at the time really did cluster around a predictable vocabulary, so scanning for it was a legitimately useful signal, and the word lists that came out of that era weren't bad advice, they were accurate advice for the filters that existed then.",
  },
  {
    type: 'h2',
    text: "What decides inbox placement now",
  },
  {
    type: 'p',
    text: "Modern filtering at Gmail, Outlook, and Yahoo leans overwhelmingly on sender reputation, proper authentication, and recipient behavior, not keyword scanning. A properly authenticated sender with a history of engaged recipients can use the word \"free\" without consequence. A poorly authenticated sender with a disengaged list gets flagged regardless of vocabulary. Content still matters, but the content that actually matters has shifted: not which specific words appear, but patterns that correlate with genuinely low-quality mail, excessive punctuation or ALL-CAPS, a page that's mostly image with barely any real text, a subject line that misrepresents what's inside. None of those are about a forbidden word list, they're about whether the email reads like something a real sender who respects the reader would actually send.",
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/28271625/pexels-photo-28271625.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A yield warning road sign on a rural road',
    caption: "The real warning signs are patterns of behavior, reputation and engagement, not a specific word choice.",
  },
  {
    type: 'h2',
    text: "The signal that matters more than anything on a word list",
  },
  {
    type: 'p',
    text: "Recipient engagement carries far more weight than content ever did: opens, clicks, deletes without reading, and spam complaints all feed directly into sender reputation, which is the dominant factor in where mail lands. A list that's been properly maintained, with dead addresses suppressed and genuinely disengaged recipients cleaned out, sends a far stronger positive signal than any amount of careful word choice. Authentication closes the other major gap, since a message that fails SPF and DKIM alignment is working against a structural disadvantage no amount of careful copy can offset.",
  },
  {
    type: 'h2',
    text: 'Where a little word-level caution still earns its keep',
  },
  {
    type: 'p',
    text: "This isn't absolute. Some corporate and enterprise email security gateways, particularly older or more conservative ones, still weight content-based rules more heavily than Gmail or Outlook do. If a meaningful share of your list sits behind that kind of infrastructure, some content awareness isn't worthless, it's just not the primary lever, and it was never going to compensate for weak reputation or missing authentication regardless. For most senders, the honest shift in priority is real: write for the reader, keep the list clean, get authentication right, and the word choice mostly takes care of itself.",
  },
];
