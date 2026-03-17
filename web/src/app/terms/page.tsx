import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Emlet',
  description: 'Terms of Service for Emlet — AI Email Generator.',
};

const LAST_UPDATED = 'March 17, 2026';
const CONTACT_EMAIL = 'support@emlet.app';

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-white/40 text-sm">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="space-y-10 text-white/70 leading-relaxed">

          <section>
            <p>
              Welcome to Emlet. By accessing or using our website at{' '}
              <span className="text-white">emlet.app</span> and any associated services (collectively, the
              "Service"), you agree to be bound by these Terms of Service ("Terms"). Please read them
              carefully. If you do not agree, do not use the Service.
            </p>
          </section>

          <Section title="1. Eligibility">
            <p>
              You must be at least 18 years old and capable of entering into a binding contract to use the
              Service. By using Emlet, you represent and warrant that you meet these requirements.
            </p>
          </Section>

          <Section title="2. Your Account">
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for
              all activity that occurs under your account. Notify us immediately at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#00ffff] hover:underline">{CONTACT_EMAIL}</a>{' '}
              if you suspect any unauthorized use.
            </p>
            <p className="mt-3">
              We reserve the right to suspend or terminate accounts that violate these Terms or are used
              for fraudulent, abusive, or illegal purposes.
            </p>
          </Section>

          <Section title="3. Acceptable Use">
            <p>You agree not to use Emlet to:</p>
            <ul className="mt-3 space-y-2 list-none">
              {[
                'Generate spam, phishing emails, or content intended to deceive recipients',
                'Violate any applicable law or regulation, including anti-spam laws (CAN-SPAM, GDPR, CASL)',
                'Infringe on the intellectual property rights of any third party',
                'Upload or transmit malicious code or interfere with the Service',
                'Attempt to reverse-engineer, copy, or resell any part of the Service',
                'Use the Service to send unsolicited bulk email without recipient consent',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#00ffff]/50 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="4. Credits & Subscriptions">
            <p>
              Emlet operates on a credit-based system. Credits are consumed when you generate emails.
              Free accounts receive a limited number of credits per month. Paid plans (Pro, Enterprise)
              provide additional credits as described on the{' '}
              <Link href="/pricing" className="text-[#00ffff] hover:underline">pricing page</Link>.
            </p>
            <p className="mt-3">
              Subscriptions are billed monthly through Paddle, our payment processor. By subscribing,
              you authorize recurring charges to your payment method. You may cancel at any time from
              your account settings; cancellation takes effect at the end of the current billing period.
            </p>
            <p className="mt-3">
              Credits reset monthly and do not roll over. Unused credits are forfeited at the end of
              each billing cycle.
            </p>
          </Section>

          <Section title="5. Refunds">
            <p>
              All payments are final and non-refundable except where required by law. If you believe you
              were charged in error, contact us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#00ffff] hover:underline">{CONTACT_EMAIL}</a>{' '}
              within 7 days of the charge.
            </p>
          </Section>

          <Section title="6. Intellectual Property">
            <p>
              <strong className="text-white">Your content:</strong> You retain ownership of any prompts,
              brand assets, or content you provide. By using the Service, you grant Emlet a limited
              license to process your content solely to provide the Service.
            </p>
            <p className="mt-3">
              <strong className="text-white">Generated content:</strong> Email content generated by
              Emlet using AI is provided to you for your use. You are responsible for reviewing,
              editing, and ensuring that generated content complies with applicable laws before sending.
            </p>
            <p className="mt-3">
              <strong className="text-white">Emlet platform:</strong> All rights in the Emlet platform,
              software, and branding are owned by Emlet. Nothing in these Terms grants you rights to
              use our trademarks or copy our software.
            </p>
          </Section>

          <Section title="7. AI-Generated Content Disclaimer">
            <p>
              Emlet uses AI models to generate email copy and layouts. AI-generated content may
              occasionally be inaccurate, incomplete, or not suitable for your specific use case. You
              are solely responsible for reviewing all generated content before use. We make no
              warranties about the accuracy, legality, or fitness of AI-generated output.
            </p>
          </Section>

          <Section title="8. Privacy">
            <p>
              Your use of the Service is also governed by our{' '}
              <Link href="/privacy" className="text-[#00ffff] hover:underline">Privacy Policy</Link>,
              which is incorporated into these Terms by reference.
            </p>
          </Section>

          <Section title="9. Availability & Changes">
            <p>
              We strive for high availability but do not guarantee uninterrupted access to the Service.
              We may modify, suspend, or discontinue any part of the Service at any time with reasonable
              notice. We also reserve the right to update these Terms; continued use after changes
              constitutes acceptance.
            </p>
          </Section>

          <Section title="10. Disclaimer of Warranties">
            <p>
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS
              OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
              PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE
              ERROR-FREE OR THAT DEFECTS WILL BE CORRECTED.
            </p>
          </Section>

          <Section title="11. Limitation of Liability">
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, EMLET AND ITS AFFILIATES, OFFICERS, EMPLOYEES,
              AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
              PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE, EVEN IF ADVISED OF THE POSSIBILITY
              OF SUCH DAMAGES. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE
              TWELVE (12) MONTHS PRECEDING THE CLAIM.
            </p>
          </Section>

          <Section title="12. Governing Law">
            <p>
              These Terms are governed by and construed in accordance with applicable law. Any disputes
              arising under these Terms shall be resolved through binding arbitration or in a court of
              competent jurisdiction.
            </p>
          </Section>

          <Section title="13. Contact">
            <p>
              If you have any questions about these Terms, please contact us at{' '}
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
            <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
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
