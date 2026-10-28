import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'event-invitation-email-what-to-include',
  title: 'Event Invitation Emails: What to Include, When to Send, and How to Fill the Room',
  description:
    "A good invitation answers five questions in seconds, then a few well-timed reminders do the rest. Here is a practical guide for small businesses and communities running meetups, workshops, launches and festivals.",
  date: '2026-10-28',
  readTime: '7 min read',
  category: 'Small Business',
  image: 'https://images.pexels.com/photos/7648020/pexels-photo-7648020.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'Conference name tag badges on lanyards laid out on a table',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "Events are one of the best things a small business or community can promote by email, because the ask is simple and the reward is concrete: come and be there. They are also easy to get wrong. Invitations bury the date, hide the location, or ask for too much commitment too early, and people who would have loved to come quietly never reply.",
  },
  {
    type: 'h2',
    text: 'The five questions every invitation must answer',
  },
  {
    type: 'p',
    text: "A reader skimming on a phone should be able to answer these without scrolling or clicking:",
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'What is it?',
        text: "Name the event and say what happens in one line. \"A relaxed listening night for vinyl collectors\" is clearer than \"our autumn gathering.\"",
      },
      {
        bold: 'When is it?',
        text: "Day, date, start and end time, and the time zone if people may be remote. Put it near the top, not in a paragraph.",
      },
      {
        bold: 'Where is it?',
        text: "A street address with a map link, or a join link for online events. If parking, transit or access matter, say so.",
      },
      {
        bold: 'Why should I come?',
        text: "The one or two things that make it worth an evening: a guest, something to hear or try, people to meet.",
      },
      {
        bold: 'What do I do now?',
        text: "One clear button: Reserve your spot, Get tickets, RSVP. Make the next step obvious and quick.",
      },
    ],
  },
  {
    type: 'h2',
    text: 'Subject lines that work for events',
  },
  {
    type: 'p',
    text: "Put the event and the date in the subject, since that is what people scan for. \"Listening night, Friday 14 November\" does more work than \"You're invited!\" Add the benefit or urgency when it is true: \"Limited to 40 seats\" is useful if there really are 40 seats. Use the preview text for the place or the guest.",
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/5386738/pexels-photo-5386738.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A calendar, coffee, and laptop laid out on a desk for planning',
    caption: "Plan the send schedule at the same time as the event, not after the date is set.",
  },
  {
    type: 'h2',
    text: 'When to send',
  },
  {
    type: 'p',
    text: "The right timing depends on the size and kind of event, so treat these as a starting point rather than a rule. For a casual meetup, two to three weeks ahead is often enough. For something people travel to or pay for, such as a festival or a workshop, start four to six weeks out. A common pattern that works for a small list:",
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'The invitation',
        text: "when you open registration.",
      },
      {
        bold: 'A reminder',
        text: "a week before, adding something new (the line-up, a guest, what to bring) so it is not just a repeat.",
      },
      {
        bold: 'A last call',
        text: "a day or two before, short and practical, and only to people who have not replied.",
      },
      {
        bold: 'A day-of note',
        text: "to those who registered, with the address, start time and anything they need to know.",
      },
    ],
  },
  {
    type: 'h2',
    text: 'Make it easy to say yes',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Cut the form down.',
        text: "Name and email is usually enough. Every extra field costs you sign-ups.",
      },
      {
        bold: 'Offer an add-to-calendar link.',
        text: "People who add an event to their calendar are far more likely to turn up. Most ticketing tools generate one automatically.",
      },
      {
        bold: 'Say what it costs, and what is included.',
        text: "Free, a ticket price, or pay what you like. Do not make people click to find out.",
      },
      {
        bold: 'Be honest about capacity.',
        text: "If seats are limited, say how many, and offer a waitlist when it is full. A clear \"sold out, join the waitlist\" beats a silent dead end.",
      },
    ],
  },
  {
    type: 'h2',
    text: 'Do not forget the email after',
  },
  {
    type: 'p',
    text: "The event is not the end of the campaign. Within a day or two, send everyone who came a thank-you with a photo or two, a link to anything you promised, and a hint about what is next. Send people who registered but did not come a gentler version, perhaps with a recording or a note about the next date. This is also the best moment to ask a single question about what they would like next time, which ties in with what we covered on inviting replies.",
  },
  {
    type: 'p',
    text: "Finally, keep the email itself accessible and simple: a readable font size, strong contrast, and the key details in actual text, not baked into an image. An invitation that cannot be read in dark mode or by a screen reader is an invitation some of your community never receives.",
  },
];
