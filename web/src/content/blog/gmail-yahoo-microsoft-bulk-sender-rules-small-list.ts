import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'gmail-yahoo-microsoft-bulk-sender-rules-small-list',
  title: 'Gmail, Yahoo and Microsoft Bulk Sender Rules: Does a Small List Need to Care?',
  description:
    "The headlines made it sound like email was about to change overnight. For most small senders the reality is calmer: here is what the rules actually require, who they target, and the short checklist that covers you anyway.",
  date: '2026-10-24',
  readTime: '7 min read',
  category: 'Deliverability',
  image: 'https://images.pexels.com/photos/20716656/pexels-photo-20716656.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'A smartphone displaying the Gmail app logo, resting on a wooden desk',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "Since Google and Yahoo announced stricter sender requirements, and Microsoft followed for Outlook.com traffic, a lot of small business owners have been told some version of \"your emails will stop arriving unless you act.\" That framing is mostly fear-driven. The rules are real and worth understanding, but most of the heaviest requirements are aimed at a kind of sender a typical small business is not.",
  },
  {
    type: 'h2',
    text: 'What the rules actually say',
  },
  {
    type: 'p',
    text: "The providers split senders into two groups. Everyone sending to their users has a baseline. Bulk senders, which Google defines as sending roughly 5,000 or more messages per day to Gmail addresses, face a stricter tier. Exact wording and enforcement details differ between providers and have shifted over time, so check each provider's current sender guidelines rather than relying on any summary, including this one.",
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'For all senders:',
        text: "authenticate with SPF or DKIM, keep spam complaint rates low, and send from a properly configured domain with working reverse DNS.",
      },
      {
        bold: 'For bulk senders, additionally:',
        text: "authenticate with both SPF and DKIM, publish a DMARC policy, align the visible From domain with the authenticated domain, and support one-click unsubscribe for marketing mail, honoring requests within about two days.",
      },
      {
        bold: 'Spam complaints:',
        text: "Google's guidance is to stay under 0.1% and never reach 0.3%. Those thresholds apply to everyone in spirit, even if the formal bulk rules do not.",
      },
    ],
  },
  {
    type: 'h2',
    text: 'Where a small list actually sits',
  },
  {
    type: 'p',
    text: "If you are mailing a list of a few hundred or a few thousand people, a couple of times a month, you are almost certainly far below the daily bulk threshold. That means the strictest formal requirements likely do not apply to you directly. But there are two reasons not to shrug and move on.",
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/17489157/pexels-photo-17489157.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A server rack with glowing blue indicator lights',
    caption: "Mailbox providers filter on behavior and authentication, whether or not you technically count as a bulk sender.",
  },
  {
    type: 'p',
    text: "First, the baseline still applies, and unauthenticated mail from a small sender has been getting filtered harder for years regardless of volume. Second, the practices the bulk rules require are simply what good senders already do. Meeting them costs little and removes a category of problems.",
  },
  {
    type: 'h2',
    text: 'The short checklist that covers you either way',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Send through a platform that authenticates for you.',
        text: "Reputable email tools handle SPF and DKIM once you verify your domain. If you use a custom domain, finish that setup step rather than skipping it.",
      },
      {
        bold: 'Add a DMARC record.',
        text: "Even a monitoring-only policy (p=none) is better than none. It is a single DNS text record, and our earlier piece on SPF, DKIM and DMARC walks through it.",
      },
      {
        bold: 'Send from an address on your own domain.',
        text: "A gmail.com From address sent through a marketing platform is the classic way to fail alignment checks.",
      },
      {
        bold: 'Make unsubscribing easy.',
        text: "A visible link in every email, honored promptly. If your platform supports the one-click header, leave it on.",
      },
      {
        bold: 'Watch your complaint rate.',
        text: "Only email people who asked to hear from you, and prune the ones who stopped engaging. This does more for deliverability than any DNS record.",
      },
    ],
  },
  {
    type: 'h2',
    text: 'When you should worry more',
  },
  {
    type: 'p',
    text: "Your situation changes if you are growing fast, if you send high-volume transactional and marketing mail from the same domain, or if you migrate from a platform that handled everything to one you configure yourself. In those cases, check the current provider guidelines and test with a tool that reports authentication results.",
  },
  {
    type: 'p',
    text: "The honest summary: the new rules are not a cliff edge for a small business sending permission-based email. They are a reminder to finish the setup you probably should have finished already, keep your list clean, and let people leave easily. Do those three things and you are in better shape than the headlines suggested you would need to be.",
  },
];
