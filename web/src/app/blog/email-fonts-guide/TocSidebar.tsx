'use client';

import { useState, useEffect } from 'react';

interface TocItem {
  id: string;
  label: string;
}

export default function TocSidebar({ toc }: { toc: TocItem[] }) {
  const [open, setOpen] = useState(true);
  const [activeId, setActiveId] = useState<string>('');

  // Highlight the section currently in view
  useEffect(() => {
    const headings = toc.map(({ id }) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          // pick the topmost visible heading
          const topEntry = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
          );
          setActiveId((topEntry.target as HTMLElement).id);
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 },
    );

    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [toc]);

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24">
        {/* Header row with toggle */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center justify-between w-full group mb-3 py-1"
          aria-expanded={open}
          aria-label={open ? 'Collapse table of contents' : 'Expand table of contents'}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-white/30 group-hover:text-white/50 transition-colors">
            On this page
          </span>
          {/* Chevron — rotates to point right when collapsed */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-white/25 group-hover:text-white/50 transition-all duration-200 flex-shrink-0 ${open ? 'rotate-0' : '-rotate-90'}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {/* Collapsible nav */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            open ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="space-y-0.5 border-l border-white/8">
            {toc.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className={`block text-sm leading-snug px-3 py-1.5 transition-all hover:text-white/90 border-l-2 -ml-px ${
                  activeId === id
                    ? 'text-[#00ffff] border-[#00ffff]'
                    : 'text-white/40 border-transparent hover:border-white/25'
                }`}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
