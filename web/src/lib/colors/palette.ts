/**
 * Server-side brand colour palette derivation.
 *
 * Derives a complete, harmonious palette from brand colours using HSL math.
 * These exact hex values are injected into the AI prompt so the model uses
 * only palette-consistent colours for every section backgroundColor,
 * textColor, and buttonColor — no arbitrary picks. Text-on-colour roles
 * (onPrimary, onDark, onAccent) are chosen by measuring actual WCAG contrast
 * against their paired background rather than hardcoded, so a light brand
 * colour (e.g. a pastel) still gets readable text instead of invisible white.
 */

import { contrastRatio } from './contrast';

export interface EmailColorPalette {
  /** White or brand background_color — default light section bg */
  surface: string;
  /** Whisper of primary hue (~97% L) — alternate light section bg */
  surfaceAlt: string;
  /** Visible soft tint (~93% L) — feature / highlight section bg */
  accentLight: string;
  /** Brand primary as-is — CTA buttons, headings, key accents */
  primary: string;
  /** Text / button colour on primary-coloured backgrounds — contrast-checked */
  onPrimary: string;
  /** Deep dark from primary hue (~11% L) — dramatic dark sections */
  primaryDark: string;
  /** Text / button colour on dark-bg sections — contrast-checked */
  onDark: string;
  /**
   * A second, distinct hue for small pops of visual interest (badges, icon
   * accents, dividers, highlight borders) — brand secondary_color when
   * provided, otherwise a split-complementary hue derived from primary (150°
   * offset, not a flat 180°) for a livelier, more art-directed pairing than a
   * textbook complement. Never used as a large surface — see the 60-30-10
   * usage rule in the AI prompt.
   */
  accent: string;
  /** Text / button colour on accent-coloured backgrounds — contrast-checked */
  onAccent: string;
  /**
   * Accent hue locked to the same near-black lightness as primaryDark —
   * exists purely so two-tone "duotone" gradients (hero fallback, photo
   * overlays) can blend primaryDark + accentDark and stay uniformly dark
   * end-to-end, guaranteeing light text stays legible across the whole
   * gradient instead of only at one end.
   */
  accentDark: string;
  /** Default body text */
  bodyText: string;
}

// ─── Colour math helpers ──────────────────────────────────────────────────────

function hexToHsl(hex: string): [number, number, number] {
  const c = hex.replace('#', '');
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
  h /= 360; s /= 100; l /= 100;
  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function isValidHex(hex: string | null | undefined): hex is string {
  return typeof hex === 'string' && /^#[0-9A-Fa-f]{6}$/.test(hex);
}

/** Picks whichever of white or near-black clears more contrast against `bg` — guarantees readable text regardless of how light or dark the brand colour is. */
function readableTextOn(bg: string): string {
  const white = '#ffffff';
  const dark = '#1a1a1a';
  const whiteRatio = contrastRatio(bg, white) ?? 0;
  const darkRatio = contrastRatio(bg, dark) ?? 0;
  return whiteRatio >= darkRatio ? white : dark;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Build a complete email colour palette from brand colours.
 *
 * @param primaryColor   Brand primary hex (e.g. "#5c5cf0")
 * @param backgroundColor Brand background hex or null
 * @param secondaryColor Brand secondary hex or null — becomes the `accent` role when valid
 */
export function buildEmailPalette(
  primaryColor: string,
  backgroundColor: string | null,
  secondaryColor: string | null = null,
): EmailColorPalette {
  const primary = isValidHex(primaryColor) ? primaryColor : '#5c5cf0';
  const [h, s] = hexToHsl(primary);

  // surface: use brand background when provided, otherwise pure white
  const surface = isValidHex(backgroundColor) ? backgroundColor : '#ffffff';

  // surfaceAlt: sameH, desaturated to a whisper, very high lightness
  const surfaceAlt = hslToHex(h, Math.min(s * 0.3, 22), 97);

  // accentLight: visible but soft — for feature cards and highlight rows
  const accentLight = hslToHex(h, Math.min(s * 0.4, 34), 92);

  // primaryDark: deep brand-hued dark — feels intentional, not generic charcoal
  const primaryDark = hslToHex(h, Math.min(s * 0.55, 42), 11);

  // accent hue/saturation: brand secondary colour's own hue when given, otherwise
  // a split-complementary hue (150° offset rather than a flat 180°) — research on
  // 2026 palette trends favours split-complementary over pure-complement for a
  // pairing that reads as art-directed rather than mechanically "opposite", plus
  // a higher, more saturated floor for the bold/electric look Gen Z palettes lean
  // into (vs. the muted 45-70% range this used to clamp to).
  const [accentH, accentS] = isValidHex(secondaryColor)
    ? hexToHsl(secondaryColor)
    : [(h + 150) % 360, Math.min(Math.max(s, 55), 85)];

  // accent: brand secondary colour kept exactly (it's a deliberate brand choice)
  // when given, otherwise built from the derived split-complementary hue/sat above
  const accent = isValidHex(secondaryColor)
    ? secondaryColor
    : hslToHex(accentH, accentS, 50);

  // accentDark: same hue as accent, pinned to primaryDark's near-black lightness —
  // lets duotone gradients blend primaryDark + accentDark while staying uniformly
  // dark, so light (ON_DARK) text stays legible across the entire gradient.
  const accentDark = hslToHex(accentH, Math.min(accentS * 0.6, 40), 13);

  return {
    surface,
    surfaceAlt,
    accentLight,
    primary,
    onPrimary: readableTextOn(primary),
    primaryDark,
    onDark: readableTextOn(primaryDark),
    accent,
    onAccent: readableTextOn(accent),
    accentDark,
    bodyText: '#1a1a1a',
  };
}
