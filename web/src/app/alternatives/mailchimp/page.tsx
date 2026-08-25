import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';
import BlogCTA from '@/components/BlogCTA';
import BlogHeroImage from '@/components/BlogHeroImage';
import ComparisonTable from '@/components/ComparisonTable';
import WinCards from '@/components/WinCards';
import { ALTERNATIVES } from '@/lib/content/alternatives';

const alt = ALTERNATIVES.find((a) => a.slug === 'mailchimp')!;

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

export default function MailchimpAlternativePage() {
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
        <p className="text-xs font-semibold tracking-widest text-[#00ffff]/60 uppercase mb-3">Emlet vs Mailchimp</p>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 leading-tight">{alt.title}</h1>
      </div>

      <BlogHeroImage src={alt.image} alt={alt.imageAlt} />

      <div className="space-y-6 text-white/70 leading-relaxed text-[17px]">
        <p>
          Straight answer first: Emlet and Mailchimp aren't really competing for the same job, and if you're trying to decide between them, that's worth knowing before you read a comparison table. Mailchimp is a full email service provider, it stores your audience, sends the emails, tracks opens and clicks, and runs automations. Emlet does one thing and does it fast: it generates the email itself, the design and the copy, from a plain English description, already matched to your brand, in under a minute.
        </p>

        <WinCards
          cards={[
            { title: 'Describe it, don’t drag it', description: 'One sentence in, a finished design out. No blocks to place, no columns to align by hand.' },
            { title: 'Brand memory built in', description: 'Save your colors and logo once. Every email after that matches automatically, no re-styling per campaign.' },
            { title: 'Own your code', description: 'Export real HTML and TSX on the free trial too, not locked behind a paid tier.' },
          ]}
        />

        <h2 className="text-2xl font-bold text-white pt-6">Where Emlet wins</h2>
        <p>
          The email creation step itself. Mailchimp's builder is drag-and-drop blocks, you're still making every layout, spacing, and color decision by hand, block by block, for every single campaign. Emlet skips that entirely: you describe the email, it already knows your brand colors and logo from a saved profile, and it generates a complete, structured design in one pass. You edit from there instead of starting from nothing, which is a meaningfully different amount of work when you're sending three or four campaigns a month.
        </p>
        <p>
          There's also the pricing angle worth mentioning honestly: Mailchimp's free tier caps at 250 contacts, down from a much more generous limit in past years, and costs have climbed since the 2021 Intuit acquisition. That's driven a lot of the "Mailchimp alternative" searches. Emlet's free trial isn't contact-limited at all, since it isn't a sending platform, it's scoped to trying the generator itself.
        </p>

        <h2 className="text-2xl font-bold text-white pt-6">Where Mailchimp still wins</h2>
        <p>
          If you need list management, segmentation, automated journeys, or built-in sending infrastructure with deliverability reputation already established, that's Mailchimp's actual product, and it's mature. Emlet has none of that and isn't trying to. If your business runs on Mailchimp automations already, you're not ripping that out, and you shouldn't.
        </p>

        <ComparisonTable
          competitor="Mailchimp"
          rows={[
            { feature: 'What it actually is', emlet: 'AI email design & copy generator', competitor: 'Full email service provider (send, lists, automation)' },
            { feature: 'How you build an email', emlet: 'Describe it in plain English', competitor: 'Drag-and-drop block editor', emletWins: true },
            { feature: 'Time to a finished design', emlet: 'Under a minute', competitor: 'Often 30+ minutes of manual building', emletWins: true },
            { feature: 'Brand consistency', emlet: 'Saved brand profile applied automatically', competitor: 'Manual per template', emletWins: true },
            { feature: 'Code export (HTML / TSX)', emlet: 'Yes, on the free trial too', competitor: 'HTML export on paid plans only', emletWins: true },
            { feature: 'Sends & manages your list', emlet: 'No, export and send elsewhere', competitor: 'Yes, built in' },
            { feature: 'Automation / journeys', emlet: 'No', competitor: 'Yes' },
            { feature: 'Free tier', emlet: 'Unlimited by contact count (not a sending platform)', competitor: '250 contacts, limited sends' },
          ]}
        />

        <h2 className="text-2xl font-bold text-white pt-6">The workflow a lot of people actually use</h2>
        <p>
          In practice, these aren't mutually exclusive. Build the email in Emlet, export the HTML, and paste it into a Mailchimp campaign to send it to your existing list. You get the design speed without giving up Mailchimp's sending and automation, since Emlet was built to hand off clean HTML to exactly this kind of provider rather than replace it.
        </p>

        <h2 className="text-2xl font-bold text-white pt-6">Bottom line</h2>
        <p>
          Keep Mailchimp if you need list management and automation. Use Emlet for the part where you're staring at a blank template deciding where the button goes, it's faster, it already knows your brand, and you keep the code either way.
        </p>

        <BlogCTA
          heading="Design the email, send it however you already do"
          body="Generate a brand-matched email in seconds, then export HTML that drops straight into Mailchimp, or wherever you send from."
        />
      </div>
    </MarketingLayout>
  );
}
