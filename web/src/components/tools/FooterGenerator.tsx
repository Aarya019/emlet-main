'use client';

import { useMemo, useState } from 'react';
import CopyButton from '@/components/tools/CopyButton';
import { Field, Panel, SeverityBadge, buttonClass, inputClass } from '@/components/tools/ui';
import { DEFAULT_FOOTER, PLATFORMS, buildFooter, type FooterInput, type Platform } from '@/lib/tools/footer';

function ColorField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
  return (
    <Field label={label} htmlFor={id}>
      <div className="flex items-center gap-2">
        <input id={id} type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-9 w-12 cursor-pointer rounded border border-white/15 bg-transparent p-0.5" />
        <span className="text-xs tabular-nums text-white/40">{value}</span>
      </div>
    </Field>
  );
}

export default function FooterGenerator() {
  const [input, setInput] = useState<FooterInput>(DEFAULT_FOOTER);
  const [view, setView] = useState<'html' | 'text'>('html');
  const set = <K extends keyof FooterInput>(key: K, value: FooterInput[K]) => setInput((prev) => ({ ...prev, [key]: value }));

  const output = useMemo(() => buildFooter(input), [input]);
  const code = view === 'html' ? output.html : output.text;
  const previewDoc = `<!doctype html><html><body style="margin:0;background:#e5e7eb;">${output.html}</body></html>`;
  const platform = PLATFORMS.find((p) => p.id === input.platform);
  const needsOwnPreferences = input.includePreferences && (input.platform === 'custom' || platform?.preferences === '');

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <div className="space-y-6">
        <Panel title="Your business">
          <div className="space-y-4">
            <Field label="Business name" htmlFor="ft-name">
              <input id="ft-name" className={inputClass} value={input.businessName} onChange={(e) => set('businessName', e.target.value)} />
            </Field>
            <Field label="Street address or PO box" htmlFor="ft-street" hint="A real postal address where you can receive mail. If you would rather not publish your home address, a PO box or a private mailbox works.">
              <input id="ft-street" className={inputClass} value={input.street} onChange={(e) => set('street', e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="City" htmlFor="ft-city">
                <input id="ft-city" className={inputClass} value={input.city} onChange={(e) => set('city', e.target.value)} />
              </Field>
              <Field label="State / region" htmlFor="ft-region">
                <input id="ft-region" className={inputClass} value={input.region} onChange={(e) => set('region', e.target.value)} />
              </Field>
              <Field label="Postal code" htmlFor="ft-postal">
                <input id="ft-postal" className={inputClass} value={input.postal} onChange={(e) => set('postal', e.target.value)} />
              </Field>
              <Field label="Country" htmlFor="ft-country">
                <input id="ft-country" className={inputClass} value={input.country} onChange={(e) => set('country', e.target.value)} />
              </Field>
            </div>
            <Field label="Contact email" htmlFor="ft-email" hint="Optional, but people reach you instead of hitting the spam button.">
              <input id="ft-email" type="email" className={inputClass} value={input.contactEmail} onChange={(e) => set('contactEmail', e.target.value)} />
            </Field>
          </div>
        </Panel>

        <Panel title="Wording">
          <div className="space-y-4">
            <Field label="Why they are getting this" htmlFor="ft-reason">
              <textarea id="ft-reason" rows={3} className={inputClass} value={input.reason} onChange={(e) => set('reason', e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Before the link" htmlFor="ft-intro">
                <input id="ft-intro" className={inputClass} value={input.introText} onChange={(e) => set('introText', e.target.value)} />
              </Field>
              <Field label="Link text" htmlFor="ft-unsub-text">
                <input id="ft-unsub-text" className={inputClass} value={input.unsubscribeText} onChange={(e) => set('unsubscribeText', e.target.value)} />
              </Field>
            </div>
          </div>
        </Panel>

        <Panel title="Links">
          <div className="space-y-4">
            <Field label="Email platform" htmlFor="ft-platform" hint="Platforms replace their own tag with a working unsubscribe link for each person. Check your platform's docs for the current tag.">
              <select id="ft-platform" className={inputClass} value={input.platform} onChange={(e) => set('platform', e.target.value as Platform)}>
                {PLATFORMS.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </Field>
            {input.platform === 'custom' && (
              <Field label="Unsubscribe link or tag" htmlFor="ft-unsub-custom">
                <input id="ft-unsub-custom" className={inputClass} value={input.customUnsubscribe} onChange={(e) => set('customUnsubscribe', e.target.value)} placeholder="https://… or your platform's tag" />
              </Field>
            )}
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input type="checkbox" checked={input.includePreferences} onChange={(e) => set('includePreferences', e.target.checked)} />
              Add a &ldquo;Manage preferences&rdquo; link
            </label>
            {needsOwnPreferences && (
              <Field label="Preferences link or tag" htmlFor="ft-prefs">
                <input id="ft-prefs" className={inputClass} value={input.customPreferences} onChange={(e) => set('customPreferences', e.target.value)} placeholder="https://… or your platform's tag" />
              </Field>
            )}
            <Field label="Privacy policy link" htmlFor="ft-privacy" hint="Optional. Helpful if you email people in the EU or UK.">
              <input id="ft-privacy" className={inputClass} value={input.privacyUrl} onChange={(e) => set('privacyUrl', e.target.value)} placeholder="https://yoursite.com/privacy" />
            </Field>
          </div>
        </Panel>

        <Panel title="Style">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Alignment" htmlFor="ft-align">
              <select id="ft-align" className={inputClass} value={input.align} onChange={(e) => set('align', e.target.value as 'left' | 'center')}>
                <option value="center">Centered</option>
                <option value="left">Left</option>
              </select>
            </Field>
            <Field label="Text size" htmlFor="ft-size">
              <select id="ft-size" className={inputClass} value={input.fontSize} onChange={(e) => set('fontSize', Number(e.target.value))}>
                {[11, 12, 13, 14, 16].map((n) => (
                  <option key={n} value={n}>{n}px</option>
                ))}
              </select>
            </Field>
            <ColorField id="ft-text-color" label="Text colour" value={input.textColor} onChange={(v) => set('textColor', v)} />
            <ColorField id="ft-link-color" label="Link colour" value={input.linkColor} onChange={(v) => set('linkColor', v)} />
            <ColorField id="ft-bg-color" label="Background" value={input.backgroundColor} onChange={(v) => set('backgroundColor', v)} />
          </div>
        </Panel>
      </div>

      <div className="space-y-6">
        <Panel title="Preview">
          <iframe title="Footer preview" sandbox="" srcDoc={previewDoc} className="h-60 w-full rounded-lg bg-gray-200" />
        </Panel>

        <Panel title="Copy it">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <div role="tablist" aria-label="Output format" className="flex gap-1">
              {(['html', 'text'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  role="tab"
                  aria-selected={view === v}
                  onClick={() => setView(v)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${view === v ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
                >
                  {v === 'html' ? 'HTML' : 'Plain text'}
                </button>
              ))}
            </div>
            <CopyButton getText={() => code} label={view === 'html' ? 'Copy HTML' : 'Copy text'} className={`${buttonClass} ml-auto`} />
          </div>
          <textarea
            readOnly
            aria-label={view === 'html' ? 'Footer HTML' : 'Footer plain text'}
            value={code}
            rows={12}
            onFocus={(e) => e.currentTarget.select()}
            className="w-full resize-y rounded-lg border border-white/15 bg-black/50 p-3 font-mono text-xs leading-relaxed text-white/75 outline-none focus:border-primary-bright/60"
          />
          <p className="mt-2 text-xs text-white/35">
            {view === 'html'
              ? 'Paste into the HTML or code block of your email builder, near the very bottom.'
              : 'Use this in the plain-text version of your email, which many platforms ask for separately.'}
          </p>
        </Panel>

        <Panel title="Compliance check">
          <ul className="space-y-4">
            {output.checks.map((c) => (
              <li key={c.id} className="flex gap-3">
                <span className="mt-0.5 shrink-0"><SeverityBadge severity={c.severity} /></span>
                <div>
                  <p className="text-sm font-semibold text-white">{c.title}</p>
                  <p className="text-sm leading-relaxed text-white/55">{c.detail}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-white/35">
            General information, not legal advice. Rules depend on where you and your recipients are, so check the details for your situation.
          </p>
        </Panel>
      </div>
    </div>
  );
}
