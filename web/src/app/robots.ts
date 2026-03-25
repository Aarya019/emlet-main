import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/dashboard/',
          '/api/',
          '/auth/',
          '/sign-in',
          '/sign-up',
        ],
      },
    ],
    sitemap: 'https://emlet.app/sitemap.xml',
  };
}
