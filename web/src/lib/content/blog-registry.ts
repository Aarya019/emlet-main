import fs from 'fs';
import path from 'path';
import type { BlogPostMeta } from './posts';
import type { ContentBlock } from './blocks';

/**
 * Server-only. Scans src/content/blog/ for post modules and loads each one.
 * Dropping a new `<slug>.ts` file in that directory is the entire
 * registration step — no array to remember to update (unlike the legacy
 * hand-written pages, where `connect-esp-guide` proves it's easy to forget).
 *
 * This directory must contain ONLY `.ts` post modules — Turbopack resolves
 * the dynamic `import(`@/content/blog/${slug}`)` below as a context module
 * covering every file here, and errors on any file type it has no loader
 * for (a stray `.md` file broke the build this way). The topic backlog
 * lives one level up, at `src/content/blog-topic-backlog.md`, for exactly
 * this reason.
 */

export interface BlogPostModule {
  meta: BlogPostMeta;
  body: ContentBlock[];
  /**
   * Optional per-post override for the closing CTA. Omit entirely to get
   * the standard "try Emlet free" CTA (BlogCTA's own defaults), pass a
   * custom heading/body for a topic-relevant tie-in, or pass `false` to
   * skip the CTA — most posts don't need to mention Emlet at all.
   */
  cta?: { heading?: string; body?: string } | false;
}

const CONTENT_DIR = path.join(process.cwd(), 'src/content/blog');

function listSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter(f => f.endsWith('.ts'))
    .map(f => f.replace(/\.ts$/, ''));
}

export async function getRegisteredSlugs(): Promise<string[]> {
  return listSlugs();
}

export async function getRegisteredPost(slug: string): Promise<BlogPostModule | null> {
  if (!listSlugs().includes(slug)) return null;
  const mod = await import(`@/content/blog/${slug}`);
  return { meta: mod.meta, body: mod.body, cta: mod.cta };
}

export async function getAllRegisteredPostsMeta(): Promise<BlogPostMeta[]> {
  const slugs = listSlugs();
  const mods = await Promise.all(slugs.map(slug => import(`@/content/blog/${slug}`)));
  return mods.map(mod => mod.meta as BlogPostMeta);
}
