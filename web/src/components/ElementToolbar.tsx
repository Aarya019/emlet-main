'use client';

import type { ElementStyle } from '@/lib/ai/claude';
import BorderControls from '@/components/BorderControls';

/** What the preview reports about the clicked element's current look (used to show real values when nothing is overridden). */
export interface ComputedElementStyle {
  color?: string;
  backgroundColor?: string;
  fontSize?: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: string;
}

interface ElementToolbarProps {
  label: string;
  kind: string;
  style: ElementStyle | undefined;
  computed: ComputedElementStyle | null;
  /** True when the style being edited applies to every item of this role. */
  appliesToAll: boolean;
  /** Whether this element belongs to a list of similar items, so "apply to all" makes sense. */
  canApplyToAll: boolean;
  onChange: (patch: Partial<ElementStyle>) => void;
  onToggleAll: (on: boolean) => void;
  onReset: () => void;
  onClose: () => void;
}

const inputCls =
  'px-1.5 py-1 bg-white/5 border border-white/10 rounded text-white text-[11px] font-mono focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20';
const labelCls = 'block text-[10px] text-white/30 mb-1 uppercase tracking-wider';

function ColorInput({
  label,
  value,
  fallback,
  onChange,
}: {
  label: string;
  value: string | undefined;
  fallback: string | undefined;
  onChange: (v: string | undefined) => void;
}) {
  const shown = value ?? fallback;
  return (
    <div className="min-w-[132px]">
      <label className={labelCls}>{label}</label>
      <div className="flex items-center gap-1.5">
        <input
          type="color"
          value={/^#[0-9a-f]{6}$/i.test(shown || '') ? shown : '#000000'}
          onChange={e => onChange(e.target.value)}
          className="w-7 h-7 rounded cursor-pointer border border-white/20 bg-transparent p-0.5 flex-shrink-0"
        />
        <input
          type="text"
          value={value ?? ''}
          onChange={e => onChange(e.target.value || undefined)}
          className={`${inputCls} w-[88px]`}
          placeholder={fallback ?? 'default'}
        />
      </div>
    </div>
  );
}

function ToggleButton({ active, title, onClick, children }: { active: boolean; title: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`w-7 h-7 rounded border text-xs transition-colors ${
        active ? 'bg-[#00ffff]/15 border-[#00ffff]/50 text-[#00ffff]' : 'border-white/10 text-white/50 hover:text-white hover:bg-white/5'
      }`}
    >
      {children}
    </button>
  );
}

/**
 * Docked editor for whichever element is selected in the preview. Shows only
 * the controls that make sense for that kind of element (text, button, card,
 * image, icon). Values that aren't overridden fall back to what the preview
 * actually renders, so the pickers always show the real current color/size.
 */
