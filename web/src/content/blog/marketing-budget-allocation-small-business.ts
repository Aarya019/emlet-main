import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'marketing-budget-allocation-small-business',
  title: 'Marketing Budget Allocation for Small Businesses: A Realistic Starting Split',
  description:
    "Most budget allocation advice is written for a company that already has a proven channel and a sales team to match. Here's a starting split for a business that doesn't have either yet, and the mistake that wastes the most money early on.",
  date: '2026-10-01',
  readTime: '7 min read',
  category: 'Small Business Marketing',
  image: 'https://images.pexels.com/photos/7964208/pexels-photo-7964208.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'A hand drawing a pie chart on paper next to a cup of coffee',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "Ask how to split a marketing budget and you'll get a pie chart: some percentage to paid ads, some to content, some to social, some to email, all presented with a confidence that makes it look like a settled formula. Most of those charts come from companies with an established sales funnel, a sales team to hand leads to, and enough volume to know which channel is actually working. A brand-new or small business usually has none of that yet, which makes the standard advice mostly irrelevant to the actual decision in front of you.",
  },
  {
    type: 'h2',
    text: "Why copying a big company's split doesn't transfer",
  },
  {
    type: 'p',
    text: "A large company spends heavily on brand awareness because it already has the conversion infrastructure to capture demand once it exists, a sales team, a mature website, a retention program. For a small business, awareness spend without a working conversion path is money spent making strangers aware of something they still can't easily buy from, follow up with, or trust. The actual constraint early on usually isn't \"not enough people know we exist,\" it's \"we haven't proven any single channel reliably turns attention into a customer yet.\" Budget allocation advice that starts with awareness is answering a question most small businesses haven't earned the right to ask yet.",
  },
  {
    type: 'h2',
    text: 'The real first mistake: spreading too thin, not spending wrong',
  },
  {
    type: 'p',
    text: "The more common failure isn't picking the wrong channel, it's picking five channels at once with a budget that was only ever going to produce a meaningful signal in one. Splitting a modest budget evenly across paid ads, social, content, and email means none of them gets enough volume to tell you anything reliable. You end up with five inconclusive experiments instead of one conclusive one. The fix isn't a better ratio, it's concentration: put most of the budget behind the one or two channels most plausible for your specific business, run them long enough to get a real signal, and only diversify once one is proven.",
  },
  {
    type: 'h2',
    text: 'A starting split, not a permanent one',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Owned channels first (roughly 40%): email, content, your own site.',
        text: "These are the channels you don't pay rent on. An email list you build keeps compounding without continued spend to sustain it, unlike an ad that stops producing the moment you stop paying for it. For a business with more time than cash, this is usually where the first real effort belongs.",
      },
      {
        bold: 'Paid, tightly targeted (roughly 35%): one channel, not several.',
        text: "Pick the single paid channel most plausible for your actual customer (search ads for a solved problem people look for, social ads for something more visually or impulse-driven) and give it enough budget to produce a statistically meaningful result, rather than splitting it across platforms where none gets enough spend to learn anything.",
      },
      {
        bold: 'Community and earned (roughly 15%): time-intensive, not free, but low-cash-cost.',
        text: "Participating genuinely in the places your actual customers already gather, answering questions, being useful, mentioning what you do only when it's relevant, builds trust that paid channels can't buy at this stage. It costs time more than money, which is often the trade a small business should be making.",
      },
      {
        bold: 'Reserve for testing (roughly 10%): held back, not allocated yet.',
        text: "A small pool set aside specifically to try one new channel for a defined period, with a clear number that decides whether it graduates into the regular budget or gets dropped. This keeps experimentation from quietly eating the budget of whatever's already working.",
      },
    ],
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/5900132/pexels-photo-5900132.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A person reviewing receipts and using a calculator next to a laptop',
    caption: "The split matters less than actually tracking what each dollar produced, most small businesses skip this part.",
  },
  {
    type: 'h2',
    text: "What percentage of revenue, if you're asking that instead",
  },
  {
    type: 'p',
    text: "The range that gets cited most often for an established small business sits somewhere around 7 to 12% of gross revenue, with newer businesses prioritizing growth sometimes going higher and low-margin businesses needing to stay well under that. Treat that range as a sanity check, not a target. A business with zero proven channels spending 12% of revenue chasing five untested tactics is in a worse position than one spending 5% concentrated on the one channel it has real evidence for.",
  },
  {
    type: 'h2',
    text: 'The one number that should move the split',
  },
  {
    type: 'p',
    text: "None of these percentages matter as much as a single discipline: know roughly what it costs you to acquire a customer through each channel you're actually running, and let that number, not a pie chart, decide where next month's budget shifts. A channel that's quietly profitable deserves more of the budget than the split above gives it. One that's burning cash with nothing to show deserves less, regardless of how standard its allocation is supposed to be. The starting split above is just a reasonable place to begin measuring from, not a formula to defend once the data says otherwise.",
  },
];
