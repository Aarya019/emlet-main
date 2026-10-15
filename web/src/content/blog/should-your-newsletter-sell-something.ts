import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'should-your-newsletter-sell-something',
  title: 'Should Your Newsletter Actually Be Selling Something?',
  description:
    "Pure-value content and a straightforward pitch get treated as opposites, pick one. Most newsletters that actually work for a small business live somewhere in between, and the mix is a deliberate choice, not an accident.",
  date: '2026-10-15',
  readTime: '7 min read',
  category: 'Small Business',
  image: 'https://images.pexels.com/photos/2041387/pexels-photo-2041387.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'A person writing by hand at a wooden desk with a cup of coffee nearby',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "\"Provide value, don't just sell\" is close to universal newsletter advice, and it's not wrong, a newsletter that's nothing but pitches trains its list to stop opening. But taken too literally, it produces a different failure: a newsletter so allergic to selling that it never actually asks for the sale, month after month of genuinely useful content that never converts into revenue because asking felt like it would ruin the relationship.",
  },
  {
    type: 'h2',
    text: 'Why the pure-value model has a ceiling',
  },
  {
    type: 'p',
    text: "A newsletter that only ever educates, entertains, or informs builds trust, real trust, but trust alone doesn't pay the bills. At some point, a business sending a newsletter needs some portion of that list to actually buy something, and if the newsletter has spent a year carefully avoiding ever mentioning the product, asking for the first time feels like a jarring shift in tone rather than a natural next step. The recipient was never primed for it. Pure-value content works best as a list-growth and trust-building tool, not as the entire strategy for a business that needs the list to eventually generate revenue.",
  },
  {
    type: 'h2',
    text: "Why the all-pitch model burns out faster",
  },
  {
    type: 'p',
    text: "The opposite failure is more obviously self-defeating and doesn't need much explanation: a newsletter that's a product pitch every single send trains recipients to stop opening almost immediately, since there's no reason to read something that's reliably just an ad. Unsubscribe and complaint rates climb, engagement cratering in exactly the way that damages sender reputation, a connection covered in more detail in the deliverability pieces on this blog. Open rates on an all-pitch newsletter tend to decay faster over time than on a newsletter that mixes in real content, simply because there's nothing pulling a recipient back in besides whatever's being sold that week.",
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/8666810/pexels-photo-8666810.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'An old-fashioned balance scale with weights on one side',
    caption: "The real question isn't content versus sales, it's what ratio actually earns the right to ask.",
  },
  {
    type: 'h2',
    text: 'A rougher, more honest framing: the 80/20 version',
  },
  {
    type: 'p',
    text: "A commonly cited starting ratio, not a rigid rule, is roughly 80% genuinely useful content to 20% direct promotion, often phrased as \"earn the right to sell\" by sending several sends of real value before one that asks for something. The exact ratio matters less than the underlying logic: every pitch needs to be backed by enough non-pitch sends that the relationship doesn't feel transactional, and the content needs to be good enough on its own that a recipient wouldn't mind getting it even if they never buy anything.",
  },
  {
    type: 'h2',
    text: "What hybrid actually looks like in a single send, not just across a sequence",
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Lead with something genuinely useful, not a thin wrapper around the pitch.',
        text: "A real tip, a real answer to a question your audience actually has, something that would hold up even with the promotional section deleted entirely.",
      },
      {
        bold: "Let the product connect naturally to what you just said, don't force it in.",
        text: "If the useful content and the offer don't have an honest connection, that's a signal the pitch belongs in a different send, not that it needs a more creative segue.",
      },
      {
        bold: 'Keep the promotional section short and clearly marked as promotional.',
        text: "A newsletter that blurs the line, dressing a pitch up as objective advice, erodes trust faster than an openly labeled offer does, since the recipient feels misled rather than sold to.",
      },
      {
        bold: 'Track whether content-only sends and hybrid sends perform differently over time, not just per-send.',
        text: "A single send's numbers are noisy. Whether open rates on your content-only sends stay healthy over several months is the real signal for whether your current ratio is sustainable.",
      },
    ],
  },
  {
    type: 'p',
    text: "The honest answer to \"should your newsletter sell something\" is usually yes, eventually, but not every time, and not without having earned it first. A newsletter that never sells leaves revenue on the table it built the trust to capture. A newsletter that always sells spends that trust faster than it can rebuild it. The sustainable version is a deliberate mix, decided on purpose, not a default picked because selling felt uncomfortable or because content alone felt safer.",
  },
];
