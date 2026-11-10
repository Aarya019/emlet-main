import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TemplateCategoryPage from '@/components/TemplateCategoryPage';
import { getAllTemplatesMeta } from '@/lib/content/templates-registry';
import { MIN_INDEXABLE_CATEGORY, SITE_URL, typeBlurb, typeLabel } from '@/lib/content/templates';

export const dynamicParams = false;

export async function generateStaticParams() {
  const all = await getAllTemplatesMeta();
  return [...new Set(all.map((t) => t.emailType))].map((type) => ({ type }));
}

async function templatesOfType(type: string) {
  return (await getAllTemplatesMeta()).filter((t) => t.emailType === type);
}

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await params;
  const templates = await templatesOfType(type);
  if (templates.length === 0) return {};
  const title = `${typeLabel(type)}: Free Editable Templates | Emlet`;
  const description = `${typeBlurb(type)} Open any template in the editor and make it yours.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/templates/type/${type}` },
    openGraph: { title, description, url: `${SITE_URL}/templates/type/${type}`, siteName: 'Emlet', type: 'website' },
    // A page with only one or two templates is thin: keep it out of search until the category fills up.
    robots: templates.length >= MIN_INDEXABLE_CATEGORY ? undefined : { index: false, follow: true },
  };
}

export default async function TemplateTypePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const templates = await templatesOfType(type);
  if (templates.length === 0) notFound();
  return (
    <TemplateCategoryPage eyebrow="Template type" heading={typeLabel(type)} blurb={typeBlurb(type)} templates={templates} />
  );
}
