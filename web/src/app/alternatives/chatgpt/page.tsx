import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';
import BlogCTA from '@/components/BlogCTA';
import BlogHeroImage from '@/components/BlogHeroImage';
import ComparisonTable from '@/components/ComparisonTable';
import WinCards from '@/components/WinCards';
import { ALTERNATIVES } from '@/lib/content/alternatives';

const alt = ALTERNATIVES.find((a) => a.slug === 'chatgpt')!;

export const metadata: Metadata = {
  title: `${alt.title} | Emlet`,
  description: alt.description,
  openGraph: {
    title: alt.title,
    description: alt.description,
    url: `https://emlet.app/alternatives/${alt.slug}`,
    siteName: 'Emlet',
    type: 'article',
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://emlet.app/' },
    { '@type': 'ListItem', position: 2, name: 'Alternatives', item: 'https://emlet.app/alternatives' },
    { '@type': 'ListItem', position: 3, name: alt.title, item: `https://emlet.app/alternatives/${alt.slug}` },
  ],
};

export default function ChatGptAlternativePage() {
  return (
    <MarketingLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Link href="/alternatives" className="text-sm text-white/40 hover:text-white transition-colors mb-8 inline-block">
        ← Back to comparisons
      </Link>

      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest text-[#00ffff]/60 uppercase mb-3">Emlet vs ChatGPT</p>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 leading-tight">{alt.title}</h1>
      </div>

      <BlogHeroImage src={alt.image} alt={alt.imageAlt} />

      <div className="space-y-6 text-white/70 leading-relaxed text-[17px]">
        <p>
          Worth being upfront about this one: Emlet uses a large language model too, so this isn't a "human-made vs AI" comparison. It's a comparison between a general-purpose chat assistant and a tool built specifically around the constraints of email HTML, with your brand remembered from one email to the next. Those are different jobs even when the underlying technology rhymes.
        </p>

        <WinCards
          cards={[
            { title: 'Remembers your brand', description: 'Set your colors, logo, and tone once. ChatGPT starts from zero in every new chat.' },
            { title: 'Email-safe HTML by default', description: 'Table-based layout and inline styles built in, not something you have to know to ask for.' },
            { title: 'Visual editor included', description: 'See and adjust the actual email, not just a code block you have to paste elsewhere to check.' },
          ]}
        />

        <h2 className="text-2xl font-bold text-white pt-6">What ChatGPT is actually good at here</h2>
        <p>
          Copy. If you need a subject line, a paragraph of promotional copy, or help figuring out what to actually say in a welcome email, ChatGPT is a genuinely solid first draft tool, and plenty of people already use it exactly that way. The trouble starts when people ask it to also produce the finished HTML.
        </p>

        <h2 className="text-2xl font-bold text-white pt-6">Where it falls apart: the HTML itself</h2>
        <p>
          Ask ChatGPT to "write an HTML email" and it can produce something that looks fine in a code preview or even in Gmail, and then falls apart in Outlook. That's not a knowledge gap in the model exactly, it's that safe email HTML requires specific, non-obvious constraints: table-based layout instead of flexbox or grid, every style inlined rather than in a stylesheet, and Outlook-specific conditional comments (MSO comments) for things like button padding that render inconsistently otherwise. Unless you already know to ask for all of that explicitly, and know enough to check the output for it, what you get back is web HTML wearing an email costume. I go through the specific rendering failures, dark mode inversion, Outlook's Word-based engine, image blocking, in{' '}
          <Link href="/blog/why-your-emails-look-broken-in-gmail-outlook" className="text-[#00ffff] hover:underline">
            this post
          </Link>
          , if you want the detail.
        </p>

        <h2 className="text-2xl font-bold text-white pt-6">No memory of your brand</h2>
        <p>
          Every new chat starts from zero. If you want your brand colors, logo, and tone applied consistently, you're re-explaining it, or re-pasting brand guidelines, every single time, and it's easy for that consistency to drift across sessions. There's no persistent brand profile a general chat assistant applies automatically to every email you ask for afterward.
        </p>

        <h2 className="text-2xl font-bold text-white pt-6">Where ChatGPT is still the right call</h2>
        <p>
          Brainstorming, drafting a single line of copy, or figuring out tone before you've settled on what the email should even say. It's a fine thinking partner for that stage. It's the "now build the finished, brand-matched, Outlook-safe email" stage where it needs more hand-holding than most people realize going in.
        </p>

        <ComparisonTable
          competitor="ChatGPT"
          rows={[
            { feature: 'Good for drafting copy', emlet: 'Yes', competitor: 'Yes' },
            { feature: 'Outputs email-safe HTML by default', emlet: 'Yes, table-based with inline styles', competitor: 'Inconsistent, depends on prompting', emletWins: true },
            { feature: 'Remembers your brand across sessions', emlet: 'Yes, saved brand profile', competitor: 'No, re-explain every time', emletWins: true },
            { feature: 'Visual preview & block editor', emlet: 'Yes', competitor: 'No, code output only', emletWins: true },
            { feature: 'Built specifically for email rendering', emlet: 'Yes', competitor: 'No, general-purpose assistant', emletWins: true },
            { feature: 'Exports HTML and TSX', emlet: 'Yes', competitor: 'Only what you manually copy' },
          ]}
        />

        <h2 className="text-2xl font-bold text-white pt-6">The honest recommendation</h2>
        <p>
          If you're drafting a single line of copy or brainstorming subject lines, ChatGPT is fine for that. If you want the finished, ready-to-send email, brand-consistent, tested against how email clients actually render HTML, without learning MSO conditional comments yourself, that's specifically the problem Emlet is built around. Same underlying category of technology, aimed at a much narrower and more specific job.
        </p>

        <BlogCTA
          heading="Skip re-explaining your brand every time"
          body="Set your brand profile once. Every email after that uses your colors, logo, and voice automatically, and outputs HTML built for actual inboxes."
        />
      </div>
    </MarketingLayout>
  );
}
