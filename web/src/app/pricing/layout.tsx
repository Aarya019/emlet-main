import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | Emlet',
  description: 'Simple, transparent pricing for Emlet AI Email Generator. Start free and upgrade when you need more.',
  alternates: { canonical: 'https://emlet.app/pricing' },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
