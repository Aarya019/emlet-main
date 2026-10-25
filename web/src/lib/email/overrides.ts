import React from 'react';
import { Heading, Text, Button, Link, Img } from '@react-email/components';
import type { EmailSection, BorderOverride } from '@/lib/ai/claude';
import { wildcardOf } from '@/lib/email/element-ids';

// ─────────────────────────────────────────────
// Border / shadow primitives (shared by block-level and element-level overrides)
// ─────────────────────────────────────────────

const BORDER_SIDE_KEYS = ['border', 'borderTop', 'borderRight', 'borderBottom', 'borderLeft'] as const;

export function borderValue(o: BorderOverride): string {
  return `${o.width ?? 2}px ${o.lineStyle ?? 'solid'} ${o.color ?? '#000000'}`;
}

/** CSS box-shadow for an override: a string to set, 'none' to clear, or undefined to keep the style's own. */
export function shadowValue(o: BorderOverride): string | undefined {
  if (o.shadowMode === 'none') return 'none';
  if (o.shadowMode === 'custom') {
    const off = o.shadowOffset ?? 4;
    return `${off}px ${off}px ${o.shadowBlur ?? 0}px ${o.shadowColor ?? '#000000'}`;
  }
  return undefined;
}

/** Cards, icon boxes, badges, buttons, images: replace the style's border/shadow/radius with the user's choices. */
export function overrideBox(base: React.CSSProperties, o: BorderOverride): React.CSSProperties {
  const s: Record<string, unknown> = { ...base };
  if (o.mode === 'none' || o.mode === 'custom') {
    for (const k of BORDER_SIDE_KEYS) delete s[k];
    if (o.mode === 'none') s.border = 'none';
    else {
      s.border = borderValue(o);
      // 'simple' cards are padded top/bottom only; a visible box needs side padding too.
      if (s.padding === '16px 0') s.padding = '16px';
    }
  }
  const shadow = shadowValue(o);
  if (shadow !== undefined) s.boxShadow = shadow;
  if (o.radius != null) s.borderRadius = `${o.radius}px`;
  return s as React.CSSProperties;
}

/** The block-wide rule some styles draw around/beside content sections (brutalist box, editorial left rule). Keeps which sides it was on. */
export function overrideSectionBorder(base: React.CSSProperties, o: BorderOverride): React.CSSProperties {
  const s: Record<string, unknown> = { ...base };
  const sides = BORDER_SIDE_KEYS.filter(k => s[k] != null);
  if (o.mode === 'none' || (o.mode === 'custom' && o.outline)) {
    // 'custom' + outline draws its own box around the whole block instead (see applyOutline in renderer).
    for (const k of sides) delete s[k];
  } else if (o.mode === 'custom') {
    for (const k of sides) s[k] = borderValue(o);
  }
  return s as React.CSSProperties;
}

export function overrideHr(base: React.CSSProperties, o: BorderOverride): React.CSSProperties {
  const s: Record<string, unknown> = { ...base };
  if (o.mode === 'none') {
    s.borderWidth = '0px';
    s.borderTop = '0px none transparent';
  } else if (o.mode === 'custom') {
    s.borderWidth = `${o.width ?? 2}px`;
    s.borderStyle = o.lineStyle ?? 'solid';
    s.borderColor = o.color ?? '#000000';
    s.borderTop = borderValue(o);
  }
  return s as React.CSSProperties;
}

/**
 * Returns a text color (dark or light) that contrasts well against `bgHex`.
 * Used to keep card text readable whatever the card's background is.
 */
