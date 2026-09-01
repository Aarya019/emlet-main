import Link from 'next/link';
import type { Metadata } from 'next';
import MarketingLayout from '@/components/MarketingLayout';

export const metadata: Metadata = {
  title: 'Terms of Service | Emlet',
  description: 'Terms of Service for Emlet, the AI email design generator.',
};

const LAST_UPDATED = 'September 1, 2026';
const CONTACT_EMAIL = 'support@emlet.app';

export default function TermsPage() {
  return (
    <MarketingLayout contentClassName="max-w-3xl">
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

        <Section title="4. Plans & Free Usage">
          <p>
            Free accounts receive a recurring monthly allowance: 5 pooled AI actions (email generation,
            AI-assisted editing, and block regeneration all draw from this same pool), 3 test email sends,
            and 1 active brand profile. Free-tier allowances reset at the start of each billing month and
            do not carry over. The paid Professional plan removes these limits, as described on the{' '}
            <Link href="/#pricing" className="text-[#00ffff] hover:underline">pricing page</Link>. We may
            adjust free-tier allowances or plan features from time to time; material reductions will be
            posted on the pricing page.
          </p>
        </Section>

        <Section title="5. Billing & Refunds">
          <p>
            The Professional plan is billed on a recurring monthly basis through Paddle.com, our merchant
            of record and payment processor. By subscribing, you authorize recurring charges to your
            payment method until you cancel. You may cancel at any time from your account settings;
            cancellation stops future billing but does not refund the current period, and your Professional
            access continues until the end of the period already paid for.
          </p>
          <p className="mt-3">
            Charges are generally final. If you believe you were charged in error, or want to request a
            refund, contact us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#00ffff] hover:underline">{CONTACT_EMAIL}</a>{' '}
            within 7 days of the charge. Refunds, when granted, are issued at our discretion through
            Paddle and will downgrade your account to the free plan. See our{' '}
            <Link href="/refunds" className="text-[#00ffff] hover:underline">Refund Policy</Link> for
            the full process, including chargebacks.
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
            <strong className="text-white">Stock imagery:</strong> Images sourced through the Service
            from third-party libraries (such as Pexels and Pixabay) remain subject to those providers'
            own license terms, which generally permit commercial use without attribution. You are
            responsible for confirming a given image's suitability for your intended use.
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

        <Section title="8. Third-Party Services">
          <p>
            The Service relies on third-party providers to operate, including our AI provider,
            authentication and database provider, payment processor, image libraries, and email
            delivery provider. A full list appears in our{' '}
            <Link href="/privacy" className="text-[#00ffff] hover:underline">Privacy Policy</Link>. We
            are not responsible for outages or errors originating from these third parties, though we
            will make reasonable efforts to work around them.
          </p>
        </Section>

        <Section title="9. Copyright Complaints">
          <p>
            If you believe content generated or hosted through the Service infringes your copyright,
            send a notice to{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#00ffff] hover:underline">{CONTACT_EMAIL}</a>{' '}
            identifying the material and your rights in it. We will review and remove infringing
            material where appropriate and may terminate the accounts of repeat infringers.
          </p>
        </Section>

        <Section title="10. Privacy">
          <p>
            Your use of the Service is also governed by our{' '}
            <Link href="/privacy" className="text-[#00ffff] hover:underline">Privacy Policy</Link>,
            which is incorporated into these Terms by reference.
          </p>
        </Section>

        <Section title="11. Termination">
          <p>
            You may stop using the Service and delete your account at any time from your account
            settings. We may suspend or terminate your access, with or without notice, if we
            reasonably believe you have violated these Terms, misused the Service, or if required to
            do so by law. Sections of these Terms that by their nature should survive termination
            (including Intellectual Property, Disclaimers, Limitation of Liability, and Governing Law)
            will continue to apply.
          </p>
        </Section>

        <Section title="12. Availability & Changes">
          <p>
            We strive for high availability but do not guarantee uninterrupted access to the Service.
            We may modify, suspend, or discontinue any part of the Service at any time with reasonable
            notice. We also reserve the right to update these Terms; continued use after changes
            constitutes acceptance.
          </p>
        </Section>

        <Section title="13. Disclaimer of Warranties">
          <p>
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS
            OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
            PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE
            ERROR-FREE OR THAT DEFECTS WILL BE CORRECTED.
          </p>
        </Section>

        <Section title="14. Limitation of Liability">
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, EMLET AND ITS AFFILIATES, OFFICERS, EMPLOYEES,
            AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
            PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE, EVEN IF ADVISED OF THE POSSIBILITY
            OF SUCH DAMAGES. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE
            TWELVE (12) MONTHS PRECEDING THE CLAIM.
          </p>
        </Section>

        <Section title="15. Indemnification">
          <p>
            You agree to indemnify and hold Emlet harmless from any claims, damages, or expenses
            (including reasonable legal fees) arising from your use of the Service, content you
            generate or send using it, or your violation of these Terms or applicable law.
          </p>
        </Section>

        <Section title="16. Governing Law">
          <p>
            These Terms are governed by and construed in accordance with the laws of India, without
            regard to its conflict of law principles. Any disputes arising under these Terms shall be
            subject to the exclusive jurisdiction of the courts located in Hyderabad, Telangana, India.
          </p>
        </Section>

        <Section title="17. General Provisions">
          <p>
            If any provision of these Terms is found unenforceable, the remaining provisions remain in
            full effect. Our failure to enforce a provision is not a waiver of it. These Terms, together
            with our Privacy Policy, constitute the entire agreement between you and Emlet regarding the
            Service. You may not assign your rights under these Terms without our consent; we may
            assign ours in connection with a merger, acquisition, or sale of assets.
          </p>
        </Section>

        <Section title="18. Contact">
          <p>
            Emlet is operated from Hyderabad, Telangana, India. If you have any questions about these
            Terms, please contact us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#00ffff] hover:underline">
              {CONTACT_EMAIL}
            </a>.
          </p>
        </Section>

      </div>
    </MarketingLayout>
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
