'use client';

import { useState } from 'react';

// Mirrors the curated Phosphor icon set the AI prompt is allowed to pick from
// (see IMAGE/ICON rules in web/src/lib/ai/claude.ts) — keeps user picks and
// AI-generated icons visually consistent. Rendered via the Iconify API, same
// as the email renderer itself (web/src/lib/email/renderer.tsx renderPhosphorIcon).
const ICON_OPTIONS: Array<{ name: string; emoji: string }> = [
  { name: 'rocket', emoji: '🚀' },
  { name: 'check-circle', emoji: '✅' },
  { name: 'lightning', emoji: '⚡' },
  { name: 'chart-bar', emoji: '📊' },
  { name: 'users', emoji: '👥' },
  { name: 'shield-check', emoji: '🛡️' },
  { name: 'clock', emoji: '🕐' },
  { name: 'star', emoji: '⭐' },
  { name: 'arrow-right', emoji: '➡️' },
  { name: 'code', emoji: '💻' },
  { name: 'globe', emoji: '🌐' },
  { name: 'lock', emoji: '🔒' },
  { name: 'chat-circle', emoji: '💬' },
  { name: 'gear', emoji: '⚙️' },
  { name: 'trophy', emoji: '🏆' },
  { name: 'chart-line-up', emoji: '📈' },
  { name: 'currency-dollar', emoji: '💲' },
  { name: 'envelope', emoji: '✉️' },
  { name: 'bell', emoji: '🔔' },
  { name: 'image-square', emoji: '🖼️' },
  { name: 'device-mobile', emoji: '📱' },
  { name: 'hand-heart', emoji: '💖' },
  { name: 'leaf', emoji: '🍃' },
  { name: 'magnifying-glass', emoji: '🔍' },
  { name: 'paint-brush', emoji: '🎨' },
  { name: 'person', emoji: '🧑' },
  { name: 'planet', emoji: '🪐' },
  { name: 'plug', emoji: '🔌' },
  { name: 'question', emoji: '❓' },
  { name: 'sparkle', emoji: '✨' },
  { name: 'tag', emoji: '🏷️' },
  { name: 'target', emoji: '🎯' },
  { name: 'thumbs-up', emoji: '👍' },
  { name: 'timer', emoji: '⏱️' },
  { name: 'translate', emoji: '🌍' },
  { name: 'vault', emoji: '🔐' },
  { name: 'warning', emoji: '⚠️' },
  { name: 'wifi', emoji: '📶' },
  { name: 'wrench', emoji: '🔧' },
];

function iconifyUrl(name: string, color = '%23ffffff'): string {
  return `https://api.iconify.design/ph/${name}.svg?color=${color}`;
}

interface IconPickerProps {
  iconName?: string;
  icon?: string;
  onChange: (update: { iconName?: string; icon?: string }) => void;
}

export default function IconPicker({ iconName, icon, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        title="Choose icon"
        className="w-9 h-9 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center hover:border-white/30 transition-colors"
      >
        {iconName ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={iconifyUrl(iconName)} alt={iconName} className="w-4 h-4" />
        ) : icon ? (
          <span className="text-sm leading-none">{icon}</span>
        ) : (
          <span className="text-white/20 text-xs">—</span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1.5 z-20 w-60 max-h-64 overflow-y-auto bg-black border border-white/20 rounded-lg shadow-2xl shadow-black/50 p-2">
            <button
              type="button"
              onClick={() => { onChange({ iconName: undefined, icon: undefined }); setOpen(false); }}
              className="w-full text-left text-[11px] text-white/40 hover:text-red-400 px-1.5 py-1 mb-1 transition-colors"
            >
              No icon
            </button>
            <div className="grid grid-cols-6 gap-1">
              {ICON_OPTIONS.map(opt => (
                <button
                  key={opt.name}
                  type="button"
                  title={opt.name}
                  onClick={() => { onChange({ iconName: opt.name, icon: opt.emoji }); setOpen(false); }}
                  className={`w-8 h-8 rounded flex items-center justify-center hover:bg-white/10 transition-colors ${
                    iconName === opt.name ? 'bg-[#00ffff]/15 border border-[#00ffff]/50' : 'border border-transparent'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={iconifyUrl(opt.name)} alt={opt.name} className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
