import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';
import TemplateGrid from '@/components/TemplateGrid';
import type { TemplateMeta } from '@/lib/content/templates';

/** Shared body of /templates/type/[type] and /templates/industry/[industry]. */
export default function TemplateCategoryPage({
  eyebrow,
  heading,
  blurb,
  templates,
}: {
  eyebrow: string;
  heading: string;
  blurb: string;
  templates: TemplateMeta[];
}) {
  return (
    <MarketingLayout contentClassName="max-w-6xl">
      <Link href="/templates" className="mb-8 inline-block text-sm text-white/40 transition-colors hover:text-white">
        ← All templates
      </Link>
      <div className="mb-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-neon-ink/60">{eyebrow}</p>
        <h1 className="mb-4 text-4xl font-black tracking-tight sm:text-5xl">{heading}</h1>
        <p className="max-w-2xl text-lg text-white/50">{blurb}</p>
      </div>
      <TemplateGrid templates={templates} />
    </MarketingLayout>
  );
}
