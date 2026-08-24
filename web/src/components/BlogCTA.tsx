import Link from 'next/link';

export default function BlogCTA({
  heading = 'Try it on your next email',
  body = "Describe the email you need in plain English and Emlet builds it, brand colors and all. Free to try, no credit card.",
}: {
  heading?: string;
  body?: string;
}) {
  return (
    <div className="not-prose rounded-2xl border border-white/10 bg-white/5 p-8 my-12 text-center">
      <p className="text-xl font-bold text-white mb-2">{heading}</p>
      <p className="text-white/60 text-sm mb-6 max-w-md mx-auto leading-relaxed">{body}</p>
      <Link
        href="/sign-up"
        className="inline-block px-6 py-3 rounded-xl bg-[#00ffff] text-black font-bold text-sm hover:shadow-lg hover:shadow-[#00ffff]/30 hover:-translate-y-px transition-all"
      >
        Generate your first email free
      </Link>
    </div>
  );
}
