import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';
import BlogCTA from '@/components/BlogCTA';
import BlogHeroImage from '@/components/BlogHeroImage';
import BlogSidebar from '@/components/BlogSidebar';
import { BLOG_POSTS, getAllPostsMeta } from '@/lib/content/posts';

const post = BLOG_POSTS.find((p) => p.slug === 'send-html-emails-from-react-app')!;

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

export default async function Post() {
  const allPosts = await getAllPostsMeta();
  return (
    <MarketingLayout sidebar={<BlogSidebar posts={allPosts} currentSlug={post.slug} activeCategory={post.category} />}>
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
          You've built the whole product in React. Components, hooks, a design system, the works. Then someone asks for a "welcome email" and you go looking for the equivalent, and there isn't one. You can't just render your React app to a string and mail it, because email clients don't run JavaScript, don't load external stylesheets, and half of them (looking at you, Outlook) render HTML with a rendering engine borrowed from a word processor. Everything you know about building UI in React quietly stops applying.
        </p>

        <h2 className="text-2xl font-bold text-white pt-6">Why you can't just reuse your components</h2>
        <p>
          Modern web layout leans on flexbox, grid, external CSS, media queries, custom fonts loaded via <code>@font-face</code>, and JavaScript for anything interactive. Email HTML supports approximately none of that reliably. No grid. Flexbox support is inconsistent at best. No external stylesheets, styles have to be inlined on every element, because plenty of clients strip style blocks out of the document head entirely. No JS, obviously, an email is not a web page with a script tag. The safe baseline is still table-based layout with inline styles, the exact thing web development spent the 2010s trying to leave behind, because it's genuinely the one approach that survives Outlook's Word rendering engine and everything else at the same time.
        </p>

        <h2 className="text-2xl font-bold text-white pt-6">What React Email actually does</h2>
        <p>
          <a href="https://react.email" target="_blank" rel="noopener noreferrer" className="text-[#00ffff] hover:underline">React Email</a>{' '}
          is an open source component library that gives you a familiar JSX API, `Section`, `Row`, `Column`, `Text`, `Button`, `Img`, but compiles it down to that same defensive, table-based, inline-styled HTML under the hood. You write something like:
        </p>
        <pre className="bg-white/5 border border-white/10 rounded-xl p-4 overflow-x-auto text-sm text-white/80">
{`<Section style={{ padding: '32px 24px' }}>
  <Row>
    <Column>
      <Text style={{ fontSize: 24, fontWeight: 700, color: '#111' }}>
        Welcome to the team
      </Text>
      <Button
        href="https://example.com/get-started"
        style={{ background: '#00c2c2', color: '#fff', padding: '12px 24px' }}
      >
        Get started
      </Button>
    </Column>
  </Row>
</Section>`}
        </pre>
        <p>
          and it renders to real nested tables with inline styles, the exact markup you'd otherwise have to hand-write and re-test in every client yourself. You get version control, code review, and reusable components for something that used to live in a designer's Litmus account as a one-off HTML file nobody wanted to touch.
        </p>

        <h2 className="text-2xl font-bold text-white pt-6">The actual workflow</h2>
        <p>
          In practice, you render the React Email component to an HTML string server-side (there's a `render()` helper for exactly this), and hand that string to a transactional sending provider, Resend, Postmark, SES, whichever you're already using. React Email doesn't send anything itself, it solves the templating half of the problem, not delivery. Resend in particular was built by the same team and integrates directly, but the rendered HTML works with any provider that accepts raw HTML.
        </p>

        <h2 className="text-2xl font-bold text-white pt-6">Where it still gets annoying</h2>
        <p>
          This solves the transactional case well, password resets, receipts, "your order shipped." It gets messier for marketing emails specifically, for a few reasons:
        </p>
        <ul className="list-disc list-outside pl-5 space-y-2">
          <li>Marketing copy changes constantly, and per-campaign edits to a JSX component mean either a deploy or a non-technical teammate opening your codebase, neither of which is realistic day to day.</li>
          <li>Brand consistency (colors, logo placement, tone) has to be manually maintained across every component you write, there's no built-in concept of "brand" the way a design tool has a shared style library.</li>
          <li>Testing across clients, Gmail, Outlook, Apple Mail, dark mode, is still on you. React Email gives you safer defaults, not a guarantee.</li>
        </ul>

        <p>
          I've written more on the specific rendering failures that show up even with correct-looking HTML in{' '}
          <Link href="/blog/why-your-emails-look-broken-in-gmail-outlook" className="text-[#00ffff] hover:underline">
            this post
          </Link>
          , if you want the client-by-client breakdown.
        </p>

        <h2 className="text-2xl font-bold text-white pt-6">Where this is heading</h2>
        <p>
          The honest answer for a lot of teams is a split workflow: engineering owns the transactional templates in code, because those need to live alongside the app and ship with deploys, and marketing needs something faster for campaigns that doesn't route through a pull request. That's the gap Emlet fills on the marketing side, it generates the same kind of table-based, brand-consistent HTML (and exports the equivalent TSX if you want to hand it back to engineering), from a plain English description instead of hand-written JSX. Engineers get a starting point without spending an afternoon on it, marketers get something they can actually edit without opening an IDE.
        </p>

        <BlogCTA
          heading="Get a starting point in seconds"
          body="Describe the email, get back production HTML and TSX you can hand to your team or drop straight into your sending pipeline."
        />
      </div>
    </MarketingLayout>
  );
}
