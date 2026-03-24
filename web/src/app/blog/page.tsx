import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Emlet',
  description: 'Email design and marketing insights from the Emlet team — practical guides on fonts, layouts, deliverability, and more.',
};

const POSTS = [
  {
    slug: 'email-fonts-guide',
    category: 'Design',
    title: 'The Ultimate Guide to Email Fonts',
    description:
      'Everything you need to know about choosing, embedding, and fallback-stacking fonts in HTML email — including a client-by-client support matrix, recommended stacks, and sizing best practices.',
    date: 'March 24, 2026',
    readTime: '12 min read',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/5">
        <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-center px-4 py-3 md:grid-cols-3 md:px-6 md:py-4">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="Emlet" className="h-7 w-auto md:h-8" />
          </Link>
          <nav className="hidden items-center justify-center gap-8 text-sm text-white/70 md:flex">
            <Link href="/pricing" className="transition-colors hover:text-white">Pricing</Link>
            <Link href="/#features" className="transition-colors hover:text-white">Features</Link>
            <Link href="/blog" className="text-white">Blog</Link>
          </nav>
          <div className="flex items-center justify-end gap-3">
            <Link href="/sign-in" className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white transition-all hover:border-[#00ffff] hover:text-[#00ffff]">
              Sign in
            </Link>
            <Link href="/sign-up" className="hidden sm:block rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-black transition-all hover:shadow-lg hover:shadow-white/20 hover:-translate-y-px">
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-10">
        <p className="text-xs font-semibold tracking-widest text-[#00ffff]/60 uppercase mb-4">The Emlet Blog</p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
          Email design, demystified.
        </h1>
        <p className="text-white/50 text-lg max-w-xl">
          Practical guides on email fonts, layouts, deliverability, and everything else that makes an email actually land.
        </p>
      </div>

      {/* Posts */}
      <div className="max-w-4xl mx-auto px-6 pb-24 space-y-6">
        {POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block rounded-2xl border border-white/8 bg-white/3 p-6 sm:p-8 transition-all hover:border-white/20 hover:bg-white/5"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold tracking-widest text-[#00ffff]/70 uppercase">
                {post.category}
              </span>
              <span className="text-white/20">·</span>
              <span className="text-xs text-white/40">{post.date}</span>
              <span className="text-white/20">·</span>
              <span className="text-xs text-white/40">{post.readTime}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-3 group-hover:text-[#00ffff] transition-colors">
              {post.title}
            </h2>
            <p className="text-white/50 leading-relaxed text-sm sm:text-base">
              {post.description}
            </p>
            <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-[#00ffff]/70 group-hover:text-[#00ffff] transition-colors">
              Read article
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
