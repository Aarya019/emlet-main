import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'event-invitation-email-examples',
  title: 'Event Invitation Email Examples and Subject Lines',
  description:
    "Event invitation email examples for meetups, workshops, open houses and online classes, with subject lines, button wording and reminder copy you can adapt.",
  date: '2026-11-02',
  readTime: '7 min read',
  category: 'Small Business',
  image: 'https://images.pexels.com/photos/5386738/pexels-photo-5386738.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'A calendar, coffee, and laptop laid out on a desk for planning',
};

export const cta = {
  heading: 'Make the invitation look as good as it reads',
  body: 'Describe your event and Emlet builds the invitation in your brand colors, ready to edit and export. Free to try, no credit card.',
};

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "An invitation has a few seconds to answer four questions: what is it, when is it, where is it, and what do I do next. Seeing the wording makes that easier. The examples below are for made-up small organizers (a record shop, a pottery studio, a community bakery) and cover the invitation, the reminders and the day-of note. For the thinking behind them, see our guide to [what every event invitation must include](/blog/event-invitation-email-what-to-include).",
  },
  {
    type: 'h2',
    text: '1. A casual meetup',
  },
  {
    type: 'p',
    text: "Groove Street Records is hosting a listening night. The tone is relaxed, the details are up front, and there is one clear way to say yes.",
  },
  {
    type: 'ul',
    items: [
      { bold: 'Subject:', text: 'Listening night, Friday 13 November' },
      { bold: 'Preview text:', text: 'Doors at 7, free entry, and Mara plays her new record start to finish.' },
      {
        bold: 'Copy:',
        text: "Join us for a listening night at the shop on Friday 13 November, 7 to 9 pm. Mara is bringing her new record and we will play it start to finish on the good speakers, with tea and a short chat afterwards. It is free, but seats are limited to 40, so please let us know you are coming. The shop is at 12 Example Lane, a two-minute walk from the tram stop.",
      },
      { bold: 'Button:', text: 'Save my seat' },
    ],
  },
  {
    type: 'p',
    text: "Why it works: the date is in the subject, the reason to come (the full record, played properly) is in the preview, and the only effort asked is a click.",
  },
  {
    type: 'h2',
    text: '2. A paid workshop',
  },
  {
    type: 'p',
    text: "When people pay, they want to know what they get for the money and what happens if the event fills. Clay Hand Studio is running a beginner pottery workshop.",
  },
  {
    type: 'ul',
    items: [
      { bold: 'Subject:', text: 'Pottery workshop, Saturday 7 November (12 places)' },
      { bold: 'Preview text:', text: '$45 covers clay, firing and a mug to take home two weeks later.' },
      {
        bold: 'Copy:',
        text: "Learn to throw a mug on the wheel with Ines, who has taught beginners for ten years. The workshop runs from 10 am to 1 pm on Saturday 7 November at the studio. The $45 ticket covers all materials and firing, and your mug is ready to collect two weeks later. No experience is needed, and aprons are provided. There are 12 places, and we keep a waiting list if it fills.",
      },
      { bold: 'Button:', text: 'Book a place for $45' },
    ],
  },
  {
    type: 'p',
    text: "Why it works: the price and what it includes are stated before anyone has to click, the capacity is a real number, and a waiting list turns \"sold out\" into a second chance.",
  },
  {
    type: 'h2',
    text: '3. An open house',
  },
  {
    type: 'p',
    text: "Kiln & Co. is opening its doors on a Saturday. Nobody needs to book, so the button is a calendar link instead of a form.",
  },
  {
    type: 'ul',
    items: [
      { bold: 'Subject:', text: 'Open house at the studio, Saturday 14 November' },
      { bold: 'Preview text:', text: 'Free coffee, a first look at the new mugs, and 10% off on the day.' },
      {
        bold: 'Copy:',
        text: "We are opening the studio doors on Saturday 14 November, from 11 am to 4 pm. Come and see where the mugs are made, watch a glaze being mixed, and be one of the first to pick up the new speckled range. There is free coffee all day, and 10% off anything you buy on the day. No need to book, just drop by.",
      },
      { bold: 'Button:', text: 'Add to my calendar' },
    ],
  },
  {
    type: 'p',
    text: "Why it works: it tells people what they will actually see and do, the offer is concrete, and an add-to-calendar button makes it far more likely to be remembered on the day.",
  },
  {
    type: 'h2',
    text: '4. An online class',
  },
  {
    type: 'p',
    text: "For online events, the details that trip people up are time zones and whether they can join late or catch up. Little Loaf is running a free live class.",
  },
  {
    type: 'ul',
    items: [
      { bold: 'Subject:', text: 'Live class: start your sourdough, Thursday 7 pm GMT' },
      { bold: 'Preview text:', text: 'Free, 45 minutes, and you get the recording if you cannot make it.' },
      {
        bold: 'Copy:',
        text: "Join Marta live on Thursday 12 November at 7 pm GMT (2 pm in New York, 11 am in Los Angeles) to make your first sourdough starter. It is free and takes about 45 minutes. Everyone who registers gets the recording by email the next day, so sign up even if you cannot be there live.",
      },
      { bold: 'Button:', text: 'Register for the live class' },
    ],
  },
  {
    type: 'p',
    text: "Why it works: the time zone is stated and converted for the places most readers live, and offering the recording removes the main reason not to register.",
  },
  {
    type: 'h2',
    text: '5. The reminders',
  },
  {
    type: 'p',
    text: "One invitation is rarely enough. A short run of reminders, each adding something, does most of the work of filling the room. Here is how it looks for the pottery workshop.",
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'A week before.',
        text: "Subject: \"Next Saturday: what you will make, and what to wear\". Add something new, such as a photo of the mug shapes people can choose from and a note about wearing clothes that can get clay on them.",
      },
      {
        bold: 'Two days before, to people who have not booked.',
        text: "Subject: \"Last call: 6 places left for Saturday\". Keep it short and practical, with the date, the price and one button.",
      },
      {
        bold: 'The day before, to people who booked.',
        text: "Subject: \"Tomorrow: your pottery workshop\". Give the address, the start time, how to park, and what to do if they can no longer come, so you can offer the place to someone on the waiting list.",
      },
      {
        bold: 'The morning of.',
        text: "Subject: \"Today at 10: see you at the studio\". Two lines, a map link and a phone number for anyone running late.",
      },
    ],
  },
  {
    type: 'h2',
    text: 'Subject lines for events',
  },
  {
    type: 'ul',
    items: [
      { bold: 'Name and date:', text: "\"Listening night, Friday 13 November\" is what people scan for." },
      { bold: 'Name and a real number:', text: "\"Pottery workshop (12 places)\" suggests there is a limit, as long as there is." },
      { bold: 'A reminder with news:', text: "\"Next Saturday: what you will make\" gives a reason to open a second email." },
      { bold: 'The day of:', text: "\"Today at 10: see you at the studio\" is plain and useful." },
    ],
  },
  {
    type: 'p',
    text: "Phones cut subjects off early, so put the event and the date first. Our post on [subject line length](/blog/email-subject-line-length-how-many-characters) explains how much shows, and the free [Subject Line Tester](/tools/subject-line-tester) previews yours in a phone-style inbox.",
  },
  {
    type: 'h2',
    text: 'Button wording that gets a yes',
  },
  {
    type: 'ul',
    items: [
      { bold: 'Free with limited seats:', text: "\"Save my seat\" or \"RSVP, it's free\"." },
      { bold: 'Paid:', text: "\"Book a place for $45\" puts the price where people can see it." },
      { bold: 'No booking needed:', text: "\"Add to my calendar\" or \"Get directions\"." },
      { bold: 'Full:', text: "\"Join the waiting list\", which is better than a dead end." },
    ],
  },
  {
    type: 'h2',
    text: 'Details that quietly lose people',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Ambiguous dates.',
        text: "\"11/12\" is the 11th of December in some countries and the 12th of November in others. Write the weekday and the month in words: Thursday 12 November.",
      },
      {
        bold: 'A missing end time.',
        text: "People plan an evening around it, and some will not come without it.",
      },
      {
        bold: 'Time zones for online events.',
        text: "State yours, and add one or two conversions for where your readers are.",
      },
      {
        bold: 'Details inside an image.',
        text: "Text baked into a banner disappears when images are blocked and cannot be read by a screen reader. Keep the date, place and button as real text, as our [email accessibility guide](/blog/email-accessibility-guide) explains.",
      },
      {
        bold: 'No calendar link.',
        text: "An event that lands in someone's calendar is far more likely to be remembered than one they meant to note down later.",
      },
    ],
  },
  {
    type: 'p',
    text: "When the event is over, send a thank-you with a photo or two and a hint about what is next. The free [Email Prompt Library](/tools/email-prompt-library) has event prompts, including one for the thank-you, that you can edit and turn into a full email.",
  },
  {
    type: 'p',
    text: "Planning something for February? Our [Valentine's Day email ideas](/blog/valentines-day-email-ideas-small-business) include a send plan and a Galentine's invitation subject line.",
  },
];
