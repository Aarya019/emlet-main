import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import MarketingLayout from '@/components/MarketingLayout';
import { TOOLS, getTool, toolUrl } from '@/lib/content/tools';
import { getAllPostsMeta } from '@/lib/content/posts';
import { SITE_URL } from '@/lib/content/templates';

export interface ToolSection {
  heading: string;
  body: ReactNode;
}

export interface ToolFaq {
  q: string;
  a: string;
}

export function toolMetadata(slug: string): Metadata {
  const tool = getTool(slug);
  const title = `${tool.name}: Free, No Signup | Emlet`;
  return {
    title,
    description: tool.description,
    alternates: { canonical: `${SITE_URL}${toolUrl(slug)}` },
    openGraph: { title: tool.name, description: tool.description, url: `${SITE_URL}${toolUrl(slug)}`, siteName: 'Emlet', type: 'website' },
  };
}

/** Shared frame for every free tool: heading, the tool itself, explanatory content, FAQ, a CTA, and related links. Server-rendered. */
export default async function ToolPage({
  slug,
  children,
  sections = [],
  faq = [],
}: {
  slug: string;
  children: ReactNode;
  sections?: ToolSection[];
  faq?: ToolFaq[];
}) {
  const tool = getTool(slug);
  const otherTools = TOOLS.filter((t) => t.slug !== slug);
  const allPosts = await getAllPostsMeta();
  const reading = tool.blogSlugs
    .map((s) => allPosts.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    description: tool.description,
    url: `${SITE_URL}${toolUrl(slug)}`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@type': 'Organization', name: 'Emlet', url: SITE_URL },
  };

  return (
    <MarketingLayout contentClassName="max-w-5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Link href="/tools" className="mb-8 inline-block text-sm text-white/40 transition-colors hover:text-white">
        ← All tools
      </Link>

      <header className="mb-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary/60">Free tool</p>
        <h1 className="mb-4 text-3xl font-black leading-tight tracking-tight sm:text-5xl">{tool.name}</h1>
        <p className="max-w-2xl text-lg text-white/50">{tool.tagline}</p>
        <p className="mt-3 text-sm text-white/35">Free, no signup. Everything runs in your browser; what you type is never sent to us.</p>
      </header>

      {children}

      {sections.length > 0 && (
        <div className="mt-16 space-y-10">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="mb-3 text-2xl font-black tracking-tight">{s.heading}</h2>
              <div className="max-w-3xl space-y-3 leading-relaxed text-white/60">{s.body}</div>
            </section>
          ))}
        </div>
      )}

      {faq.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-5 text-2xl font-black tracking-tight">Questions</h2>
          <dl className="max-w-3xl space-y-6">
            {faq.map((item) => (
              <div key={item.q}>
                <dt className="mb-1 font-bold text-white">{item.q}</dt>
                <dd className="leading-relaxed text-white/60">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <div className="my-16 rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="mb-2 text-xl font-bold text-white">Want the whole email written and designed?</p>
        <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-white/60">
          Describe the email in plain English and Emlet builds it in your brand colours, ready to edit and export. Free to try, no credit card.
        </p>
        <Link
          href="/sign-up"
          className="inline-block rounded-xl bg-primary px-6 py-3 text-sm font-bold text-on-primary transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-primary-bright/30"
        >
          Generate your first email free
        </Link>
      </div>

      <section className="mb-12">
        <h2 className="mb-5 text-lg font-bold">More tools</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {otherTools.map((t) => (
            <Link key={t.slug} href={toolUrl(t.slug)} className="group rounded-xl border border-white/10 p-4 transition-colors hover:border-white/30">
              <p className="mb-1 font-bold text-white transition-colors group-hover:text-primary">{t.name}</p>
              <p className="text-sm text-white/45">{t.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      {reading.length > 0 && (
        <section>
          <h2 className="mb-5 text-lg font-bold">Worth reading next</h2>
          <ul className="space-y-2">
            {reading.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="text-white/60 underline decoration-white/20 underline-offset-4 transition-colors hover:text-primary">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </MarketingLayout>
  );
}
