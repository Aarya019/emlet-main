'use client';

import type { BorderOverride, FrameOverride } from '@/lib/ai/claude';

type Value = BorderOverride & Partial<FrameOverride>;

interface BorderControlsProps {
  value: Value | undefined;
  /** Called with the next value, or undefined when everything is back to the style default. */
  onChange: (next: Value | undefined) => void;
  /** Block-level only: offer the "draw around the whole block" checkbox. */
  allowOutline?: boolean;
  /** Frame-level only: offer the top accent bar controls. */
  allowAccentBar?: boolean;
  /** Block-level only: copy these settings to every block. */
  onApplyToAll?: () => void;
}

const inputCls =
  'px-1.5 py-1 bg-white/5 border border-white/10 rounded text-white text-[11px] font-mono focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20';
const labelCls = 'block text-[10px] text-white/30 mb-1 uppercase tracking-wider';

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex rounded border border-white/10 overflow-hidden">
      {options.map(o => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`px-2.5 py-1 text-[11px] transition-colors ${
            value === o.value ? 'bg-[#00ffff]/15 text-[#00ffff]' : 'text-white/50 hover:text-white/80 hover:bg-white/5'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function ColorField({ value, fallback, onChange }: { value: string | undefined; fallback: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-1.5">
      <input
        type="color"
        value={/^#[0-9a-f]{6}$/i.test(value || '') ? value : fallback}
        onChange={e => onChange(e.target.value)}
        className="w-7 h-7 rounded cursor-pointer border border-white/20 bg-transparent p-0.5 flex-shrink-0"
      />
      <input
        type="text"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        className={`${inputCls} flex-1 min-w-0`}
        placeholder={fallback}
      />
    </div>
  );
}

function NumberField({
  value,
  min,
  max,
  placeholder,
  onChange,
}: {
  value: number | undefined;
  min: number;
  max: number;
  placeholder: string;
  onChange: (v: number | undefined) => void;
}) {
  return (
    <input
      type="number"
      min={min}
      max={max}
      value={value ?? ''}
      placeholder={placeholder}
      onChange={e => {
        if (e.target.value === '') return onChange(undefined);
        const n = Number(e.target.value);
        if (!Number.isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
      }}
      className={`${inputCls} w-full`}
    />
  );
}

/**
 * Border / corner / shadow controls shared by the per-block "Borders & effects"
 * group and the email-level frame group. Every choice is an override on top of
 * the design style: "Style default" always means "whatever brutalist/cyberpunk/
 * etc. would draw", so nothing here is locked in by the style.
 */
export default function BorderControls({ value, onChange, allowOutline, allowAccentBar, onApplyToAll }: BorderControlsProps) {
  const v: Value = value ?? {};
  const mode = v.mode ?? 'default';
  const shadowMode = v.shadowMode ?? 'default';
  const barMode = v.accentBar ?? 'default';

  const set = (patch: Partial<Value>) => {
    const next: Record<string, unknown> = { ...v, ...patch };
    for (const k of Object.keys(next)) if (next[k] === undefined) delete next[k];
    // Drop the stored value once it is back to all-defaults.
    const meaningful = Object.entries(next).some(([k, val]) => !(val === 'default' || (k === 'outline' && val === false)));
    onChange(meaningful ? (next as Value) : undefined);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className={labelCls}>Border</label>
        <Segmented
          value={mode}
          onChange={m => set({ mode: m, ...(m !== 'custom' ? { outline: undefined } : {}) })}
          options={[
            { value: 'default', label: 'Style default' },
            { value: 'none', label: 'None' },
            { value: 'custom', label: 'Custom' },
          ]}
        />
        {mode === 'custom' && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div>
              <label className={labelCls}>Width (px)</label>
              <NumberField value={v.width} min={0} max={16} placeholder="2" onChange={n => set({ width: n })} />
            </div>
            <div>
              <label className={labelCls}>Line</label>
              <select
                value={v.lineStyle ?? 'solid'}
                onChange={e => set({ lineStyle: e.target.value as BorderOverride['lineStyle'] })}
                className={`${inputCls} w-full`}
              >
                <option value="solid" className="bg-black">Solid</option>
                <option value="dashed" className="bg-black">Dashed</option>
                <option value="dotted" className="bg-black">Dotted</option>
              </select>
            </div>
            <div className="col-span-3">
              <label className={labelCls}>Color</label>
              <ColorField value={v.color} fallback="#000000" onChange={c => set({ color: c || undefined })} />
            </div>
          </div>
        )}
        {allowOutline && mode === 'custom' && (
          <label className="flex items-center gap-2 mt-2 text-[11px] text-white/50 cursor-pointer">
            <input
              type="checkbox"
              checked={!!v.outline}
              onChange={e => set({ outline: e.target.checked || undefined })}
              className="accent-[#00ffff]"
            />
            Also draw it around the whole block
          </label>
        )}
        <p className="text-[10px] text-white/25 mt-1.5">
          Applies to cards, icon boxes, badges and dividers in this block.
        </p>
      </div>

      <div>
        <label className={labelCls}>Corner radius (px)</label>
        <div className="flex items-center gap-2">
          <div className="w-20">
            <NumberField value={v.radius} min={0} max={48} placeholder="default" onChange={n => set({ radius: n })} />
          </div>
          <input
            type="range"
            min={0}
            max={48}
            value={v.radius ?? 0}
            onChange={e => set({ radius: Number(e.target.value) })}
            className="flex-1 accent-[#00ffff]"
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>Shadow / glow</label>
        <Segmented
          value={shadowMode}
          onChange={m => set({ shadowMode: m })}
          options={[
            { value: 'default', label: 'Style default' },
            { value: 'none', label: 'None' },
            { value: 'custom', label: 'Custom' },
          ]}
        />
        {shadowMode === 'custom' && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <label className={labelCls}>Offset (px)</label>
              <NumberField value={v.shadowOffset} min={0} max={24} placeholder="4" onChange={n => set({ shadowOffset: n })} />
            </div>
            <div>
              <label className={labelCls}>Blur (px)</label>
              <NumberField value={v.shadowBlur} min={0} max={48} placeholder="0" onChange={n => set({ shadowBlur: n })} />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Color</label>
              <ColorField value={v.shadowColor} fallback="#000000" onChange={c => set({ shadowColor: c || undefined })} />
            </div>
          </div>
        )}
      </div>

      {allowAccentBar && (
        <div>
          <label className={labelCls}>Top accent bar</label>
          <Segmented
            value={barMode}
            onChange={m => set({ accentBar: m })}
            options={[
              { value: 'default', label: 'Style default' },
              { value: 'none', label: 'None' },
              { value: 'custom', label: 'Custom' },
            ]}
          />
          {barMode === 'custom' && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <label className={labelCls}>Height (px)</label>
                <NumberField value={v.accentBarWidth} min={1} max={16} placeholder="4" onChange={n => set({ accentBarWidth: n })} />
              </div>
              <div>
                <label className={labelCls}>Color</label>
                <ColorField value={v.accentBarColor} fallback="#5c5cf0" onChange={c => set({ accentBarColor: c || undefined })} />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-4">
        {value && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="text-[11px] text-white/30 hover:text-red-400 transition-colors"
          >
            Reset to style default
          </button>
        )}
        {onApplyToAll && value && (
          <button
            type="button"
            onClick={onApplyToAll}
            className="text-[11px] text-white/40 hover:text-[#00ffff] transition-colors"
          >
            Apply to all blocks
          </button>
        )}
      </div>
    </div>
  );
}
