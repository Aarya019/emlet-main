import fs from 'fs';
import path from 'path';
import type { GeneratedEmail } from '@/lib/ai/claude';
import type { TemplateMeta } from './templates';

/**
 * Server-only. Templates are one file each in src/content/templates/<slug>.ts exporting `meta` and
 * `email` (a GeneratedEmail, exactly what the editor stores). Dropping a file in is the whole registration
 * step, same as the blog. Everything that reads this is built at deploy time, so visitors never wait on it.
 *
 * That directory must contain ONLY `.ts` template modules: Turbopack resolves the dynamic import below as a
 * context module over every file there and errors on file types it has no loader for.
 */

export interface TemplateModule {
  meta: TemplateMeta;
  email: GeneratedEmail;
}

const CONTENT_DIR = path.join(process.cwd(), 'src/content/templates');
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
/** URL segments owned by category pages: a template can't use them as its slug. */
const RESERVED_SLUGS = new Set(['type', 'industry', 'occasion']);
const isValidSlug = (slug: string) => SLUG_RE.test(slug) && !RESERVED_SLUGS.has(slug);

/** Drafts show in dev, and in any build run with TEMPLATES_INCLUDE_DRAFTS=1 (e.g. a Vercel preview). Never in production by default. */
const isVisible = (meta: TemplateMeta) =>
  !meta.draft || process.env.NODE_ENV !== 'production' || process.env.TEMPLATES_INCLUDE_DRAFTS === '1';

function listSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.ts'))
    .map((f) => f.replace(/\.ts$/, ''))
    .filter(isValidSlug);
}

/** Load one template by slug. No filesystem access, so it is safe to call from a server action at runtime. */
export async function loadTemplate(slug: string): Promise<TemplateModule | null> {
  if (!isValidSlug(slug)) return null;
  try {
    const mod = await import(`@/content/templates/${slug}`);
    const template: TemplateModule = { meta: mod.meta, email: mod.email };
    return isVisible(template.meta) ? template : null;
  } catch {
    return null;
  }
}

/** All visible templates' metadata, newest first. Reads every template module, so call it at build time only. */
export async function getAllTemplatesMeta(): Promise<TemplateMeta[]> {
  const mods = await Promise.all(listSlugs().map((slug) => loadTemplate(slug)));
  return mods
    .filter((m): m is TemplateModule => m !== null)
    .map((m) => m.meta)
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}
