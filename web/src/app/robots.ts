import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /dashboard, /sign-in, /sign-up are kept crawlable on purpose: they carry a
      // noindex meta tag (see their layout.tsx files) so Google can actually fetch
      // them and honor that signal. Blocking them here instead would prevent Google
      // from ever recrawling to confirm exclusion, which is what left them stuck in
      // "Crawled - currently not indexed" rather than cleanly excluded.
      disallow: ['/api/'],
    },
    sitemap: 'https://www.emlet.app/sitemap.xml',
  };
}
