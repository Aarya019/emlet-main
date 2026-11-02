import Link from 'next/link';
import type { Metadata } from 'next';
import MarketingLayout from '@/components/MarketingLayout';
import { TOOLS, toolUrl } from '@/lib/content/tools';
import { SITE_URL } from '@/lib/content/templates';

const TITLE = 'Free Email Tools: Subject Lines, Footers, Signatures and More | Emlet';
const DESCRIPTION =
  'Free tools for anyone who sends email: test subject lines, build a compliant footer, make a signature, check your HTML for Outlook and Gmail problems, and find prompts for AI-written emails.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/tools` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/tools`, siteName: 'Emlet', type: 'website' },
};

export default function ToolsHubPage() {
  return (
    <MarketingLayout contentClassName="max-w-5xl">
      <div className="mb-12">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary/60">Tools</p>
        <h1 className="mb-4 text-4xl font-black tracking-tight sm:text-5xl">Small tools that make email less annoying</h1>
        <p className="max-w-2xl text-lg text-white/50">
          No signup, no limits. Everything runs in your browser, so what you type stays with you.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <Link
            key={tool.slug}
            href={toolUrl(tool.slug)}
            className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-colors hover:border-white/30"
          >
            <h2 className="mb-2 text-xl font-black tracking-tight text-white transition-colors group-hover:text-primary">{tool.name}</h2>
            <p className="leading-relaxed text-white/50">{tool.tagline}</p>
            <p className="mt-4 text-sm font-semibold text-primary">Open the tool →</p>
          </Link>
        ))}
      </div>

      <p className="mt-14 text-sm text-white/40">
        Looking for ready-made designs?{' '}
        <Link href="/blog" className="text-primary hover:underline">Read the blog</Link>{' '}
        or{' '}
        <Link href="/sign-up" className="text-primary hover:underline">generate an email in your brand colours</Link>.
      </p>
    </MarketingLayout>
  );
}
