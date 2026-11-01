'use client';

import { useMemo, useState } from 'react';
import { Field, Panel, SeverityBadge, buttonClass, inputClass, primaryButtonClass } from '@/components/tools/ui';
import { analyzePreview, analyzeSubject, summarizeAlternative } from '@/lib/tools/subject-line';
import { startGenerating } from '@/lib/start-generating';

const EXAMPLE = {
  sender: 'Groove Street Records',
  subject: 'The Sunday drop: 12 new arrivals and 3 rare pressings',
  preview: 'Plus a listening night this Friday. Doors at 7, 40 seats, no phones.',
  alternatives: 'New arrivals are in\nThis Sunday: 12 new records, 3 you will not see again\nYour first pick of Sunday’s arrivals',
};

const MAX_ALTERNATIVES = 8;

function Text({ children, muted }: { children: string; muted?: boolean }) {
  return <span className={muted ? 'text-gray-500' : undefined}>{children}</span>;
}

/** Approximate inbox rows. Truncation is real CSS ellipsis at a typical width, so you see what gets cut. */
function InboxRows({ sender, subject, preview }: { sender: string; subject: string; preview: string }) {
  const from = sender.trim() || 'Sender name';
  const subj = subject.trim();
  const prev = preview.trim();
  const initial = from.charAt(0).toUpperCase();
  const subjectText = subj || '(no subject)';

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">Desktop inbox</p>
        <div className="overflow-hidden rounded-lg bg-pure-white text-[13px] text-gray-900">
          <div className="flex items-center gap-3 px-3 py-2.5">
            <span aria-hidden className="h-3.5 w-3.5 shrink-0 rounded-sm border border-gray-300" />
            <span className="w-32 shrink-0 truncate font-bold sm:w-44">{from}</span>
            <span className="min-w-0 flex-1 truncate">
              <span className={`font-bold ${subj ? '' : 'italic text-gray-500'}`}>{subjectText}</span>
              {prev && <Text muted>{` - ${prev}`}</Text>}
            </span>
            <span className="shrink-0 text-xs text-gray-500">10:42 AM</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">Android-style phone</p>
          <div className="mx-auto w-full max-w-[340px] rounded-xl bg-pure-white p-3 text-gray-900">
            <div className="flex gap-3">
              <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-pure-white">{initial}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm font-bold">{from}</span>
                  <span className="shrink-0 text-[11px] text-gray-500">10:42</span>
                </div>
                <p className={`truncate text-[13px] font-medium ${subj ? '' : 'italic text-gray-500'}`}>{subjectText}</p>
                <p className="truncate text-[13px] text-gray-500">{prev || ' '}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">iPhone-style mail</p>
          <div className="mx-auto w-full max-w-[340px] rounded-xl bg-pure-white p-3 text-gray-900">
            <div className="flex gap-2">
              <span aria-hidden className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-[15px] font-bold">{from}</span>
                  <span className="shrink-0 text-xs text-gray-500">10:42</span>
                </div>
                <p className={`truncate text-[14px] ${subj ? '' : 'italic text-gray-500'}`}>{subjectText}</p>
                <p className="line-clamp-2 text-[14px] leading-snug text-gray-500">{prev || ' '}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-white/35">
        Approximate. Real widths depend on the device, app, font size and settings, so treat this as a guide rather than a guarantee.
      </p>
    </div>
  );
}

