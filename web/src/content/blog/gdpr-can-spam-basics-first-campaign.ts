import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'gdpr-can-spam-basics-first-campaign',
  title: "GDPR and CAN-SPAM Basics Before You Send Your First Campaign",
  description:
    "The two laws work on opposite logic: one assumes you can email someone until they opt out, the other assumes you can't until they opt in. Mixing them up is the single most common compliance mistake a first-time sender makes.",
  date: '2026-10-05',
  readTime: '7 min read',
  category: 'Compliance',
  image: 'https://images.pexels.com/photos/5387258/pexels-photo-5387258.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'A person signing a contract document at a desk',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "Before the usual caveat gets skipped past: this is a general, practical overview to understand the shape of two laws before your first send, not legal advice, and the specific penalty figures and finer requirements both laws use get updated periodically. If you're sending at real scale, the five minutes it takes to confirm current specifics with someone qualified is worth it. What follows is the part that doesn't change often: the underlying logic each law runs on, since that's what actually determines what you need to do differently for US versus EU recipients.",
  },
  {
    type: 'h2',
    text: "They run on opposite default assumptions",
  },
  {
    type: 'p',
    text: "This is the single most common point of confusion, and it goes in both directions. CAN-SPAM, the US law, is opt-out by default: you're generally allowed to email someone commercially without their prior permission, as long as you follow the rules and honor their request to stop once they make one. GDPR, the EU law, is opt-in by default: you generally need a valid lawful basis before you email someone at all, and for marketing email that basis is almost always affirmative, specific consent collected in advance. A small business that assumes \"US law is basically GDPR but smaller\" over-restricts itself for no reason. One that assumes \"GDPR just means a working unsubscribe link, same as everywhere else\" is building on the wrong foundation entirely.",
  },
  {
    type: 'h2',
    text: "CAN-SPAM: what it actually requires",
  },
  {
    type: 'ul',
    items: [
      {
        bold: "Honest header and subject line.",
        text: "The \"from\" name, reply-to address, and routing information have to be accurate, and the subject line can't misrepresent what's inside. This is the rule most spam filters and most lawsuits actually hinge on.",
      },
      {
        bold: 'A real physical postal address.',
        text: "Every commercial email needs a valid mailing address somewhere in it, usually the footer. A PO box is generally acceptable; no address at all is not.",
      },
      {
        bold: 'A clear, working opt-out mechanism.',
        text: "An unsubscribe link (or another clear method) has to be present and has to keep working for at least 30 days after the send.",
      },
      {
        bold: 'Opt-outs honored within 10 business days.',
        text: "Once someone unsubscribes, continuing to email them after that window is itself a violation, independent of anything else.",
      },
      {
        bold: "You're responsible even if someone else sends on your behalf.",
        text: "Using an ESP, an agency, or an affiliate doesn't transfer the compliance obligation away from the business whose product is being promoted.",
      },
    ],
  },
  {
    type: 'p',
    text: "Notice what's absent: CAN-SPAM doesn't require someone to have opted in before you email them the first time. That surprises a lot of first-time senders who assume the opposite by default, usually because GDPR is the more commonly discussed law and people quietly apply its logic everywhere.",
  },
  {
    type: 'h2',
    text: "GDPR: what it actually requires",
  },
  {
    type: 'p',
    text: "GDPR applies based on where the recipient is, not where your business is registered or based. A small business anywhere in the world that emails someone in the EU is in scope for that recipient, regardless of whether the business has any EU presence itself. For marketing email specifically, that means consent has to be freely given, specific, informed, and unambiguous, a pre-ticked checkbox or a buried \"by using this site you agree to marketing emails\" clause doesn't meet that bar. The consent also has to be as easy to withdraw as it was to give, and you need to be able to show, if asked, when and how someone actually consented. People covered by GDPR also have rights beyond opting out: to access what data you hold on them, to have it corrected, and to have it deleted (the \"right to be forgotten\"), which matters for how you handle your list, not just how you send to it.",
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/5668481/pexels-photo-5668481.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A wooden gavel resting on a dark desk',
    caption: "Both laws are enforced, both have real penalty structures, and neither is worth treating as a formality.",
  },
  {
    type: 'h2',
    text: 'A practical minimum for a first campaign',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Real address, honest subject line, working unsubscribe link.',
        text: "The CAN-SPAM floor, and a reasonable floor for any list regardless of where recipients are.",
      },
      {
        bold: "If any part of your list is in the EU, confirm how they actually opted in.",
        text: "A signup form with an unchecked, explicit marketing-consent checkbox is the safe baseline. A name collected at checkout for a transactional purpose isn't automatically consent to market to that same address.",
      },
      {
        bold: 'Keep a record of consent, not just the email address itself.',
        text: "Timestamp and source (which form, which page) for each signup. You very likely won't need it, but not having it when asked is a worse position than having it and never using it.",
      },
      {
        bold: "Don't buy lists.",
        text: "A purchased list has no verifiable consent trail for GDPR purposes and no real opt-in history for CAN-SPAM's spirit either, on top of the deliverability damage it tends to cause on a list with no sending reputation yet.",
      },
    ],
  },
  {
    type: 'p',
    text: "None of this requires a lawyer for a first small campaign to a list you built yourself with a clear signup form. It starts to matter more as the list grows, as you add EU subscribers, or as you bring on an agency or affiliate sending on your behalf, which is exactly the point to have an actual conversation with someone qualified rather than continuing to work from a blog post.",
  },
];
