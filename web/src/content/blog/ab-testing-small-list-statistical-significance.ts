import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'ab-testing-small-list-statistical-significance',
  title: "A/B Testing With a Small List: What to Do When You Don't Have the Volume for Significance",
  description:
    "Most A/B testing advice assumes a list size most small businesses don't have. A 22% vs 18% open rate on a few hundred sends usually isn't a result, it's noise. Here's what to test instead, and why.",
  date: '2026-10-07',
  readTime: '6 min read',
  category: 'Research',
  image: 'https://images.pexels.com/photos/8123829/pexels-photo-8123829.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'Two people reviewing a hand-drawn line graph on paper',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "Run an A/B test on a list of a few hundred people and you'll get a winner. Subject line A gets 22% opens, subject line B gets 18%. It feels like a result. Most of the time, at that list size, it isn't one, it's noise that happened to land on one side, and the standard A/B testing advice rarely mentions how much volume it actually takes to tell the difference.",
  },
  {
    type: 'h2',
    text: 'What significance actually means, and why small samples need bigger gaps',
  },
  {
    type: 'p',
    text: "Statistical significance is really a question about how likely it is that the difference you saw could have happened by pure chance, even if the two versions performed identically. Flip a coin 20 times and getting 12 heads instead of an even 10 doesn't mean the coin is biased, that gap is well within normal randomness at that sample size. Flip it 2,000 times and a 12%-skewed result would be a real signal. Email works the same way: a small sample needs a much bigger relative gap between two versions before you can trust it's real and not noise. A 2-point difference (18% vs 20%) is close to impossible to trust at a few hundred recipients. A 2x difference (10% vs 20%) might actually be trustworthy at that same size, because the gap is large enough to stand out from the noise floor.",
  },
  {
    type: 'h2',
    text: "Why most A/B testing content doesn't mention this",
  },
  {
    type: 'p',
    text: "Most guides showing clean, confident A/B results come from companies sending to lists that are an order of magnitude larger than what most small businesses have, where a 2-point gap genuinely is detectable because the sample size is big enough to separate signal from noise. The advice isn't wrong, it's just calibrated for a list size that doesn't describe most of the people reading it. Applied to a list of a few hundred, the same testing process produces a result that looks exactly as clean and is far more likely to just be chance.",
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/34511909/pexels-photo-34511909.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'Two pencils, one orange and one black, lying on contrasting orange and black backgrounds',
    caption: "At small volume, a test only tells you something if the two versions are genuinely different, not a shade apart.",
  },
  {
    type: 'h2',
    text: 'What to actually test instead',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Test big, obvious differences, not marginal tweaks.',
        text: "A short email vs. a long one, a question subject line vs. a statement, a single CTA vs. three. Differences large enough that even a noisy small sample has a chance of showing something real, instead of button-color or single-word subject line swaps that need volume you don't have to ever separate from chance.",
      },
      {
        bold: 'Accumulate evidence across many sends, not one test.',
        text: "Track which style wins more often than it loses across 10 or 15 campaigns rather than treating any single test as a verdict. A pattern that holds up repeatedly over time is far more trustworthy than one clean-looking result from one send.",
      },
      {
        bold: 'Treat results as directional, not proof.',
        text: "Pair the numbers with what you can actually see: reply content, which links got clicked, who unsubscribed and when. At small scale, a test result is one input into a judgment call, not a definitive answer on its own.",
      },
      {
        bold: 'Split by time instead of by send when a list is especially small.',
        text: "Run version A on every Tuesday send and version B on every Thursday send for a month, rather than splitting one list in half for one send. It takes longer, but it builds up far more combined data before you have to decide anything.",
      },
    ],
  },
  {
    type: 'h2',
    text: "A single test isn't where the confidence should come from",
  },
  {
    type: 'p',
    text: "None of this means testing is pointless at small scale, it means the unit of confidence has to shift. A big list can trust one well-run test. A small list has to trust a pattern that holds up across many of them, paired with judgment about what actually makes sense for the audience. That's a slower, less satisfying process than a single test with a clean-looking winner, but it's the version that's actually telling you something true.",
  },
];
