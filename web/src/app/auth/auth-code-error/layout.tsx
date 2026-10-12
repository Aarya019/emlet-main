import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Link Expired | Emlet',
  robots: { index: false, follow: false },
};

export default function AuthCodeErrorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