export function cardTextColor(bgHex: string | undefined): string {
  if (!bgHex) return '#1a1a1a';
  const hex = bgHex.replace(/^#/, '');
  if (hex.length !== 6) return '#1a1a1a';
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.45 ? '#1a1a1a' : '#f0f0f0';
}

// ─────────────────────────────────────────────
// Per-element style overrides
//
// Each renderer builds a plain React element tree. After a section is rendered,
// applyElementStyles() walks that tree once and gives every styleable element
// (headings, text, buttons, links, images, icons, and the card/badge/icon-box
// containers) a stable id. If the section has an override for that id in
// `section.styles`, it is merged into the element's inline style. In preview
// mode the id is also stamped on the element so the editor can select it.
//
// Ids:
//   - text fields the renderer already tags for inline editing use that field:
//     'heading', 'subheading', 'intro', 'eyebrow', 'text:0' (nth paragraph) ...
//   - everything else is numbered per kind in document order: 'button#0',
//     'text#2', 'card#1', 'icon#0' ... Lists grow at the end, so existing ids
//     keep pointing at the same item when an item is appended.
//   - 'role:*' / 'role#*' applies to every item of that role at once; an exact
//     id always wins over the wildcard.
// ─────────────────────────────────────────────

/** Marks a style object as a styleable container ('card', 'iconBox', 'badge', 'panel'). Symbol keys never reach the DOM. */
export const BOX = Symbol.for('em-box');

export function boxed(style: React.CSSProperties, role: string): React.CSSProperties {
  return { ...style, [BOX]: role } as React.CSSProperties;
}

type Kind = 'heading' | 'text' | 'link' | 'button' | 'image' | 'icon' | 'box';

const KIND_BY_TYPE = new Map<unknown, Kind>([
  [Heading, 'heading'],
  [Text, 'text'],
  [Link, 'link'],
  [Button, 'button'],
  [Img, 'image'],
]);

const PREVIEW_ATTRS = ['data-em-field', 'data-em-si', 'data-em-ti', 'data-em-kind'];

function isHex(c: string | undefined): c is string {
  return !!c && /^#[0-9a-f]{6}$/i.test(c);
}

type AnyProps = Record<string, any>;
interface Ctx { fg?: string }

export function applyElementStyles(
  root: React.ReactElement,
  section: EmailSection,
  si: number,
  preview: boolean,
): React.ReactElement {
  const styles = section.styles ?? {};
  const counters: Record<string, number> = {};
  const nextId = (role: string) => `${role}#${counters[role] = (counters[role] ?? -1) + 1}`;
  const lookup = (id: string) => {
    if (styles[id]) return styles[id];
    const w = wildcardOf(id);
    return w ? styles[w] : undefined;
  };

  const visit = (node: React.ReactNode, ctx: Ctx, isRoot: boolean): React.ReactNode => {
    if (Array.isArray(node)) return node.map(n => visit(n, ctx, false));
    if (!React.isValidElement(node)) return node;

    const el = node as React.ReactElement<AnyProps>;
    const props = el.props;
    const rawStyle = props.style as (React.CSSProperties & { [BOX]?: string }) | undefined;
    const boxRole = rawStyle ? (rawStyle as unknown as Record<symbol, string>)[BOX] : undefined;

    let kind: Kind | undefined;
    let id: string | undefined;
    if (boxRole) {
      kind = 'box';
      id = nextId(boxRole);
    } else if (props['data-em-kind'] === 'icon') {
      kind = 'icon';
      id = nextId('icon');
    } else {
      const k = KIND_BY_TYPE.get(el.type);
      if (k) {
        kind = k;
        const field = props['data-em-field'] as string | undefined;
        const ti = props['data-em-ti'];
        id = field ? (ti != null ? `${field}:${ti}` : field) : nextId(k);
      }
    }

    const ov = id ? lookup(id) : undefined;
    const next: AnyProps = { ...props };
    let style: AnyProps | undefined = rawStyle ? { ...rawStyle } : undefined; // spread drops nothing we need; symbols re-checked via rawStyle
    if (style) for (const sym of Object.getOwnPropertySymbols(style)) delete (style as AnyProps)[sym as unknown as string];

    let childCtx = ctx;

    if (kind === 'box') {
      // Hardcoded panels (announcement, coupon, quote) follow the block-level border settings too.
      if (boxRole === 'panel' && section.border && style) style = overrideBox(style as React.CSSProperties, section.border) as AnyProps;
      if (ov) {
        style = style ?? {};
        if (ov.backgroundColor) style.backgroundColor = ov.backgroundColor;
        if (ov.border) style = overrideBox(style as React.CSSProperties, ov.border) as AnyProps;
        const fg = ov.color ?? (isHex(ov.backgroundColor) ? cardTextColor(ov.backgroundColor) : undefined);
        if (fg) childCtx = { fg };
      }
    } else if (kind === 'heading' || kind === 'text' || kind === 'link') {
      style = style ?? {};
      if (ctx.fg) style.color = ctx.fg;
      if (ov) {
        if (ov.color) style.color = ov.color;
        if (ov.fontSize) style.fontSize = `${ov.fontSize}px`;
        if (ov.bold != null) style.fontWeight = ov.bold ? '700' : '400';
        if (ov.italic != null) style.fontStyle = ov.italic ? 'italic' : 'normal';
        if (ov.align) style.textAlign = ov.align;
        if (ov.underline != null) style.textDecoration = ov.underline ? 'underline' : 'none';
      }
    } else if (kind === 'button') {
      if (ov) {
        style = style ?? {};
        if (ov.backgroundColor) style.backgroundColor = ov.backgroundColor;
        if (ov.color) style.color = ov.color;
        if (ov.fontSize) style.fontSize = `${ov.fontSize}px`;
        if (ov.bold != null) style.fontWeight = ov.bold ? '700' : '400';
        if (ov.border) style = overrideBox(style as React.CSSProperties, ov.border) as AnyProps;
      }
    } else if (kind === 'image') {
      if (ov?.border) style = overrideBox((style ?? {}) as React.CSSProperties, ov.border) as AnyProps;
    } else if (kind === 'icon') {
      if (ov?.color && typeof props.src === 'string') {
        next.src = props.src.replace(/color=[^&]*/, `color=${encodeURIComponent(ov.color)}`);
      }
    }

    if (style) next.style = style;

    if (preview) {
      if (id && kind) {
        next['data-em-el'] = id;
        next['data-em-kind'] = kind;
        next['data-em-si'] = String(si);
      }
      if (isRoot) {
        next['data-em-root'] = String(si);
        next['data-em-si'] = String(si);
      }
    } else {
      for (const a of PREVIEW_ATTRS) delete next[a];
    }
    delete next.children;

    const children = props.children as React.ReactNode;
    const mapped = children === undefined ? undefined : visit(children, childCtx, false);
    const config = { ...next, key: el.key ?? undefined };
    if (mapped === undefined) return React.createElement(el.type, config);
    return Array.isArray(mapped)
      ? React.createElement(el.type, config, ...mapped)
      : React.createElement(el.type, config, mapped);
  };

  return visit(root, {}, true) as React.ReactElement;
}
