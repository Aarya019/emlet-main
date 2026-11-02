import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'what-to-put-in-an-email-footer',
  title: 'What to Put in an Email Footer (With Examples)',
  description:
    "What belongs in an email footer: who you are, why they got it, an easy unsubscribe link and a postal address, with three examples you can adapt.",
  date: '2026-11-02',
  readTime: '6 min read',
  category: 'Compliance',
  image: 'https://images.pexels.com/photos/7875829/pexels-photo-7875829.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'Hands sorting through papers in a binder on a desk',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "The footer is the part of an email that almost everyone copies from the last campaign and nobody checks. It is also where three things meet: legal requirements, trust and deliverability. A missing address or a hidden unsubscribe link leads to complaints, and complaints affect where your emails land. This is general information, not legal advice, and the rules differ by country, so check the ones that apply to you.",
  },
  {
    type: 'h2',
    text: 'What a footer should contain',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Who you are.',
        text: "Your business name, so there is no doubt about who sent it.",
      },
      {
        bold: 'Why they are getting it.',
        text: "One sentence, such as \"You are receiving this email because you signed up for updates from Groove Street Records.\" It reminds people they asked for it, which reduces spam complaints.",
      },
      {
        bold: 'A working unsubscribe link.',
        text: "Plain wording that takes people to a page that removes them without a login. Gmail and Yahoo expect bulk senders to support [one-click unsubscribe](/blog/one-click-unsubscribe-what-it-is-and-how-to-set-it-up), and it is simply good manners.",
      },
      {
        bold: 'A postal address.',
        text: "In the US, the CAN-SPAM Act requires a valid physical postal address in commercial email. According to the FTC's CAN-SPAM guide, that can be your street address, a post office box registered with the US Postal Service, or a private mailbox registered with a commercial mail receiving agency. Other countries have their own rules about identifying the sender.",
      },
      {
        bold: 'A way to reach you.',
        text: "A reply address or contact email. People who can reach a human are less likely to press the spam button.",
      },
      {
        bold: 'Optional extras.',
        text: "A link to manage preferences (so people can choose fewer emails instead of none), a link to your privacy policy, and a \"view in browser\" link if your platform adds one.",
      },
    ],
  },
  {
    type: 'p',
    text: "Honoring opt-outs matters as much as offering them. CAN-SPAM says an opt-out request must be honored within 10 business days, and most email platforms do it immediately and automatically. Where GDPR applies, being clear about who you are and making it as easy to withdraw as it was to sign up are the habits to aim for. Our post on [GDPR and CAN-SPAM basics](/blog/gdpr-can-spam-basics-first-campaign) covers the first-campaign checklist.",
  },
  {
    type: 'h2',
    text: 'Three footers you can adapt',
  },
  {
    type: 'p',
    text: "A minimal footer for a newsletter:",
  },
  {
    type: 'quote',
    text: "You are receiving this because you subscribed to the Groove Street Records newsletter. Groove Street Records, 12 Example Lane, Portland, OR 97201, United States. Unsubscribe.",
  },
  {
    type: 'p',
    text: "A warmer one for a local business:",
  },
  {
    type: 'quote',
    text: "You are getting this email because you joined our list in the shop or on our website. We only send news about new stock and events, about twice a month. If that is more than you want, you can choose fewer emails or unsubscribe. Groove Street Records, 12 Example Lane, Portland, OR 97201, United States. Questions? Just reply to this email.",
  },
  {
    type: 'p',
    text: "And one for a receipt or account email, which is about a purchase or an account rather than a promotion:",
  },
  {
    type: 'quote',
    text: "This is a service email about your account with Groove Street Records, so we send it even if you have opted out of marketing emails. Groove Street Records, 12 Example Lane, Portland, OR 97201, United States. Questions? Reply to this email.",
  },
  {
    type: 'p',
    text: "Receipts and password resets are treated differently from promotions, and mixing the two can hurt delivery. Our post on [transactional and marketing email](/blog/transactional-vs-marketing-email-deliverability) explains why.",
  },
  {
    type: 'h2',
    text: 'Mistakes that cause trouble',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'An unsubscribe link nobody can see.',
        text: "Pale grey on white in tiny type is a common design choice and a common reason people click \"report spam\" instead. Keep footer text at a readable size and aim for at least 4.5:1 contrast, as our [accessibility guide](/blog/email-accessibility-guide) explains.",
      },
      {
        bold: 'A placeholder left in the template.',
        text: "The unsubscribe link should be the real one from your email platform, not a \"#\" or an example URL. Check the first live send as well as the test.",
      },
      {
        bold: 'Making people log in to leave.',
        text: "Unsubscribing should take a click or two. Anything harder pushes people to the spam button.",
      },
      {
        bold: 'An old address.',
        text: "If you move, update the footer. It is easy to forget because nobody looks at it.",
      },
      {
        bold: 'A footer only in the HTML version.',
        text: "Include the same text in the plain-text version of the email, since some apps and filters read it.",
      },
    ],
  },
  {
    type: 'h2',
    text: 'Where the unsubscribe link comes from',
  },
  {
    type: 'p',
    text: "You rarely write the link yourself. Your email platform inserts it from a merge tag, and each platform uses its own. Mailchimp uses *|UNSUB|*, MailerLite uses {$unsubscribe}, and Brevo uses {{ unsubscribe }}. Tags can change, so confirm the current one in your platform's help pages before you rely on it.",
  },
  {
    type: 'h2',
    text: 'Or build it in a minute',
  },
  {
    type: 'p',
    text: "The free [Email Footer Generator](/tools/email-footer-generator) lets you enter your business name, address and reason line, pick your email platform, and copy a footer as email-safe HTML and plain text, with a quick check for the basics above. It runs in your browser, so the details you enter stay with you. It is a starting point, not legal advice.",
  },
];
