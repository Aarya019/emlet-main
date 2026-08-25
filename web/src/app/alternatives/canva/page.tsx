import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';
import BlogCTA from '@/components/BlogCTA';
import BlogHeroImage from '@/components/BlogHeroImage';
import ComparisonTable from '@/components/ComparisonTable';
import WinCards from '@/components/WinCards';
import { ALTERNATIVES } from '@/lib/content/alternatives';

const alt = ALTERNATIVES.find((a) => a.slug === 'canva')!;

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

export default function CanvaAlternativePage() {
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
        <p className="text-xs font-semibold tracking-widest text-[#00ffff]/60 uppercase mb-3">Emlet vs Canva</p>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 leading-tight">{alt.title}</h1>
      </div>

      <BlogHeroImage src={alt.image} alt={alt.imageAlt} />

      <div className="space-y-6 text-white/70 leading-relaxed text-[17px]">
        <p>
          Canva is genuinely great software. It's just not built for what a lot of people end up using it for: designing an email, exporting it as an image, and sending that image as the entire email. That workflow works right up until you check what actually happens on the other end, and by then it's already gone out to your whole list. Emlet was built for exactly this case, real, structured email HTML, generated from a description, with your brand already applied.
        </p>

        <WinCards
          cards={[
            { title: 'Real HTML, not a picture', description: 'Emlet outputs actual text and layout. Canva exports a flattened image, invisible to screen readers and often blocked by default.' },
            { title: 'Built to survive Outlook', description: 'Table-based, inline-styled markup that renders the same in Gmail, Outlook, and Apple Mail. Canva was never tested against any of them.' },
            { title: 'Brand applied automatically', description: 'Set your colors and logo once. No re-uploading assets into a new Canva template every campaign.' },
          ]}
        />

        <h2 className="text-2xl font-bold text-white pt-6">What happens when you email a Canva design</h2>
        <p>
          Canva exports a flattened image, a PNG or JPG, a picture of your design rather than a real, structured email. Send that as your entire email and a few things go wrong at once. Most inboxes block remote images by default, so a chunk of your recipients open a blank box until they manually click "show images," if they bother. Screen readers can't read text baked into an image, so it's invisible to anyone using assistive technology. And an email that's 100% image with no real text is a pattern spam filters are trained to be suspicious of, since it's a known spam evasion tactic, which can quietly affect deliverability for that send and sometimes beyond it. None of this is visible in Canva's own preview, because Canva is previewing the image, not how an inbox actually treats it.
        </p>
        <p>
          I've written a more detailed breakdown of exactly what breaks and why, including the Outlook rendering quirks and dark mode issues, in{' '}
          <Link href="/blog/why-your-emails-look-broken-in-gmail-outlook" className="text-[#00ffff] hover:underline">
            this post
          </Link>
          .
        </p>

        <h2 className="text-2xl font-bold text-white pt-6">Where Canva still wins</h2>
        <p>
          Social graphics, one-off flyers, presentation decks, anything that's meant to be viewed as an image rather than sent as structured HTML to an inbox. Canva's template library and drag-and-drop editor are genuinely excellent for that category, and there's no reason to stop using it there.
        </p>

        <ComparisonTable
          competitor="Canva"
          rows={[
            { feature: 'Output format', emlet: 'Real HTML (text + layout, not an image)', competitor: 'Flattened PNG / JPG image', emletWins: true },
            { feature: 'Readable by screen readers', emlet: 'Yes', competitor: 'No', emletWins: true },
            { feature: 'Visible with images blocked', emlet: 'Yes, text renders regardless', competitor: 'No, shows blank until images load', emletWins: true },
            { feature: 'Built for email deliverability', emlet: 'Yes', competitor: 'Not designed for this', emletWins: true },
            { feature: 'Brand profile reuse', emlet: 'Saved once, applied automatically', competitor: 'Manual per design', emletWins: true },
            { feature: 'Best for', emlet: 'Marketing emails, newsletters', competitor: 'Social graphics, flyers, decks' },
          ]}
        />

        <h2 className="text-2xl font-bold text-white pt-6">A reasonable way to use both</h2>
        <p>
          Keep Canva for your Instagram posts and one-off visual assets, it's still the better tool for that. For the actual email that goes to your list, use something that outputs real HTML, whether that's Emlet or hand-coding it. If you want to keep a Canva-made graphic as one image inside an otherwise real HTML email, that's fine too, it's the "entire email is one image" pattern specifically that causes the problems above.
        </p>

        <BlogCTA
          heading="Build the email as an email, not a picture of one"
          body="Emlet generates real, brand-matched HTML that renders correctly with images off, screen readers, and Outlook, not a flattened graphic."
        />
      </div>
    </MarketingLayout>
  );
}
