import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'transactional-vs-marketing-email-deliverability',
  title: 'Transactional vs Marketing Emails: Why Mixing Them Can Hurt Deliverability',
  description:
    "A receipt and a promotional blast are both \"email,\" but mailbox providers don't treat them the same way, and sending them through the same pipe can quietly drag your order confirmations into spam along with your newsletter.",
  date: '2026-10-14',
  readTime: '7 min read',
  category: 'Deliverability',
  image: 'https://images.pexels.com/photos/6214365/pexels-photo-6214365.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'Shopping bag, credit card, and letter tiles spelling SHOPPING on a laptop keyboard',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "A password reset, an order confirmation, and a weekly newsletter are all technically \"email,\" and a lot of small setups send all three through the exact same account and the exact same sending infrastructure. Mailbox providers don't see them as equivalent, though, and treating them as interchangeable is one of the more common ways a business ends up with its receipts landing in spam without ever figuring out why.",
  },
  {
    type: 'h2',
    text: "What actually separates the two",
  },
  {
    type: 'p',
    text: "Transactional email is triggered by something a specific person just did: a purchase, a password reset, a shipping update, a receipt. The recipient is expecting it, often within minutes of the action that caused it, and it's addressed to exactly one person about exactly one thing. Marketing email is sent in bulk, on a schedule you control rather than the recipient's action, to a list rather than to one person who just did something specific. The content is similar enough, both are \"email\" in the literal sense, but the expectation, the timing, and the volume pattern are completely different.",
  },
  {
    type: 'h2',
    text: 'Why mailbox providers care about the difference',
  },
  {
    type: 'p',
    text: "Spam filtering leans heavily on sender reputation now, a theme that comes up across most of the deliverability posts on this blog, and reputation is tracked per sending domain and per sending IP. A domain that sends receipts gets judged on receipt-like behavior: near-perfect open and click patterns tied to a real action, very few spam complaints, essentially no unsubscribes since nobody unsubscribes from their own order confirmation. A domain that also sends a weekly promotional blast to a cold or stale segment of the same list gets judged on that behavior too: lower engagement, more complaints, more unsubscribes. When both flow through the same domain and IP, the marketing email's worse engagement metrics drag down the reputation that the transactional email depends on, even though the transactional email itself did nothing wrong.",
  },
  {
    type: 'p',
    text: "The practical result: a promotional campaign that gets flagged or generates a spike in spam complaints can take your order-confirmation emails down with it, right when a customer is actively waiting on one. That's a materially worse failure than a newsletter landing in spam, since a missed receipt turns into a support ticket or a lost sale, not just an unread email.",
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/4968388/pexels-photo-4968388.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A hand holding several paper receipts next to a wallet',
    caption: "A receipt is the clearest example of transactional email: expected, specific, and tied to something the recipient just did.",
  },
  {
    type: 'h2',
    text: 'How bigger senders actually solve this',
  },
  {
    type: 'p',
    text: "Separation, not better copywriting. Larger ESPs and companies with real email volume typically send transactional and marketing mail from different subdomains, something like `receipts.yourdomain.com` for transactional and `news.yourdomain.com` or `mail.yourdomain.com` for marketing, each with its own SPF and DKIM authentication and, often, a dedicated sending IP for transactional traffic specifically. That way, a reputation hit on the marketing side has no path to the transactional side, since mailbox providers evaluate reputation at the sending-domain and IP level rather than treating the whole company as one undifferentiated sender.",
  },
  {
    type: 'h2',
    text: "What this actually means for a small business, which probably isn't running separate IPs",
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Full IP and subdomain separation is a bigger-sender problem.',
        text: "If your volume is small, a dedicated sending IP is often not worth the setup and warm-up cost. Subdomain separation (receipts on one subdomain, marketing on another) is the smaller, still meaningful step, and most transactional email providers and modern ESPs support it without much extra configuration.",
      },
      {
        bold: "At minimum, don't send promotional campaigns through the same account you use for password resets and receipts.",
        text: "A lot of small setups use one transactional-email API key for literally everything because it's already configured and working. Splitting transactional traffic onto its own sending service or subdomain, even without full IP separation, keeps a bad marketing campaign from touching the emails your customers are actively depending on.",
      },
      {
        bold: 'Keep transactional email out of marketing-style list hygiene processes entirely.',
        text: "Transactional emails shouldn't be subject to the same send-frequency caps, A/B tests, or suppression lists built for promotional content, since the recipient didn't opt into a campaign, they took an action that requires a specific, immediate response.",
      },
      {
        bold: "Watch complaint and bounce rates on the marketing side specifically.",
        text: "If you can only check one thing, check where your complaints are concentrated. A marketing send with a rising complaint rate is the exact scenario that puts shared infrastructure, and your receipts along with it, at risk.",
      },
    ],
  },
  {
    type: 'p',
    text: "The underlying point isn't that marketing email is inherently bad for deliverability, every business running newsletters sends it. It's that a promotional campaign and a password reset carry very different risk profiles, and infrastructure built as if they're interchangeable means one bad campaign can take the other down with it. Separating them, even just by subdomain, is cheap insurance against that specific failure.",
  },
];
