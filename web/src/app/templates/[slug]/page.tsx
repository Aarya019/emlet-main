import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MarketingLayout from '@/components/MarketingLayout';
import TemplateGrid from '@/components/TemplateGrid';
import TemplateLivePreview from '@/components/TemplateLivePreview';
import UseTemplateButton from '@/components/UseTemplateButton';
import { getAllTemplatesMeta, loadTemplate } from '@/lib/content/templates-registry';
import {
  SITE_URL,
  humanize,
  industryLabel,
  previewImage,
  typeLabel,
  type PreviewSize,
} from '@/lib/content/templates';
import sizes from '@/lib/content/template-preview-sizes.json';

const previewSizes = sizes as Record<string, PreviewSize>;

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllTemplatesMeta()).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const template = await loadTemplate(slug);
  if (!template) return {};
  const { meta } = template;
  const title = `${meta.title} | Emlet Templates`;
  const size = previewSizes[slug];
  return {
    title,
    description: meta.description,
    alternates: { canonical: `${SITE_URL}/templates/${slug}` },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${SITE_URL}/templates/${slug}`,
      siteName: 'Emlet',
      type: 'website',
      images: size ? [{ url: `${SITE_URL}${previewImage(slug, 'full')}`, width: size.fullW, height: size.fullH, alt: meta.title }] : undefined,
    },
  };
}

export default async function TemplatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const template = await loadTemplate(slug);
  if (!template) notFound();
  const { meta, email } = template;
  const size = previewSizes[slug];

  const related = (await getAllTemplatesMeta())
    .filter((t) => t.slug !== slug && (t.emailType === meta.emailType || t.industry === meta.industry))
    .slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: meta.title,
    description: meta.description,
    image: size ? `${SITE_URL}${previewImage(slug, 'full')}` : undefined,
    dateModified: meta.date,
    isAccessibleForFree: true,
    publisher: { '@type': 'Organization', name: 'Emlet', url: SITE_URL },
  };

  const details: [string, string][] = [
    ['Email type', typeLabel(meta.emailType)],
    ['Suits', industryLabel(meta.industry)],
    ['Design style', humanize(meta.style)],
  ];

  return (
    <MarketingLayout contentClassName="max-w-6xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Link href="/templates" className="mb-8 inline-block text-sm text-white/40 transition-colors hover:text-white">
        ← All templates
      </Link>

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_340px] xl:gap-14">
        <div className="min-w-0">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-neon-ink/60">
            <Link href={`/templates/type/${meta.emailType}`} className="hover:text-neon-ink">{typeLabel(meta.emailType)}</Link>
          </p>
          <h1 className="mb-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl">{meta.title}</h1>
          <p className="mb-6 max-w-2xl text-lg text-white/50">{meta.description}</p>

          <div className="mb-8 lg:hidden">
            <UseTemplateButton slug={slug} />
          </div>

          <TemplateLivePreview
            slug={slug}
            title={meta.title}
            imageSrc={size ? previewImage(slug, 'full') : null}
            imageWidth={size?.fullW ?? 600}
            imageHeight={size?.fullH ?? 1200}
          />
        </div>

        <aside className="space-y-8 lg:sticky lg:top-24">
          <div className="hidden lg:block">
            <UseTemplateButton slug={slug} />
          </div>

          <dl className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm">
            {details.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4">
                <dt className="text-white/40">{label}</dt>
                <dd className="text-right font-medium text-white">{value}</dd>
              </div>
            ))}
          </dl>

          <section>
            <h2 className="mb-2 text-sm font-bold text-white">When to send it</h2>
            <p className="text-sm leading-relaxed text-white/60">{meta.whenToSend}</p>
          </section>

          <section>
            <h2 className="mb-2 text-sm font-bold text-white">Why it works</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-white/60">
              {meta.whyItWorks.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-sm font-bold text-white">Subject line ideas</h2>
            <ul className="space-y-2 text-sm text-white/60">
              {meta.subjectIdeas.map((s) => (
                <li key={s} className="rounded-lg border border-white/10 px-3 py-2">{s}</li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-white/30">Its own subject: {email.subject}</p>
          </section>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-20 border-t border-white/10 pt-12">
          <h2 className="mb-8 text-2xl font-black tracking-tight">More templates like this</h2>
          <TemplateGrid templates={related} />
        </section>
      )}
    </MarketingLayout>
  );
}
