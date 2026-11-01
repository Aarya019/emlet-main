import Link from 'next/link';
import ToolPage, { toolMetadata } from '@/components/tools/ToolPage';
import HtmlChecker from '@/components/tools/HtmlChecker';

const SLUG = 'html-email-checker';

export const metadata = toolMetadata(SLUG);

export default function HtmlEmailCheckerPage() {
  return (
    <ToolPage
      slug={SLUG}
      sections={[
        {
          heading: 'Why email HTML is different',
          body: (
            <>
              <p>
                A web browser and an email app are not the same thing. Outlook for Windows draws email with Word&apos;s layout engine, Gmail rewrites and limits your CSS, and each app supports a different slice of what you can do on the web. Code that looks perfect in a browser can fall apart in someone&apos;s inbox.
              </p>
              <p>
                The checker looks for the usual culprits: flexbox and grid, background images, web fonts, SVG, missing alt text, a message big enough for Gmail to clip, and styles that are not inlined. Each finding says who it affects and how to fix it. Our post on{' '}
                <Link href="/blog/why-your-emails-look-broken-in-gmail-outlook" className="text-[#00ffff] hover:underline">why emails look broken in Gmail and Outlook</Link>{' '}
                goes through them in more detail.
              </p>
            </>
          ),
        },
        {
          heading: 'What inlining CSS does',
          body: (
            <p>
              Email platforms copy the rules from your <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-white/80">&lt;style&gt;</code> block onto each element before sending, so the design survives in clients that ignore style blocks. The Inline CSS button does that for you in your browser. Rules that cannot be inlined, like media queries and hover effects, stay in a style block, which is exactly where they should be.
            </p>
          ),
        },
      ]}
      faq={[
        {
          q: 'Does this test how the email looks in Gmail and Outlook?',
          a: 'No. It reads the HTML as text and flags the things that commonly go wrong, but it cannot draw each app. After you fix what it finds, send yourself a test and open it in a few real inboxes, on a phone as well.',
        },
        {
          q: 'Is my HTML sent anywhere?',
          a: 'No. Everything runs in your browser. Your code is not uploaded, stored or logged.',
        },
        {
          q: 'Why does Gmail clip long emails?',
          a: 'Gmail cuts messages off at about 102 KB of HTML and hides the rest behind a "View entire message" link. That can hide your footer, including the unsubscribe link. Images do not count towards the limit, the code does.',
        },
        {
          q: 'Will inlining change how my email looks?',
          a: 'It should look the same, because each rule is copied onto the elements it already applied to. Keep your original HTML, compare the two, and test the inlined one before sending.',
        },
        {
          q: 'What about Outlook-only code, like conditional comments?',
          a: 'Comments, including Outlook conditionals such as <!--[if mso]>, are left alone and are not scanned for problems, since they are written for Outlook on purpose.',
        },
      ]}
    >
      <HtmlChecker />
    </ToolPage>
  );
}
