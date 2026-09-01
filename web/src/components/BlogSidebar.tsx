import Link from 'next/link';
import type { BlogPostMeta } from '@/lib/content/posts';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function BlogSidebar({
  posts,
  currentSlug,
  activeCategory,
}: {
  posts: BlogPostMeta[];
  /** Excluded from "Recent posts" when viewing that post itself. */
  currentSlug?: string;
  /** Highlights the matching entry in "Categories" on the index page. */
  activeCategory?: string;
}) {
  const categoryCounts = new Map<string, number>();
  for (const post of posts) {
    categoryCounts.set(post.category, (categoryCounts.get(post.category) ?? 0) + 1);
  }
  const categories = [...categoryCounts.entries()].sort((a, b) => b[1] - a[1]);

  const recent = [...posts]
    .filter((p) => p.slug !== currentSlug)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-4">Categories</p>
        <nav className="flex flex-col gap-1">
          <Link
            href="/blog"
            className={`text-sm rounded-lg px-3 py-1.5 -mx-3 transition-colors ${
              !activeCategory ? 'text-[#00ffff] bg-white/5 font-semibold' : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            All posts
            <span className="text-white/30 ml-1.5">{posts.length}</span>
          </Link>
          {categories.map(([category, count]) => (
            <Link
              key={category}
              href={`/blog?category=${encodeURIComponent(category)}`}
              className={`text-sm rounded-lg px-3 py-1.5 -mx-3 transition-colors ${
                activeCategory === category ? 'text-[#00ffff] bg-white/5 font-semibold' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {category}
              <span className="text-white/30 ml-1.5">{count}</span>
            </Link>
          ))}
        </nav>
      </div>

      {recent.length > 0 && (
        <div>
          <p className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-4">Recent posts</p>
          <div className="flex flex-col gap-4">
            {recent.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <p className="text-sm text-white/80 leading-snug group-hover:text-[#00ffff] transition-colors">
                  {post.title}
                </p>
                <p className="text-xs text-white/35 mt-1">{formatDate(post.date)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm font-bold text-white mb-1.5">Try Emlet free</p>
        <p className="text-xs text-white/50 leading-relaxed mb-4">
          Describe the email you need and get on-brand, ready-to-send HTML in seconds.
        </p>
        <Link
          href="/sign-up"
          className="block text-center rounded-lg bg-[#00ffff] text-black text-sm font-bold py-2 hover:shadow-lg hover:shadow-[#00ffff]/30 transition-all"
        >
          Get started free
        </Link>
      </div>
    </div>
  );
}
