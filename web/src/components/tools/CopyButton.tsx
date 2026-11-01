'use client';

import { useEffect, useRef, useState } from 'react';
import { buttonClass } from '@/components/tools/ui';

/** Plain-text copy with a fallback for browsers/contexts without the async clipboard API. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(area);
      return ok;
    } catch {
      return false;
    }
  }
}

/** Copy formatted HTML so it pastes as a styled signature/footer (e.g. into Gmail's signature box), with plain text as the fallback flavour. */
export async function copyRichHtml(html: string, plain: string): Promise<boolean> {
  try {
    if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([plain], { type: 'text/plain' }),
        }),
      ]);
      return true;
    }
  } catch {
    // fall through to the selection-based copy
  }
  try {
    const holder = document.createElement('div');
    holder.contentEditable = 'true';
    holder.style.position = 'fixed';
    holder.style.opacity = '0';
    holder.innerHTML = html;
    document.body.appendChild(holder);
    const range = document.createRange();
    range.selectNodeContents(holder);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    const ok = document.execCommand('copy');
    selection?.removeAllRanges();
    document.body.removeChild(holder);
    return ok;
  } catch {
    return false;
  }
}

interface Props {
  /** Called at click time so the copied text is always current. */
  getText: () => string;
  /** When set, copies as formatted HTML (with getText() as the plain-text version). */
  getHtml?: () => string;
  label?: string;
  className?: string;
}

export default function CopyButton({ getText, getHtml, label = 'Copy', className = buttonClass }: Props) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function onClick() {
    const ok = getHtml ? await copyRichHtml(getHtml(), getText()) : await copyText(getText());
    setState(ok ? 'copied' : 'failed');
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('idle'), 2000);
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed, select and copy manually' : label}
    </button>
  );
}
