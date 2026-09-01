import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';
import BlogCTA from '@/components/BlogCTA';
import BlogHeroImage from '@/components/BlogHeroImage';
import BlogSidebar from '@/components/BlogSidebar';
import { BLOG_POSTS, getAllPostsMeta } from '@/lib/content/posts';

const post = BLOG_POSTS.find((p) => p.slug === 'avoid-gmail-promotions-tab')!;

export const metadata: Metadata = {
  title: `${post.title} | Emlet Blog`,
  description: post.description,
  openGraph: {
    title: post.title,
    description: post.description,
    url: `https://emlet.app/blog/${post.slug}`,
    siteName: 'Emlet',
    type: 'article',
  },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: post.title,
  description: post.description,
  image: post.image,
  datePublished: post.date,
  author: { '@type': 'Person', name: 'Aarya', url: 'https://emlet.app' },
  publisher: {
    '@type': 'Organization',
    name: 'Emlet',
    logo: { '@type': 'ImageObject', url: 'https://emlet.app/icon.png' },
  },
  mainEntityOfPage: { '@type': 'WebPage', '@id': `https://emlet.app/blog/${post.slug}` },
};

export default async function Post() {
  const allPosts = await getAllPostsMeta();
  return (
    <MarketingLayout sidebar={<BlogSidebar posts={allPosts} currentSlug={post.slug} activeCategory={post.category} />}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Link href="/blog" className="text-sm text-white/40 hover:text-white transition-colors mb-8 inline-block">
        ← Back to blog
      </Link>

      <div className="mb-10">
        <p className="text-xs font-semibold tracking-widest text-[#00ffff]/60 uppercase mb-3">{post.category}</p>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 leading-tight">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-white/40">
          <span>Aarya, Founder of Emlet</span>
          <span>·</span>
          <span>{formatDate(post.date)}</span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>
      </div>

      <BlogHeroImage src={post.image} alt={post.imageAlt} />

      <div className="space-y-6 text-white/70 leading-relaxed text-[17px]">
        <p>
          Every founder who's sent a marketing email has asked some version of this. The honest answer is that it isn't one question, it's two, and almost every guide on the internet answers only the fun one. The first question is about what's inside the email: the subject line, the images, the links, the wording. The second is about the infrastructure the email came from: the sending domain, the authentication records, the reputation built up over months of sends. The second one decides most of the outcome, and it's the one most "avoid Promotions" listicles skip, because "check your DMARC record" doesn't make for a punchy headline.
        </p>
        <p>
          Here's both halves, honestly, with the boring-but-decisive one first.
        </p>

        <h2 className="text-2xl font-bold text-white pt-6">How Gmail actually decides</h2>
        <p>
          Gmail's tab sorting isn't a fixed rulebook, it's a per-recipient machine learning model applied at the moment an email lands. Google's own explanation of the feature describes it as weighing the sender, the type of content in the message, and how that specific person has interacted with similar messages before. That last part is the one people underestimate: two recipients can get the exact same campaign from the exact same sender and have it land in different tabs, because the model isn't scoring the email in isolation, it's scoring it against what it's already learned about that one inbox.
        </p>
        <p>
          On top of that per-recipient layer, the model reads the message itself: how much of it is images versus text, how many links it contains, whether the formatting resembles a template rather than a personal note, and whether the language reads as commercial ("Save 20%," "Limited time," "Shop now"). None of these alone determines the outcome. It's a weighted combination, which is why two seemingly similar emails from two different senders can land differently, and why nobody outside Google can give you a guaranteed formula.
        </p>

        <h2 className="text-2xl font-bold text-white pt-6">The part you can't fix from inside the email</h2>
        <p>
          This is the half that actually moves the needle, and it has nothing to do with design. Since February 2024, Google (alongside Yahoo, and with Microsoft and Apple following a similar direction) has enforced a specific set of requirements for anyone sending meaningful volume, and it's been ratcheting up enforcement since: proper SPF and DKIM on your sending domain, DMARC alignment, a spam complaint rate that stays well under 0.3% (deliverability trackers generally recommend treating 0.1% as the real ceiling, not the 0.3% hard cutoff), and, since June 2024, a working one-click unsubscribe link (RFC 8058) in every marketing send, not just a link buried in the footer that opens a five-step web form.
        </p>
        <p>
          None of that is about whether your email "reads as promotional." It's about whether Gmail trusts that your domain is who it says it is, and whether the people receiving your mail have historically wanted it. Skip authentication or run a high complaint rate, and it doesn't matter how tastefully you wrote the subject line, you're fighting an uphill battle before the content-classification model even gets involved. This is also, worth saying plainly, a different failure mode than landing in Promotions: an unauthenticated domain risks the spam folder outright, which is a much worse outcome than Promotions. Promotions tab placement is Gmail saying "I believe this is legitimate commercial mail." Spam folder placement is Gmail saying "I don't trust this sender." Fix the second problem before you worry about the first.
        </p>

        <h2 className="text-2xl font-bold text-white pt-6">What's actually inside your control</h2>
        <p>
          Once your sending domain is properly authenticated and your list is opted-in and reasonably engaged, here's what the content-classification layer is actually weighing, and what you can do about each:
        </p>
        <ul className="list-disc list-outside pl-5 space-y-3">
          <li>
            <span className="text-white font-semibold">Image-to-text ratio.</span> An email that's one big banner graphic with a headline baked into the image is a strong promotional signal, and it's also bad practice for other reasons (screen readers can't read it, and it breaks entirely for anyone with images blocked). Build the email as real text with supporting images, not a picture of an email.
          </li>
          <li>
            <span className="text-white font-semibold">Link and button density.</span> A wall of "Shop Now," "Buy Now," and "Save Today" buttons reads as a catalog blast. One clear call to action, maybe two, reads as a message from someone who wants you to do a specific thing rather than browse a sale.
          </li>
          <li>
            <span className="text-white font-semibold">Commercial trigger language.</span> "% off," "Free," "Limited time," "Act now," in the subject line and the first line of body text specifically, since that's the part getting the heaviest weight from any classifier, human or machine. This doesn't mean you can't run a sale, it means write it the way you'd say it out loud, not the way a coupon flyer says it.
          </li>
          <li>
            <span className="text-white font-semibold">Template smell.</span> Big rounded hero banners, a footer stacked with six social icons and a physical mailing address in tiny gray text, feels like a "campaign" rather than a message. This is a genuine tension if you also care about the email looking polished and on-brand, and there's no way around it: a plainer, more text-forward email is inherently more likely to read as personal mail. A beautifully designed marketing email is still, structurally, a marketing email. Decide which matters more for the specific send.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-white pt-6">The feedback loop almost nobody mentions</h2>
        <p>
          Because the model is per-recipient, it updates based on what that person actually does. If someone manually drags your email from Promotions into Primary, Gmail remembers that for future messages from you specifically to them. Replies, and adding your address to their contacts, do the same thing. This is why the single highest-leverage move for an early-stage sender with a small, genuinely engaged list is just asking, directly, in your welcome email: "if this lands in Promotions, drag it into Primary so you don't miss anything." It feels almost too simple, but it's a real, documented signal, not a myth, and it costs you one sentence.
        </p>

        <h2 className="text-2xl font-bold text-white pt-6">Is escaping Promotions actually the right goal?</h2>
        <p>
          Worth pushing back on the premise for a second. Promotions exists because a meaningful chunk of Gmail users like having their deals and newsletters in one place they can browse on their own time, rather than mixed in with messages from their boss. Recipients who open the Promotions tab are doing it with buying or browsing intent already switched on, which is a different mental state than someone triaging Primary. Some senders genuinely see better click-through from Promotions than they would fighting their way into Primary and getting ignored there instead. The goal isn't "never be in Promotions," it's "don't end up there by accident because your authentication is broken or your list stopped wanting to hear from you." If you've earned Promotions placement with a genuinely engaged list, that's not a failure state.
        </p>

        <h2 className="text-2xl font-bold text-white pt-6">The actual checklist</h2>
        <p>
          In order of how much they actually move the outcome:
        </p>
        <ul className="list-disc list-outside pl-5 space-y-3">
          <li>SPF and DKIM configured and passing, DMARC set to at least a monitoring policy, on the domain you're actually sending from.</li>
          <li>A working one-click unsubscribe link on every marketing send, and honor it within a day or two, not "eventually."</li>
          <li>Watch your spam complaint rate. If it's creeping up, that's a list-quality problem to fix, not a design problem.</li>
          <li>Build the email as real HTML text and layout, not a single exported graphic.</li>
          <li>One or two clear calls to action, not a grid of buttons.</li>
          <li>Ask engaged subscribers, once, to move you to Primary or add you to contacts.</li>
        </ul>
        <p>
          The first three are entirely about sending infrastructure, and no email design tool, including this one, can fix them for you. They live in your domain's DNS records and your ESP's reputation, not in your HTML. The last three are about the actual email, and that's the part worth getting right regardless of which tab you end up in, because a cluttered, image-heavy, button-stuffed email is a worse experience for the person reading it too, not just a worse signal to Gmail.
        </p>
        <p>
          If you want the deeper version of why email HTML behaves so differently across inboxes in the first place, I wrote about that separately in{' '}
          <Link href="/blog/why-your-emails-look-broken-in-gmail-outlook" className="text-[#00ffff] hover:underline">
            why your emails look broken in Gmail and Outlook
          </Link>
          .
        </p>

        <BlogCTA
          heading="Get the content half right, at least"
          body="Emlet builds real, email-safe HTML with sensible link and image density instead of a flattened banner graphic, so the part of this that's actually in your control isn't working against you."
        />
      </div>
    </MarketingLayout>
  );
}
