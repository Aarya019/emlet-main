import { getAllTemplatesMeta, loadTemplate } from '@/lib/content/templates-registry';
import { renderTemplateHtml } from '@/lib/content/template-render';

// Built once at deploy time like the pages, so serving it costs nothing at request time.
export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllTemplatesMeta()).map((t) => ({ slug: t.slug }));
}

/** The template's final HTML (what an export looks like), fetched by the live-preview toggle on demand. */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const template = await loadTemplate(slug);
  if (!template) return new Response('Not found', { status: 404 });

  const html = await renderTemplateHtml(template.meta, template.email);
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex',
    },
  });
}