export default function SubjectLineTester() {
  const [sender, setSender] = useState(EXAMPLE.sender);
  const [subject, setSubject] = useState(EXAMPLE.subject);
  const [preview, setPreview] = useState(EXAMPLE.preview);
  const [alternatives, setAlternatives] = useState(EXAMPLE.alternatives);

  const subjectResult = useMemo(() => analyzeSubject(subject), [subject]);
  const previewResult = useMemo(() => analyzePreview(preview, subject), [preview, subject]);
  const altRows = useMemo(
    () =>
      alternatives
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
        .slice(0, MAX_ALTERNATIVES)
        .map(summarizeAlternative),
    [alternatives],
  );

  const prompt = `Write an email from ${sender.trim() || 'my brand'} with the subject line "${subject.trim()}"${
    preview.trim() ? ` and the preview text "${preview.trim()}"` : ''
  }. Make the body deliver on that subject line.`;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
      <div className="space-y-6">
        <Panel title="Your email">
          <div className="space-y-4">
            <Field label="From name" htmlFor="sl-sender" hint="People see this before the subject. A real name or a brand they know usually beats a no-reply address.">
              <input id="sl-sender" className={inputClass} value={sender} onChange={(e) => setSender(e.target.value)} placeholder="Your brand or name" />
            </Field>
            <Field label="Subject line" htmlFor="sl-subject">
              <input id="sl-subject" className={inputClass} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="What is this email about?" />
              <p className="mt-1.5 text-xs text-white/35">
                {subjectResult.chars} characters · {subjectResult.words} {subjectResult.words === 1 ? 'word' : 'words'}
              </p>
            </Field>
            <Field label="Preview text" htmlFor="sl-preview">
              <input id="sl-preview" className={inputClass} value={preview} onChange={(e) => setPreview(e.target.value)} placeholder="The line of text shown after the subject" />
              <p className="mt-1.5 text-xs text-white/35">{previewResult.chars} characters</p>
            </Field>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={buttonClass} onClick={() => { setSender(''); setSubject(''); setPreview(''); setAlternatives(''); }}>
                Clear
              </button>
              <button
                type="button"
                className={buttonClass}
                onClick={() => { setSender(EXAMPLE.sender); setSubject(EXAMPLE.subject); setPreview(EXAMPLE.preview); setAlternatives(EXAMPLE.alternatives); }}
              >
                Reset example
              </button>
            </div>
          </div>
        </Panel>

        <Panel title="Compare other subject lines">
          <Field label="One per line" htmlFor="sl-alts" hint={`Up to ${MAX_ALTERNATIVES}. Handy for choosing between two or three ideas before you send.`}>
            <textarea id="sl-alts" rows={5} className={inputClass} value={alternatives} onChange={(e) => setAlternatives(e.target.value)} placeholder={'Another idea\nAnd another'} />
          </Field>
        </Panel>
      </div>

      <div className="space-y-6">
        <Panel title="How it looks in an inbox">
          <InboxRows sender={sender} subject={subject} preview={preview} />
        </Panel>

        <Panel title="Checks">
          {!subject.trim() && !preview.trim() ? (
            <p className="text-sm text-white/45">Type a subject line to see feedback.</p>
          ) : (
            <ul className="space-y-4">
              {[...subjectResult.findings, ...previewResult.findings].map((f) => (
                <li key={f.id} className="flex gap-3">
                  <span className="mt-0.5 shrink-0"><SeverityBadge severity={f.severity} /></span>
                  <div>
                    <p className="text-sm font-semibold text-white">{f.title}</p>
                    <p className="text-sm leading-relaxed text-white/55">{f.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-white/35">
            These are guidelines. Whether an email reaches the inbox depends mostly on your sender reputation and email authentication, not on any single word.
          </p>
        </Panel>

        {altRows.length > 0 && (
          <Panel title="Comparison">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-white/40">
                    <th className="pb-2 pr-3 font-semibold">Subject line</th>
                    <th className="pb-2 pr-3 font-semibold">Chars</th>
                    <th className="pb-2 pr-3 font-semibold">To check</th>
                    <th className="pb-2" />
                  </tr>
                </thead>
                <tbody>
                  {altRows.map((row) => (
                    <tr key={row.subject} className="border-b border-white/5 align-top">
                      <td className="py-2.5 pr-3 text-white/80">{row.subject}</td>
                      <td className="py-2.5 pr-3 tabular-nums text-white/60">{row.chars}</td>
                      <td className="py-2.5 pr-3 text-white/50">{row.flags.length > 0 ? row.flags.join('; ') : 'Nothing flagged'}</td>
                      <td className="py-2.5 text-right">
                        <button type="button" onClick={() => setSubject(row.subject)} className="text-xs font-semibold text-neon-ink hover:underline">
                          Use
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button type="button" disabled={!subject.trim()} onClick={() => void startGenerating(prompt)} className={primaryButtonClass}>
            Write this email with Emlet
          </button>
          <span className="text-xs text-white/35">Free account, 5 AI actions a month.</span>
        </div>
      </div>
    </div>
  );
}
