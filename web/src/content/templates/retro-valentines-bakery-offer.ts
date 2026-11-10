import type { GeneratedEmail } from '@/lib/ai/claude';
import type { TemplateMeta } from '@/lib/content/templates';

export const meta: TemplateMeta = {
  slug: 'retro-valentines-bakery-offer',
  title: "Retro Valentine's Day offer for a bakery or small food shop",
  description:
    "A warm, poster-style Valentine's email for pre-orders: three boxes to choose from, an order-by date and a collection window. Works for bakeries, chocolatiers, florists and any small shop that takes pre-orders.",
  emailType: 'sale-promotion',
  industry: 'food-and-drink',
  occasion: 'valentines-day',
  style: 'retro',
  date: '2026-11-10',
  brand: { name: 'Little Loaf', primaryColor: '#c2185b', secondaryColor: '#7a1f3d', backgroundColor: '#fff1ec' },
  whenToSend:
    'Three weeks before Valentine’s Day for the offer, a reminder a week later, and a last call two or three days before your order-by date. For a made-to-order product, the order-by date is the real deadline, so put it in the subject line of the last email. Swap the dates, boxes and prices for your own.',
  whyItWorks: [
    'The choice is limited to three boxes with a clear middle option, so nobody has to think hard about what to order.',
    'The order-by date and the collection window are in the hero, the announcement and the last block, so no one has to hunt for the dates.',
    'It sounds warm without being syrupy, and it includes allergen information, which is both kind and what customers look for.',
  ],
  subjectIdeas: ['Say it with something sweet', 'Valentine’s boxes: pre-order by Sunday 7 Feb', 'Twelve hearts, baked the morning you collect'],
  draft: true,
};

export const email: GeneratedEmail = {
  subject: 'Say it with something sweet',
  previewText: 'Three Valentine’s boxes, baked to order. Pre-order by Sunday 7 February.',
  emailType: 'promotional',
  fontVariant: 0,
  sections: [
    { type: 'header', tagline: 'Valentine’s week' },
    {
      type: 'hero',
      eyebrow: 'For the ones you love',
      heading: 'Say it with something sweet',
      intro: 'Hand-iced hearts, baked the morning you collect them.',
      subheading: 'Pre-order by Sunday 7 February',
      backgroundColor: '#7a1f3d',
      textColor: '#ffffff',
      buttonText: 'Pre-order a box',
      buttonUrl: '#',
      buttonColor: '#ffd6e0',
      // The hero draws button labels in white; on a pale pink button that needs to be the wine colour.
      styles: { 'button#0': { color: '#7a1f3d' } },
    },
    {
      type: 'pricing-table',
      heading: 'Choose your box',
      plans: [
        { name: 'The Little Box', price: '$18', period: 'four hearts', features: ['Vanilla or lemon', 'Tied with ribbon'], buttonText: 'Order', buttonUrl: '#' },
        { name: 'The Sweetheart Box', price: '$28', period: 'six hearts and a note', features: ['Two flavours', 'A handwritten card'], highlighted: true, buttonText: 'Order', buttonUrl: '#' },
        { name: 'The Big Love Box', price: '$42', period: 'twelve hearts', features: ['Two flavours', 'A handwritten card', 'Gift wrapped'], buttonText: 'Order', buttonUrl: '#' },
      ],
      recommendedLabel: 'Most popular',
    },
    {
      type: 'feature-list',
      heading: 'How it works',
      numbered: true,
      features: [
        { title: 'Choose your box', description: 'Pick a size and a flavour, and add a note if you would like one written for you.' },
        { title: 'Pre-order by Sunday 7 February', description: 'We only bake what is ordered, so pre-orders close on that date.' },
        { title: 'Collect on Saturday 13 or Sunday 14 February', description: 'From the shop between 9 am and 2 pm. Pick a slot when you order.' },
      ],
    },
    {
      type: 'announcement',
      heading: 'Good to know',
      text: 'Our bakes contain wheat, milk and eggs, and are made in a kitchen that also handles nuts. If you need something nut free or vegan, email us and we will do our best.',
    },
    {
      type: 'cta',
      heading: 'Order early, we bake to order',
      text: 'Boxes are made fresh for each order, and the Sweetheart Box is the one that sells out first.',
      buttonText: 'Pre-order a box',
      buttonUrl: '#',
      backgroundColor: '#7a1f3d',
      textColor: '#ffffff',
    },
    { type: 'footer', text: 'Little Loaf · 12 Example Lane, Your City', unsubscribeUrl: '#' },
  ],
};
