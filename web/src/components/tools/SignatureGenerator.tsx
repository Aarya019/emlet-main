'use client';

import { useMemo, useState } from 'react';
import CopyButton from '@/components/tools/CopyButton';
import { Field, Panel, buttonClass, inputClass, primaryButtonClass } from '@/components/tools/ui';
import {
  DEFAULT_SIGNATURE,
  FONT_STACKS,
  buildSignature,
  type SignatureFont,
  type SignatureInput,
  type SignatureLayout,
} from '@/lib/tools/signature';

const LAYOUTS: { id: SignatureLayout; label: string; hint: string }[] = [
  { id: 'classic', label: 'Classic', hint: 'Photo on the left, accent line, details on the right' },
  { id: 'stacked', label: 'Stacked', hint: 'Photo on top, details underneath' },
  { id: 'minimal', label: 'Minimal', hint: 'Text only, no photo' },
];

export default function SignatureGenerator() {
  const [input, setInput] = useState<SignatureInput>(DEFAULT_SIGNATURE);
  const set = <K extends keyof SignatureInput>(key: K, value: SignatureInput[K]) => setInput((prev) => ({ ...prev, [key]: value }));
  const output = useMemo(() => buildSignature(input), [input]);
  const previewDoc = `<!doctype html><html><body style="margin:0;padding:24px;background:#ffffff;">${output.html}</body></html>`;

  const text = (id: string, label: string, key: keyof SignatureInput, placeholder?: string, hint?: string) => (
    <Field label={label} htmlFor={id} hint={hint}>
      <input id={id} className={inputClass} value={String(input[key])} onChange={(e) => set(key, e.target.value as never)} placeholder={placeholder} />
    </Field>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <div className="space-y-6">
        <Panel title="Layout">
          <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Signature layout">
            {LAYOUTS.map((l) => (
              <button
                key={l.id}
                type="button"
                role="radio"
                aria-checked={input.layout === l.id}
                onClick={() => set('layout', l.id)}
                className={`rounded-xl border p-3 text-left transition-colors ${
                  input.layout === l.id ? 'border-[#00ffff]/70 bg-[#00ffff]/10' : 'border-white/15 hover:border-white/35'
                }`}
              >
                <span className="block text-sm font-bold text-white">{l.label}</span>
                <span className="mt-1 block text-xs leading-snug text-white/45">{l.hint}</span>
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="Your details">
          <div className="space-y-4">
            {text('sg-name', 'Name', 'name')}
            <div className="grid grid-cols-2 gap-4">
              {text('sg-title', 'Job title', 'title')}
              {text('sg-company', 'Company', 'company')}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {text('sg-phone', 'Phone', 'phone')}
              {text('sg-email', 'Email', 'email')}
            </div>
            {text('sg-website', 'Website', 'website', 'yoursite.com')}
            {text('sg-address', 'Address or tagline', 'address', 'Optional')}
          </div>
        </Panel>

        <Panel title="Photo or logo">
          <div className="space-y-4">
            {text(
              'sg-image',
              'Image link',
              'imageUrl',
              'https://…/photo.jpg',
              'Emails link to images rather than carrying them, so use the web address of a picture you have already uploaded (your website, or a service that gives you a public link). Square pictures work best.',
            )}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Shape" htmlFor="sg-shape">
                <select id="sg-shape" className={inputClass} value={input.imageShape} onChange={(e) => set('imageShape', e.target.value as 'round' | 'square')}>
                  <option value="round">Round</option>
                  <option value="square">Square</option>
                </select>
              </Field>
              <Field label={`Size: ${input.imageSize}px`} htmlFor="sg-size">
                <input id="sg-size" type="range" min={48} max={140} step={4} value={input.imageSize} onChange={(e) => set('imageSize', Number(e.target.value))} className="w-full" />
              </Field>
            </div>
          </div>
        </Panel>

        <Panel title="Social links">
          <div className="grid grid-cols-2 gap-4">
            {text('sg-linkedin', 'LinkedIn', 'linkedin', 'username or link')}
            {text('sg-x', 'X', 'twitter', '@handle or link')}
            {text('sg-instagram', 'Instagram', 'instagram', '@handle or link')}
            {text('sg-github', 'GitHub', 'github', 'username or link')}
          </div>
        </Panel>

        <Panel title="Style">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Font" htmlFor="sg-font">
              <select id="sg-font" className={inputClass} value={input.font} onChange={(e) => set('font', e.target.value as SignatureFont)}>
                {(Object.keys(FONT_STACKS) as SignatureFont[]).map((f) => (
                  <option key={f} value={f}>{FONT_STACKS[f].label}</option>
                ))}
              </select>
            </Field>
            <Field label="Text size" htmlFor="sg-fontsize">
              <select id="sg-fontsize" className={inputClass} value={input.fontSize} onChange={(e) => set('fontSize', Number(e.target.value))}>
                {[12, 13, 14, 15, 16].map((n) => (
                  <option key={n} value={n}>{n}px</option>
                ))}
              </select>
            </Field>
            <Field label="Accent colour" htmlFor="sg-accent">
              <input id="sg-accent" type="color" value={input.accentColor} onChange={(e) => set('accentColor', e.target.value)} className="h-9 w-full cursor-pointer rounded border border-white/15 bg-transparent p-0.5" />
            </Field>
            <Field label="Text colour" htmlFor="sg-ink">
              <input id="sg-ink" type="color" value={input.textColor} onChange={(e) => set('textColor', e.target.value)} className="h-9 w-full cursor-pointer rounded border border-white/15 bg-transparent p-0.5" />
            </Field>
          </div>
          <label className="mt-5 flex items-start gap-2 text-sm text-white/60">
            <input type="checkbox" className="mt-1" checked={input.attribution} onChange={(e) => set('attribution', e.target.checked)} />
            <span>Add a small &ldquo;Made with Emlet&rdquo; link. Untick it any time, it is just a way of saying thanks.</span>
          </label>
        </Panel>
      </div>

      <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <Panel title="Preview">
          <iframe title="Signature preview" sandbox="" srcDoc={previewDoc} className="h-72 w-full rounded-lg bg-white" />
          {output.warnings.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm text-amber-300">
              {output.warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-xs leading-relaxed text-white/35">
            Round photos show as squares in some versions of Outlook for Windows. Everything else is built to display consistently in Gmail, Outlook and Apple Mail.
          </p>
        </Panel>

        <Panel title="Use it">
          <div className="mb-4 flex flex-wrap gap-2">
            <CopyButton getText={() => output.text} getHtml={() => output.html} label="Copy signature" className={primaryButtonClass} />
            <CopyButton getText={() => output.html} label="Copy HTML code" className={buttonClass} />
          </div>
          <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-white/60">
            <li>Press <strong className="text-white/80">Copy signature</strong>.</li>
            <li>
              Open your email app&apos;s signature settings and paste into the signature box.
              <ul className="mt-1 list-disc space-y-1 pl-5 text-white/45">
                <li>Gmail: Settings, See all settings, General, Signature</li>
                <li>Outlook (new): Settings, Accounts, Signatures. Outlook (classic): File, Options, Mail, Signatures</li>
                <li>Apple Mail: Mail, Settings, Signatures</li>
              </ul>
            </li>
            <li>Save, then send yourself a test and check it on your phone.</li>
          </ol>
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-semibold text-white/70 hover:text-white">Show the HTML</summary>
            <textarea
              readOnly
              aria-label="Signature HTML"
              value={output.html}
              rows={10}
              onFocus={(e) => e.currentTarget.select()}
              className="mt-3 w-full resize-y rounded-lg border border-white/15 bg-black/50 p-3 font-mono text-xs leading-relaxed text-white/75 outline-none focus:border-[#00ffff]/60"
            />
          </details>
        </Panel>
      </div>
    </div>
  );
}
