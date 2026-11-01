import Link from 'next/link';
import type { Metadata } from 'next';
import MarketingLayout from '@/components/MarketingLayout';
import TemplateGrid from '@/components/TemplateGrid';
import { getAllTemplatesMeta } from '@/lib/content/templates-registry';
import { SITE_URL, industryLabel, typeLabel } from '@/lib/content/templates';

const TITLE = 'Free Email Templates You Can Edit and Send | Emlet';
const DESCRIPTION =
  'Original, designed email templates for welcome emails, events, launches and more. Open one in the editor, switch to your brand colours, and change anything.';

export async function generateMetadata(): Promise<Metadata> {
  const templates = await getAllTemplatesMeta();
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: `${SITE_URL}/templates` },
    openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/templates`, siteName: 'Emlet', type: 'website' },
    // An empty library is not worth indexing.
    robots: templates.length > 0 ? undefined : { index: false, follow: true },
  };
}

function counts(values: string[]): [string, number][] {
  const map = new Map<string, number>();
  for (const v of values) map.set(v, (map.get(v) ?? 0) + 1);
  return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

export default async function TemplatesIndexPage() {
  const templates = await getAllTemplatesMeta();
  const types = counts(templates.map((t) => t.emailType));
  const industries = counts(templates.map((t) => t.industry));

  return (
    <MarketingLayout contentClassName="max-w-6xl">
      <div className="mb-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary/60">Templates</p>
        <h1 className="mb-4 text-4xl font-black tracking-tight sm:text-5xl">Email templates with some personality</h1>
        <p className="max-w-2xl text-lg text-white/50">
          Original designs you can open in the editor, recolour to your brand, and change block by block. Free account, no AI credit used.
        </p>
      </div>

      {templates.length === 0 ? (
        <p className="py-12 text-white/40">
          New templates are on the way. In the meantime,{' '}
          <Link href="/sign-up" className="text-primary hover:underline">generate one from a description</Link>.
        </p>
      ) : (
        <>
          <nav aria-label="Browse templates" className="mb-10 flex flex-wrap gap-2 text-sm">
            {types.map(([key, n]) => (
              <Link key={`t-${key}`} href={`/templates/type/${key}`} className="rounded-full border border-white/15 px-3.5 py-1.5 text-white/70 transition-colors hover:border-white/40 hover:text-white">
                {typeLabel(key)} <span className="text-white/30">{n}</span>
              </Link>
            ))}
            {industries.map(([key, n]) => (
              <Link key={`i-${key}`} href={`/templates/industry/${key}`} className="rounded-full border border-white/15 px-3.5 py-1.5 text-white/70 transition-colors hover:border-white/40 hover:text-white">
                {industryLabel(key)} <span className="text-white/30">{n}</span>
              </Link>
            ))}
          </nav>
          <TemplateGrid templates={templates} />
        </>
      )}
    </MarketingLayout>
  );
}
