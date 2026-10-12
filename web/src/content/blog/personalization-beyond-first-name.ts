import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'personalization-beyond-first-name',
  title: 'Personalization Beyond {First Name}: What Actually Moves the Needle',
  description:
    "Inserting a name token stopped being novel a long time ago, and a broken merge tag does more damage than the generic version ever would have. Real personalization is a different thing entirely, and it's usually simpler than people assume.",
  date: '2026-10-12',
  readTime: '6 min read',
  category: 'Copywriting',
  image: 'https://images.pexels.com/photos/8385830/pexels-photo-8385830.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'Light blue jigsaw puzzle pieces scattered on a white surface',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "\"Personalize your emails\" has quietly come to mean one thing for most senders: insert {First Name} into the subject line or greeting. It's become so standard that it's lost most of whatever novelty it once had, and when the merge tag breaks, which happens constantly, it actively damages trust more than the plain, generic version ever would have.",
  },
  {
    type: 'h2',
    text: "The failure mode that's worse than not personalizing at all",
  },
  {
    type: 'p',
    text: "\"Hi there\" reads as mildly impersonal. \"Hi {first_name}\" or \"Hi ,\" the literal broken merge tag or an empty field left over from a contact with no name on file, reads as a company that doesn't check its own emails before sending them. That failure is extremely common, since plenty of contacts in any real list never had a name field filled in, and it's entirely preventable with a sensible fallback. If personalization is going to happen at all, getting the fallback right is the floor, not an edge case worth skipping.",
  },
  {
    type: 'h2',
    text: "What personalization actually means, mechanically",
  },
  {
    type: 'p',
    text: "Real personalization isn't a name inserted into otherwise identical content, it's relevance: showing someone something that reflects what's actually true about them. A name token doesn't change what the email says, it just decorates the same message for everyone. Relevance changes the content itself based on real signal, behavior, purchase history, stated preference, what someone actually did or didn't do.",
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/37213006/pexels-photo-37213006.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A close-up of handwritten cursive text on paper',
    caption: "What makes something feel personal was never the name at the top. It's whether the content actually fits the reader.",
  },
  {
    type: 'h2',
    text: 'Concrete forms of personalization that actually move a number',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Behavioral triggers.',
        text: "An abandoned-cart email referencing the actual item left behind, or a re-engagement email that only goes to people who've genuinely gone quiet, both respond to something real the recipient did, not a static field pulled from a signup form.",
      },
      {
        bold: 'Purchase or activity-based recommendations.',
        text: "\"You bought X, here's a complementary Y\" is built from real history. \"Check out our new arrivals\" sent to everyone isn't personalization no matter how the subject line is worded.",
      },
      {
        bold: 'Segment-level content, not just segment-level targeting.',
        text: "Splitting a list into two or three real segments and sending each one genuinely different content produces more lift than a perfectly inserted name token ever will, and it doesn't require sophisticated tooling to execute.",
      },
      {
        bold: 'Preference-driven content blocks.',
        text: "Someone who consistently engages with one type of content getting more of that, and less of what they've ignored, is personalization built from evidence instead of a guess.",
      },
    ],
  },
  {
    type: 'h2',
    text: 'Where to actually start',
  },
  {
    type: 'p',
    text: "Granular, individual-level content personalization needs infrastructure most small lists don't have and isn't where the early return lives anyway. The realistic starting point is simpler: fix the name-token fallback so a missing name never shows up broken, then pick the single highest-leverage behavioral trigger available, usually cart abandonment or inactivity-based re-engagement, before investing in anything more elaborate. A name in the subject line was never the thing doing the work. Relevance was, and relevance is buildable with far less data than it sounds like it requires.",
  },
];
