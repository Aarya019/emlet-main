import Link from 'next/link';
import ToolPage, { toolMetadata } from '@/components/tools/ToolPage';
import SubjectLineTester from '@/components/tools/SubjectLineTester';

const SLUG = 'subject-line-tester';

export const metadata = toolMetadata(SLUG);

export default function SubjectLineTesterPage() {
  return (
    <ToolPage
      slug={SLUG}
      sections={[
        {
          heading: 'What this checks',
          body: (
            <>
              <p>
                It shows your subject line and preview text the way a few common inboxes lay them out, and flags the things that tend to cause trouble: a subject that gets cut off before the point, shouting capitals, heavy punctuation, a preview that repeats the subject, an empty preview, and sales-sounding phrases.
              </p>
              <p>
                Paste a few alternatives underneath and compare them side by side. It is quicker than guessing, and it costs nothing to try five.
              </p>
            </>
          ),
        },
        {
          heading: 'What it cannot tell you',
          body: (
            <>
              <p>
                No tool can promise your email lands in the inbox or gets opened. That depends mostly on your sender reputation, whether your domain is authenticated, and whether people who know you want to hear from you. Our posts on{' '}
                <Link href="/blog/spam-trigger-words-outdated-advice" className="text-[#00ffff] hover:underline">spam trigger words</Link> and{' '}
                <Link href="/blog/email-deliverability-spf-dkim-dmarc-explained" className="text-[#00ffff] hover:underline">SPF, DKIM and DMARC</Link> explain what actually moves the needle.
              </p>
              <p>
                Use this as a proofreader, not a judge. The only real test of a subject line is how your own list responds to it.
              </p>
            </>
          ),
        },
      ]}
      faq={[
        {
          q: 'How long should an email subject line be?',
          a: 'There is no magic number. Many phones show roughly 35 to 45 characters and desktop inboxes about 60 to 70, so the first few words should carry the meaning. A longer subject is fine if the start works on its own.',
        },
        {
          q: 'Do spam trigger words really send email to the spam folder?',
          a: 'Rarely, on their own. Modern filters look mainly at who is sending, whether the domain is authenticated, and how recipients react. Words like "free" or "limited time" can still make a message read as pushy, which is why the tool mentions them, but it will not claim they decide anything.',
        },
        {
          q: 'What is preview text?',
          a: 'The line of grey text after the subject in the inbox list, also called a preheader. If you do not set one, the inbox shows the first text from the email body, often "View in browser". A short, specific line is a free second subject line.',
        },
        {
          q: 'Should I use emojis in subject lines?',
          a: 'Sometimes. One can make a subject stand out; several look like marketing noise, and they render a little differently in each app. Test it on your own list, and check the result on a phone first.',
        },
        {
          q: 'Is what I type sent anywhere?',
          a: 'No. The checks run in your browser. Nothing you type here is uploaded or stored.',
        },
      ]}
    >
      <SubjectLineTester />
    </ToolPage>
  );
}
