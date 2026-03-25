import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found | Emlet',
};

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col overflow-hidden">

      {/* Animated neon blobs */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-gradient-to-br from-[#00ff00]/25 via-[#00ffff]/20 to-[#ff00ff]/15 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/2 -left-40 w-[420px] h-[420px] bg-gradient-to-br from-[#ff00ff]/20 via-[#00ffff]/15 to-[#00ff00]/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-40 right-1/4 w-[480px] h-[480px] bg-gradient-to-br from-[#00ffff]/20 via-[#ff00ff]/15 to-[#00ff00]/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '48px 48px' }}
      />

      {/* Twinkling stars */}
      <div className="pointer-events-none fixed inset-0 z-[1]">
        {[
          { x: 3,  y: 8,  size: 1.5, delay: 0,   dur: 4 },
          { x: 8,  y: 72, size: 1,   delay: 1.5, dur: 6 },
          { x: 14, y: 35, size: 1,   delay: 3,   dur: 5 },
          { x: 19, y: 18, size: 2,   delay: 0.5, dur: 4 },
          { x: 24, y: 55, size: 1,   delay: 2,   dur: 7 },
          { x: 29, y: 82, size: 1.5, delay: 4,   dur: 5 },
          { x: 33, y: 12, size: 1,   delay: 1,   dur: 6 },
          { x: 38, y: 43, size: 2,   delay: 2.5, dur: 4 },
          { x: 42, y: 67, size: 1,   delay: 0,   dur: 5 },
          { x: 47, y: 28, size: 1.5, delay: 3.5, dur: 6 },
          { x: 51, y: 90, size: 1,   delay: 1,   dur: 4 },
          { x: 56, y: 5,  size: 2,   delay: 2,   dur: 7 },
          { x: 61, y: 48, size: 1,   delay: 0.5, dur: 5 },
          { x: 65, y: 75, size: 1.5, delay: 3,   dur: 6 },
          { x: 70, y: 22, size: 1,   delay: 1.5, dur: 4 },
          { x: 74, y: 60, size: 2,   delay: 4,   dur: 5 },
          { x: 79, y: 38, size: 1,   delay: 0,   dur: 7 },
          { x: 83, y: 85, size: 1.5, delay: 2,   dur: 4 },
          { x: 88, y: 15, size: 1,   delay: 3,   dur: 6 },
          { x: 92, y: 52, size: 2,   delay: 1,   dur: 5 },
          { x: 96, y: 30, size: 1.5, delay: 2.5, dur: 4 },
          { x: 11, y: 45, size: 1,   delay: 4,   dur: 7 },
          { x: 17, y: 95, size: 1.5, delay: 0.5, dur: 5 },
          { x: 22, y: 62, size: 1,   delay: 2,   dur: 6 },
          { x: 36, y: 25, size: 2,   delay: 3,   dur: 4 },
          { x: 44, y: 78, size: 1,   delay: 1.5, dur: 5 },
          { x: 49, y: 15, size: 1.5, delay: 0,   dur: 7 },
          { x: 58, y: 88, size: 1,   delay: 4,   dur: 4 },
          { x: 63, y: 32, size: 2,   delay: 2,   dur: 6 },
          { x: 76, y: 58, size: 1,   delay: 0.5, dur: 5 },
          { x: 85, y: 42, size: 1.5, delay: 3.5, dur: 4 },
          { x: 90, y: 70, size: 1,   delay: 1,   dur: 7 },
          { x: 95, y: 10, size: 2,   delay: 2.5, dur: 5 },
          { x: 7,  y: 50, size: 1,   delay: 0,   dur: 6 },
          { x: 27, y: 3,  size: 1.5, delay: 2,   dur: 4 },
          { x: 53, y: 40, size: 1,   delay: 3.5, dur: 5 },
          { x: 68, y: 92, size: 2,   delay: 1,   dur: 7 },
          { x: 81, y: 20, size: 1.5, delay: 4,   dur: 4 },
          { x: 97, y: 80, size: 1,   delay: 0.5, dur: 6 },
          { x: 2,  y: 65, size: 2,   delay: 2,   dur: 5 },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              borderRadius: '50%',
              backgroundColor: 'white',
              animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-center px-4 py-3 md:grid-cols-3 md:px-6 md:py-4">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="Emlet" className="h-7 w-auto md:h-8" />
          </Link>
          <nav className="hidden items-center justify-center gap-8 text-sm text-white/70 md:flex">
            <Link href="/pricing" className="transition-colors hover:text-white">Pricing</Link>
            <Link href="/#features" className="transition-colors hover:text-white">Features</Link>
          </nav>
          <div className="flex items-center justify-end gap-3">
            <Link href="/sign-in" className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white transition-all hover:border-[#00ffff] hover:text-[#00ffff]">
              Sign in
            </Link>
            <Link href="/sign-up" className="hidden sm:block rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-black transition-all hover:shadow-lg hover:shadow-white/20 hover:-translate-y-px">
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">

        {/* Big 404 background watermark */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
          aria-hidden="true"
        >
          <span
            className="text-[clamp(180px,35vw,400px)] font-black tracking-tighter leading-none"
            style={{
              background: 'linear-gradient(135deg, #00ff00 0%, #00ffff 40%, #ff00ff 80%, #00ff00 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              opacity: 0.07,
            }}
          >
            404
          </span>
        </div>

        {/* Content */}
        <div className="animate-fade-in flex flex-col items-center">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#00ff00]/10 border border-[#00ff00]/30 px-3 py-0.5 text-xs font-semibold text-[#00ff00] tracking-wide uppercase mb-6">
            Error 404
          </span>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-none mb-6">
            Page not found
          </h1>

          <p className="text-white/50 text-lg max-w-sm mb-10 leading-relaxed">
            This page doesn&apos;t exist or was moved. Nothing to see here.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/"
              className="rounded-full bg-white px-7 py-2.5 text-sm font-semibold text-black transition-all hover:shadow-[0_0_24px_rgba(255,255,255,0.25)] hover:-translate-y-px"
            >
              Go home
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-white/20 px-7 py-2.5 text-sm text-white transition-all hover:border-[#00ffff] hover:text-[#00ffff] hover:shadow-[0_0_16px_rgba(0,255,255,0.15)]"
            >
              Open dashboard
            </Link>
          </div>
        </div>
      </main>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />
    </div>
  );
}
