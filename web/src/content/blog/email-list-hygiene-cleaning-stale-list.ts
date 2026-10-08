import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'email-list-hygiene-cleaning-stale-list',
  title: 'Email List Hygiene: When and How to Actually Clean a Stale List',
  description:
    "Not every bounce means the same thing, and not every quiet subscriber is actually gone. Here's the actual mechanics of list hygiene: the bounce types that matter, and a cleaning cadence that doesn't rely on guessing.",
  date: '2026-10-08',
  readTime: '6 min read',
  category: 'Deliverability',
  image: 'https://images.pexels.com/photos/8287257/pexels-photo-8287257.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'A person sweeping a kitchen floor with a broom',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "\"Clean your list\" gets said often enough that it's easy to nod along without a clear picture of what actually counts as dirty. A bounce isn't one thing, and a quiet subscriber isn't automatically a dead one. The mechanics matter more than the general advice.",
  },
  {
    type: 'h2',
    text: 'Hard bounces and soft bounces are not the same problem',
  },
  {
    type: 'p',
    text: "A hard bounce is a permanent failure, the address doesn't exist, the domain is gone, there's nothing to retry. Every reputable ESP suppresses these automatically after one occurrence, and it's worth actually confirming that setting rather than assuming it. A soft bounce is temporary: a full mailbox, a server briefly down, a message too large. The instinct is to treat soft bounces as harmless since they're labeled temporary, but an address that soft-bounces on every single send for months isn't experiencing a string of coincidental outages, it's functionally dead and should eventually be treated like a hard bounce. A reasonable rule: suppress after three or four consecutive soft bounces rather than letting them accumulate indefinitely.",
  },
  {
    type: 'h2',
    text: "The quieter problem: addresses that work but never engage",
  },
  {
    type: 'p',
    text: "Bounces are the visible problem. The bigger one is usually invisible: addresses that accept every send without complaint and never open or click anything. They don't show up as an error anywhere, which is exactly why they're easy to ignore, and exactly why they're doing real damage. Inbox providers weigh aggregate engagement heavily when deciding where your mail lands, so a list padded with permanently inactive addresses drags down your engagement rate for everyone, including the people who genuinely want to hear from you. A smaller, more engaged list reliably outperforms a larger, stagnant one on the metric that actually matters: whether your mail reaches the inbox at all.",
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/7875829/pexels-photo-7875829.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'Hands sorting through papers in a binder on a desk',
    caption: "Hygiene is sorting, not deleting on sight, most of the work is figuring out which bucket an address actually belongs in.",
  },
  {
    type: 'h2',
    text: "Use clicks, not opens, to judge who's actually inactive",
  },
  {
    type: 'p',
    text: "Apple Mail Privacy Protection pre-loads tracking pixels for a large share of opens regardless of whether a human ever looked at the message, which means open rate alone isn't a trustworthy signal for who's actually engaged. Clicks don't have that problem, a recorded click means a real person did something. When deciding who counts as dormant for cleaning purposes, lean on click activity (or site visits, purchases, any real action) over opens, or you risk suppressing people who were engaged the entire time and just never showed up correctly in an inflated open metric.",
  },
  {
    type: 'h2',
    text: 'A cadence that actually gets followed',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Immediate: hard bounces auto-suppress.',
        text: "Confirm this is actually configured in your ESP rather than assumed. It usually is by default, but it's worth one actual check.",
      },
      {
        bold: 'Ongoing: soft bounces suppress after 3 to 4 consecutive failures.',
        text: "Most ESPs can automate this threshold directly, so it doesn't require manual review per address.",
      },
      {
        bold: 'Quarterly, or before any campaign where deliverability really matters: segment by click-based engagement.',
        text: "Pull the genuinely dormant segment (no clicks across a stretch that's meaningfully longer than your normal send cadence) and send one real win-back attempt before removing anyone.",
      },
      {
        bold: "Suppress what doesn't respond to the win-back, not before it.",
        text: "The cleaning happens after the attempt, not instead of it, removing someone who simply hasn't had a reason to click yet is a different mistake than keeping someone who's been silent for two years.",
      },
    ],
  },
  {
    type: 'p',
    text: "That last point is worth being explicit about: the right dormancy threshold scales with how often you actually send. Ninety days of silence means something different to a list that gets emailed weekly than to one that gets emailed monthly. Borrowing a fixed number from a guide written for someone else's sending frequency is how a healthy subscriber gets mistaken for a stale one.",
  },
];
