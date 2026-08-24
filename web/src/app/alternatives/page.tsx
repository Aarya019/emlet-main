import Link from 'next/link';
import type { Metadata } from 'next';
import MarketingLayout from '@/components/MarketingLayout';
import { ALTERNATIVES } from '@/lib/content/alternatives';

export const metadata: Metadata = {
  title: 'Emlet Alternatives & Comparisons | Emlet',
  description: 'Honest, specific comparisons between Emlet and the tools people usually try first for building marketing emails.',
  openGraph: {
    title: 'Emlet Alternatives & Comparisons',
    description: 'Honest, specific comparisons between Emlet and the tools people usually try first for building marketing emails.',
    url: 'https://emlet.app/alternatives',
    siteName: 'Emlet',
    type: 'website',
  },
};

export default function AlternativesIndexPage() {
  return (
    <MarketingLayout contentClassName="max-w-4xl">
      <div className="mb-12">
        <p className="text-xs font-semibold tracking-widest text-[#00ffff]/60 uppercase mb-3">Comparisons</p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
          How Emlet compares
        </h1>
        <p className="text-white/50 text-lg max-w-xl">
          We&apos;re not trying to be everyone&apos;s everything. Here&apos;s where Emlet actually fits next to the tools you&apos;ve probably already tried.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {ALTERNATIVES.map((alt) => (
          <Link
            key={alt.slug}
            href={`/alternatives/${alt.slug}`}
            className="group rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-[#00ffff]/30 hover:bg-white/[0.07] transition-all"
          >
            <div className="relative aspect-[16/9] overflow-hidden border-b border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={alt.image.replace('w=1600&h=800', 'w=640&h=360')}
                alt={alt.imageAlt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <p className="absolute bottom-3 left-4 text-xs font-bold tracking-widest text-white uppercase">
                Emlet <span className="text-[#00ffff]">vs</span> {alt.competitor}
              </p>
            </div>
            <div className="p-6">
              <h2 className="text-lg font-bold text-white mb-2 group-hover:text-[#00ffff] transition-colors leading-snug">
                {alt.title.replace('Emlet vs ', '').replace(/:.*$/, '')}
              </h2>
              <p className="text-sm text-white/50 leading-relaxed">{alt.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </MarketingLayout>
  );
}
