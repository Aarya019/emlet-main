import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'retention-vs-acquisition-small-business-email',
  title: 'Retention vs Acquisition: Why the List You Already Have Is Your Most Predictable Growth Lever',
  description:
    "Chasing new customers is exciting and expensive. For many small businesses the faster, cheaper gains are sitting in the list they already have. Here is the case for retention, and what to actually send.",
  date: '2026-10-25',
  readTime: '7 min read',
  category: 'Small Business',
  image: 'https://images.pexels.com/photos/11341894/pexels-photo-11341894.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'A handwritten note reading "Thank you" next to a pen',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "Ask a small business owner how they want to grow and the answer is usually some version of \"more customers.\" Ads, social posts, a new landing page. It is the natural instinct, and it is also the most expensive way to grow, because every new customer has to be found, convinced, and won from scratch.",
  },
  {
    type: 'p',
    text: "Meanwhile, a list of people who already bought from you, or at least asked to hear from you, sits mostly ignored. For a lot of small businesses that list is the most predictable growth lever they have.",
  },
  {
    type: 'h2',
    text: 'The economics, with a caveat',
  },
  {
    type: 'p',
    text: "You will often see the claim that keeping a customer costs five to twenty-five times less than acquiring a new one. It gets repeated so much that its origin is hard to trace, and the real ratio clearly depends on the business, so do not quote it as a law. The direction, though, is well supported by common sense and by most businesses' own numbers: advertising to strangers costs money on every impression, while emailing someone who already knows you costs almost nothing per send.",
  },
  {
    type: 'p',
    text: "There is also a compounding effect. A repeat customer has already cleared the biggest hurdle, trust. They know your product works, they know how checkout goes, and they are far more likely to buy again, buy more, and tell someone else. Small improvements in how many customers come back tend to matter more than the same improvement in how many arrive.",
  },
  {
    type: 'h2',
    text: 'Why small businesses neglect it',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Acquisition feels like progress.',
        text: "A new customer is visible and countable. A customer who did not leave is invisible.",
      },
      {
        bold: 'The list feels too small to bother with.',
        text: "A few hundred subscribers does not look like much, but a few hundred people who chose to hear from you is worth more than thousands of cold impressions.",
      },
      {
        bold: 'There is no obvious campaign.',
        text: "Ads have a dashboard. Retention is a pile of small habits, which is harder to get excited about.",
      },
    ],
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A person reviewing customer data on a laptop spreadsheet',
    caption: "Your own customer data is the cheapest research and the cheapest audience you will ever have.",
  },
  {
    type: 'h2',
    text: 'What to actually send',
  },
  {
    type: 'p',
    text: "You do not need a complicated program. A handful of simple emails cover most of the ground:",
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'A real thank-you after the first purchase.',
        text: "Not a receipt, an actual note. Say what happens next and who to contact if something is wrong. First impressions of the relationship set how it goes.",
      },
      {
        bold: 'A check-in once they have had time to use the product.',
        text: "\"How is it going?\" with an easy way to reply catches problems before they become refund requests, and surfaces your best testimonials.",
      },
      {
        bold: 'A well-timed reorder reminder.',
        text: "If your product runs out, wears out, or needs refreshing, you can estimate when. Send a nudge shortly before that point, not after they have gone elsewhere.",
      },
      {
        bold: 'Useful content between offers.',
        text: "Tips, care instructions, ideas for using what they bought. This keeps your name familiar without asking for money every time. Our post on whether a newsletter should sell something covers how to balance the two.",
      },
      {
        bold: 'A win-back message for people who have gone quiet.',
        text: "A short, honest \"we miss you\" with a reason to return works better than a discount blast, and the re-engagement post on this blog covers when to try one and when to let the address go.",
      },
    ],
  },
  {
    type: 'h2',
    text: 'How to tell whether it is working',
  },
  {
    type: 'p',
    text: "Pick one or two simple numbers and watch them over months, not days. Repeat purchase rate (what share of customers buy a second time) and the time between first and second purchase are both easy to calculate from an order list. If you have a subscription or membership, watch how many people stay month to month. Resist the urge to track everything. A single number you check every month beats a dashboard you never open.",
  },
  {
    type: 'h2',
    text: 'This is not either/or',
  },
  {
    type: 'p',
    text: "None of this means you should stop looking for new customers. A business that only retains will eventually shrink as people naturally drift away. The point is balance and order of operations. Before you spend another pound or dollar on finding strangers, make sure the people who already trust you are being looked after. It is cheaper, it is quicker to see results, and it makes every new customer you do win more valuable.",
  },
];
