import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'cta-button-copy-that-isnt-learn-more',
  title: 'How to Write a CTA Button That Isn\'t "Learn More"',
  description:
    "\"Learn More\" isn't wrong, it's just doing zero work. A single pronoun swap produced a 90% clickthrough lift in one of the most cited button-copy tests ever run. Here's the mechanism behind it, and what else actually moves the number.",
  date: '2026-09-27',
  readTime: '6 min read',
  category: 'Copywriting',
  image: 'https://images.pexels.com/photos/7821760/pexels-photo-7821760.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'A hand using a laptop trackpad with a webpage open showing a highlighted button',
};

export const cta = {
  heading: "Not stuck with a generic default",
  body: "Emlet writes button copy that matches the actual action, not a placeholder, as part of every email it generates. Swap it in the editor if you want something else.",
};

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "\"Learn More\" sits on an enormous share of the emails and landing pages sent every day. It's not technically wrong, someone who clicks it does, in fact, learn more. But it's the button-copy equivalent of a shrug: it describes the mildest possible commitment and asks for nothing specific, which is exactly why it converts worse than something that actually says what happens next.",
  },
  {
    type: 'h2',
    text: 'The single pronoun that produced a 90% lift',
  },
  {
    type: 'p',
    text: "One of the most cited button-copy tests in the industry, run by Michael Aagaard for ContentVerve, compared two buttons that were otherwise identical: same offer, same color, same length. One read \"Start your free trial.\" The other read \"Start my free trial.\" The only difference was a single pronoun, and the first-person version produced a 90% clickthrough lift. Other practitioners have since run similar tests and found smaller but consistent gains, typically in the 10 to 40% range, which suggests the exact number was specific to that test but the direction is real.",
  },
  {
    type: 'p',
    text: "The mechanism is worth understanding, not just copying. \"Your\" reads as an instruction coming from you, the company, telling the visitor what to do. \"My\" reframes the same action as something the visitor is already deciding for themselves, a small trigger of what behavioral researchers call the endowment effect, where framing something as already yours makes you value it more and act on it more readily. It's not a trick so much as a framing shift: the button stops sounding like a command and starts sounding like a decision the reader already made.",
  },
  {
    type: 'h2',
    text: 'Say the outcome, not the action',
  },
  {
    type: 'table',
    headers: ['Generic default', 'Says the actual outcome'],
    rows: [
      ['Learn More', 'See How It Works'],
      ['Submit', 'Send My Request'],
      ['Click Here', 'Get My Free Guide'],
      ['Sign Up', 'Start My Free Trial'],
      ['Download', 'Get the Checklist'],
      ['Continue', 'Save My Spot'],
    ],
    caption: "The right column names the thing the reader actually gets, not the mechanical act of clicking.",
  },
  {
    type: 'p',
    text: "\"Learn More\" and \"Submit\" describe the mechanics of clicking a button. They say nothing about what happens after. Action-oriented verbs paired with a concrete benefit, start, get, save, send, claim, tell the reader what they're walking away with, which gives them an actual reason to click instead of a vague suggestion that more information exists somewhere past the button.",
  },
  {
    type: 'h2',
    text: 'One button, one job',
  },
  {
    type: 'p',
    text: "Emails with a single, clear call to action consistently outperform ones offering several. One widely cited benchmark puts the gap at 371% more clicks for a single-CTA email over a multi-CTA one, and while the exact multiplier varies by source, the direction shows up everywhere: more choices at the decision point means more people choose nothing at all. If you genuinely need more than one button in an email, for a newsletter with several stories, say, make sure they're parallel entries to different content rather than competing asks pulling toward different goals. A reader deciding between \"buy now\" and \"read the case study\" is a reader who often does neither.",
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/5053846/pexels-photo-5053846.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A finger tapping an app icon on a smartphone screen',
    caption: "The button is the one moment in the email that asks for a decision. Vague copy makes that decision easy to skip.",
  },
  {
    type: 'h2',
    text: "Treat the pronoun swap as a lead, not a rule",
  },
  {
    type: 'p',
    text: "A broader HubSpot study of over 330,000 calls to action found that personalized CTAs, buttons tailored to what's actually known about the visitor rather than a static default, converted 202% better and generated 42% more leads than the same static button shown to everyone. That's a bigger effect than the pronoun swap alone, and it points at the same underlying idea: specificity beats a generic default, whether the specificity comes from pronoun, from matching the actual benefit, or from knowing something real about who's reading. \"Start my free trial\" isn't magic on its own. It's one specific, well-tested application of a pattern that's worth testing against your own audience rather than assuming the exact wording will transfer perfectly from someone else's test to yours.",
  },
];
