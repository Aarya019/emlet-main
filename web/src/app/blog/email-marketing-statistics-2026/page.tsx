import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';
import BlogCTA from '@/components/BlogCTA';
import BlogHeroImage from '@/components/BlogHeroImage';
import BlogSidebar from '@/components/BlogSidebar';
import { BLOG_POSTS, getAllPostsMeta } from '@/lib/content/posts';

const post = BLOG_POSTS.find((p) => p.slug === 'email-marketing-statistics-2026')!;

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
          I went looking for a straight answer to "what's a good open rate" and came back with three different numbers from three credible sources, none of which agreed. That's worth saying up front: treat every benchmark below as a general direction, not a target to hit exactly. Different reports pull from different sample sizes, industries, and definitions of "open" (Apple's Mail Privacy Protection alone has made open rate a fuzzier metric than it used to be). With that caveat, here's what's actually useful to know going into 2026.
        </p>

        <h2 className="text-2xl font-bold text-white pt-6">Open rates and engagement</h2>
        <ul className="list-disc list-outside pl-5 space-y-3">
          <li>
            Mailchimp's own benchmarks report, pulled from over 12 billion emails sent by small businesses on its platform, puts the average open rate at 21.5%. Other aggregators that pool data across broader sets of senders report figures as high as 32% to 42%, which tells you more about how differently "average" gets calculated than about what you should expect.
          </li>
          <li>
            A reasonable target range most sources converge on: 15 to 25% for a typical small business list. If you're well below that consistently, it's more likely a list quality or subject line problem than a design one.
          </li>
          <li>
            Automated, triggered emails (welcome sequences, cart abandonment, post-purchase) substantially outperform one-off campaign sends: one benchmark set found flow-based emails getting roughly 3x the click rate of standalone campaigns (5.58% vs 1.69%), and over 10x the placed-order rate. If you only ever send broadcast campaigns and have no automated flows running, that's the highest-leverage gap to close before worrying about design polish.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-white pt-6">Return on spend</h2>
        <ul className="list-disc list-outside pl-5 space-y-3">
          <li>
            Email marketing's return is consistently cited in the $36 to $42 per dollar spent range across multiple industry reports, well above paid search (roughly $2), social ads (roughly $2.80), and display (roughly $1.35). It's one of the few channels where the infrastructure cost (a sending tool, your own list) is genuinely cheap relative to the return, assuming the list is actually opted in and engaged.
          </li>
          <li>
            In a 2026 Constant Contact survey of over 1,500 small business owners, 41% said they expect email to be their single most valuable marketing channel this year, ahead of social and paid channels. Anecdotally this tracks: email is the one channel you own outright, an algorithm change on another platform can't quietly zero out your reach.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-white pt-6">Where AI is actually moving numbers</h2>
        <ul className="list-disc list-outside pl-5 space-y-3">
          <li>
            Subject lines are the clearest case: reports on AI-assisted subject line generation and testing show around a 26% lift in open rates compared to manually written, non-tested subject lines. This isn't magic, it's mostly that AI tools make it cheap to generate and test more variants than a person would bother writing by hand, and testing at volume beats guessing once.
          </li>
          <li>
            The gap between "used AI to write one email" and "used AI to build a consistent, brand-matched system" is where most of the actual time savings live. A single AI-written email doesn't move much. Consistently sending well-designed, on-brand emails without spending an afternoon on each one is where it compounds.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-white pt-6">What's changing in the tools people use</h2>
        <ul className="list-disc list-outside pl-5 space-y-3">
          <li>
            Mailchimp's free tier now caps out at 250 contacts, down from a much more generous historical limit, and pricing has climbed noticeably since its 2021 acquisition by Intuit. That single change is responsible for a lot of the "Mailchimp alternative" searches you'll see, it's less that Mailchimp got worse at sending email and more that the economics shifted for smaller senders.
          </li>
          <li>
            Newsletter-first platforms like Beehiiv (2,500 free subscribers, unlimited sends) have picked up a meaningful share of that migration, particularly from solo creators and small publishers rather than traditional ecommerce senders.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-white pt-6">The takeaway</h2>
        <p>
          None of these numbers matter much in isolation. What they add up to: automation beats one-off sends by a wide margin, subject line testing has real measurable upside, and the "which tool" question is shifting for a lot of small senders because of pricing changes, not because the old tools stopped working. If you're optimizing one thing this year, an automated welcome sequence will probably outperform obsessing over your broadcast open rate.
        </p>

        <BlogCTA />
      </div>
    </MarketingLayout>
  );
}
