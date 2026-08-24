import Link from 'next/link';

export default function MarketingLayout({
  children,
  contentClassName = 'max-w-3xl',
}: {
  children: React.ReactNode;
  contentClassName?: string;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-black tracking-tight">
          <span className="bg-gradient-to-r from-[#00ffff] to-[#00ff00] bg-clip-text text-transparent">
            emlet
          </span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-6 text-sm text-white/60">
          <Link href="/blog" className="hidden sm:inline hover:text-white transition-colors">Blog</Link>
          <Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/sign-in" className="hover:text-white transition-colors">Sign in</Link>
        </div>
      </div>

      <div className={`${contentClassName} mx-auto px-6 py-16`}>
        {children}
      </div>

      <footer className="border-t border-white/10 px-6 py-8 mt-8">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/30">
          <span>© {new Date().getFullYear()} Emlet. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link href="/blog" className="hover:text-white/60 transition-colors">Blog</Link>
            <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link href="/#pricing" className="hover:text-white/60 transition-colors">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
