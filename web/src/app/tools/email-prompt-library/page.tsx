import Link from 'next/link';
import ToolPage, { toolMetadata } from '@/components/tools/ToolPage';
import PromptLibrary from '@/components/tools/PromptLibrary';

const SLUG = 'email-prompt-library';

export const metadata = toolMetadata(SLUG);

export default function EmailPromptLibraryPage() {
  return (
    <ToolPage
      slug={SLUG}
      sections={[
        {
          heading: 'What makes a prompt for an email work',
          body: (
            <>
              <p>
                Vague prompts get vague emails. Every prompt here is written as a short brief, and they all cover the same few things, which is a good habit to keep when you write your own:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li><strong className="text-white/80">Who it is for and what they just did.</strong> A new subscriber, a customer who left a cart, someone who has not opened an email in months.</li>
                <li><strong className="text-white/80">The one thing the email should do.</strong> One action, one button. If you need two, you probably need two emails.</li>
                <li><strong className="text-white/80">The real facts.</strong> Dates, prices, codes, places and numbers. These are the [brackets]; the AI cannot invent them correctly.</li>
                <li><strong className="text-white/80">The tone, in a few words.</strong> &ldquo;Friendly and a little dry&rdquo; works better than &ldquo;professional&rdquo;.</li>
                <li><strong className="text-white/80">What to leave out.</strong> No countdowns, no exclamation marks, no hype words. Saying so saves an edit.</li>
              </ul>
            </>
          ),
        },
        {
          heading: 'Why AI emails all sound the same, and how to avoid it',
          body: (
            <p>
              Left alone, AI writes the average email. The cure is specifics: your real details, a tone you have named, and permission to be plain. We go deeper in{' '}
              <Link href="/blog/ai-written-emails-all-sound-the-same" className="text-neon-ink hover:underline">why AI-written emails all sound the same</Link>{' '}
              and{' '}
              <Link href="/blog/write-like-a-person-not-a-brand" className="text-neon-ink hover:underline">how to write like a person, not a brand</Link>.
            </p>
          ),
        },
      ]}
      faq={[
        {
          q: 'Do I need Emlet to use these prompts?',
          a: 'No. Copy any prompt into the AI tool you already use. In Emlet, the same prompt also becomes a designed, editable email in your brand colours, ready to export.',
        },
        {
          q: 'What do I put in the [brackets]?',
          a: 'The real details only you know: your brand name, dates, prices, discount codes, places. Press Edit on a prompt, fill them in, then copy it or turn it into an email.',
        },
        {
          q: 'Can I change a prompt?',
          a: 'Yes, that is the idea. Edit the text, add a sentence about your tone, remove anything that does not fit. Your edits stay in this tab and are not saved anywhere.',
        },
        {
          q: 'Are these prompts free to use commercially?',
          a: 'Yes. Use them for your own business, your clients, or your team. A link back is appreciated but never required.',
        },
      ]}
    >
      <PromptLibrary />
    </ToolPage>
  );
}
