import Link from 'next/link';
import type { Metadata } from 'next';
import MarketingLayout from '@/components/MarketingLayout';

export const metadata: Metadata = {
  title: 'Refund Policy | Emlet',
  description: 'Refund Policy for Emlet, the AI email design generator.',
};

const LAST_UPDATED = 'September 1, 2026';
const CONTACT_EMAIL = 'support@emlet.app';

export default function RefundsPage() {
  return (
    <MarketingLayout contentClassName="max-w-3xl">
      <div className="mb-12">
        <p className="text-xs font-semibold tracking-widest text-white/30 uppercase mb-3">Legal</p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
          Refund Policy
        </h1>
        <p className="text-white/40 text-sm">Last updated: {LAST_UPDATED}</p>
      </div>

      <div className="space-y-10 text-white/70 leading-relaxed">

        <section>
          <p>
            This page explains how refunds work for Emlet's Professional plan. It's a companion to our{' '}
            <Link href="/terms" className="text-[#00ffff] hover:underline">Terms of Service</Link>, which
            remains the governing document if the two ever conflict.
          </p>
        </section>

        <Section title="1. How billing works">
          <p>
            Emlet's Professional plan is a recurring monthly subscription, billed through Paddle.com, our
            merchant of record. Your card is charged automatically at the start of each billing period
            until you cancel.
          </p>
        </Section>

        <Section title="2. Cancelling is not the same as a refund">
          <p>
            You can cancel your subscription at any time from your account settings. Cancelling stops
            future charges, but it does not refund the period you're currently in, you keep Professional
            access until the end of the period you already paid for, then your account moves to the free
            plan. If you want money back for the current period rather than just stopping future charges,
            that's a refund request, covered below.
          </p>
        </Section>

        <Section title="3. Requesting a refund">
          <p>
            If you were charged in error, didn't mean to subscribe, or aren't happy with the Service,
            email us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#00ffff] hover:underline">{CONTACT_EMAIL}</a>{' '}
            within 7 days of the charge, with the email address on your account and the approximate
            charge date. We review requests individually and typically respond within 2 business days.
          </p>
          <p className="mt-3">
            Refunds are granted at our discretion. We're generally happy to refund a first-time or
            clearly mistaken charge; we look more closely at requests for accounts that have made heavy
            use of that billing period's Professional features (for example, generating a large number
            of emails) before asking for money back.
          </p>
        </Section>

        <Section title="4. What happens if a refund is approved">
          <p>
            Approved refunds are processed by Paddle back to your original payment method and typically
            appear within 5-10 business days, depending on your bank or card issuer. Your account is
            downgraded to the free plan as soon as the refund is issued, and any Professional-only
            content you created remains in your account but becomes subject to free-plan limits going
            forward.
          </p>
        </Section>

        <Section title="5. Chargebacks">
          <p>
            If you dispute a charge directly with your bank or card issuer (a chargeback) instead of
            contacting us first, your account will be downgraded and may be suspended while the dispute
            is resolved. We'd genuinely rather you email us first, it's faster for you and avoids any
            chargeback fees or account holds on either side.
          </p>
        </Section>

        <Section title="6. Contact">
          <p>
            Questions about a specific charge or this policy can go to{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#00ffff] hover:underline">
              {CONTACT_EMAIL}
            </a>. Emlet is operated from Hyderabad, Telangana, India.
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
