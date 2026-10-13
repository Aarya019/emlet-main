import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'marketing-automation-when-small-business-needs-it',
  title: 'Marketing Automation for Small Businesses: When It\'s Worth It, When It\'s Overkill',
  description:
    "Automation platforms get sold as something every business eventually needs. For a lot of small lists, the honest answer is not yet, and sometimes not ever, and knowing which category you're in saves real money.",
  date: '2026-10-13',
  readTime: '7 min read',
  category: 'Small Business',
  image: 'https://images.pexels.com/photos/7857531/pexels-photo-7857531.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'A small business owner writing notes at a desk surrounded by boxes',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "Marketing automation gets pitched as an inevitability: every business eventually needs workflows, triggers, branching logic, a system quietly running in the background. Platform marketing pages are built to make the case that you need it now. For a real share of small businesses, the honest answer is not yet, sometimes not for a while, and the cost of jumping in early is more than the subscription fee.",
  },
  {
    type: 'h2',
    text: 'What automation actually buys you',
  },
  {
    type: 'p',
    text: "The pitch is real, at a certain scale. Automation means a trigger, a signup, a purchase, a cart abandonment, an inactivity window, fires a sequence without a human remembering to send it. That matters most when volume is high enough that manual sending becomes the actual bottleneck: hundreds of signups a week, enough purchase events that cart-abandonment emails sent by hand would eat a full workday, enough segments that manually tracking who should get what becomes its own job.",
  },
  {
    type: 'h2',
    text: 'The point where it stops paying for itself',
  },
  {
    type: 'p',
    text: "Below a certain volume, the math inverts. A business sending a weekly newsletter to a few hundred people, with the occasional one-off promotion, doesn't have an execution problem automation solves, there's nothing repetitive enough yet to need automating. Setting up branching logic, testing every trigger path, maintaining the workflow as the product or offer changes, all of that is real ongoing work, and at low volume it's often more hours than just sending the handful of emails that actually need to go out by hand.",
  },
  {
    type: 'p',
    text: "There's a second cost that's easy to miss: a badly configured automated sequence runs on autopilot, including the mistakes. A one-off email with an outdated price or an old reference gets caught the next time someone reads it before sending. An automated welcome sequence with the same mistake keeps sending it to every new signup, unnoticed, until someone happens to check.",
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/10583683/pexels-photo-10583683.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'An ornate mechanical gear clock mounted on a brick wall',
    caption: "Automation is a mechanism, and like any mechanism, it keeps running exactly as built, mistakes included, until someone opens it back up.",
  },
  {
    type: 'h2',
    text: 'A rough way to tell which side you\'re on',
  },
  {
    type: 'ul',
    items: [
      {
        bold: "You're sending the same email by hand more than a couple times a month.",
        text: "A welcome message, a cart reminder, an order-confirmation follow-up typed out individually each time it's needed is the clearest signal that a single automated trigger would save real recurring time, not hypothetical future time.",
      },
      {
        bold: 'Your list is growing fast enough that manual tracking is already slipping.',
        text: "If new signups are sitting for days before anyone notices and welcomes them, or segments are tracked in a spreadsheet that's already out of date, the delay itself is doing damage automation would prevent.",
      },
      {
        bold: "You can name the specific trigger and sequence you'd build, not just \"automation\" in the abstract.",
        text: "Wanting the category of automation isn't the same as having a concrete use for it. If the honest answer to \"automate what, exactly\" is vague, that's usually a sign it's not needed yet.",
      },
      {
        bold: "You've outgrown your current tool's basic scheduling, not just its branding.",
        text: "A lot of small lists get pushed toward a bigger automation platform by comparison marketing rather than an actual limitation they've hit. If the current tool already does what the business needs, upgrading solves a feeling, not a problem.",
      },
    ],
  },
  {
    type: 'h2',
    text: "Starting smaller than the pitch suggests",
  },
  {
    type: 'p',
    text: "The realistic starting point for most small businesses isn't a full automation platform, it's a single trigger: one welcome email that fires on signup, or one cart-abandonment reminder, built and tested once, then left alone unless something about the business actually changes. That's enough to capture most of the real benefit, the recurring manual task that was actually costing time, without taking on the maintenance burden of a branching system built for a volume the business may not have yet. Automation is worth adopting when it removes work that's genuinely repetitive and already happening by hand. It's worth skipping, for now, when it's being adopted because it's what a growing business is supposed to have.",
  },
];
