import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'open-rate-bad-metric-what-to-track-instead',
  title: 'Why Open Rate Alone Is a Bad Engagement Metric (and What to Track Instead)',
  description:
    "If your open rate looks suspiciously good, it's probably not you, it's Apple. And the metric everyone recommends instead has a quieter problem of its own worth knowing about.",
  date: '2026-09-02',
  readTime: '7 min read',
  category: 'Research',
  image: 'https://images.pexels.com/photos/577195/pexels-photo-577195.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'A laptop open on a couch showing an analytics dashboard with charts',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "If your open rate has crept up over the past couple of years and you can't quite point to what you did differently, that's worth sitting with for a second, because the honest answer for most senders isn't \"I got better at subject lines,\" it's Apple. Open rate has quietly stopped meaning what it used to mean, and most dashboards still present it as if nothing changed.",
  },
  {
    type: 'h2',
    text: 'What Apple Mail Privacy Protection actually does',
  },
  {
    type: 'p',
    text: "Apple Mail Privacy Protection pre-loads incoming email content, including the invisible tracking pixel that registers an \"open\", on Apple's own servers before a human ever looks at the message. That means an open gets recorded whether the recipient reads the email, glances at it, or never opens their Mail app that day at all. It's not a bug or an edge case, it's the intended behavior of a privacy feature that's now widely adopted across iOS and macOS Mail.",
  },
  {
    type: 'h2',
    text: 'The actual scale of it',
  },
  {
    type: 'p',
    text: "This isn't a minor asterisk. One large benchmark study covering roughly 15 billion emails across 939 companies and 46 industries found that Apple MPP now accounts for about 49% of all tracked opens, essentially half. That inflates most senders' reported open rate by somewhere in the range of 15 to 25 percentage points. The practical result: dashboards commonly show 35% to 55% open rates, while the actual human-engaged number for most B2B senders is closer to 15% to 25%. If your reporting tool doesn't explicitly strip out MPP-flagged opens, you're very likely looking at the inflated number without knowing it.",
  },
  {
    type: 'h2',
    text: "Why this matters more than it sounds like it should",
  },
  {
    type: 'p',
    text: "The concrete risk isn't just vanity, it's that open rate stops being a reliable signal for the decisions people actually make based on it. If you're subject-line testing and one variant shows a higher open rate, that difference might be genuine, or it might just reflect which variant happened to reach a segment of your list with a higher share of Apple Mail users that week, a factor that has nothing to do with how good your subject line was. Two campaigns can show meaningfully different open rates for reasons entirely disconnected from the copy.",
  },
  {
    type: 'h2',
    text: 'What to track instead, and the catch with the obvious answer',
  },
  {
    type: 'p',
    text: 'The standard advice at this point is "track click-to-open rate (CTOR) instead", the percentage of openers who went on to click something. That\'s a genuinely more diagnostic metric in general: a high open rate with a low CTOR usually means your subject line is doing its job but the content inside isn\'t, while a low open rate with a healthy CTOR usually points the other way, fix the subject line, the content\'s fine. But CTOR has a quieter problem worth knowing about: it\'s calculated as clicks divided by opens, and if the opens figure is itself inflated by MPP\'s fake opens, that inflated number becomes the denominator. An artificially large denominator makes CTOR come out artificially low, so CTOR doesn\'t actually correct for the MPP problem, it just moves the distortion one step downstream.',
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/6120217/pexels-photo-6120217.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A magnifying glass over a printed financial chart next to a percent sign',
    caption: "The number that looks the cleanest usually deserves the closest look, not the least.",
  },
  {
    type: 'h2',
    text: 'The two metrics that actually hold up',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Raw click rate (clicks divided by emails delivered, not by opens).',
        text: "This sidesteps the whole problem, since it never touches the open-tracking pixel at all. A prefetching server loads images automatically; it doesn't click links inside them. A recorded click is close to the cleanest signal you have that an actual person engaged.",
      },
      {
        bold: 'Conversion rate.',
        text: "Whatever the email was actually for, a signup, a purchase, a reply, this is the metric that was always the point. Open rate and CTOR are both proxies for something further down the funnel; conversion rate just measures that thing directly.",
      },
    ],
  },
  {
    type: 'p',
    text: "CTOR still has a place, just as a relative comparison rather than an absolute number: if MPP's share of your list stays roughly steady from one send to the next (which it usually does over a short window), comparing CTOR between two recent campaigns to each other is still reasonably fair, even if neither number is \"true\" in isolation.",
  },
  {
    type: 'h2',
    text: 'A practical way to actually read your dashboard',
  },
  {
    type: 'p',
    text: "Stop comparing your open rate to generic industry benchmark numbers you find online, since how much of any given list uses Apple Mail with MPP enabled varies a lot by audience, so an \"average\" benchmark is averaging across wildly different levels of distortion. Instead, treat your own open rate as directional, useful for spotting a big shift over time within your own list, not as a precise measure to chase upward campaign to campaign. For decisions that actually cost you something to get wrong, which subject line to use, whether a campaign worked, lean on click rate and conversion rate. They're not perfect either, nothing here is, but they're not the ones a privacy feature quietly broke.",
  },
];
