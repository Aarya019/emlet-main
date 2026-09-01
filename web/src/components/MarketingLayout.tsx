import Image from 'next/image';
import Link from 'next/link';

export default function MarketingLayout({
  children,
  sidebar,
  contentClassName = 'max-w-3xl',
}: {
  children: React.ReactNode;
  /** Optional right-hand rail (categories, recent posts, etc). When present, content renders in a 2-column layout instead of a single centered column. */
  sidebar?: React.ReactNode;
  contentClassName?: string;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Emlet" width={532} height={532} className="h-7 w-auto" />
        </Link>
        <div className="flex items-center gap-4 sm:gap-6 text-sm text-white/60">
          <Link href="/blog" className="hidden sm:inline hover:text-white transition-colors">Blog</Link>
          <Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/sign-in" className="hover:text-white transition-colors">Sign in</Link>
        </div>
      </header>

      <main className={`${sidebar ? 'max-w-6xl' : contentClassName} mx-auto px-6 py-16`}>
        {sidebar ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 xl:gap-16 items-start">
            <div className={`${contentClassName} min-w-0`}>{children}</div>
            <aside className="lg:sticky lg:top-24">{sidebar}</aside>
          </div>
        ) : (
          children
        )}
      </main>

      <footer className="border-t border-white/10 px-6 py-8 mt-8">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/60">
          <span>© {new Date().getFullYear()} Emlet. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link href="/blog" className="hover:text-white/60 transition-colors">Blog</Link>
            <Link href="/terms" className="hover:text-white/60 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy</Link>
            <Link href="/refunds" className="hover:text-white/60 transition-colors">Refunds</Link>
            <Link href="/#pricing" className="hover:text-white/60 transition-colors">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
