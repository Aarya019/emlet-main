import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <ThemeToggle className="fixed right-4 top-4 z-30" />
      <div className="max-w-md w-full p-8 rounded-xl border border-white/10 bg-white/5 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Page not found</h2>
        <p className="text-white/50 mb-6">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-full bg-primary text-on-primary font-semibold hover:bg-primary-bright/80 transition-all"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
