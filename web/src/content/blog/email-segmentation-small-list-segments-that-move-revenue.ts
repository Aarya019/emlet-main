import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'email-segmentation-small-list-segments-that-move-revenue',
  title: 'Email Segmentation for a Small List: The 3 or 4 Segments That Actually Move Revenue',
  description:
    "Most segmentation advice is written for a list of 500,000 with a data team behind it. For a small list, the entire benefit comes from three or four honest splits done well, not fifteen clever ones you'll never keep updated.",
  date: '2026-09-11',
  readTime: '7 min read',
  category: 'Email Marketing',
  image: 'https://images.pexels.com/photos/29916732/pexels-photo-29916732.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'Envelopes and mail sorted into organized groups',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "Segmentation is one of those email marketing topics where the stats thrown around are so large they stop sounding credible: a 760% revenue increase gets cited constantly, sourced back to a single benchmark study that's hard to verify and easy to repeat. I'd treat that specific number skeptically. What's better supported across multiple independent studies: segmented campaigns see roughly 14% higher open rates and 100% higher click-through rates than unsegmented sends, and segmenting by behavior or purchase history increases revenue per email by 50 to 100%. Still a big number, just a more believable one.",
  },
  {
    type: 'h2',
    text: "The part the advice usually skips: more segments isn't the goal",
  },
  {
    type: 'p',
    text: "Most segmentation guides are written by and for teams with a data platform, a list in the hundreds of thousands, and someone whose job is specifically to maintain the segmentation logic. None of that describes a small business with a list of a few thousand. On a small list, splitting into 12 or 15 micro-segments creates two real problems: each individual segment gets too small to justify writing a genuinely different email for it, and somebody has to keep the segment logic current as people's behavior changes, which quietly turns into unpaid, unglamorous maintenance work nobody does consistently. The honest finding for a small list: three or four segments, chosen well and actually used, capture almost all the available lift. Beyond that, you're mostly adding complexity without adding revenue.",
  },
  {
    type: 'h2',
    text: 'The segments worth building first',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Engagement level: active, lapsing, and cold.',
        text: "Based on opens and clicks over your own sending window, not a flat 90-day rule. This is the single highest-leverage split, since it changes both what you send (your best content to your most active readers) and whether you send at all (holding back from the cold segment protects deliverability for everyone else).",
      },
      {
        bold: 'Customer status: never purchased, purchased once, repeat or VIP.',
        text: "A subscriber who's never bought needs a different nudge than someone who buys from you every month. Treating both groups identically means either under-selling to your best customers or over-selling to people who haven't decided to trust you yet.",
      },
      {
        bold: "Lifecycle stage: new versus long-time subscriber.",
        text: "Someone who signed up last week is still deciding whether to trust you. Someone who's been on the list for two years already made that decision. New subscribers get more context and social proof; long-time subscribers get treated like they already know who you are.",
      },
      {
        bold: 'A fourth, optional: what they actually signed up for or clicked on.',
        text: "If your signup form or past clicks already tell you someone's specific interest (a product category, a topic), that's real signal worth a light segment. Don't manufacture this one if the data isn't already sitting there.",
      },
    ],
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A person reviewing customer data on a laptop spreadsheet',
    caption: "The data behind good segments is usually already sitting in your list, unused, not something you need a new tool to generate.",
  },
  {
    type: 'table',
    headers: ['Segment', 'What it catches', 'One thing to actually do differently'],
    rows: [
      ['Active / lapsing / cold', 'Who\'s still reading you at all', "Send your best content to active; hold back or run a win-back on cold"],
      ['Never / once / repeat buyer', 'How much trust already exists', "Lead with proof for never-bought; skip the pitch for repeat buyers"],
      ['New / long-time subscriber', 'How much context they already have', "Explain the basics to new; assume familiarity with long-time"],
    ],
  },
  {
    type: 'h2',
    text: "What's not worth segmenting on yet",
  },
  {
    type: 'p',
    text: "Demographic splits, age bracket, gender, general location, feel like segmentation because they're easy to collect on a signup form, but on their own they're weak predictors of what someone actually wants from an email. Behavior (what someone opened, clicked, or bought) beats demographics as a signal almost every time, so if you're choosing where to spend limited segmentation effort, behavior comes first and demographics stay optional, useful mainly for things like time zone or genuinely relevant regional content, not for deciding tone or offer.",
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/33714910/pexels-photo-33714910.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A small group of people standing together, representing a targeted audience',
    caption: 'Three honest groups you actually send differently beat a dozen you built once and never touched again.',
  },
  {
    type: 'p',
    text: "Also worth resisting: building an elaborate RFM (recency, frequency, monetary value) model with a dozen tiers before you've even confirmed the basic engagement split changes anything for you. RFM modeling is genuinely useful at scale, but on a small list it's solving a problem you don't have yet. Get real mileage out of the three or four simple segments first. If you're still finding meaningful lift after that and have the volume to support finer splits, that's the point to go granular, not before.",
  },
  {
    type: 'p',
    text: "The actual test of whether a segment is worth keeping: can you name, right now, one thing you send that group differently from everyone else? If the answer is no, it's not a segment yet, it's just a label. Start with the three or four above, make sure each one changes something real about what that group receives, and only add a fifth once the first four are actually doing something.",
  },
];
