import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'reengagement-campaigns-when-to-send-vs-prune',
  title: 'Re-Engagement Campaigns: When to Send One, and When to Just Prune the List',
  description:
    "Every list-hygiene guide says to win back inactive subscribers before deleting them. That's true for some of them and a waste of a spam complaint for others, and the difference comes down to separating \"gone quiet\" from \"never engaged at all.\"",
  date: '2026-09-10',
  readTime: '7 min read',
  category: 'Deliverability',
  image: 'https://images.pexels.com/photos/7439124/pexels-photo-7439124.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'A laptop screen showing an email inbox being sorted and cleaned up',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "There are two pieces of standard advice about a quiet segment of your list, and they contradict each other more than anyone admits. One says always try to win them back, a re-engaged subscriber is nearly free revenue. The other says just delete them, they're dragging down your engagement rate and quietly hurting deliverability for everyone else. Both are true, for different subscribers. The actual skill here is telling which subscriber you're looking at.",
  },
  {
    type: 'h2',
    text: 'Define "inactive" before doing anything else',
  },
  {
    type: 'p',
    text: 'Sources genuinely disagree on the exact window, and the honest answer is that it should scale with how often you send, not sit at one fixed number. A brand emailing daily or weekly can call someone inactive after 3 to 6 months of no opens or clicks, since that\'s already many missed sends. A monthly newsletter needs a longer runway, 12 to 18 months, before the same silence means the same thing. The commonly cited "industry standard" of 6 to 12 months is really an average of those two situations, useful as a default if you don\'t know your own number yet, not a rule to apply blindly.',
  },
  {
    type: 'table',
    headers: ['If you send', 'A reasonable inactivity threshold'],
    rows: [
      ['Daily or weekly', '3 to 6 months with no opens or clicks'],
      ['Biweekly or monthly', '6 to 12 months'],
      ['Quarterly or less often', '12 to 18 months'],
    ],
    caption: "Scale the window to your own cadence. A flat 90-day rule punishes infrequent senders' subscribers for being exactly as engaged as they've always been.",
  },
  {
    type: 'h2',
    text: "Why doing nothing isn't neutral",
  },
  {
    type: 'p',
    text: "It's tempting to just leave a quiet segment alone rather than deal with it, but that's not actually a neutral choice. Lists decay on their own regardless, one widely cited figure puts natural annual list decay around 22 to 23%, through bounces, spam-trap conversions, and abandoned addresses, whether you send to that segment or not. Worse, inactive subscribers are disproportionately likely to mark an email as spam rather than unsubscribe, simply because they've forgotten who you are and a delete-and-report click is faster than finding the unsubscribe link. Since mailbox providers score reputation at the domain level, not per recipient, that complaint rate drags down inbox placement for the subscribers who are still actually reading you.",
  },
  {
    type: 'p',
    text: "This isn't a small technical footnote anymore either. Gmail and Yahoo's sender requirements now enforce a spam complaint rate under 0.3%, with best-in-class senders targeting closer to 0.1%, and as of late 2025 Gmail moved to hard enforcement: mail from non-compliant domains gets rejected outright rather than just filtered to spam. A stale, unengaged chunk of your list is one of the more direct paths to crossing that line.",
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/33197834/pexels-photo-33197834.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A person scrolling through a contacts list on a smartphone',
    caption: "Leaving a dormant segment alone doesn't preserve the status quo. It slowly drags down deliverability for everyone else on the list.",
  },
  {
    type: 'h2',
    text: 'The case for trying to win them back first',
  },
  {
    type: 'p',
    text: 'That said, deleting a quiet segment outright without a single attempt to reach them usually leaves real revenue on the table. Left alone, only around 11% of inactive customers come back to a brand on their own within a month, but subscribers who do get successfully re-engaged convert at a rate research puts around 7:1 relative to the cost of reaching them, and segments that have been quiet for about 90 days often reactivate at 10 to 12% when sent a genuine win-back attempt. A short, well-timed sequence before deletion is usually worth the two or three emails it costs, both for the recovered revenue and because it gives ISPs a fresher engagement signal on those addresses than months of total silence would.',
  },
  {
    type: 'h2',
    text: 'What an actual win-back sequence looks like',
  },
  {
    type: 'ul',
    items: [
      {
        bold: '3 to 5 emails, spaced about a week apart.',
        text: "Long enough to give someone a real chance to notice and respond, short enough that it doesn't turn into its own form of spam.",
      },
      {
        bold: 'Start with value, not a sales pitch.',
        text: '"Here\'s what you\'ve missed" or a genuinely good piece of content does more than "we miss you," which asks for an emotional response a cold subscriber doesn\'t have.',
      },
      {
        bold: 'Offer a frequency or preference change, not just an unsubscribe link.',
        text: "Some of these subscribers didn't disengage from the brand, they disengaged from the volume. Letting them drop to monthly instead of weekly recovers people a binary unsubscribe would lose.",
      },
      {
        bold: 'End with an explicit \"we\'ll stop emailing you\" notice.',
        text: "The final email in the sequence should say plainly that this is the last one unless they take an action. It's the most effective single email in most win-back sequences, because it forces a decision instead of inviting continued silence.",
      },
    ],
  },
  {
    type: 'p',
    text: "Anyone who doesn't respond to that sequence, no open, no click, no preference update, should come off the active list within 90 to 180 days of the sequence finishing, or after 3 to 4 attempts, whichever comes first. That's not punitive. It's the same logic as the sequence itself: their engagement signal has told you what it's going to tell you, and continuing to mail them past that point only adds risk with no realistic upside left.",
  },
  {
    type: 'h2',
    text: 'When to skip straight to pruning instead',
  },
  {
    type: 'p',
    text: "Where I'd push back on the \"always try to win them back first\" version of this advice: it assumes every quiet subscriber was once engaged and drifted. Plenty weren't. Someone who has never opened a single email since the day they signed up isn't dormant, they're a bad address, whether that's a mistyped signup, a burner used to get a discount code, or a contact from a purchased or imported list that never actually opted in with intent. Sending that group a thoughtful win-back sequence doesn't recover meaningful revenue, since there's no prior engagement to revive, and it does add spam-complaint exposure you didn't need to take on. The same goes for anyone already well past your inactivity threshold from the table above by a wide margin, a year or more of total silence on a weekly send, for instance. At that point a win-back email is closer to a cold email than a re-engagement one, and it's worth treating it with the same caution.",
  },
  {
    type: 'p',
    text: "The actual goal underneath all of this isn't keeping the subscriber count high. It's keeping inbox placement good for the people still reading you, and a smaller, more honestly engaged list does that better than a larger one padded with addresses that were never going to open anything again.",
  },
];
