import type { GeneratedEmail } from '@/lib/ai/claude';
import type { TemplateMeta } from '@/lib/content/templates';

export const meta: TemplateMeta = {
  slug: 'retro-welcome-record-store',
  title: 'Retro welcome email for a record store',
  description:
    'A warm, poster-style welcome for new subscribers: what to expect, how to get first pick of the new arrivals, and a reason to visit the shop. Works for record stores, bookshops and any small shop with a personality.',
  emailType: 'welcome',
  industry: 'independent-retail',
  style: 'retro',
  date: '2026-11-01',
  brand: { name: 'Groove Street Records', primaryColor: '#c8452d', secondaryColor: '#2f5d62', backgroundColor: '#f4ead5' },
  whenToSend:
    'Straight after signup, within a few minutes, while they still remember why they joined. If you run a weekly drop, name the day in this first email so people know when to look for you.',
  whyItWorks: [
    'It sets expectations in one line (one email a week, usually Sunday), which keeps unsubscribes down later.',
    'One button and one next step: see this week’s arrivals. Nothing else competes with it.',
    'It sounds like a person behind the counter, not a brand. That is the whole advantage of a small shop.',
  ],
  subjectIdeas: ['You’re in. Now go dig.', 'Welcome to the crate', 'First pick of Sunday’s arrivals is yours'],
  draft: true,
};

export const email: GeneratedEmail = {
  subject: 'You’re in. Now go dig.',
  previewText: 'Sunday arrivals, early looks at rare pressings, and a standing invitation to browse.',
  emailType: 'promotional',
  fontVariant: 0,
  sections: [
    { type: 'header', tagline: 'Records · Tapes · Good company' },
    {
      type: 'hero',
      eyebrow: 'Welcome to the crate',
      heading: 'You’re in. Now go dig.',
      subheading: 'Here’s what to expect, and the quickest way to get your hands on something good.',
      backgroundImageKeyword: 'vinyl records crates record store warm light',
      backgroundImageUrl: 'https://images.pexels.com/photos/11703468/pexels-photo-11703468.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      textColor: '#ffffff',
      buttonText: 'See this week’s arrivals',
      buttonUrl: '#',
    },
    {
      type: 'content',
      eyebrow: 'How this works',
      heading: 'One email a week, usually Sunday',
      text: 'We write once a week, when the new arrivals hit the racks. Every email has the best of what came in, one record we can’t stop playing, and the occasional heads-up about a listening night.\n\nThat’s it. No daily discounts, no countdown timers. If it stops being useful, the unsubscribe link at the bottom works the first time.',
    },
    {
      type: 'feature-list',
      numbered: true,
      heading: 'What you get for being on the list',
      features: [
        {
          icon: '💿',
          iconName: 'vinyl-record',
          title: 'Early looks',
          description: 'The new arrivals list reaches you before it reaches the shelves, so you get first pick of the good stuff.',
        },
        {
          icon: '⭐',
          iconName: 'star',
          title: 'Rare pressings first',
          description: 'First pressings, imports and signed copies get a heads-up here before they appear anywhere else.',
        },
        {
          icon: '🎵',
          iconName: 'music-notes',
          title: 'Listening nights',
          description: 'Invites to the evenings when we play a record end to end and argue about it. Free, a few chairs, plenty of opinions.',
        },
      ],
    },
    {
      type: 'image-text',
      imageKeyword: 'person browsing vinyl records in independent record shop',
      imageUrl: 'https://images.pexels.com/photos/6862364/pexels-photo-6862364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      imageAlt: 'A customer flicking through a crate of records',
      imagePosition: 'right',
      heading: 'Come and say hello',
      text: 'We’re a small shop with a big back room. Walk in, ask what we’ve been playing, and take your time. There’s always a kettle on and nobody will hurry you.',
      buttonText: 'Get directions',
      buttonUrl: '#',
    },
    {
      type: 'cta',
      heading: 'Your first order: 10% off',
      text: 'Use code CRATE10 on your first online order. Valid for 14 days.',
      buttonText: 'Start digging',
      buttonUrl: '#',
    },
    { type: 'footer', text: 'Groove Street Records · 12 Example Lane, Your City', unsubscribeUrl: '#' },
  ],
};
