import Link from 'next/link';
import ToolPage, { toolMetadata } from '@/components/tools/ToolPage';
import SignatureGenerator from '@/components/tools/SignatureGenerator';

const SLUG = 'email-signature-generator';

export const metadata = toolMetadata(SLUG);

export default function EmailSignatureGeneratorPage() {
  return (
    <ToolPage
      slug={SLUG}
      sections={[
        {
          heading: 'A signature that works in every inbox',
          body: (
            <>
              <p>
                Email signatures break for the same reason email designs do: each app renders HTML differently. This generator builds the signature the way email clients like best, with a simple table layout and styles written directly on each element, so it holds together in Gmail, Outlook and Apple Mail.
              </p>
              <p>
                For the same reason it keeps to common fonts, text links instead of icon images, and one linked photo at most. Fewer moving parts means fewer surprises. Our posts on{' '}
                <Link href="/blog/why-your-emails-look-broken-in-gmail-outlook" className="text-neon-ink hover:underline">why emails look broken in Gmail and Outlook</Link>{' '}
                and{' '}
                <Link href="/blog/html-email-font-family-stacks" className="text-neon-ink hover:underline">email-safe font stacks</Link> explain the thinking.
              </p>
            </>
          ),
        },
        {
          heading: 'Keeping it short',
          body: (
            <p>
              A good signature is a business card, not a poster. Name, role, one or two ways to reach you, and a website. Skip legal boilerplate, inspirational quotes and a row of badges. Smaller signatures load faster, look cleaner in long threads, and are far less likely to be clipped or flagged.
            </p>
          ),
        },
      ]}
      faq={[
        {
          q: 'Why do I need a link for my photo instead of uploading it?',
          a: 'An email signature is HTML, and images in HTML are loaded from a web address rather than stored inside the text. Upload your picture somewhere public (your website works) and paste its address. Some apps ask the reader to allow images, so your name and details are always text as well.',
        },
        {
          q: 'Will the signature look the same for everyone who receives it?',
          a: 'Very close. Some apps hide images until the reader allows them, and some versions of Outlook for Windows show rounded photos with square corners. The text, colours and layout hold up.',
        },
        {
          q: 'Does the signature work on my phone?',
          a: 'Apps that sync your signature across devices will carry it over. The mobile versions of some apps keep their own plain signature, so you may need to paste it in there as well, or keep a shorter text-only version.',
        },
        {
          q: 'What is the "Made with Emlet" link?',
          a: 'A small, optional credit that links to Emlet. It is on by default and you can untick it before you copy. Nothing about the signature stops working without it.',
        },
        {
          q: 'Is my information saved?',
          a: 'No. The signature is built in your browser. Nothing you type is uploaded or stored.',
        },
      ]}
    >
      <SignatureGenerator />
    </ToolPage>
  );
}
