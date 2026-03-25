import type { MetadataRoute } from 'next';

const BASE = 'https://emlet.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE,
      lastModified: new Date('2026-03-25'),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE}/pricing`,
      lastModified: new Date('2026-03-25'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE}/blog`,
      lastModified: new Date('2026-03-25'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE}/blog/connect-esp-guide`,
      lastModified: new Date('2026-03-25'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE}/blog/email-fonts-guide`,
      lastModified: new Date('2026-03-24'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE}/privacy`,
      lastModified: new Date('2026-03-21'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE}/terms`,
      lastModified: new Date('2026-03-17'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
