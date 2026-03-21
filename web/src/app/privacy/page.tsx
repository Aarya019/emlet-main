import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Emlet',
  description: 'Privacy Policy for Emlet — AI Email Generator.',
};

const LAST_UPDATED = 'March 21, 2026';
const CONTACT_EMAIL = 'support@emlet.app';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-black tracking-tight">
          <span className="bg-gradient-to-r from-[#00ffff] to-[#00ff00] bg-clip-text text-transparent">
            emlet
          </span>
        </Link>
        <div className="flex items-center gap-4 text-sm text-white/60">
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/sign-in" className="hover:text-white transition-colors">Sign in</Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Title */}
        <div className="mb-12">
          <p className="text-xs font-semibold tracking-widest text-white/30 uppercase mb-3">Legal</p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/40 text-sm">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="space-y-10 text-white/70 leading-relaxed">

          <section>
            <p>
              Emlet ("we", "us", or "our") operates the website at{' '}
              <span className="text-white">emlet.app</span> and the associated email generation service
              (the "Service"). This Privacy Policy explains what information we collect, how we use it,
              and your rights with respect to it. By using the Service, you agree to the practices
              described here.
            </p>
          </section>

          <Section title="1. Information We Collect">
            <p className="font-medium text-white/80 mb-2">Information you provide directly:</p>
            <ul className="space-y-2 list-none mb-4">
              {[
                'Account information — email address and name when you sign up or sign in via Google',
                'Brand profile data — brand name, colors, logo URL, industry, and description you enter',
                'Email prompts — the text prompts you submit to generate emails',
                'Payment information — handled entirely by Paddle; we never store your card details',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#00ffff]/50 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="font-medium text-white/80 mb-2">Information collected automatically:</p>
            <ul className="space-y-2 list-none">
              {[
                'Usage data — pages visited, features used, and actions taken within the Service',
                'Device and browser information — IP address, browser type, and operating system',
                'Cookies and similar technologies — used to maintain your session and remember preferences',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#00ffff]/50 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="2. How We Use Your Information">
            <p>We use the information we collect to:</p>
            <ul className="mt-3 space-y-2 list-none">
              {[
                'Create and manage your account and authenticate your identity',
                'Generate AI-powered email content based on your prompts and brand profiles',
                'Process payments and manage your subscription through Paddle',
                'Send transactional emails such as account confirmation and billing receipts',
                'Monitor and improve the performance, reliability, and features of the Service',
                'Prevent fraud, abuse, and violations of our Terms of Service',
                'Comply with applicable legal obligations',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#00ffff]/50 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4">
              We do not sell your personal data to third parties, and we do not use your email prompts
              or generated content to train AI models.
            </p>
          </Section>

          <Section title="3. How We Share Your Information">
            <p>We share data only with the following categories of third parties, and only as necessary:</p>
            <ul className="mt-3 space-y-2 list-none">
              {[
                'Supabase — our database and authentication provider, stores your account and content data',
                'Google (via OAuth) — authenticates your identity; we receive only your name and email',
                'Paddle — our payment processor; handles billing and subscription management',
                'Google Gemini / AI providers — receives your prompts to generate email content',
                'Pexels — used to fetch stock images for generated emails',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#00ffff]/50 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4">
              We may also disclose your information if required by law, court order, or to protect the
              rights, property, or safety of Emlet, our users, or others.
            </p>
          </Section>

          <Section title="4. Data Retention">
            <p>
              We retain your account data and generated emails for as long as your account is active.
              If you delete your account, we will delete your personal data within 30 days, except
              where retention is required by law (e.g. billing records).
            </p>
          </Section>

          <Section title="5. Cookies">
            <p>
              We use essential cookies to keep you signed in and maintain your session. We may also use
              analytics cookies (e.g. Google Analytics) to understand how the Service is used. You can
              disable cookies in your browser settings, but some features of the Service may not work
              correctly without them.
            </p>
          </Section>

          <Section title="6. Your Rights">
            <p>Depending on your location, you may have the right to:</p>
            <ul className="mt-3 space-y-2 list-none">
              {[
                'Access — request a copy of the personal data we hold about you',
                'Correction — ask us to correct inaccurate or incomplete data',
                'Deletion — request deletion of your personal data ("right to be forgotten")',
                'Portability — receive your data in a structured, machine-readable format',
                'Objection — object to certain uses of your data, including direct marketing',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#00ffff]/50 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4">
              To exercise any of these rights, contact us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#00ffff] hover:underline">
                {CONTACT_EMAIL}
              </a>. We will respond within 30 days.
            </p>
          </Section>

          <Section title="7. Security">
            <p>
              We implement industry-standard security measures including encrypted connections (HTTPS),
              secure storage via Supabase, and access controls. However, no system is completely secure.
              We encourage you to use a strong password and to notify us immediately if you suspect
              unauthorized access to your account.
            </p>
          </Section>

          <Section title="8. Children's Privacy">
            <p>
              The Service is not directed to children under the age of 13, and we do not knowingly
              collect personal data from children. If you believe we have inadvertently collected data
              from a child, please contact us and we will delete it promptly.
            </p>
          </Section>

          <Section title="9. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material
              changes by updating the "Last updated" date at the top of this page. Continued use of the
              Service after changes constitutes your acceptance of the revised policy.
            </p>
          </Section>

          <Section title="10. Contact">
            <p>
              If you have any questions or concerns about this Privacy Policy, please contact us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#00ffff] hover:underline">
                {CONTACT_EMAIL}
              </a>.
            </p>
          </Section>

        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 mt-8">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/30">
          <span>© {new Date().getFullYear()} Emlet. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-white/60 transition-colors">Terms of Service</Link>
            <Link href="/pricing" className="hover:text-white/60 transition-colors">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-white mb-3">{title}</h2>
      {children}
    </section>
  );
}
