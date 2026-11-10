'use client';

import { useState } from 'react';

type Mode = 'image' | 'desktop' | 'mobile';

interface Props {
  slug: string;
  title: string;
  /** Static screenshot of the whole email. Shown first, so the page paints without an iframe. */
  imageSrc: string | null;
  imageWidth: number;
  imageHeight: number;
}

/**
 * Static screenshot by default; the live HTML (desktop / mobile width) is fetched only when the visitor
 * asks for it, so the heavy part never loads for people who just look.
 */
export default function TemplateLivePreview({ slug, title, imageSrc, imageWidth, imageHeight }: Props) {
  const [mode, setMode] = useState<Mode>('image');
  const [html, setHtml] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  async function choose(next: Mode) {
    setMode(next);
    if (next === 'image' || html || failed) return;
    try {
      const res = await fetch(`/templates/${slug}/preview`);
      if (!res.ok) throw new Error(String(res.status));
      setHtml(await res.text());
    } catch {
      setFailed(true);
      setMode('image');
    }
  }

  const tab = (value: Mode, label: string) => (
    <button
      type="button"
      onClick={() => choose(value)}
      aria-pressed={mode === value}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
        mode === value ? 'bg-white text-black' : 'text-white/60 hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div className="flex items-center gap-1 mb-4">
        {imageSrc && tab('image', 'Preview')}
        {tab('desktop', 'Live desktop')}
        {tab('mobile', 'Live mobile')}
        {failed && <span className="ml-3 text-xs text-red-400">Live preview is unavailable right now.</span>}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-5">
        {mode === 'image' && imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={`${title}: full email preview`}
            width={imageWidth}
            height={imageHeight}
            fetchPriority="high"
            decoding="async"
            className="mx-auto h-auto w-full max-w-[600px] rounded-lg"
          />
        ) : mode === 'image' ? (
          <p className="py-16 text-center text-sm text-white/40">Preview image coming soon.</p>
        ) : html ? (
          <iframe
            title={`${title}: live ${mode} preview`}
            srcDoc={html}
            sandbox=""
            className="mx-auto block h-[720px] w-full rounded-lg bg-pure-white"
            style={{ maxWidth: mode === 'mobile' ? 375 : 640 }}
          />
        ) : (
          <p className="py-16 text-center text-sm text-white/40">Loading live preview...</p>
        )}
      </div>
    </div>
  );
}
