import TemplateCard from '@/components/TemplateCard';
import type { TemplateMeta } from '@/lib/content/templates';

export default function TemplateGrid({ templates }: { templates: TemplateMeta[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
      {templates.map((t, i) => (
        <TemplateCard key={t.slug} meta={t} priority={i < 4} />
      ))}
    </div>
  );
}
