import type { BlogPostMeta } from '@/lib/content/posts';
import type { ContentBlock } from '@/lib/content/blocks';

export const meta: BlogPostMeta = {
  slug: 'write-like-a-person-not-a-brand',
  title: 'How to Write Like a Person, Not a Brand',
  description:
    "A study that fed people two versions of the same memo, one plain, one full of corporate-speak, found the jargon version tanked comprehension and recall. Here's why that matters for email, and what an actually useful voice guide looks like.",
  date: '2026-09-28',
  readTime: '6 min read',
  category: 'Copywriting',
  image: 'https://images.pexels.com/photos/6143830/pexels-photo-6143830.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=800',
  imageAlt: 'Hands typing on a vintage black typewriter',
};

export const cta = false as const;

export const body: ContentBlock[] = [
  {
    type: 'p',
    text: "Open a random marketing email and there's a decent chance it reads like it was written by the same person as every other marketing email you've gotten this month. Same warm-up sentence, same vague confidence, same phrase that means nothing specific. That sameness isn't an accident of bad writing, it's what happens when \"brand voice\" gets treated as a tone to perform instead of a real constraint on what you're actually allowed to say.",
  },
  {
    type: 'h2',
    text: 'Jargon does not just sound bad, it measurably fails',
  },
  {
    type: 'p',
    text: "Kickresume ran a small but pointed experiment: two groups of 25 people each read a version of the same workplace memo, one in plain language, one rewritten with typical corporate-speak. The plain-language group scored 80% on a reading comprehension test afterward. The jargon group scored 50%. An hour later, the plain-language readers could still recall 34 key points from the memo; the jargon readers recalled 12. Same information, same length, and the version stuffed with corporate phrasing lost most of its own content on the way in.",
  },
  {
    type: 'h2',
    text: "Buzzwords don't just confuse, they read as evasive",
  },
  {
    type: 'p',
    text: "There's an older but frequently cited finding that people who lean on buzzwords and industry jargon instead of plain language are more likely to be perceived as dishonest, not just unclear. The mechanism makes sense once you think about it: plain, specific language is easy to check against reality (\"we shipped the update Tuesday\" is either true or it isn't), while vague corporate phrasing (\"we're aligning on a path forward\") can't really be verified at all, so it reads as something being hidden even when nothing actually is. If a reader can't tell what you're claiming, the safest assumption they make isn't neutral, it's suspicious.",
  },
  {
    type: 'h2',
    text: '"Brand voice" as adjectives is not a voice guide',
  },
  {
    type: 'p',
    text: "Most brand voice documents list three or four adjectives: friendly, confident, professional, approachable. Every company's list looks basically the same, which is the tell that it isn't doing any real work. An adjective doesn't tell a writer what to actually do differently in a sentence. A voice guide that's worth anything reads more like a set of concrete rules: which specific words are banned outright (ours, at a glance, would ban \"synergy,\" \"leverage\" as a verb, and \"in today's fast-paced landscape\"), roughly how long sentences are allowed to run before they get cut, whether contractions are allowed, and a simple test: would we actually say this sentence out loud to one specific customer, or does it only work printed on a page where no one's expected to say it back to you.",
  },
  {
    type: 'table',
    headers: ['Corporate default', 'What a person would actually say'],
    rows: [
      ['We are reaching out to inform you', "We're writing to let you know"],
      ['Please do not hesitate to utilize this opportunity', 'Feel free to use this'],
      ['In order to facilitate a seamless experience', 'To make this easier'],
      ["We're circling back regarding your inquiry", "Following up on what you asked"],
      ['Leverage our platform to drive results', 'Use it to get more done'],
    ],
    caption: "Neither column changes what's being said. Only one column sounds like it was written by a person.",
  },
  {
    type: 'image',
    src: 'https://images.pexels.com/photos/9050619/pexels-photo-9050619.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=900',
    alt: 'Two people having an animated conversation over coffee, seen through a window',
    caption: "The bar worth writing to: would this sentence survive being said out loud to one actual person?",
  },
  {
    type: 'h2',
    text: 'The out-loud test',
  },
  {
    type: 'p',
    text: "Read the email out loud before sending it, specifically to one imagined person, not to a room. Corporate phrasing tends to survive being written and read silently, since nobody's ear ever actually catches it. It rarely survives being said out loud. \"We're reaching out to share an exciting update\" sounds fine on a screen. Say it to a friend's face and it sounds like you're reading from a script, because you are, just one every other company is using too.",
  },
  {
    type: 'p',
    text: "None of this is an argument for being casual for its own sake, or dropping slang into every subject line. A precise, plain sentence in a serious tone still passes the test; a jargon-free sentence that's still evasive doesn't. The actual bar is legibility and specificity: could a real person say this to another real person and have it mean something concrete? If yes, it'll probably survive contact with an inbox that's already skimming past everything that doesn't.",
  },
];
