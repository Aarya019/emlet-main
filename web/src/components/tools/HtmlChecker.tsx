'use client';

import { useDeferredValue, useMemo, useRef, useState } from 'react';
import CopyButton from '@/components/tools/CopyButton';
import { Panel, SeverityBadge, buttonClass, inputClass, primaryButtonClass } from '@/components/tools/ui';
import { SAMPLE_BROKEN_EMAIL, checkEmailHtml } from '@/lib/tools/html-checker';
import { inlineCss, type InlineResult } from '@/lib/tools/inline-css';

const MAX_BYTES = 2_000_000;

export default function HtmlChecker() {
  const [html, setHtml] = useState('');
  const [inlined, setInlined] = useState<InlineResult | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  // Typing or pasting into a big textarea should stay snappy, so the analysis trails the input slightly.
  const deferred = useDeferredValue(html);
  const result = useMemo(() => checkEmailHtml(deferred), [deferred]);

  const counts = useMemo(() => {
    const c = { bad: 0, warn: 0, info: 0 };
    for (const f of result.findings) if (f.severity in c) c[f.severity as keyof typeof c]++;
    return c;
  }, [result]);

  function update(next: string) {
    setHtml(next);
    setInlined(null);
    setMessage(null);
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    if (file.size > MAX_BYTES) {
      setMessage('That file is over 2 MB, which is far past what an email can be. Check what is in it.');
      return;
    }
    update(await file.text());
  }

  function runInline() {
    setMessage(null);
    try {
      setInlined(inlineCss(html));
    } catch {
      setInlined(null);
      setMessage('Something in that HTML could not be processed, so nothing was changed. Check that it is complete HTML.');
    }
  }

  return (
    <div className="space-y-6">
      <Panel title="Your email HTML">
        <label htmlFor="hc-input" className="sr-only">Email HTML</label>
        <textarea
          id="hc-input"
          rows={14}
          spellCheck={false}
          className={`${inputClass} font-mono text-xs leading-relaxed`}
          placeholder="Paste the full HTML of your email here, or choose a file."
          value={html}
          onChange={(e) => update(e.target.value.slice(0, MAX_BYTES))}
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button type="button" className={primaryButtonClass} disabled={!html.trim()} onClick={runInline}>
            Inline CSS
          </button>
          <button type="button" className={buttonClass} onClick={() => update(SAMPLE_BROKEN_EMAIL)}>
            Try a broken example
          </button>
          <button type="button" className={buttonClass} onClick={() => fileInput.current?.click()}>
            Choose a .html file
          </button>
          <input ref={fileInput} type="file" accept=".html,.htm,text/html" className="hidden" onChange={(e) => { void onFile(e.target.files?.[0]); e.target.value = ''; }} />
          {html && (
            <button type="button" className={buttonClass} onClick={() => update('')}>
              Clear
            </button>
          )}
          <span className="ml-auto text-xs text-white/35">Checked in your browser. Nothing is uploaded.</span>
        </div>
        {message && <p role="status" className="mt-3 text-sm text-amber-300">{message}</p>}
      </Panel>

      {inlined && (
        <Panel title="Inlined HTML">
          <p className="mb-3 text-sm text-white/65">
            {inlined.rulesInlined > 0
              ? `Wrote ${inlined.rulesInlined} ${inlined.rulesInlined === 1 ? 'rule' : 'rules'} onto ${inlined.elementsStyled} ${inlined.elementsStyled === 1 ? 'element' : 'elements'}.`
              : 'Nothing needed inlining.'}
          </p>
          {inlined.notes.length > 0 && (
            <ul className="mb-3 list-disc space-y-1 pl-5 text-sm text-white/50">
              {inlined.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          )}
          <textarea
            readOnly
            aria-label="Inlined HTML"
            rows={12}
            value={inlined.html}
            onFocus={(e) => e.currentTarget.select()}
            className="w-full resize-y rounded-lg border border-white/15 bg-black/50 p-3 font-mono text-xs leading-relaxed text-white/75 outline-none focus:border-primary-bright/60"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <CopyButton getText={() => inlined.html} label="Copy inlined HTML" className={primaryButtonClass} />
            <button type="button" className={buttonClass} onClick={() => update(inlined.html)}>
              Check this version
            </button>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-white/35">
            This copies each rule onto the elements it matches. It does not add Outlook-specific extras (such as VML or width and bgcolor attributes), so keep your original too and test the result.
          </p>
        </Panel>
      )}

      <Panel title="What the checker found">
        {!html.trim() ? (
          <p className="text-sm text-white/45">Paste your email HTML above to see what might break in Gmail and Outlook, or try the broken example.</p>
        ) : (
          <>
            <p className="mb-5 text-sm text-white/60">
              <strong className="text-red-300">{counts.bad}</strong> to fix · <strong className="text-amber-300">{counts.warn}</strong> to check ·{' '}
              <strong className="text-white/80">{counts.info}</strong> {counts.info === 1 ? 'note' : 'notes'}
              <span className="text-white/35">
                {' '}
                · {Math.round(result.stats.bytes / 1024)} KB, {result.stats.images} {result.stats.images === 1 ? 'image' : 'images'}, {result.stats.links} {result.stats.links === 1 ? 'link' : 'links'}
              </span>
            </p>

            {result.findings.length === 0 ? (
              <p className="text-sm text-emerald-300">Nothing flagged. Still send yourself a test in a couple of real inboxes.</p>
            ) : (
              <ul className="space-y-5">
                {result.findings.map((f) => (
                  <li key={f.id} className="flex gap-3">
                    <span className="mt-0.5 shrink-0"><SeverityBadge severity={f.severity} /></span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">{f.title}</p>
                      <p className="text-sm leading-relaxed text-white/55">{f.detail}</p>
                      <p className="mt-1 text-xs text-white/40"><span className="font-semibold text-white/55">Affects:</span> {f.clients}</p>
                      <p className="text-sm text-white/70"><span className="font-semibold text-primary/80">Fix:</span> {f.fix}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {result.passed.length > 0 && (
              <details className="mt-6 border-t border-white/10 pt-4">
                <summary className="cursor-pointer text-sm font-semibold text-white/60 hover:text-white">
                  {result.passed.length} {result.passed.length === 1 ? 'check' : 'checks'} passed
                </summary>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-white/45">
                  {result.passed.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </details>
            )}
          </>
        )}
        <p className="mt-6 border-t border-white/10 pt-4 text-xs leading-relaxed text-white/35">
          This reads your HTML as text and flags common risks. It cannot render each email app, so use it as a checklist and still send yourself a test.
        </p>
      </Panel>
    </div>
  );
}
