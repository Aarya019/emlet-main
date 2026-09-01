import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MarketingLayout from '@/components/MarketingLayout';
import BlogCTA from '@/components/BlogCTA';
import BlogHeroImage from '@/components/BlogHeroImage';
import BlogPostBody from '@/components/BlogPostBody';
import { getRegisteredPost, getRegisteredSlugs } from '@/lib/content/blog-registry';

export async function generateStaticParams() {
  const slugs = await getRegisteredSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getRegisteredPost(slug);
  if (!post) return {};
  return {
    title: `${post.meta.title} | Emlet Blog`,
    description: post.meta.description,
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      url: `https://emlet.app/blog/${post.meta.slug}`,
      siteName: 'Emlet',
      type: 'article',
    },
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getRegisteredPost(slug);
  if (!post) notFound();
  const { meta, body, cta } = post;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: meta.title,
    description: meta.description,
    image: meta.image,
    datePublished: meta.date,
    author: { '@type': 'Person', name: 'Aarya', url: 'https://emlet.app' },
    publisher: {
      '@type': 'Organization',
      name: 'Emlet',
      logo: { '@type': 'ImageObject', url: 'https://emlet.app/icon.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://emlet.app/blog/${meta.slug}` },
  };

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
        <p className="text-xs font-semibold tracking-widest text-[#00ffff]/60 uppercase mb-3">{meta.category}</p>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 leading-tight">{meta.title}</h1>
        <div className="flex items-center gap-3 text-sm text-white/40">
          <span>Aarya, Founder of Emlet</span>
          <span>·</span>
          <span>{formatDate(meta.date)}</span>
          <span>·</span>
          <span>{meta.readTime}</span>
        </div>
      </div>

      <BlogHeroImage src={meta.image} alt={meta.imageAlt} />

      <BlogPostBody blocks={body} />

      {cta !== false && <BlogCTA heading={cta?.heading} body={cta?.body} />}
    </MarketingLayout>
  );
}
