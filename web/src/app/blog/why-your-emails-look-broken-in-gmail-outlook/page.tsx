import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';
import BlogCTA from '@/components/BlogCTA';
import BlogHeroImage from '@/components/BlogHeroImage';
import { BLOG_POSTS } from '@/lib/content/posts';

const post = BLOG_POSTS.find((p) => p.slug === 'why-your-emails-look-broken-in-gmail-outlook')!;

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
          You send the campaign. You check it on your phone, looks great. A coworker opens it in Outlook and the button is gone, the layout is stacked wrong, and there's a mystery gap where an image used to be. This isn't bad luck and it isn't your fault for not testing hard enough. It's because email HTML is not web HTML, and almost nobody tells you that until it's already broken in front of a client.
        </p>

        <h2 className="text-2xl font-bold text-white pt-6">Outlook is still rendering with Word</h2>
        <p>
          This is the one that surprises people most. Outlook on Windows, since 2007, doesn't use a browser engine to render HTML email. It uses Microsoft Word's rendering engine. Word. The word processor. That means no CSS grid, no flexbox, unreliable support for background images, and plenty of quirks around margins and padding that don't exist anywhere else. This is also why so much email HTML still looks like it's from 2003, nested tables with inline styles, because that's genuinely one of the only layout methods that survives Word's rendering engine reliably. It's not that email developers don't know CSS. It's that the most hostile rendering environment they have to support is a word processor from two decades ago.
        </p>

        <h2 className="text-2xl font-bold text-white pt-6">The Canva export trap</h2>
        <p>
          A lot of small businesses design their email as a single graphic in Canva, export it as one image, and drop that into their email tool. It looks exactly right, because it's a picture of the design, pixel for pixel. Then it goes out and three things happen: many inboxes block images by default, so the recipient sees a blank box until they click "show images." Screen readers can't read an image, so it's invisible to anyone using assistive tech. And spam filters are naturally suspicious of an email that's 100% image and 0% text, since that's a common spam evasion tactic, which can quietly hurt your deliverability across your whole list, not just that one send.
        </p>
        <p>
          The fix isn't to avoid images. It's to build the email as real HTML text and layout, with images used for actual visuals (product photos, illustrations) rather than as a substitute for text you were too rushed to lay out properly.
        </p>

        <h2 className="text-2xl font-bold text-white pt-6">Dark mode inverts things you didn't ask it to</h2>
        <p>
          Gmail, Apple Mail, and Outlook's mobile apps all have a dark mode that can auto-invert colors in an email that doesn't explicitly declare them. The classic failure: a logo saved as a transparent PNG with black text, which looks fine in a normal inbox, and then turns into invisible black text on a black background the moment someone with dark mode enabled opens it. The fix is to either give the logo (and any similar element) an explicit background color rather than relying on transparency, or to test your email specifically with dark mode toggled on, not just light mode, before you send.
        </p>

        <h2 className="text-2xl font-bold text-white pt-6">Images are off by default for a lot of your list</h2>
        <p>
          Most major email clients block remote images until the recipient explicitly allows them, partly for privacy (tracking pixels live in images too) and partly as a spam-era holdover. If your entire email's message depends on an image loading, a portion of every send opens to a blank or broken layout. Alt text isn't a nice-to-have here, it's what a meaningful chunk of your opens will actually see on first glance. Write it like it's the headline, because for some readers, it is.
        </p>

        <h2 className="text-2xl font-bold text-white pt-6">Fixed widths and mobile stacking</h2>
        <p>
          Desktop email clients are more forgiving of fixed-width layouts than the browser is, which means a table built at 800px wide can force horizontal scrolling on a phone screen instead of gracefully stacking. The safe target is 600px max width for the main content column, with layout choices (side-by-side columns especially) that explicitly collapse to a single column below a certain width, rather than assuming it'll "just work" the way a responsive website would.
        </p>

        <h2 className="text-2xl font-bold text-white pt-6">Why this is a genuinely separate skill from design</h2>
        <p>
          I wrote a companion post on the actual design decisions, hierarchy, color, spacing, that make an email look intentional, which you can read{' '}
          <Link href="/blog/email-design-without-a-designer" className="text-[#00ffff] hover:underline">
            here
          </Link>
          . The point worth repeating is that design and rendering are two different problems. You can make every correct visual decision and still have the email fall apart in Outlook, because the thing that broke it wasn't a design choice, it was a CSS property that a legacy rendering engine doesn't support. Nobody teaches this in a normal design education, because it's specific to email and genuinely a little arcane.
        </p>

        <p>
          This is the exact reason table-based, inline-styled HTML still dominates email fifteen-plus years after CSS made it obsolete everywhere else on the web. It's also why, when Emlet generates an email, it's building real table-based markup with inline styles under the hood rather than a flattened image or modern CSS that half your recipients' inboxes can't render, so you don't have to learn Outlook's fifteen-year-old quirks to send something that looks right everywhere.
        </p>

        <BlogCTA
          heading="Skip the Outlook debugging"
          body="Emlet renders every email as email-safe HTML from the start, so you're not finding out about a broken layout after it's already in someone's inbox."
        />
      </div>
    </MarketingLayout>
  );
}
