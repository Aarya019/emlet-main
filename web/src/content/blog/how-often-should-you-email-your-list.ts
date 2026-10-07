import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'how-often-should-you-email-your-list',
  title: 'How Often Should You Actually Email Your List? A Genuinely Debated Question',
  description:
    "One camp says email more, revenue follows. Another says email less or you'll burn the list out. Both have real evidence behind them, because they're usually describing different lists with different expectations, not different universal truths.",
  date: '2026-10-05',
  readTime: '6 min read',
  category: 'Email Marketing',
  image: 'https://images.pexels.com/photos/29509476/pexels-photo-29509476.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'A spiral-bound desk calendar showing a monthly grid',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "Ask how often to email a list and you'll get two confident, opposite answers. One camp says send more, revenue tracks almost linearly with send frequency up to a point most businesses never reach. The other says send less, or you'll fatigue the list into unsubscribing and tune out the people who stay. Both sides can point to real results. The reason they disagree isn't that one of them is wrong, it's that they're usually describing lists with completely different expectations baked in from the start.",
  },
  {
    type: 'h2',
    text: 'The variable that actually matters: what was promised at signup',
  },
  {
    type: 'p',
    text: "A list that signed up for daily deal alerts expects daily email, and sending weekly instead would feel like under-delivering on the thing they asked for. A list that signed up for a single lead magnet, a PDF checklist, a free template, didn't sign up expecting daily contact, and treating them like the deal-alert list guarantees a spike in unsubscribes and complaints. The frequency question isn't \"what's the universally correct number,\" it's \"what did this specific list implicitly agree to when they handed over their email,\" and that answer is different for every business, sometimes for every segment within the same business.",
  },
  {
    type: 'h2',
    text: "Why 'send less to protect the list' isn't automatically true either",
  },
  {
    type: 'p',
    text: "The intuition behind sending less is that engagement is a limited resource that depletes with overuse. The mechanism runs the other way more often than people expect. Inbox providers weigh recent, consistent engagement heavily in deciding whether your mail lands in the inbox or the spam folder. A list you email rarely has more time to go cold between sends, forget who you are, and ignore or mark as spam the next email that does arrive, which actively damages deliverability. A list that hears from you consistently, and finds something worth opening each time, reinforces a pattern inbox providers read as wanted mail. Infrequent sending isn't a safe default, it has its own failure mode, it just shows up as a slow erosion in deliverability rather than an obvious complaint spike.",
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/5965635/pexels-photo-5965635.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A person checking their phone while walking outside',
    caption: "Consistency, not just frequency, is what trains both the reader and the inbox provider to expect you.",
  },
  {
    type: 'h2',
    text: 'The signal to actually watch, and the one to ignore for this decision',
  },
  {
    type: 'p',
    text: "Unsubscribes and spam complaints get treated as the same warning sign, and they're not. An unsubscribe is someone cleanly opting out, the system working as intended, and a healthy list has a small, steady trickle of them regardless of frequency. A spam complaint is someone who didn't bother to unsubscribe and instead flagged you, which actively damages sender reputation in a way an unsubscribe doesn't. If increasing frequency raises unsubscribes slightly but complaint rate stays flat, that's not evidence you've gone too far, it's self-selection doing its job. If complaint rate climbs, that's the actual ceiling signal, not the unsubscribe count.",
  },
  {
    type: 'h2',
    text: 'A reasonable way to actually decide',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Start at whatever frequency was implied when someone signed up.',
        text: "If you never set an expectation explicitly, assume people expect less than you'd like to send, and say what to expect the first time you ask for the address.",
      },
      {
        bold: 'Track complaint rate specifically, not just unsubscribes or opens.',
        text: "Most ESPs report it separately. It's the metric that actually tells you when frequency has become a problem rather than a preference some people opted out of.",
      },
      {
        bold: "Treat a quiet list as a decaying asset, not a safe one.",
        text: "If you haven't sent in months, re-engagement before a big increase in frequency protects deliverability better than either staying silent or jumping straight back to a high cadence.",
      },
      {
        bold: "Let content quality set the real ceiling, not a target number.",
        text: "A business with genuinely new things to say can sustain near-daily sends. One repeating the same pitch in different words can't sustain that regardless of what any guide recommends, since the content itself, not the schedule, is what determines whether a send was worth opening.",
      },
    ],
  },
];
