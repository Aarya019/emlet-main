'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { TOOLS, toolUrl } from '@/lib/content/tools';

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

/**
 * Header "Tools" item with a dropdown listing every tool (no separate page to click through).
 * A mouse opens it on hover; touch, keyboard and click toggle it. It closes on Escape, on an outside
 * press, when focus leaves it and when a tool is chosen. Inherits its text colour from the nav it sits in.
 */
export default function ToolsMenu({ className = '' }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastPointer = useRef<string>('mouse');

  useEffect(() => {
    if (!open) return;
    const onPress = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener('pointerdown', onPress);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPress);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      onPointerEnter={(e) => {
        lastPointer.current = e.pointerType;
        if (e.pointerType === 'mouse') setOpen(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') setOpen(false);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="tools-menu"
        onPointerDown={(e) => { lastPointer.current = e.pointerType; }}
        onClick={(e) => {
          // A mouse click on a menu the hover already opened keeps it open; keyboard (detail 0) and touch toggle.
          if (lastPointer.current === 'mouse' && e.detail > 0) setOpen(true);
          else setOpen((o) => !o);
        }}
        className={`inline-flex items-center gap-1 transition-colors hover:text-white ${open ? 'text-white' : ''}`}
      >
        Tools
        <Chevron open={open} />
      </button>

      {open && (
        // The top padding bridges the gap between the button and the panel, so moving the mouse down does not close it.
        <div id="tools-menu" className="absolute left-1/2 top-full z-50 w-[22rem] max-w-[calc(100vw-2rem)] -translate-x-1/2 pt-3">
          <div className="rounded-2xl border border-white/10 bg-surface p-2 shadow-xl">
            {TOOLS.map((tool) => (
              <Link
                key={tool.slug}
                href={toolUrl(tool.slug)}
                onClick={() => setOpen(false)}
                className="block whitespace-normal rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/5 focus-visible:bg-white/5"
              >
                <span className="block text-sm font-semibold text-white">{tool.name}</span>
                <span className="mt-0.5 line-clamp-2 block text-xs leading-snug text-white/60">{tool.tagline}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** The same list for a mobile drawer: a row that expands in place. */
export function MobileToolsMenu({ onNavigate }: { onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="tools-menu-mobile"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
      >
        Tools
        <Chevron open={open} />
      </button>
      {open && (
        <div id="tools-menu-mobile" className="ml-3 flex flex-col border-l border-white/10 pl-2">
          {TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={toolUrl(tool.slug)}
              onClick={onNavigate}
              className="rounded-lg px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              {tool.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
