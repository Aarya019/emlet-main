import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MarketingLayout from '@/components/MarketingLayout';
import BlogCTA from '@/components/BlogCTA';
import BlogHeroImage from '@/components/BlogHeroImage';
import BlogPostBody from '@/components/BlogPostBody';
import BlogSidebar from '@/components/BlogSidebar';
import { getRegisteredPost, getRegisteredSlugs } from '@/lib/content/blog-registry';
import { getAllPostsMeta } from '@/lib/content/posts';

export async function generateStaticParams() {
  const slugs = await getRegisteredSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getRegisteredPost(slug);
  if (!post) return {};
  // The post's openGraph replaces the site-wide one, so it has to carry its own share image (the hero),
  // as an absolute URL. Without it, a link shared on LinkedIn or X has no preview picture.
  const shareImage = post.meta.image.startsWith('/') ? `https://www.emlet.app${post.meta.image}` : post.meta.image;
  return {
    title: `${post.meta.title} | Emlet Blog`,
    description: post.meta.description,
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      url: `https://www.emlet.app/blog/${post.meta.slug}`,
      siteName: 'Emlet',
      type: 'article',
      images: [{ url: shareImage, alt: post.meta.imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta.title,
      description: post.meta.description,
      images: [shareImage],
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
  const allPosts = await getAllPostsMeta();

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: meta.title,
    description: meta.description,
    // Structured data wants an absolute URL; a post may use an image from this site's own /public folder.
    image: meta.image.startsWith('/') ? `https://www.emlet.app${meta.image}` : meta.image,
    datePublished: meta.date,
    author: { '@type': 'Person', name: 'Aarya', url: 'https://www.emlet.app' },
    publisher: {
      '@type': 'Organization',
      name: 'Emlet',
      logo: { '@type': 'ImageObject', url: 'https://www.emlet.app/icon.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.emlet.app/blog/${meta.slug}` },
  };

  return (
    <MarketingLayout sidebar={<BlogSidebar posts={allPosts} currentSlug={meta.slug} activeCategory={meta.category} />}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Link href="/blog" className="text-sm text-white/40 hover:text-white transition-colors mb-8 inline-block">
        ← Back to blog
      </Link>

      <div className="mb-10">
        <p className="text-xs font-semibold tracking-widest text-primary/60 uppercase mb-3">{meta.category}</p>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 leading-tight">{meta.title}</h1>
        <div className="flex items-center gap-3 text-sm text-white/40">
          <span>Aarya, Founder of Emlet</span>
          <span>·</span>
          <span>{formatDate(meta.date)}</span>
          <span>·</span>
          <span>{meta.readTime}</span>
        </div>
      </div>

      <BlogHeroImage src={meta.image} alt={meta.imageAlt} caption={meta.imageCaption} natural={meta.imageNatural} />

      <BlogPostBody blocks={body} />

      {cta !== false && <BlogCTA heading={cta?.heading} body={cta?.body} />}
    </MarketingLayout>
  );
}
