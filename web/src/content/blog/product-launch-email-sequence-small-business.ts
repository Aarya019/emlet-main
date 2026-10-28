import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'product-launch-email-sequence-small-business',
  title: 'How to Write a Product Launch Email (and the Three-Email Sequence Around It)',
  description:
    "One announcement email rarely carries a launch. A short sequence that builds anticipation, opens the doors, and follows up does better. Here is what each email needs, with no big-company budget required.",
  date: '2026-10-28',
  readTime: '7 min read',
  category: 'Copywriting',
  image: 'https://images.pexels.com/photos/8475169/pexels-photo-8475169.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'A small business owner flipping an "open" sign on a shop door',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "Most small businesses launch a product the same way: one email on launch day that says \"it's here!\" and a link. Then they wait. Sometimes that works, usually it underperforms, and the owner concludes that email does not do much for them. The email was not the problem. Asking a list to pay attention to a single message on a single day is.",
  },
  {
    type: 'p',
    text: "A launch is a small campaign, not a single send. You do not need a large team or ten emails. Three, with clear jobs, is enough for most small businesses.",
  },
  {
    type: 'h2',
    text: 'Email 1: the heads-up (a few days before)',
  },
  {
    type: 'p',
    text: "The first email is not a sales pitch. Its job is to make the launch feel real and give people a reason to look out for it. Tell them what is coming, why you made it, and when it arrives. Keep it short and personal.",
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Lead with the problem or the story.',
        text: "Why did you build this? What were customers asking for? A real reason is more interesting than a feature list.",
      },
      {
        bold: 'Give one concrete detail.',
        text: "A photo, a price range, a first look. Something specific is more believable than \"something exciting is coming.\"",
      },
      {
        bold: 'Offer a reason to act early.',
        text: "A waitlist, early access, or a small founding-member perk gives people a way to say \"yes, tell me first\" without buying anything yet.",
      },
    ],
  },
  {
    type: 'h2',
    text: 'Email 2: launch day',
  },
  {
    type: 'p',
    text: "This is the announcement, and it should be the easiest email in the sequence to understand. Someone who has not read email 1 should still know within five seconds what the product is, who it is for, and what to do next.",
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'A subject line that says what it is.',
        text: "\"Our new vinyl subscription is open\" beats \"Big news!\" because the reader knows what they are getting before they open it.",
      },
      {
        bold: 'One hero image and one clear benefit.',
        text: "Show the product in use, not just on a white background. Say what changes for the buyer, in plain words.",
      },
      {
        bold: 'One button, repeated at most once.',
        text: "Launch emails lose people with five different links. Pick the main action (buy, join, reserve) and make it obvious.",
      },
      {
        bold: 'A line of proof.',
        text: "A short quote from an early tester, a number of pre-orders, or a mention of who has already tried it. Only use what is true.",
      },
      {
        bold: 'The practical details.',
        text: "Price, shipping or delivery, limits, and any deadline. Hiding the price rarely helps.",
      },
    ],
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/10024580/pexels-photo-10024580.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A handwritten mind-map outline in a notebook on a wooden desk',
    caption: "Plan the sequence on paper first: what each email is for, and the one action it asks for.",
  },
  {
    type: 'h2',
    text: 'Email 3: the follow-up (a day or two later)',
  },
  {
    type: 'p',
    text: "Most people who will buy do not act on the first email. Some were busy, some meant to come back, some wanted to see what others thought. A follow-up is not nagging if it adds something. Good reasons to send one:",
  },
  {
    type: 'ul',
    items: [
      {
        text: "A real deadline is approaching (an early price ends, a limited run is nearly gone).",
      },
      {
        text: "You can answer the question people have been asking since launch day, such as sizing, compatibility or shipping.",
      },
      {
        text: "There is new social proof: a review, a photo from a customer, a milestone.",
      },
    ],
  },
  {
    type: 'p',
    text: "If you have nothing new to say, do not send filler. Only use urgency that is real. A fake countdown that resets teaches your list to ignore your deadlines.",
  },
  {
    type: 'h2',
    text: 'Who gets which email',
  },
  {
    type: 'p',
    text: "A little segmentation helps without any complicated setup. People who clicked in email 2 but did not buy are the best audience for the follow-up. People who already bought should skip it and get a thank-you instead. If your platform makes that hard, a simple rule works: send the follow-up only to those who did not click, with a different angle.",
  },
  {
    type: 'h2',
    text: 'After the launch',
  },
  {
    type: 'p',
    text: "Look at what happened rather than just the sales number. Which email got the most clicks? Which subject line got opened? What did people reply with? Our post on reply rate covers why replies are the most honest signal you will get. Write down what worked while it is fresh. The next launch will start from a better place than this one did.",
  },
  {
    type: 'p',
    text: "A good launch email is not clever. It tells people clearly what exists, why it is worth their attention, and what to do next, and it does that across a few days instead of a single shout.",
  },
];
