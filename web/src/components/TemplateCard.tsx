import Link from 'next/link';
import {
  humanize,
  industryLabel,
  previewImage,
  typeLabel,
  type PreviewSize,
  type TemplateMeta,
} from '@/lib/content/templates';
import sizes from '@/lib/content/template-preview-sizes.json';

const previewSizes = sizes as Record<string, PreviewSize>;

/** One template in a grid. Static thumbnail only (no iframe), lazy-loaded, with fixed dimensions so nothing shifts as it loads. */
export default function TemplateCard({ meta, priority = false }: { meta: TemplateMeta; priority?: boolean }) {
  const size = previewSizes[meta.slug];

  return (
    <Link href={`/templates/${meta.slug}`} className="group block">
      <div
        className="overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-colors group-hover:border-white/30"
        style={{ aspectRatio: size ? `${size.thumbW} / ${size.thumbH}` : '3 / 4' }}
      >
        {size ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewImage(meta.slug, 'thumb')}
            alt={`${meta.title}: email template preview`}
            width={size.thumbW}
            height={size.thumbH}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-white/30">Preview coming soon</div>
        )}
      </div>
      <p className="mt-3 text-[11px] font-semibold uppercase tracking-widest text-neon-ink/60">
        {typeLabel(meta.emailType)}
      </p>
      <h3 className="mt-1 text-base font-bold leading-snug text-white transition-colors group-hover:text-neon-ink">
        {meta.title}
      </h3>
      <p className="mt-1 text-xs text-white/40">
        {industryLabel(meta.industry)} · {humanize(meta.style)} style
      </p>
    </Link>
  );
}
