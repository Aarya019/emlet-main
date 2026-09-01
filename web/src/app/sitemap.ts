import type { MetadataRoute } from 'next';
import { getAllPostsMeta } from '@/lib/content/posts';
import { ALTERNATIVES } from '@/lib/content/alternatives';

const SITE_URL = 'https://emlet.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/alternatives`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/terms`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const allPosts = await getAllPostsMeta();
  const blogRoutes: MetadataRoute.Sitemap = allPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const alternativeRoutes: MetadataRoute.Sitemap = ALTERNATIVES.map((alt) => ({
    url: `${SITE_URL}/alternatives/${alt.slug}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes, ...alternativeRoutes];
}
