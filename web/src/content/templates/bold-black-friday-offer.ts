import type { GeneratedEmail } from '@/lib/ai/claude';
import type { TemplateMeta } from '@/lib/content/templates';

export const meta: TemplateMeta = {
  slug: 'bold-black-friday-offer',
  title: 'Bold Black Friday offer email for a small shop',
  description:
    'A loud, one-offer email for Black Friday or Cyber Monday: the deal, the dates and a single button on the first screen, with the details underneath. Suits any small shop that wants to stand out in a crowded inbox without shouting in all caps.',
  emailType: 'sale-promotion',
  industry: 'independent-retail',
  occasion: 'black-friday',
  style: 'brutalist',
  date: '2026-11-10',
  brand: { name: 'Northline Goods', primaryColor: '#111111', secondaryColor: '#ffe600', backgroundColor: '#ffffff' },
  whenToSend:
    'Two or three sends across the weekend work better than a daily barrage: a heads-up the Monday before with the offer and the dates, the main email on Friday morning, and a short last call on the final day to people who have not clicked. Replace the discount, dates and code with your own, and only claim a deadline that is real.',
  whyItWorks: [
    'The whole offer (25% off, four days, free shipping over a threshold) sits in a row of three facts, so someone skimming on a phone gets it without scrolling.',
    'There is one button, repeated once. The code is shown as text as well, so it still works if an image or a button fails to load.',
    'The deadline is specific and honest, and the last block says when orders stop shipping this week. That is more persuasive than a countdown timer.',
  ],
  subjectIdeas: ['Four days, 25% off the whole shop', 'Black Friday: everything, 25% off', 'Last call: sale ends tonight at midnight'],
  draft: true,
};

export const email: GeneratedEmail = {
  subject: 'Four days, 25% off the whole shop',
  previewText: 'No tiers, no tricks. Everything in the shop, until Monday at midnight.',
  emailType: 'promotional',
  fontVariant: 0,
  sections: [
    // buttonColor is the tagline colour on a header; the brand yellow is unreadable on white, so it is ink here.
    { type: 'header', tagline: 'Black Friday weekend', buttonColor: '#111111' },
    {
      type: 'hero',
      eyebrow: 'Four days only',
      heading: '25% off everything',
      intro: 'No tiers, no tricks. The whole shop, until Monday at midnight.',
      subheading: 'Friday to Monday · All orders',
      backgroundColor: '#111111',
      textColor: '#ffffff',
      buttonText: 'Shop the sale',
      buttonUrl: '#',
      buttonColor: '#ffe600',
      // The hero draws button labels in white; on a yellow button that needs to be ink.
      styles: { 'button#0': { color: '#111111' } },
    },
    {
      type: 'stats',
      stats: [
        { value: '25%', label: 'off the whole shop' },
        { value: '4 days', label: 'Friday to Monday' },
        { value: 'Free', label: 'shipping over $60' },
      ],
    },
    {
      type: 'coupon',
      heading: 'Your code',
      code: 'BLACKFRIDAY25',
      expiryText: 'Applied at checkout. Ends Monday at 11:59 pm.',
    },
    {
      type: 'columns',
      heading: 'Start here',
      columns: [
        { heading: 'The best sellers', text: 'The Harbour Tote, waxed by hand, and the bag we reorder most often.' },
        { heading: 'Gifts under $30', text: 'Notebooks, mugs and small things that wrap well and ship fast.' },
        { heading: 'The last of the run', text: 'Colours we will not make again. When they are gone, they are gone.' },
      ],
    },
    {
      type: 'feature-list',
      heading: 'How it works',
      numbered: true,
      features: [
        { title: 'Add what you like', description: 'No minimum, and the discount is applied to everything in the shop.' },
        { title: 'Enter the code at checkout', description: 'BLACKFRIDAY25 takes 25% off. It does not stack with other codes.' },
        { title: 'We ship within two working days', description: 'Orders placed before Sunday evening ship this week.' },
      ],
    },
    {
      type: 'cta',
      heading: 'Ends Monday at midnight',
      text: 'After that, prices go back to normal. If something has been in your basket for a while, this is the weekend.',
      buttonText: 'Shop the sale',
      buttonUrl: '#',
      backgroundColor: '#ffe600',
      textColor: '#111111',
      buttonColor: '#111111',
    },
    { type: 'footer', text: 'Northline Goods · 12 Example Lane, Your City', unsubscribeUrl: '#' },
  ],
};
