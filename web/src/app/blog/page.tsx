import Link from 'next/link';
import type { Metadata } from 'next';
import MarketingLayout from '@/components/MarketingLayout';
import { BLOG_POSTS } from '@/lib/content/posts';

export const metadata: Metadata = {
  title: 'Blog | Emlet',
  description: 'Practical writing on email design, deliverability, and marketing for people who would rather not think about email HTML.',
  openGraph: {
    title: 'The Emlet Blog',
    description: 'Practical writing on email design, deliverability, and marketing for people who would rather not think about email HTML.',
    url: 'https://emlet.app/blog',
    siteName: 'Emlet',
    type: 'website',
  },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function BlogIndexPage() {
  const posts = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <MarketingLayout contentClassName="max-w-4xl">
      <div className="mb-12">
        <p className="text-xs font-semibold tracking-widest text-[#00ffff]/60 uppercase mb-3">Blog</p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
          Writing on email that doesn&apos;t suck
        </h1>
        <p className="text-white/50 text-lg max-w-xl">
          Design, deliverability, and the occasional statistic. No listicles about &quot;10 email marketing tips&quot; unless the tips are actually good.
        </p>
      </div>

      <div className="space-y-1">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col sm:flex-row gap-5 py-6 border-t border-white/10 last:border-b hover:bg-white/[0.02] transition-colors -mx-4 px-4 rounded-lg"
          >
            <div className="w-full sm:w-48 flex-shrink-0 aspect-[16/10] rounded-xl overflow-hidden border border-white/10 bg-white/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image.replace('w=1600&h=800', 'w=480&h=300')}
                alt={post.imageAlt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-3 text-xs text-white/40 mb-2">
                <span className="text-[#00ffff]/70 font-semibold uppercase tracking-wide">{post.category}</span>
                <span>·</span>
                <span>{formatDate(post.date)}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-[#00ffff] transition-colors">
                {post.title}
              </h2>
              <p className="text-white/50 leading-relaxed max-w-2xl">{post.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t border-white/10">
        <p className="text-sm text-white/40">
          Comparing tools?{' '}
          <Link href="/alternatives" className="text-[#00ffff] hover:underline">
            See how Emlet stacks up against Mailchimp, Canva, and ChatGPT →
          </Link>
        </p>
      </div>
    </MarketingLayout>
  );
}
