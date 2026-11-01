import Link from 'next/link';
import ToolPage, { toolMetadata } from '@/components/tools/ToolPage';
import FooterGenerator from '@/components/tools/FooterGenerator';

const SLUG = 'email-footer-generator';

export const metadata = toolMetadata(SLUG);

export default function EmailFooterGeneratorPage() {
  return (
    <ToolPage
      slug={SLUG}
      sections={[
        {
          heading: 'What a compliant footer needs',
          body: (
            <>
              <p>The details vary by country, but the basics are the same almost everywhere a business emails customers:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li><strong className="text-white/80">Who you are.</strong> The sender should be clearly identifiable.</li>
                <li><strong className="text-white/80">A real postal address.</strong> CAN-SPAM in the US requires a valid physical postal address, which can be a street address, a PO box or a private mailbox. Canada&apos;s CASL expects a mailing address plus another way to reach you.</li>
                <li><strong className="text-white/80">A working unsubscribe.</strong> Easy to find, free to use, and honoured promptly. Both CAN-SPAM and CASL allow at most 10 business days to act on it, and in practice it should be immediate.</li>
                <li><strong className="text-white/80">Why they are getting it.</strong> Not a strict US requirement, but expected under GDPR-style transparency rules and a proven way to reduce spam complaints.</li>
              </ul>
              <p>
                Gmail and Yahoo also expect one-click unsubscribe for bulk senders. We explain what that means, and how to set it up, in{' '}
                <Link href="/blog/one-click-unsubscribe-what-it-is-and-how-to-set-it-up" className="text-neon-ink hover:underline">our guide to one-click unsubscribe</Link>.
              </p>
            </>
          ),
        },
        {
          heading: 'How to use the footer',
          body: (
            <>
              <p>
                Pick your email platform so the unsubscribe link uses the right tag, check the compliance list on the right, then copy the HTML into the bottom of your email. If you build your emails in Emlet, the footer block already includes the unsubscribe wording, and this tool is handy for anything you send from elsewhere.
              </p>
              <p>
                Always send yourself a test. Click the unsubscribe link in the test and make sure it works before the real send.
              </p>
            </>
          ),
        },
      ]}
      faq={[
        {
          q: 'Do I really need my address in every email?',
          a: 'In the US, yes: CAN-SPAM requires a valid physical postal address in commercial email. If you work from home and would rather not publish your address, a PO box or a private mailbox (such as one from a mail-receiving service) is allowed.',
        },
        {
          q: 'What does the unsubscribe tag do?',
          a: 'Email platforms replace their tag, such as *|UNSUB|* in Mailchimp, with a unique, working unsubscribe link for every recipient when the email is sent. If you leave the placeholder in, the link will be broken.',
        },
        {
          q: 'Is this enough for GDPR?',
          a: 'The footer covers identification, a way to opt out, and a link to your privacy policy, which are the visible parts. GDPR also depends on having a lawful basis, such as consent, to email people in the first place. That is something your sign-up process has to handle.',
        },
        {
          q: 'Is this legal advice?',
          a: 'No. It is general information to help you get the basics right. If you send at volume or in regulated areas, ask a professional.',
        },
      ]}
    >
      <FooterGenerator />
    </ToolPage>
  );
}
