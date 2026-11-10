import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TemplateCategoryPage from '@/components/TemplateCategoryPage';
import { getAllTemplatesMeta } from '@/lib/content/templates-registry';
import { MIN_INDEXABLE_CATEGORY, SITE_URL, occasionBlurb, occasionLabel } from '@/lib/content/templates';

export const dynamicParams = false;

export async function generateStaticParams() {
  const all = await getAllTemplatesMeta();
  return [...new Set(all.map((t) => t.occasion).filter((o): o is string => Boolean(o)))].map((occasion) => ({ occasion }));
}

async function templatesForOccasion(occasion: string) {
  return (await getAllTemplatesMeta()).filter((t) => t.occasion === occasion);
}

export async function generateMetadata({ params }: { params: Promise<{ occasion: string }> }): Promise<Metadata> {
  const { occasion } = await params;
  const templates = await templatesForOccasion(occasion);
  if (templates.length === 0) return {};
  const title = `${occasionLabel(occasion)}: Free Editable Templates | Emlet`;
  const description = `${occasionBlurb(occasion)} Open any template in the editor and make it yours.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/templates/occasion/${occasion}` },
    openGraph: { title, description, url: `${SITE_URL}/templates/occasion/${occasion}`, siteName: 'Emlet', type: 'website' },
    // A page with only one or two templates is thin: keep it out of search until the category fills up.
    robots: templates.length >= MIN_INDEXABLE_CATEGORY ? undefined : { index: false, follow: true },
  };
}

export default async function TemplateOccasionPage({ params }: { params: Promise<{ occasion: string }> }) {
  const { occasion } = await params;
  const templates = await templatesForOccasion(occasion);
  if (templates.length === 0) notFound();
  return (
    <TemplateCategoryPage eyebrow="Occasion" heading={occasionLabel(occasion)} blurb={occasionBlurb(occasion)} templates={templates} />
  );
}
