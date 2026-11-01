import type { MetadataRoute } from 'next';
import { getAllPostsMeta } from '@/lib/content/posts';
import { ALTERNATIVES } from '@/lib/content/alternatives';
import { getAllTemplatesMeta } from '@/lib/content/templates-registry';
import { MIN_INDEXABLE_CATEGORY } from '@/lib/content/templates';
import { TOOLS, toolUrl } from '@/lib/content/tools';

const SITE_URL = 'https://www.emlet.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/alternatives`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/tools`, changeFrequency: 'monthly', priority: 0.8 },
    ...TOOLS.map((tool) => ({ url: `${SITE_URL}${toolUrl(tool.slug)}`, changeFrequency: 'monthly' as const, priority: 0.7 })),
    { url: `${SITE_URL}/terms`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/refunds`, changeFrequency: 'yearly', priority: 0.3 },
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

  // Template library: nothing is listed until there is at least one published template, and category
  // pages only once they have enough templates to be worth a search result.
  const templates = await getAllTemplatesMeta();
  const templateRoutes: MetadataRoute.Sitemap = [];
  if (templates.length > 0) {
    templateRoutes.push({ url: `${SITE_URL}/templates`, changeFrequency: 'weekly', priority: 0.8 });
    for (const t of templates) {
      templateRoutes.push({ url: `${SITE_URL}/templates/${t.slug}`, lastModified: t.date, changeFrequency: 'monthly', priority: 0.7 });
    }
    const addCategories = (segment: string, keys: string[]) => {
      const sizes = new Map<string, number>();
      for (const k of keys) sizes.set(k, (sizes.get(k) ?? 0) + 1);
      for (const [key, n] of sizes) {
        if (n >= MIN_INDEXABLE_CATEGORY) {
          templateRoutes.push({ url: `${SITE_URL}/templates/${segment}/${key}`, changeFrequency: 'weekly', priority: 0.6 });
        }
      }
    };
    addCategories('type', templates.map((t) => t.emailType));
    addCategories('industry', templates.map((t) => t.industry));
  }

  return [...staticRoutes, ...blogRoutes, ...alternativeRoutes, ...templateRoutes];
}