export default function ElementToolbar({
  label,
  kind,
  style,
  computed,
  appliesToAll,
  canApplyToAll,
  onChange,
  onToggleAll,
  onReset,
  onClose,
}: ElementToolbarProps) {
  const isText = kind === 'heading' || kind === 'text' || kind === 'link';
  const isButton = kind === 'button';
  const isBox = kind === 'box';
  const isImage = kind === 'image';
  const isIcon = kind === 'icon';
  const hasOverride = !!style && Object.keys(style).length > 0;
  const bold = style?.bold ?? computed?.bold ?? false;
  const italic = style?.italic ?? computed?.italic ?? false;
  const underline = style?.underline ?? computed?.underline ?? false;
  const align = style?.align ?? (computed?.align === 'center' || computed?.align === 'right' ? computed.align : 'left');
  const showBorder = isButton || isBox || isImage;

  return (
    <div className="sticky top-0 z-20 mb-4 rounded-lg border border-[#00ffff]/30 bg-[#0a0a0f]/95 backdrop-blur p-3 shadow-xl">
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ffff] flex-shrink-0" />
          <span className="text-xs font-semibold text-white truncate">{label}</span>
          {hasOverride && <span className="text-[10px] text-[#00ffff]/60">customised</span>}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {canApplyToAll && (
            <label className="flex items-center gap-1.5 text-[11px] text-white/50 cursor-pointer">
              <input type="checkbox" checked={appliesToAll} onChange={e => onToggleAll(e.target.checked)} className="accent-[#00ffff]" />
              Apply to all similar
            </label>
          )}
          {hasOverride && (
            <button type="button" onClick={onReset} className="text-[11px] text-white/30 hover:text-red-400 transition-colors">
              Reset
            </button>
          )}
          <button type="button" onClick={onClose} title="Deselect" className="text-white/40 hover:text-white transition-colors text-sm leading-none">
            ✕
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-x-4 gap-y-2.5">
        {isText && (
          <>
            <ColorInput label="Text color" value={style?.color} fallback={computed?.color} onChange={color => onChange({ color })} />
            <div>
              <label className={labelCls}>Size (px)</label>
              <input
                type="number"
                min={8}
                max={96}
                value={style?.fontSize ?? ''}
                placeholder={computed?.fontSize ? String(Math.round(computed.fontSize)) : 'auto'}
                onChange={e => onChange({ fontSize: e.target.value === '' ? undefined : Math.min(96, Math.max(8, Number(e.target.value))) })}
                className={`${inputCls} w-16`}
              />
            </div>
            <div>
              <label className={labelCls}>Style</label>
              <div className="flex gap-1">
                <ToggleButton active={bold} title="Bold" onClick={() => onChange({ bold: !bold })}><b>B</b></ToggleButton>
                <ToggleButton active={italic} title="Italic" onClick={() => onChange({ italic: !italic })}><i>I</i></ToggleButton>
                <ToggleButton active={underline} title="Underline" onClick={() => onChange({ underline: !underline })}><u>U</u></ToggleButton>
              </div>
            </div>
            {kind !== 'link' && (
              <div>
                <label className={labelCls}>Align</label>
                <div className="flex gap-1">
                  {(['left', 'center', 'right'] as const).map(a => (
                    <ToggleButton key={a} active={align === a} title={`Align ${a}`} onClick={() => onChange({ align: a })}>
                      {a === 'left' ? '⇤' : a === 'center' ? '↔' : '⇥'}
                    </ToggleButton>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {isButton && (
          <>
            <ColorInput label="Button color" value={style?.backgroundColor} fallback={computed?.backgroundColor} onChange={backgroundColor => onChange({ backgroundColor })} />
            <ColorInput label="Label color" value={style?.color} fallback={computed?.color} onChange={color => onChange({ color })} />
            <div>
              <label className={labelCls}>Size (px)</label>
              <input
                type="number"
                min={8}
                max={48}
                value={style?.fontSize ?? ''}
                placeholder={computed?.fontSize ? String(Math.round(computed.fontSize)) : 'auto'}
                onChange={e => onChange({ fontSize: e.target.value === '' ? undefined : Math.min(48, Math.max(8, Number(e.target.value))) })}
                className={`${inputCls} w-16`}
              />
            </div>
            <div>
              <label className={labelCls}>Style</label>
              <ToggleButton active={bold} title="Bold" onClick={() => onChange({ bold: !bold })}><b>B</b></ToggleButton>
            </div>
          </>
        )}

        {isBox && (
          <>
            <ColorInput label="Fill" value={style?.backgroundColor} fallback={computed?.backgroundColor} onChange={backgroundColor => onChange({ backgroundColor })} />
            <ColorInput label="Text inside" value={style?.color} fallback={undefined} onChange={color => onChange({ color })} />
          </>
        )}

        {isIcon && <ColorInput label="Icon color" value={style?.color} fallback={computed?.color} onChange={color => onChange({ color })} />}
      </div>

      {showBorder && (
        <details className="mt-3 group" open={!!style?.border}>
          <summary className="cursor-pointer select-none text-[11px] text-white/40 uppercase tracking-wider list-none flex items-center gap-1.5">
            <span className="inline-block transition-transform group-open:rotate-90">▸</span>
            Border, corners &amp; shadow
          </summary>
          <div className="mt-3 max-w-md">
            <BorderControls value={style?.border} onChange={border => onChange({ border })} />
          </div>
        </details>
      )}

      {isIcon && (
        <p className="mt-2 text-[10px] text-white/25">Emoji icons take their color from the text color of the card they sit in.</p>
      )}
    </div>
  );
}
