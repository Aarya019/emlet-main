import type { GeneratedEmail } from '@/lib/ai/claude';
import type { TemplateMeta } from '@/lib/content/templates';

export const meta: TemplateMeta = {
  slug: 'bauhaus-listening-night-invitation',
  title: 'Bauhaus-style invitation for a listening night',
  description:
    'A bold, typographic invitation that answers when, where and how much on the first screen, then gives one clear way to reserve a seat. Suits gigs, listening nights, launches and workshops.',
  emailType: 'event-invitation',
  industry: 'music-and-culture',
  style: 'bauhaus',
  date: '2026-11-01',
  brand: { name: 'The Listening Room', primaryColor: '#d62828', secondaryColor: '#1d3557', backgroundColor: '#fffdf7' },
  whenToSend:
    'Three to four weeks ahead for a small ticketed night, with a reminder a week out and a last call two days before. Send the invitation on a weekday morning, when people are planning their week.',
  whyItWorks: [
    'The date, place and price sit in a single row near the top, so someone skimming on a phone has everything without scrolling.',
    'The capacity is real (40 seats), which makes the “limited” message believable instead of pushy.',
    'One button, repeated once at the end. No competing links to wander off to.',
  ],
  subjectIdeas: ['Listening Night, Friday 14 November', '40 seats, one record, no phones', 'You’re invited: an evening with one album'],
  draft: true,
};

export const email: GeneratedEmail = {
  subject: 'Listening Night, Fri 14 Nov',
  previewText: '40 seats, one album played start to finish, and good company. Doors at 7pm.',
  emailType: 'promotional',
  fontVariant: 0,
  sections: [
    { type: 'header', tagline: 'A room for listening' },
    {
      type: 'hero',
      eyebrow: 'You’re invited',
      heading: 'Listening Night',
      intro: 'One album, played start to finish on the big speakers, with no phones and good company.',
      subheading: 'Friday 14 November · Doors 7pm',
      textColor: '#ffffff',
      buttonText: 'Reserve a seat',
      buttonUrl: '#',
    },
    {
      type: 'columns',
      heading: 'The details',
      columns: [
        { icon: '📅', iconName: 'calendar-blank', heading: 'When', text: 'Friday 14 November. Doors 7pm, music at 7:30.' },
        { icon: '📍', iconName: 'map-pin', heading: 'Where', text: 'The Listening Room, 12 Example Lane. Step-free entrance.' },
        { icon: '🎟️', iconName: 'ticket', heading: 'How much', text: '$10 booked ahead, $12 on the door. A drink is included.' },
      ],
    },
    {
      type: 'image-text',
      imageKeyword: 'live band gig crowd small venue stage lights',
      imageUrl: 'https://images.pexels.com/photos/16674070/pexels-photo-16674070.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      imageAlt: 'A small crowd watching a band under stage lights',
      imagePosition: 'left',
      heading: 'How the night works',
      text: 'We pick one album, dim the lights, and play it all the way through on the good speakers. Afterwards there’s time to talk about what you heard, or just sit with it. No phones, no talking over the music, and no need to know the record beforehand.',
    },
    {
      type: 'feature-list',
      heading: 'What to expect',
      features: [
        { icon: '🪑', iconName: 'armchair', title: '40 seats, first come first served', description: 'Seats are limited so everyone can see and hear properly.' },
        { icon: '💿', iconName: 'vinyl-record', title: 'One album, start to finish', description: 'The whole record, in order, the way it was meant to be heard.' },
        { icon: '🍻', iconName: 'beer-bottle', title: 'A drink and a chat afterwards', description: 'Stay as long as you like. The bar stays open after the last track.' },
      ],
    },
    {
      type: 'cta',
      heading: 'Reserve your seat',
      text: 'Seats are limited to 40 so everyone can hear properly. Book now and we’ll hold yours until the doors open.',
      buttonText: 'Reserve a seat',
      buttonUrl: '#',
    },
    { type: 'footer', text: 'The Listening Room · 12 Example Lane, Your City', unsubscribeUrl: '#' },
  ],
};
