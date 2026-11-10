import type { ReactNode } from 'react';
import type { Severity } from '@/lib/tools/severity';

/** Shared look for the free tools' forms and panels. Presentational only (works in server and client components). */

export const inputClass =
  'w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-primary-bright/60';

export const buttonClass =
  'inline-flex items-center justify-center rounded-lg border border-white/20 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10 disabled:opacity-50';

export const primaryButtonClass =
  'inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-primary-bright/30 disabled:opacity-50';

export function Panel({ title, children, className = '' }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-white/10 bg-white/[0.04] p-5 ${className}`}>
      {title && <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-white/70">{title}</h2>}
      {children}
    </section>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/50">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-white/35">{hint}</p>}
    </div>
  );
}

const SEVERITY_STYLES: Record<Severity, string> = {
  good: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  info: 'border-white/15 bg-white/5 text-white/60',
  warn: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
  bad: 'border-red-400/30 bg-red-400/10 text-red-300',
};

const SEVERITY_LABELS: Record<Severity, string> = { good: 'Good', info: 'Note', warn: 'Check', bad: 'Fix' };

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={`inline-block rounded-md border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${SEVERITY_STYLES[severity]}`}>
      {SEVERITY_LABELS[severity]}
    </span>
  );
}
