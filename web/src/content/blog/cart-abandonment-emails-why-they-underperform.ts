import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'cart-abandonment-emails-why-they-underperform',
  title: 'Cart Abandonment Emails: Why Most Underperform, and What Actually Fixes It',
  description:
    "The average abandoned-cart flow still only recovers a fraction of lost sales, and it's usually not the tactic that's broken. It's the timing, the discount you led with, or measuring against shoppers who were never going to buy in the first place.",
  date: '2026-09-10',
  readTime: '7 min read',
  category: 'Email Marketing',
  image: 'https://images.pexels.com/photos/6214365/pexels-photo-6214365.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'A shopping cart icon and checkout screen displayed on a laptop',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "Somewhere between 69% and 75% of online shopping carts get abandoned before checkout, depending on which study you're reading and which industries it covers. That stat gets cited so often it's become wallpaper: everyone nods, then moves straight to \"so send a recovery email\" as if that's the whole fix. It isn't quite. Cart abandonment emails do work, Klaviyo puts their average open rate above 50%, but the gap between that headline number and what a lot of senders actually see in their own flow usually comes down to three or four specific, fixable mistakes, not bad luck or a saturated tactic.",
  },
  {
    type: 'h2',
    text: 'What "good" actually looks like',
  },
  {
    type: 'p',
    text: "Worth anchoring on real numbers before diagnosing anything. Across platforms, abandoned-cart flows average somewhere around a 50% open rate, with the top 10% of senders reaching into the mid-60s. Placed-order rate, the share of the flow that ends in an actual purchase, averages around 3.3%, which is still the highest conversion rate of any automated email flow, beating welcome series and browse-abandonment by a wide margin. Revenue per recipient lands around $3.65 on average. Those are industry midpoints, not targets, and they vary a lot by price point and category, but they're a more useful baseline than \"recover everything\" or \"recover nothing,\" which is the two-option framing a lot of senders default to.",
  },
  {
    type: 'h2',
    text: 'Start with why people actually left',
  },
  {
    type: 'p',
    text: "Before fixing the email, it's worth being honest about why the cart got abandoned in the first place, because not every reason is one an email can solve. Unexpected costs, shipping, taxes, fees revealed late in checkout, are the single biggest driver, cited by roughly half of shoppers. A complicated or too-long checkout accounts for close to one in five abandonments. Being forced to create an account before buying pushes away about a quarter of shoppers. Trust concerns about handing over payment details account for another meaningful slice. And critically, a large share, some research puts it around 42%, say they were just browsing and weren't ready to buy at all.",
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/6567546/pexels-photo-6567546.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A woman looking at her phone while holding a credit card near a laptop',
    caption: 'A chunk of every abandoned cart was never a real purchase intent to begin with.',
  },
  {
    type: 'p',
    text: "That last group matters more than most recovery-email advice admits. If close to half of your abandoners were window shopping, a perfectly written email isn't going to convert them, and judging your flow against 100% of abandoned carts instead of the addressable slice makes a genuinely good flow look like a failing one. The senders who get discouraged and abandon the tactic entirely are often just measuring against the wrong denominator.",
  },
  {
    type: 'h2',
    text: 'The timing mistake most senders still make',
  },
  {
    type: 'p',
    text: "Multiple studies converge on the same answer here: the first email should go out 30 to 60 minutes after abandonment, not the next morning. The logic is straightforward. Wait too long and the shopper has already bought elsewhere or lost the impulse entirely; send it while they're still mid-decision and you catch them before the moment passes. It also gives a real window for self-checkout, someone who comes back and finishes on their own within that hour never needs to see the email at all.",
  },
  {
    type: 'table',
    headers: ['Email', 'Send it', "Its one job"],
    rows: [
      ['1', '30 to 60 minutes after abandonment', "Reminder, no discount. Just the cart, clearly, in case it was a tab they forgot."],
      ['2', '24 hours later', "Address a real objection: shipping cost, trust, or a nudge like free shipping."],
      ['3', '2 to 3 days later', "Last call, with urgency only if it's genuine (limited stock, a real deadline)."],
    ],
    caption: 'A three-email sequence is the most common structure across the research, though more considered purchases sometimes do better with a slightly longer first delay.',
  },
  {
    type: 'h2',
    text: 'The discount trap',
  },
  {
    type: 'p',
    text: "The fastest way to make an abandoned-cart flow underperform long-term is putting a discount code in email one. It recovers the immediate sale, but it also teaches your most attentive shoppers a pattern: add to cart, do nothing, wait for the email, get a code. Repeat customers figure this out fast, and once they do, you're discounting sales you would have gotten at full price anyway. The margin math on that is quietly brutal over a year of repeat buyers.",
  },
  {
    type: 'p',
    text: "The fix isn't \"never discount,\" it's sequencing the discount so it's the last resort, not the opener. Lead with the plain reminder, address a real objection like shipping cost in the second email (free shipping is a lighter lever than a percentage off and doesn't train the same behavior as aggressively), and hold the actual discount for the final email, ideally as a single-use, frequency-capped code rather than a reusable one that's easy to hoard or share.",
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/8938663/pexels-photo-8938663.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A payment form open on a laptop during an online checkout',
    caption: 'Every discount you hand out by default is a discount some of those buyers would have skipped.',
  },
  {
    type: 'h2',
    text: 'What actually goes in each email',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Show the actual product, not a generic banner.',
        text: "A photo and name of what's in the cart, pulled dynamically, outperforms a templated \"you left something behind\" graphic every time. It's the difference between a reminder and an ad.",
      },
      {
        bold: 'One visible call to action, not three competing ones.',
        text: "\"Complete your order\" linking straight back to the pre-filled cart. Don't split attention with a secondary \"browse more\" button in the same email.",
      },
      {
        bold: "Only use urgency that's true.",
        text: "A real low-stock count or a real time-limited offer works. A countdown timer that resets every time someone reopens the email erodes trust in every future email you send them, not just this one.",
      },
      {
        bold: "Address trust directly if that's a plausible reason.",
        text: "A security badge, a returns policy line, or a review snippet near the CTA does real work for the roughly one in six shoppers who back out over payment-security concerns.",
      },
    ],
  },
  {
    type: 'p',
    text: "None of this is exotic advice. What's actually happening in most underperforming flows is a combination of the wrong denominator (measuring against unrecoverable browsers), the wrong timing (a first email sent hours too late), and a discount habit that quietly trains away future full-price sales. Fix those three and the flow usually starts looking a lot closer to the benchmarks than the tactic itself ever needed replacing.",
  },
];
