import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'copywriting-frameworks-aida-pas-bab',
  title: 'AIDA, PAS, and BAB: Do Copywriting Frameworks Actually Help, or Are They Crutches?',
  description:
    "Every marketing blog teaches these three formulas like settled wisdom. The more useful question is when each one actually fits, and when it just makes your copy sound like a template.",
  date: '2026-09-02',
  readTime: '7 min read',
  category: 'Copywriting',
  image: 'https://images.pexels.com/photos/10024580/pexels-photo-10024580.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'A handwritten mind-map outline in a notebook on a wooden desk',
};

export const cta = {
  heading: "Emlet already picks the framework for you",
  body: "When Emlet writes email copy, it chooses between AIDA, PAS, BAB, and a couple of others based on what the email is actually trying to do, not by defaulting to the same one every time.",
};

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "Nearly every marketing blog has some version of \"5 copywriting formulas you need to know,\" and AIDA, PAS, and BAB show up in basically all of them, presented like settled wisdom you just apply and results follow. Almost none of those posts ask the more useful question: when does each one actually fit, and when does it just make your copy sound like it came out of a template? That's worth answering properly instead of just listing the acronyms.",
  },
  {
    type: 'h2',
    text: 'What the three actually are',
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'AIDA: Attention, Interest, Desire, Action.',
        text: "Open with something that stops the scroll, build interest with a benefit or story, build desire for the outcome, then ask for the action.",
      },
      {
        bold: 'PAS: Problem, Agitate, Solution.',
        text: "Name the pain point directly, make the reader feel the cost of leaving it unsolved, then present your offer as the fix.",
      },
      {
        bold: 'BAB: Before, After, Bridge.',
        text: "Describe the frustrating current state, paint the better state on the other side, then position your product as the bridge between the two.",
      },
    ],
  },
  {
    type: 'h2',
    text: 'The actual case for using them',
  },
  {
    type: 'p',
    text: "These aren't arbitrary. They loosely map to something marketer Eugene Schwartz described decades ago: people move through stages of awareness before they buy anything, unaware they have a problem, aware of the problem but not the solution, aware solutions exist but not yours specifically, aware of your product but not sold, and finally ready to act. A framework's real job is forcing you to write to the stage your reader is actually at, instead of skipping straight to \"buy now\" on someone who doesn't yet know why they'd want to.",
  },
  {
    type: 'h2',
    text: 'Where they go wrong',
  },
  {
    type: 'p',
    text: "Two failure modes show up constantly. The first is obvious: copy that follows the structure too literally starts to sound like it was assembled from a checklist rather than written by a person, stiff, predictable, and easy to skim past. The second is subtler and more damaging: using the wrong framework for your reader's actual awareness level. AIDA assumes the reader isn't paying attention yet, so it earns Attention first, that's the wrong opener for someone who already knows the problem and is comparing options, it reads as slow and a little patronizing. PAS and BAB both assume the opposite, that the reader already recognizes the problem, which means opening with \"agitation\" on someone who doesn't yet realize they have that problem just falls flat, there's no pain to agitate yet.",
  },
  {
    type: 'h2',
    text: "A framework can't fix a wrong read on your audience",
  },
  {
    type: 'p',
    text: "Even the correctly-chosen framework fails if the pain point you named is the wrong one, or if the audience segment you're writing to is too broad to have a shared pain point at all. Structure organizes an argument, it doesn't do the work of figuring out who you're talking to or why they'd actually care. That part still has to come from knowing your reader, no formula substitutes for it.",
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/7968063/pexels-photo-7968063.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'A hand marking up a printed manuscript with red and green pen',
    caption: 'Structure gets copy in the right shape. Editing is what makes it sound like a person wrote it.',
  },
  {
    type: 'h2',
    text: 'The same pitch, three ways',
  },
  {
    type: 'p',
    text: "Concretely, here's one scenario, a team project tool, written through each framework, to show what actually changes:",
  },
  {
    type: 'ul',
    items: [
      {
        bold: 'AIDA:',
        text: '"Most teams miss deadlines because tasks live in five different chat threads. That scattered feeling gets worse every week a project drags on. Picture your whole team working off one shared list, updated in real time. Try it free for 14 days."',
      },
      {
        bold: 'PAS:',
        text: '"Your team\'s tasks live in five different chat threads. Every week that goes on, someone misses a deadline because nobody agreed on what \'done\' meant. One shared list fixes that instantly."',
      },
      {
        bold: 'BAB:',
        text: '"Right now your team is chasing updates across five chat threads and still missing deadlines. Imagine everyone working off one shared list, always current, no one asking \'wait, is this done?\' That\'s what switching over gets you."',
      },
    ],
  },
  {
    type: 'p',
    text: "Same facts, same offer, genuinely different reading experience. AIDA takes the longest runway because it assumes the least prior awareness. PAS is the most direct, useful when you're confident the reader already feels the pain. BAB leans hardest on the emotional contrast between the two states, which tends to work well when the \"after\" picture is vivid and specific.",
  },
  {
    type: 'h2',
    text: "They're not predictable, which is why you still test",
  },
  {
    type: 'p',
    text: 'Run BAB against PAS on the identical offer to the identical audience and one will often outperform the other by a wide margin, sometimes 2 to 1, and which one wins genuinely isn\'t obvious in advance. A framework guarantees structure, not results. Treat the choice as a hypothesis worth testing, not a decision you make once and never revisit.',
  },
  {
    type: 'h2',
    text: 'The actual takeaway',
  },
  {
    type: 'p',
    text: "Pick based on what your reader already knows, not out of habit or because one formula is the one you learned first. If they don't yet know they have the problem, earn attention before you sell anything. If they already feel the problem, skip straight to agitating it and offering the fix. The frameworks are real, useful tools for organizing an argument, they're just not a substitute for knowing who's actually reading.",
  },
];
