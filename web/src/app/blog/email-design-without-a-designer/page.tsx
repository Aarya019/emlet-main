import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';
import BlogCTA from '@/components/BlogCTA';
import BlogHeroImage from '@/components/BlogHeroImage';
import { BLOG_POSTS } from '@/lib/content/posts';

const post = BLOG_POSTS.find((p) => p.slug === 'email-design-without-a-designer')!;

export const metadata: Metadata = {
  title: `${post.title} | Emlet Blog`,
  description: post.description,
  openGraph: {
    title: post.title,
    description: post.description,
    url: `https://emlet.app/blog/${post.slug}`,
    siteName: 'Emlet',
    type: 'article',
  },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: post.title,
  description: post.description,
  image: post.image,
  datePublished: post.date,
  author: { '@type': 'Person', name: 'Aarya', url: 'https://emlet.app' },
  publisher: {
    '@type': 'Organization',
    name: 'Emlet',
    logo: { '@type': 'ImageObject', url: 'https://emlet.app/icon.png' },
  },
  mainEntityOfPage: { '@type': 'WebPage', '@id': `https://emlet.app/blog/${post.slug}` },
};

export default function Post() {
  return (
    <MarketingLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Link href="/blog" className="text-sm text-white/40 hover:text-white transition-colors mb-8 inline-block">
        ← Back to blog
      </Link>

      <div className="mb-10">
        <p className="text-xs font-semibold tracking-widest text-[#00ffff]/60 uppercase mb-3">{post.category}</p>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 leading-tight">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-white/40">
          <span>Aarya, Founder of Emlet</span>
          <span>·</span>
          <span>{formatDate(post.date)}</span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>
      </div>

      <BlogHeroImage src={post.image} alt={post.imageAlt} />

      <div className="space-y-6 text-white/70 leading-relaxed text-[17px]">
        <p>
          The first email I ever sent for a business took me four hours. Not because the copy was hard, I knew what I wanted to say, but because I kept opening a blank template and freezing. Where does the logo go. Is this font too big. Should the button be blue or does blue look cheap now. None of that is writing. It's decoration, and decoration is where people without design backgrounds go to die.
        </p>
        <p>
          Here's the thing that took me embarrassingly long to figure out: an email that "looks designed" isn't the result of good taste. It's the result of a handful of structural decisions, made once, and then applied consistently. You don't need an eye for design. You need a short checklist and the discipline to stick to it even when a part of you wants to add a third font because it "pops."
        </p>

        <h2 className="text-2xl font-bold text-white pt-6">Pick one goal per email</h2>
        <p>
          This is the biggest one, and it has nothing to do with visuals. Before you touch color or layout, decide what you want the reader to do after opening this specific email. Buy the thing. Read the post. Book the call. One action.
        </p>
        <p>
          Most amateur emails fail before they're even designed, because they try to do five things: here's our new feature, and also a sale, and also read our blog, and also follow us on Instagram. Every extra link is a vote against the one you actually care about. If you can't say your email's goal in one sentence, you're not ready to design it yet, you're still writing it.
        </p>

        <h2 className="text-2xl font-bold text-white pt-6">Hierarchy beats decoration</h2>
        <p>
          A reader scanning an email (and they are scanning, nobody reads top to bottom on the first pass) needs to instantly tell what matters most. That's hierarchy, and you get it almost entirely from three levers: size, weight, and spacing. Not color, not icons, not a clever font pairing.
        </p>
        <p>
          A working hierarchy looks like this: one headline that's noticeably bigger than everything else, body text that's comfortable to read (16px minimum, don't go smaller to fit more in), and one button that's visually louder than any other element on the page. If someone glances at your email for two seconds, they should walk away knowing the headline and the button. That's it. Everything else is supporting cast.
        </p>

        <h2 className="text-2xl font-bold text-white pt-6">Two colors, maybe three</h2>
        <p>
          You already have brand colors, even if you've never written them down. It's whatever's on your logo and your website. Use those. Pick a primary (usually your logo color, used for the button and headline accents) and a neutral (near-black text, off-white or white background). If you want a third, make it a genuine accent used sparingly, a highlight, a badge, a small icon fill. Not a fourth. Not a fifth. Every additional color is a decision the reader has to unconsciously process, and it dilutes whichever one you actually wanted them to notice, which is almost always the button.
        </p>
        <p>
          This is also just faster. When you constrain yourself to two or three colors decided in advance, you stop relitigating the palette every time you sit down to make an email. The decision is made once, for the brand, not once per campaign.
        </p>

        <h2 className="text-2xl font-bold text-white pt-6">Whitespace is not wasted space</h2>
        <p>
          The instinct when something looks unfinished is to add more, another line of copy, a second image, a border. Usually the actual fix is the opposite: more padding around what's already there. Cramped elements read as amateur regardless of how good the individual pieces are. Give your headline room above it. Give your button at least 24px of breathing room on every side. If in doubt, add space before you add content.
        </p>

        <h2 className="text-2xl font-bold text-white pt-6">A structure you can reuse for almost anything</h2>
        <p>
          Most marketing emails, regardless of what they're announcing, fit one of three shapes:
        </p>
        <ul className="list-disc list-outside pl-5 space-y-2">
          <li><strong className="text-white">Announcement</strong>: logo, one hero image or none, headline, two sentences of context, one button. Good for launches, sales, single-offer promos.</li>
          <li><strong className="text-white">Story</strong>: headline, a few short paragraphs building context, then the ask at the end. Good for newsletters, updates, anything that needs to earn the click rather than lead with it.</li>
          <li><strong className="text-white">Digest</strong>: headline, then three or four short blocks (image, title, one line, link) stacked or in a grid. Good for roundups, "what's new," multi-item content.</li>
        </ul>
        <p>
          Decide which shape you're using before you open the editor. It removes about eighty percent of the layout decisions on the spot, because the shape tells you where things go.
        </p>

        <h2 className="text-2xl font-bold text-white pt-6">The part nobody warns you about: HTML email is its own animal</h2>
        <p>
          Even once the design decisions are made, there's a second, more annoying problem: getting it to actually render the same way in Gmail, Outlook, and Apple Mail. Email clients don't render HTML like browsers do. Outlook on Windows in particular still uses Microsoft Word's rendering engine, not a real browser engine, which means a lot of ordinary CSS just doesn't work. I wrote a full breakdown of what specifically breaks and why in{' '}
          <Link href="/blog/why-your-emails-look-broken-in-gmail-outlook" className="text-[#00ffff] hover:underline">
            this post
          </Link>
          , but the short version is: design decisions and rendering problems are two separate skills, and most people only find out about the second one after their newsletter shows up looking like a ransom note in someone's inbox.
        </p>

        <p>
          If any of this sounds like more decision-making than you wanted to do for a Tuesday promo email, that's honestly the reason I built Emlet. You describe the email, it already knows your brand colors and logo from a profile you set up once, and it makes the hierarchy and spacing decisions for you, using table-based HTML that doesn't fall apart in Outlook. You can still open the editor and change anything. But you don't have to stare at a blank template deciding where the button goes.
        </p>

        <BlogCTA />
      </div>
    </MarketingLayout>
  );
}
