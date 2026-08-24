'use client';

import { useMemo } from 'react';
import type { GeneratedEmail } from '@/lib/ai/claude';
import { runEmailChecklist, type CheckStatus, type ResolvedColors } from '@/lib/email/checklist';

interface EmailVerifyModalProps {
  email: GeneratedEmail;
  colors: ResolvedColors;
  htmlCode: string | null;
  onClose: () => void;
}

const STATUS_STYLES: Record<CheckStatus, { dot: string; text: string; label: string }> = {
  fail: { dot: 'bg-red-400', text: 'text-red-400', label: 'Fix' },
  warn: { dot: 'bg-yellow-400', text: 'text-yellow-400', label: 'Warning' },
  pass: { dot: 'bg-[#00ff80]', text: 'text-[#00ff80]', label: 'Pass' },
};

export default function EmailVerifyModal({ email, colors, htmlCode, onClose }: EmailVerifyModalProps) {
  const categories = useMemo(() => runEmailChecklist(email, colors, htmlCode), [email, colors, htmlCode]);

  const allChecks = categories.flatMap((c) => c.checks);
  const failCount = allChecks.filter((c) => c.status === 'fail').length;
  const warnCount = allChecks.filter((c) => c.status === 'warn').length;
  const passCount = allChecks.filter((c) => c.status === 'pass').length;

  return (
    <>
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm z-10 animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="absolute inset-0 z-20 flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-full max-w-lg max-h-[85vh] flex flex-col bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10 flex-shrink-0">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00ffff] to-[#00ff80] flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Verify Email
            </h3>
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Summary */}
          <div className="flex items-center gap-4 px-6 py-3 border-b border-white/10 flex-shrink-0 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> {failCount} to fix
            </span>
            <span className="flex items-center gap-1.5 text-yellow-400">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" /> {warnCount} warning{warnCount === 1 ? '' : 's'}
            </span>
            <span className="flex items-center gap-1.5 text-[#00ff80]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff80]" /> {passCount} passed
            </span>
          </div>

          {/* Body */}
          <div className="overflow-y-auto px-6 py-4 space-y-5">
            {categories.map((category) => (
              <div key={category.name}>
                <h4 className="text-xs font-bold uppercase tracking-wide text-white/40 mb-2">{category.name}</h4>
                <div className="space-y-2.5">
                  {category.checks.map((check) => {
                    const style = STATUS_STYLES[check.status];
                    return (
                      <div key={check.id} className="flex gap-2.5">
                        <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${style.dot}`} />
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-white">{check.label}</div>
                          <div className="text-xs text-white/50 leading-relaxed">{check.message}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/10 flex-shrink-0">
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
