import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TemplateCategoryPage from '@/components/TemplateCategoryPage';
import { getAllTemplatesMeta } from '@/lib/content/templates-registry';
import { MIN_INDEXABLE_CATEGORY, SITE_URL, industryBlurb, industryLabel } from '@/lib/content/templates';

export const dynamicParams = false;

export async function generateStaticParams() {
  const all = await getAllTemplatesMeta();
  return [...new Set(all.map((t) => t.industry))].map((industry) => ({ industry }));
}

async function templatesOfIndustry(industry: string) {
  return (await getAllTemplatesMeta()).filter((t) => t.industry === industry);
}

export async function generateMetadata({ params }: { params: Promise<{ industry: string }> }): Promise<Metadata> {
  const { industry } = await params;
  const templates = await templatesOfIndustry(industry);
  if (templates.length === 0) return {};
  const title = `Email Templates for ${industryLabel(industry)} | Emlet`;
  const description = `${industryBlurb(industry)} Open any template in the editor and make it yours.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/templates/industry/${industry}` },
    openGraph: { title, description, url: `${SITE_URL}/templates/industry/${industry}`, siteName: 'Emlet', type: 'website' },
    robots: templates.length >= MIN_INDEXABLE_CATEGORY ? undefined : { index: false, follow: true },
  };
}

export default async function TemplateIndustryPage({ params }: { params: Promise<{ industry: string }> }) {
  const { industry } = await params;
  const templates = await templatesOfIndustry(industry);
  if (templates.length === 0) notFound();
  return (
    <TemplateCategoryPage
      eyebrow="Industry"
      heading={`Email templates for ${industryLabel(industry).toLowerCase()}`}
      blurb={industryBlurb(industry)}
      templates={templates}
    />
  );
}
