import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'writing-for-skimmers-how-people-read-email',
  title: "Writing for Skimmers: How People Actually Read Your Email",
  description:
    "Eye-tracking research says nobody reads your email top to bottom. They scan it in a predictable pattern, looking for a handful of anchors. Here's what those anchors are and how to write for them.",
  date: '2026-09-28',
  readTime: '6 min read',
  category: 'Copywriting',
  image: 'https://images.pexels.com/photos/6958526/pexels-photo-6958526.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'A hand highlighting text in a printed document with a teal highlighter',
};

export const cta = {
  heading: "Built to be skimmed, not just written",
  body: "Emlet generates emails as distinct blocks, headings, short paragraphs, bullets, not one long paragraph, so the structure that makes skimming work is already there by default.",
};

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "Litmus has tracked how long people actually look at a marketing email for years, and the number has been dropping. In 2018 it was 13.4 seconds. By 2022 it was down to 9. Break that down further and it gets more specific: about 30% of emails get less than 2 seconds of attention, 41% get somewhere between 2 and 8 seconds, and only 29% get more than 8 seconds. Nobody is reading your email the way they'd read an article. They're scanning it, deciding fast, and moving on.",
  },
  {
    type: 'h2',
    text: "Nobody reads in a straight line",
  },
  {
    type: 'p',
    text: "Eye-tracking research on how people read on screens keeps finding the same handful of patterns, not a smooth left-to-right, top-to-bottom read. The most common is the F-pattern: eyes move across the headline, then drop down the left margin, picking up just the first few words of each line below it, and rarely make it all the way to the right edge. That's what happens to a dense, unformatted block of text. Well-structured content gets read differently: eyes jump from heading to heading, bullet to bullet, skipping the body copy in between almost entirely. Researchers sometimes call this the layer-cake pattern. The difference between the two isn't the reader, it's whether you gave them headings and bullets to jump between in the first place.",
  },
  {
    type: 'table',
    headers: ['Time spent looking at an email', 'Share of opens'],
    rows: [
      ['Under 2 seconds', '30%'],
      ['2 to 8 seconds', '41%'],
      ['More than 8 seconds', '29%'],
    ],
    caption: "Litmus's attention-span research. Under a third of opens get more than 8 seconds of real attention.",
  },
  {
    type: 'h2',
    text: "What the first 11 seconds actually fixate on",
  },
  {
    type: 'p',
    text: "Nielsen Norman Group's eye-tracking work on email found a consistent set of anchors readers' eyes land on early: the first two sentences (the single highest fixation point in the whole email), the last sentence or the call to action (people scroll ahead to see what's actually being asked of them before deciding whether the middle is worth reading), any bolded or visually distinct text, and the sender name. That's a short, specific list, and it means the sentence you bury three paragraphs in in the hope someone reads that far is, for roughly 70% of opens, never going to be seen.",
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'Put the actual point in the first two sentences.',
        text: "Not a warm-up, not context-setting, the thing you actually want them to know or do. That's the highest-attention real estate you get.",
      },
      {
        bold: 'Make the CTA legible without reading anything above it.',
        text: "Since people scroll down to check the ask before committing to read, a vague button like \"Learn More\" wastes the one thing they're actively looking for.",
      },
      {
        bold: 'Bold text sparingly, and mean it.',
        text: "Bolded and highlighted text should work as a scannable skeleton, someone reading only the bold phrases should still get the gist. That only works if bolding is rare enough to actually draw the eye; a rule of thumb worth respecting is keeping highlighted text under roughly 30% of the total.",
      },
    ],
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/7596911/pexels-photo-7596911.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A person marking up a printed document with a red pen',
    caption: "Editing for skimmers usually means cutting, not rewriting, the sentence that isn't load-bearing.",
  },
  {
    type: 'h2',
    text: 'Scannable formatting is measurably not just a nicety',
  },
  {
    type: 'p',
    text: "This isn't purely a stylistic preference. Content with clear structure, lists, headings, short paragraphs, has been measured to produce meaningfully better usability outcomes than the same information delivered as dense prose, in the range of a 47% improvement in one commonly cited usability comparison. The mechanism lines up with the eye-tracking data: a heading or a bullet is a decision point where a skimming reader can quickly judge \"is this section for me\" without reading the sentences underneath it. Take that decision point away by burying everything in paragraphs and you're asking someone who gives you 9 seconds to invest closer to 90.",
  },
  {
    type: 'h2',
    text: "Design for the scan, not the read",
  },
  {
    type: 'p',
    text: "None of this means write less carefully, it means place the careful writing where it'll actually get seen. A skimmed email that lands its one real point in the first two sentences and makes the CTA obvious does more work than a beautifully written email whose best line is buried in paragraph four. Skimming isn't a failure mode you're fighting against, it's just how reading email actually works, and writing for it, not against it, is the difference between a message that lands and one that technically existed.",
  },
];
