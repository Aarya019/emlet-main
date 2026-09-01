import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'welcome-email-sequence-what-to-send',
  title: 'What Actually Goes in a Welcome Email Sequence (Email 1, 2, and 3)',
  description:
    "The 'send 5 emails over 8 days' advice is everywhere and the sources behind it disagree with each other constantly. Here's what has real evidence behind it, and what to actually put in the first three emails.",
  date: '2026-09-01',
  readTime: '7 min read',
  category: 'Email Marketing',
  image: 'https://images.pexels.com/photos/3826678/pexels-photo-3826678.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'A hand lettering the word "Welcome" in ink calligraphy on kraft paper',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "Look up \"ideal welcome email sequence length\" and you'll get a different confident answer from every source: 3 emails, 5 emails, 6, sometimes as many as 9. One report averages it out to 6.45 emails, which is a strange number to be confident about anything with. Before getting into what to actually put in each email, it's worth being honest that the \"how many\" question doesn't have one right answer, and most of the advice on it is more opinion dressed as a rule than actual tested data.",
  },
  {
    type: 'h2',
    text: 'How long should the sequence actually be',
  },
  {
    type: 'p',
    text: "What the sources do agree on, roughly: somewhere between 3 and 6 emails, spread across 7 to 20 days, is the range almost everyone converges on. Fewer than 3 and you're leaving an obvious opportunity on the table, since a new subscriber is more curious about you on day one than they'll ever be again. More than 6 and you risk it feeling like a drip campaign instead of a welcome, tipping into the kind of automated cadence people unsubscribe from out of sheer volume.",
  },
  {
    type: 'p',
    text: "My honest read: for a small business without a dedicated lifecycle marketer, 3 to 5 emails is the right target. A 9-email sequence sounds thorough on a strategy doc, but somebody has to actually write 9 good emails, and a shorter sequence you finish and iterate on beats a long one that's 60% filler because you ran out of things to say by email 5.",
  },
  {
    type: 'h2',
    text: 'When does the first one actually need to go out',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'The range here is wide too:',
        text: 'some sources say within five minutes of signup, others say within 24 hours is fine. What they all agree on is the underlying reason, the first 48 hours after someone signs up is the single highest-engagement window you\'ll ever get from them, and it decays fast after that.',
      },
      {
        bold: 'The practical takeaway isn\'t the exact minute.',
        text: "It's that this email needs to be automated, not something a person remembers to send manually. If your welcome email currently goes out whenever someone on your team gets around to it, that's the actual gap to close before worrying about whether email 4 should be day 9 or day 11.",
      },
    ],
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/5386738/pexels-photo-5386738.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A calendar, coffee, and laptop laid out on a desk for planning',
    caption: 'Space the emails by what each one needs to accomplish, not by an arbitrary daily cadence.',
  },
  {
    type: 'h2',
    text: 'Give each email one job, not five',
  },
  {
    type: 'p',
    text: "This is the actual useful piece of advice buried under all the \"how many emails\" debate: assign each email in the sequence a single conversion job, and measure that job on its own instead of judging the whole sequence as one blob. Concretely, for a 3-email version:",
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Email 1 — welcome and set expectations.',
        text: "Say thanks, say what they'll actually get from you and how often (weekly tips, occasional sales, whatever's true), and give one low-commitment action, reply to this email, follow on social, check out a specific page. Not a sale. This one email gets the highest open rate you'll ever see from this person, so the job here is trust, not revenue.",
      },
      {
        bold: 'Email 2 — the story, not the pitch.',
        text: 'Why you exist, what makes the product or the business different, maybe a customer story. This is the email that turns "I signed up for a discount" into "I actually want to hear from this brand," and it\'s the one most sequences skip entirely in a rush to get to the offer.',
      },
      {
        bold: 'Email 3 — the actual offer.',
        text: "Save your strongest offer for here, not email 1. Leading with the discount code trains new subscribers to wait for a deal before they ever engage with anything else you send, and it skips the trust-building the first two emails were supposed to do.",
      },
    ],
  },
  {
    type: 'p',
    text: 'If you\'re running a longer sequence, the same logic just repeats: pick a job per email (education, social proof, objection-handling, offer) rather than writing five variations of "check out our stuff."',
  },
  {
    type: 'h2',
    text: 'The stat worth actually caring about',
  },
  {
    type: 'p',
    text: "Open rate numbers for welcome emails are all over the place across different reports, anywhere from 35% to over 50%, and any number above roughly 45% should be read skeptically since Apple's Mail Privacy Protection auto-opens a chunk of email for a meaningful share of iPhone users, inflating the metric industry-wide. Click rate and conversion data is more consistent and more interesting: welcome emails see roughly 14% click rates against 2-3% for standard campaigns, and businesses running an actual multi-email sequence see conversion rates around a third higher than businesses sending just one welcome email. Automated sequences overall are commonly cited as driving well over a third of total email revenue from a low single-digit share of total volume sent. That's the actual argument for building one of these, not the open rate.",
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/4049730/pexels-photo-4049730.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A person sitting cross-legged on the floor checking a laptop with breakfast nearby',
    caption: 'The first email lands while someone\'s still curious about you, not yet in inbox-triage mode.',
  },
  {
    type: 'h2',
    text: "Plain text or designed?",
  },
  {
    type: 'p',
    text: "One genuinely counterintuitive finding worth passing on honestly: plain-text or lightly-designed emails tend to outperform heavy HTML templates specifically in welcome sequences, because they read as personal rather than promotional. I'd apply that nuance rather than the blanket rule, though. Email 1, the \"hi, welcome, here's what to expect\" note, benefits the most from feeling like it came from a person. By the time you're at email 3, the offer, it's fine and often better for it to look like a real, on-brand campaign, since that's the email where you actually want it to read as a deliberate, professional offer rather than an afterthought.",
  },
  {
    type: 'h2',
    text: "What I'd actually build with 3 emails",
  },
  {
    type: 'p',
    text: 'If you\'re starting from nothing: day 0, an automated welcome with one soft action, no offer. Day 2 or 3, the story or social proof email. Day 5 to 7, the actual offer, your best one, not a token 10% off. That\'s it. You can always add a fourth and fifth email later once you\'ve seen how the first three actually perform, which is a more useful next step than guessing at the "ideal" length from a blog post, including this one.',
  },
];
