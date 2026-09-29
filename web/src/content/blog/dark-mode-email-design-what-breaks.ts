import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'dark-mode-email-design-what-breaks',
  title: 'Designing for Dark Mode: What Actually Breaks in Email',
  description:
    "About a third of email opens now happen in dark mode, but each client decides what that means on its own, sometimes ignoring your CSS entirely. Here's what actually breaks, and the two legitimate ways to handle it.",
  date: '2026-09-29',
  readTime: '7 min read',
  category: 'Design',
  image: 'https://images.pexels.com/photos/16345434/pexels-photo-16345434.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'Hands holding a smartphone showing a dark mode app screen in a dim room',
};

export const cta = {
  heading: "Sidesteps the whole problem by default",
  body: "Every email Emlet generates ships with color-scheme: light locked in, so your palette and logo render exactly as designed instead of getting auto-inverted by a client guessing at what you meant.",
};

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "Dark mode stopped being a niche preference a while ago. Litmus's tracking puts it at roughly 35% of all email opens, and on Gmail's mobile app specifically, about a third of users have it turned on. Set against that, only 11% of marketers say they always design for dark mode, with another 44% doing it at least sometimes. That gap, a third of your opens against roughly half your peers actually planning for it, is exactly where logos disappear and buttons go invisible.",
  },
  {
    type: 'h2',
    text: "Each client decides for itself, and that's the actual problem",
  },
  {
    type: 'p',
    text: "Dark mode in email isn't one behavior, it's three or four different ones depending on which client opens the message. Apple Mail respects the @media (prefers-color-scheme: dark) query if you've written one, and if you haven't, it just leaves your light-mode email alone rather than guessing. Gmail does the opposite: it strips prefers-color-scheme out entirely and applies its own automatic color-inversion algorithm regardless of what you coded, which is why an email with zero dark-mode CSS can still show up half-inverted in Gmail. Outlook splits down the middle again, Outlook.com partially inverts colors, while Outlook 2021 on Windows fully inverts. Three clients, three different sets of rules, and no single piece of CSS controls all of them.",
  },
  {
    type: 'table',
    headers: ['Client', 'Follows your dark-mode CSS?', 'What happens if you write none'],
    rows: [
      ['Apple Mail', 'Yes, if you provide it', 'Stays light, untouched'],
      ['Gmail (web and app)', 'No, ignores it entirely', 'Auto-inverts colors on its own logic'],
      ['Outlook.com', 'Partially', 'Partial automatic inversion'],
      ['Outlook 2021 (Windows)', 'No', 'Full automatic inversion'],
    ],
    caption: "Four clients, four different starting assumptions about what you wanted.",
  },
  {
    type: 'h2',
    text: 'What actually breaks',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Transparent PNG logos.',
        text: "A logo saved with a transparent background inherits whatever color sits behind it. A black wordmark on transparency turns invisible the moment the client flips the background to black, or gets an ugly white halo if only part of the image gets inverted.",
      },
      {
        bold: 'Buttons that vanish.',
        text: "A button whose background color happens to land close to the auto-inverted surrounding background effectively disappears, readable text on an invisible button.",
      },
      {
        bold: 'Colors chosen for contrast that stop working.',
        text: "A palette built for a white background can land on genuinely unreadable combinations once the background auto-inverts and the text color doesn't move with it.",
      },
    ],
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/6943444/pexels-photo-6943444.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A person lying in bed at night looking at a smartphone, viewed from above',
    caption: "A meaningful share of opens happen exactly like this, at night, in a dark room, with dark mode already on.",
  },
  {
    type: 'h2',
    text: 'Two legitimate ways to handle it, not one',
  },
  {
    type: 'p',
    text: "The advice that circulates most is \"design a proper dark mode\": add meta name=\"color-scheme\" content=\"light dark\" and meta name=\"supported-color-schemes\" content=\"light dark\" to the head, mirror them in a :root { color-scheme: light dark; } CSS rule, then write an explicit @media (prefers-color-scheme: dark) block with your own chosen dark palette instead of leaving it to each client's guesswork. Swap transparent logos for versions with a solid background, or provide a separate dark-mode logo asset. Done properly, this gives you control over exactly what a dark-mode reader sees instead of hoping the auto-inversion lands somewhere reasonable.",
  },
  {
    type: 'p',
    text: "The other legitimate option is simpler: skip adaptive dark mode entirely and force light mode with meta name=\"color-scheme\" content=\"light\" alone. That's not a cop-out, it's a real, commonly used choice, and it sidesteps the whole inconsistent-auto-inversion problem rather than trying to out-design it. The tradeoff is honest too: some dark-mode readers will see a bright email land in an otherwise dark interface, which a fraction of people mildly dislike, versus the alternative risk of an invisible logo or an unreadable button if the adaptive approach isn't executed carefully everywhere.",
  },
  {
    type: 'h2',
    text: "Device dark mode and app dark mode aren't the same number",
  },
  {
    type: 'p',
    text: "One distinction worth knowing before you decide how much effort this deserves: roughly 37% of iOS devices have dark mode enabled at the operating system level, but only about 7.5% of Apple Mail opens actually render dark. Turning on dark mode for your phone doesn't automatically mean every app, including Mail, follows along. If you're trying to judge how much this matters for your own list, check your ESP's actual dark-mode-open percentage rather than assuming device-level adoption numbers translate directly into what your subscribers see.",
  },
];
