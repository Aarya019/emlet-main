import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'building-email-list-from-zero',
  title: 'Building an Email List From Zero: What Actually Works for a Brand-New Business',
  description:
    "Most list-growth advice assumes you already have traffic to convert. A brand-new business doesn't have that yet, which is exactly the problem the usual advice skips over. Here's what actually gets the first few hundred subscribers.",
  date: '2026-10-01',
  readTime: '6 min read',
  category: 'Email Marketing',
  image: 'https://images.pexels.com/photos/8532633/pexels-photo-8532633.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'A laptop with a blank white screen on a minimal desk',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "Most advice on growing an email list starts from an assumption that quietly skips the hardest part: it assumes you already have traffic. \"Add an exit-intent popup,\" \"put a signup form in your footer,\" \"run a giveaway,\" all of that converts visitors who are already there. A brand-new business doesn't have visitors yet. The actual problem isn't conversion, it's finding the first people at all.",
  },
  {
    type: 'h2',
    text: 'The first fifty almost always come from people who already know you',
  },
  {
    type: 'p',
    text: "This is the part that feels unglamorous enough that most people skip past it looking for a tactic instead: the first real subscribers for a brand-new list are usually former colleagues, people from your actual network, local contacts, people you message individually rather than people who stumble onto a signup form. It doesn't scale, and it isn't supposed to yet. The goal of this stage isn't volume, it's getting a small group of genuinely interested people on the list so the next stage (word of mouth, referrals, someone forwarding an email) has something real to start from.",
  },
  {
    type: 'h2',
    text: "Trade something specific, not \"updates\"",
  },
  {
    type: 'p',
    text: "\"Sign up for updates\" asks someone to hand over their inbox for nothing in particular. The exchange that actually works is specific: a template, a checklist, a short guide that solves one real problem your exact audience already has. The more specific and narrow the thing, the better it tends to convert, since it signals you understand their actual problem rather than offering a generic newsletter that could belong to any business in the category.",
  },
  {
    type: 'h2',
    text: 'Go where your audience already gathers, without pitching',
  },
  {
    type: 'ul',
    items: [
      {
        bold: "Answer real questions in communities your audience is already in.",
        text: "Relevant subreddits, local groups, forums, Discord servers. A genuinely useful answer, with a signup link mentioned only when it's actually relevant to what you answered, builds more trust than any ad at this stage, and costs nothing but time.",
      },
      {
        bold: 'Partner with someone adjacent, not competing.',
        text: "A short newsletter swap or shoutout with a business that shares an audience but isn't a direct competitor exposes you to people already primed to care, which is a very different cold start than paid traffic to strangers.",
      },
      {
        bold: "Capture it offline if you have any physical presence at all.",
        text: "A sign-up sheet, a QR code at a counter or event, a line in a receipt footer. Easy to forget entirely for a business that thinks of itself as online-first, and often disproportionately effective for exactly that reason, since almost nobody else bothers.",
      },
    ],
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/8475169/pexels-photo-8475169.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A small business owner flipping an "open" sign on a shop door',
    caption: "The unglamorous, in-person version of list building still works, and most online-first businesses skip it entirely.",
  },
  {
    type: 'h2',
    text: "Don't buy a list, even though it's tempting at zero",
  },
  {
    type: 'p',
    text: "A purchased list looks like an instant shortcut past the slow part, and it's one of the most damaging mistakes available at this stage specifically. A brand-new sending domain has no reputation built up yet, and a wave of opens-and-deletes or spam complaints from people who never asked to hear from you can get flagged before you've sent a single campaign to someone who actually wanted it. Deliverability reputation is cumulative and slow to rebuild once damaged. It's a worse trade at the start of a list's life than at any other point.",
  },
  {
    type: 'h2',
    text: 'A big list of the wrong people is worse than a small list of the right ones',
  },
  {
    type: 'p',
    text: "A giveaway or contest can produce a fast spike in subscriber count, and almost all of that spike is prize hunters with no interest in what you actually sell. The number looks good and the engagement rate quietly craters, which matters more than it sounds like it should: a list with a low open rate damages your sender reputation across the board, which can hurt deliverability even for the genuinely interested subset mixed in. At zero, every subscriber's behavior still meaningfully shapes how your whole domain gets treated by inbox providers going forward. A smaller list of people who actually opted in for a real reason is a stronger foundation than a bigger one that quietly drags your numbers down from day one.",
  },
  {
    type: 'p',
    text: "None of this is fast, and that's the actual expectation to set going in. A few hundred genuinely engaged subscribers built slowly through a real network, useful content, and community participation is a normal, solid outcome for a brand-new business, not a sign that growth tactics are failing. That early group is also disproportionately valuable later: they're the ones who reply with honest feedback, refer other people, and become customers before a single ad has run.",
  },
];
