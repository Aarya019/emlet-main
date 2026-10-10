import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'single-vs-double-opt-in-signups',
  title: 'Single vs Double Opt-In: Does the Extra Step Actually Cost You Signups?',
  description:
    "Yes, a confirmation click loses some signups. That's not the whole tradeoff. The people double opt-in filters out are disproportionately the ones who were never going to stay engaged anyway.",
  date: '2026-10-10',
  readTime: '6 min read',
  category: 'Email Marketing',
  image: 'https://images.pexels.com/photos/11159131/pexels-photo-11159131.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'An ornate double door at the top of a stone staircase',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "Single opt-in adds someone to your list the moment they submit a form. Double opt-in sends a confirmation email first and only adds them once they click the link inside it. The debate over which to use usually gets framed as a simple numbers question, does the extra step cost you signups, and the honest answer is yes, it does. That's also not the part of the tradeoff that actually matters most.",
  },
  {
    type: 'h2',
    text: "The real cost, and what it's actually filtering for",
  },
  {
    type: 'p',
    text: "Every additional step in any funnel loses some percentage of people, that's just how funnels work, and a confirmation click is a genuine step. Some people never check the inbox they signed up with. Some confirmation emails land in spam before anyone sees them to click. None of that is in dispute. What's missing from the simple version of this debate is who, specifically, that step tends to filter out: mistyped addresses that were never going to receive anything anyway, bot and low-effort signups with no real interest behind them, and people whose intent was weak enough that one extra click was enough to end it. A single-opt-in list counts all of those as subscribers. A double-opt-in list doesn't, which is exactly why the smaller number isn't simply a worse number.",
  },
  {
    type: 'h2',
    text: 'Why a smaller, confirmed list tends to perform better anyway',
  },
  {
    type: 'p',
    text: "List hygiene and engagement rate matter more to deliverability than raw list size, inbox providers weigh how recipients actually respond to your mail far more heavily than how many of them exist. A single-opt-in list routinely needs that same filtering to happen eventually, through bounce suppression and engagement-based cleaning, after the fact. Double opt-in just does that filtering upfront instead of downstream. The list is smaller on day one, but what's left behind is closer to what a cleaned single-opt-in list looks like after a few months of normal attrition anyway, without the bounce and complaint damage along the way.",
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/33440144/pexels-photo-33440144.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A phone screen showing an account verification interface',
    caption: "The confirmation click is a real cost. It's also doing real filtering, not just adding friction.",
  },
  {
    type: 'h2',
    text: "The consent record double opt-in actually buys you",
  },
  {
    type: 'p',
    text: "Beyond list quality, double opt-in produces something single opt-in structurally can't: unambiguous proof that a specific person, at a specific time, actively confirmed they wanted to be on your list. That's close to exactly what a defensible consent record under GDPR is supposed to look like, which is why double opt-in gets recommended so often alongside compliance advice, not as a separate best practice but as a practical way to satisfy it.",
  },
  {
    type: 'h2',
    text: "When single opt-in is the more defensible choice",
  },
  {
    type: 'p',
    text: "This isn't a universal answer either. A brand-new business still building its first few hundred subscribers through personal outreach and real conversations is already getting a natural quality filter, the people signing up know exactly who's asking and why, and losing even a handful of them to a confirmation step can cost more than it protects at that scale. A business running paid traffic to a lead magnet, where typos, bot fills, and low-intent clicks are a real and ongoing risk, has the opposite problem, and the filtering double opt-in provides matters a lot more there. If you'd rather filter after signup instead of before it, a clear welcome email that sets expectations plainly and makes unsubscribing effortless, paired with watching early engagement closely, is a reasonable version of the same idea: just moving the filter to right after signup instead of in front of it.",
  },
];
