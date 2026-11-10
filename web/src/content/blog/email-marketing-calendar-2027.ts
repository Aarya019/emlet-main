import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'email-marketing-calendar-2027',
  title: 'Email Marketing Calendar 2027: Key Dates and What to Send',
  description:
    "A 2027 email marketing calendar for small businesses: the dates worth sending for, an email idea for each, and when to start planning.",
  date: '2026-11-10',
  readTime: '6 min read',
  category: 'Email Marketing',
  image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'A hand holding a blue pen over printed bar charts and graphs',
};

export const cta = false as const;

const HEADERS = ['Date', 'Occasion', 'An email worth sending', 'Start planning'];

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "You do not need an email for every date on the calendar. Most small businesses do better picking six to ten and doing them well. This calendar lists the dates people expect to hear from businesses like yours in 2027, an email idea for each, and when to start planning so you are not writing at midnight the night before.",
  },
  {
    type: 'p',
    text: "Dates are for 2027 and are US dates unless marked. \"Start planning\" is about four weeks ahead, and six or eight weeks for the big shopping dates. Check any date that matters to your business before you commit to it.",
  },
  {
    type: 'h2',
    text: 'How to use it',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Circle the dates your customers care about.',
        text: "A record shop and a garden centre will not choose the same six. Start from what your customers already do.",
      },
      {
        bold: 'Keep only the ones you have something real to say about.',
        text: "A date with no offer, event or story behind it makes a weak email. Skipping it is fine.",
      },
      {
        bold: 'Work back from each date.',
        text: "Put the \"start planning\" day in your calendar, then decide the offer, write the email, and send yourself a test a few days before it goes out.",
      },
    ],
  },
  {
    type: 'h2',
    text: 'January to March',
  },
  {
    type: 'table',
    headers: HEADERS,
    rows: [
      ['Fri 1 Jan', 'New Year’s Day', 'What is new this year, or a thank-you with a fresh-start offer', 'Fri 4 Dec 2026'],
      ['Mon 18 Jan', 'Blue Monday', 'Only if it suits your tone: a cheerful note or a small treat. It is not a real holiday.', 'Mon 21 Dec 2026'],
      ['Sat 13 Feb', 'Galentine’s Day', 'An invitation to a gathering, or a gifts-for-friends guide', 'Sat 16 Jan'],
      ['Sun 14 Feb', 'Valentine’s Day', 'A gift guide, order-by dates or a love note to customers', 'Sun 3 Jan'],
      ['Mon 15 Feb', 'Presidents’ Day (US)', 'A long-weekend sale, if sales suit your brand', 'Mon 18 Jan'],
      ['Sun 7 Mar', 'Mothering Sunday (UK)', 'Gift ideas and last order dates for UK customers', 'Sun 24 Jan'],
      ['Mon 8 Mar', 'International Women’s Day', 'Celebrate customers or makers; skip discounts that feel opportunistic', 'Mon 8 Feb'],
      ['Wed 17 Mar', 'St Patrick’s Day', 'A light, playful email; good for pubs, cafes and anything green', 'Wed 24 Feb'],
      ['Sun 28 Mar', 'Easter Sunday', 'Spring offers, bakes, gift ideas and opening hours', 'Sun 28 Feb'],
    ],
  },
  {
    type: 'p',
    text: "Valentine's Day falls on a Sunday in 2027, so anything that has to be ordered or shipped needs a deadline the week before. Our guide to [Valentine's Day email ideas](/blog/valentines-day-email-ideas-small-business) has a send plan for it. The Super Bowl is currently scheduled for the same Sunday, so if you sell to a US audience, check that date nearer the time and avoid sending your biggest email that evening.",
  },
  {
    type: 'h2',
    text: 'April to June',
  },
  {
    type: 'table',
    headers: HEADERS,
    rows: [
      ['Thu 22 Apr', 'Earth Day', 'Only if you have something real to say about how you make or ship things', 'Thu 1 Apr'],
      ['Sat 24 Apr', 'Independent Bookstore Day', 'Events and in-store offers for bookshops', 'Sat 27 Mar'],
      ['Sun 9 May', 'Mother’s Day (US)', 'Gift ideas, order-by dates, or a kind note that does not assume everyone is celebrating', 'Sun 28 Mar'],
      ['Mon 31 May', 'Memorial Day (US)', 'A long-weekend offer, or a simple opening-hours notice', 'Mon 3 May'],
      ['Sun 20 Jun', 'Father’s Day (US)', 'Gift ideas and order-by dates', 'Sun 9 May'],
    ],
  },
  {
    type: 'p',
    text: "Record Store Day is a Saturday in April, and the organizers announce the exact date early in the year, so add it once it is confirmed. If you run a record shop, it is the one date that deserves its own plan.",
  },
  {
    type: 'h2',
    text: 'July to September',
  },
  {
    type: 'table',
    headers: HEADERS,
    rows: [
      ['Sun 4 Jul', 'Independence Day (US)', 'Opening hours and a summer offer', 'Sun 6 Jun'],
      ['Mon 6 Sep', 'Labor Day (US)', 'A long-weekend sale, or an end-of-summer email', 'Mon 9 Aug'],
    ],
  },
  {
    type: 'p',
    text: "Summer is the quietest stretch, which makes it the best time to do the work nobody does in November: clean the list, rewrite the welcome emails and test your sending. Our posts on [list hygiene](/blog/email-list-hygiene-cleaning-stale-list) and [welcome sequences](/blog/welcome-email-sequence-what-to-send) are a good place to start.",
  },
  {
    type: 'h2',
    text: 'October to December',
  },
  {
    type: 'table',
    headers: HEADERS,
    rows: [
      ['Sun 31 Oct', 'Halloween', 'Playful offers and themed products', 'Sun 3 Oct'],
      ['Thu 25 Nov', 'Thanksgiving (US)', 'A thank-you, not a sale', 'Thu 28 Oct'],
      ['Fri 26 Nov', 'Black Friday', 'Your main offer of the year, if you run one', 'Fri 1 Oct'],
      ['Sat 27 Nov', 'Small Business Saturday', 'A shop-local message for independent businesses', 'Sat 16 Oct'],
      ['Mon 29 Nov', 'Cyber Monday', 'A follow-up for people who did not buy on Friday', 'Mon 4 Oct'],
      ['Tue 30 Nov', 'Giving Tuesday', 'For charities and community groups, or a donation match', 'Tue 19 Oct'],
      ['Mon 13 Dec', 'Green Monday (second Monday of December)', 'Last order dates and free shipping, if you sell online', 'Mon 15 Nov'],
      ['Sat 25 Dec', 'Christmas Day', 'A greeting, or a reminder of your last order dates', 'Sat 30 Oct'],
      ['Fri 31 Dec', 'New Year’s Eve', 'A thank-you and a look ahead, plus opening hours', 'Fri 3 Dec'],
    ],
  },
  {
    type: 'p',
    text: "The last quarter is where most of the year's sending happens, and where inboxes are busiest. Our [Black Friday and holiday email plan](/blog/black-friday-holiday-email-calendar-small-business) goes through how to space the sends without burning out your list.",
  },
  {
    type: 'h2',
    text: 'Pick six, not twenty-five',
  },
  {
    type: 'p',
    text: "The calendar looks like a to-do list, and it is not one. A small list that hears from you twenty-five times a year for twenty-five different reasons learns to ignore you. Pick the dates where you have an offer, an event or a story, and keep the rest of the year for the emails that are not on any calendar. Our post on [how often to email your list](/blog/how-often-should-you-email-your-list) is a useful sanity check before you commit.",
  },
  {
    type: 'h2',
    text: 'Dates that depend on your audience',
  },
  {
    type: 'p',
    text: "Religious and cultural holidays are not listed here, because which ones matter depends on your customers, and many follow lunar calendars, so their dates move each year. Add the ones your own audience celebrates, and confirm each date before you plan around it.",
  },
  {
    type: 'h2',
    text: 'The emails that are not on any calendar',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'A welcome email,',
        text: "sent the moment someone joins. See [what goes in each email of a welcome sequence](/blog/welcome-email-sequence-what-to-send).",
      },
      {
        bold: 'A re-engagement email,',
        text: "for people who have gone quiet, covered in [when to send one and when to prune](/blog/reengagement-campaigns-when-to-send-vs-prune).",
      },
      {
        bold: 'A product launch or event,',
        text: "whenever you have one. Our [product launch email examples](/blog/product-launch-email-examples) and [event invitation examples](/blog/event-invitation-email-examples) show the wording.",
      },
      {
        bold: 'A proper footer,',
        text: "on every email, with a real unsubscribe link. See [what to put in an email footer](/blog/what-to-put-in-an-email-footer).",
      },
    ],
  },
  {
    type: 'p',
    text: "When you are ready to write, the free [Subject Line Tester](/tools/subject-line-tester) shows how a subject looks on a phone, and the [Email Prompt Library](/tools/email-prompt-library) has seasonal and event prompts you can edit and use as a starting point.",
  },
];
