import React from 'react';
import { render } from '@react-email/render';
import {
  Html,
  Head,
  Body,
  Preview,
  Container,
  Section,
  Row,
  Column,
  Heading,
  Text,
  Button,
  Link,
  Img,
  Hr,
  CodeBlock,
  atomDark,
  oneDark,
} from '@react-email/components';
import type { GeneratedEmail, EmailSection } from '@/lib/ai/gemini';
import type { BrandProfile } from '@/lib/db/types';

// ─────────────────────────────────────────────
// Font resolver — fetches Google Fonts CSS on the server with a real browser
// UA so we get back actual @font-face blocks. Those blocks reference static
// fonts.gstatic.com URLs that email clients can load without any UA check.
// Results are cached per URL for the lifetime of the server process.
// ─────────────────────────────────────────────

const _fontCSSCache = new Map<string, string>();

async function resolveFontFaceCSS(googleFontsUrl: string): Promise<string> {
  if (_fontCSSCache.has(googleFontsUrl)) return _fontCSSCache.get(googleFontsUrl)!;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(googleFontsUrl, {
      headers: {
        // A real Chrome UA so Google Fonts returns WOFF2 @font-face declarations
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/css,*/*;q=0.1',
      },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) { return ''; }  // don't cache failures — retry on next request
    const css = await res.text();
    // Extract @font-face blocks — src URLs inside point to fonts.gstatic.com
    // which is a pure static CDN (no UA detection, email clients load fine)
    const blocks = (css.match(/@font-face\s*\{[\s\S]*?\}/g) ?? []).join('\n');
    if (blocks) _fontCSSCache.set(googleFontsUrl, blocks);  // only cache successful results
    return blocks;
  } catch {
    return '';  // don't cache failures — retry on next request
  }
}

// ─────────────────────────────────────────────
// Preview-mode data attribute helper
// ─────────────────────────────────────────────

/** Returns data attrs for inline field editing when preview=true; empty object otherwise. */
function pv(preview: boolean, si: number, field: string, ti?: number): Record<string, string> {
  if (!preview) return {};
  const a: Record<string, string> = { 'data-em-field': field, 'data-em-si': String(si) };
  if (ti != null) a['data-em-ti'] = String(ti);
  return a;
}

// ─────────────────────────────────────────────
// Font registry — all supported fonts
// css      : exact CSS font-family value (with quotes if needed)
// fallback : appended fallback generic stack
// gfParam  : Google Fonts API param string (undefined = system font)
// ─────────────────────────────────────────────

export interface FontDef {
  css: string;
  fallback: string;
  gfParam?: string;
}

export const FONT_REGISTRY: Record<string, FontDef> = {
  // ── Google Fonts ──────────────────────────────────────────────────────
  'Alegreya':            { css: "'Alegreya'",            fallback: "Georgia, serif",          gfParam: "Alegreya:ital,wght@0,400;0,700;1,400" },
  'Alegreya Sans':       { css: "'Alegreya Sans'",       fallback: "Georgia, serif",          gfParam: "Alegreya+Sans:wght@400;700" },
  'Bitter':              { css: "'Bitter'",              fallback: "Georgia, serif",          gfParam: "Bitter:ital,wght@0,400;0,700" },
  'Cormorant':           { css: "'Cormorant'",           fallback: "Georgia, serif",          gfParam: "Cormorant:ital,wght@0,400;0,600;1,400" },
  'DM Sans':             { css: "'DM Sans'",             fallback: "Arial, sans-serif",       gfParam: "DM+Sans:wght@400;500;700" },
  'EB Garamond':         { css: "'EB Garamond'",         fallback: "Georgia, serif",          gfParam: "EB+Garamond:ital,wght@0,400;0,700;1,400" },
  'Eczar':               { css: "'Eczar'",               fallback: "Georgia, serif",          gfParam: "Eczar:wght@400;700" },
  'Gothic A1':           { css: "'Gothic A1'",           fallback: "Arial, sans-serif",       gfParam: "Gothic+A1:wght@400;700" },
  'IBM Plex Sans':       { css: "'IBM Plex Sans'",       fallback: "Arial, sans-serif",       gfParam: "IBM+Plex+Sans:ital,wght@0,400;0,700;1,400" },
  'Instrument Sans':     { css: "'Instrument Sans'",     fallback: "Arial, sans-serif",       gfParam: "Instrument+Sans:wght@400;500;700" },
  'Instrument Serif':    { css: "'Instrument Serif'",    fallback: "Georgia, serif",          gfParam: "Instrument+Serif:ital@0;1" },
  'Inter':               { css: "'Inter'",               fallback: "Arial, sans-serif",       gfParam: "Inter:wght@400;500;700" },
  'Karla':               { css: "'Karla'",               fallback: "Arial, sans-serif",       gfParam: "Karla:ital,wght@0,400;0,700" },
  'Lato':                { css: "'Lato'",                fallback: "Arial, sans-serif",       gfParam: "Lato:ital,wght@0,400;0,700;1,400" },
  'Libre Baskerville':   { css: "'Libre Baskerville'",   fallback: "Georgia, serif",          gfParam: "Libre+Baskerville:ital,wght@0,400;0,700;1,400" },
  'Libre Franklin':      { css: "'Libre Franklin'",      fallback: "Arial, sans-serif",       gfParam: "Libre+Franklin:wght@400;700" },
  'Lora':                { css: "'Lora'",                fallback: "Georgia, serif",          gfParam: "Lora:ital,wght@0,400;0,600;1,400" },
  'Merriweather':        { css: "'Merriweather'",        fallback: "Georgia, serif",          gfParam: "Merriweather:ital,wght@0,400;0,700;1,400" },
  'Montserrat':          { css: "'Montserrat'",          fallback: "Arial, sans-serif",       gfParam: "Montserrat:wght@400;500;700" },
  'Noto Sans':           { css: "'Noto Sans'",           fallback: "Arial, sans-serif",       gfParam: "Noto+Sans:wght@400;700" },
  'Noto Serif':          { css: "'Noto Serif'",          fallback: "Georgia, serif",          gfParam: "Noto+Serif:wght@400;700" },
  'Open Sans':           { css: "'Open Sans'",           fallback: "Arial, sans-serif",       gfParam: "Open+Sans:ital,wght@0,400;0,700;1,400" },
  'Oswald':              { css: "'Oswald'",              fallback: "Arial, sans-serif",       gfParam: "Oswald:wght@400;700" },
  'Playfair Display':    { css: "'Playfair Display'",    fallback: "Georgia, serif",          gfParam: "Playfair+Display:ital,wght@0,700;0,900;1,700" },
  'Poppins':             { css: "'Poppins'",             fallback: "Arial, sans-serif",       gfParam: "Poppins:ital,wght@0,400;0,700;1,400" },
  'PT Sans':             { css: "'PT Sans'",             fallback: "Arial, sans-serif",       gfParam: "PT+Sans:ital,wght@0,400;0,700;1,400" },
  'PT Serif':            { css: "'PT Serif'",            fallback: "Georgia, serif",          gfParam: "PT+Serif:ital,wght@0,400;0,700;1,400" },
  'Raleway':             { css: "'Raleway'",             fallback: "Arial, sans-serif",       gfParam: "Raleway:wght@400;700" },
  'Roboto':              { css: "'Roboto'",              fallback: "Arial, sans-serif",       gfParam: "Roboto:ital,wght@0,400;0,700;1,400" },
  'Source Sans 3':       { css: "'Source Sans 3'",       fallback: "Arial, sans-serif",       gfParam: "Source+Sans+3:ital,wght@0,400;0,700;1,400" },
  'Space Grotesk':       { css: "'Space Grotesk'",       fallback: "Arial, sans-serif",       gfParam: "Space+Grotesk:wght@400;700" },
  'Space Mono':          { css: "'Space Mono'",          fallback: "'Courier New', monospace", gfParam: "Space+Mono:ital,wght@0,400;0,700;1,400" },
  'Spectral':            { css: "'Spectral'",            fallback: "Georgia, serif",          gfParam: "Spectral:ital,wght@0,400;0,700;1,400" },
  'Syne':                { css: "'Syne'",                fallback: "Arial, sans-serif",       gfParam: "Syne:wght@400;700;800" },
  'Taviraj':             { css: "'Taviraj'",             fallback: "Georgia, serif",          gfParam: "Taviraj:ital,wght@0,400;0,700;1,400" },
  'Work Sans':           { css: "'Work Sans'",           fallback: "Arial, sans-serif",       gfParam: "Work+Sans:wght@400;500;700" },
  // ── System fonts (no Google Fonts fetch needed) ───────────────────────
  'Arial':               { css: "Arial",                 fallback: "Helvetica, sans-serif" },
  'Courier':             { css: "'Courier New'",         fallback: "Courier, monospace" },
  'Georgia':             { css: "Georgia",               fallback: "'Times New Roman', serif" },
  'Helvetica':           { css: "Helvetica",             fallback: "Arial, sans-serif" },
  'Lucida Console':      { css: "'Lucida Console'",      fallback: "'Courier New', monospace" },
  'Palatino':            { css: "'Palatino Linotype'",   fallback: "Georgia, serif" },
  'Times New Roman':     { css: "'Times New Roman'",     fallback: "Times, serif" },
  'Trebuchet MS':        { css: "'Trebuchet MS'",        fallback: "Arial, sans-serif" },
  'Verdana':             { css: "Verdana",               fallback: "Geneva, sans-serif" },
};

/** Builds a Google Fonts CSS2 URL for up to two font names. Returns '' if both are system fonts. */
export function buildGoogleFontsUrl(heading: string, body: string): string {
  const hDef = FONT_REGISTRY[heading];
  const bDef = FONT_REGISTRY[body];
  const params: string[] = [];
  if (hDef?.gfParam) params.push(`family=${hDef.gfParam}`);
  if (bDef?.gfParam && body !== heading) params.push(`family=${bDef.gfParam}`);
  if (params.length === 0) return '';
  return `https://fonts.googleapis.com/css2?${params.join('&')}&display=swap`;
}

/** Returns the full CSS font-family string for a named font (with fallbacks). */
export function fontFamilyCSS(name: string, genericFallback = 'sans-serif'): string {
  const def = FONT_REGISTRY[name];
  if (!def) return genericFallback;
  return `${def.css}, ${def.fallback}`;
}

// ─────────────────────────────────────────────
// Style definitions per design style
// ─────────────────────────────────────────────

interface StyleConfig {
  fontFamily: string;
  headingFontFamily: string;
  googleFontsUrl: string;
  bodyBg: string;
  bodyColor: string;
  headingWeight: string;
  headingLetterSpacing: string;
  borderRadius: string;
  sectionBorderRadius: string;
  sectionPadding: string;
  buttonBorderRadius: string;
  buttonPadding: string;
  containerBorder: string;
  heroAlign: 'center' | 'left';
  hrStyle: React.CSSProperties;
  sectionBorderStyle: React.CSSProperties;
  cardStyle: React.CSSProperties;
}

export const styleConfigs: Record<string, StyleConfig> = {
  minimalist: {
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
    headingFontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700&display=swap",
    bodyBg: '#f9f9f9',
    bodyColor: '#1a1a1a',
    headingWeight: '500',
    headingLetterSpacing: '-0.02em',
    borderRadius: '4px',
    sectionBorderRadius: '0',
    sectionPadding: '52px 40px',
    buttonBorderRadius: '4px',
    buttonPadding: '14px 44px',
    containerBorder: '1px solid #e8e8e8',
    heroAlign: 'center',
    hrStyle: { borderColor: '#eeeeee', borderWidth: '1px', margin: '24px 0' },
    sectionBorderStyle: {},
    cardStyle: { backgroundColor: '#ffffff', borderRadius: '10px', padding: '24px', border: '1px solid #f0f0f0' },
  },
  editorial: {
    fontFamily: "'Lora', Georgia, 'Palatino Linotype', serif",
    headingFontFamily: "'Playfair Display', Georgia, 'Palatino Linotype', serif",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lora:ital,wght@0,400;0,600;1,400&display=swap",
    bodyBg: '#fefefe',
    bodyColor: '#1a1a1a',
    headingWeight: '700',
    headingLetterSpacing: '0',
    borderRadius: '0',
    sectionBorderRadius: '0',
    sectionPadding: '48px 40px',
    buttonBorderRadius: '0',
    buttonPadding: '14px 44px',
    containerBorder: '1px solid #ddd',
    heroAlign: 'left',
    hrStyle: { borderColor: '#1a1a1a', borderWidth: '2px', margin: '24px 0' },
    sectionBorderStyle: { borderLeft: '4px solid #1a1a1a', paddingLeft: '16px' },
    cardStyle: { backgroundColor: '#f5f5f5', padding: '20px', borderLeft: '3px solid #1a1a1a' },
  },
  retro: {
    fontFamily: "'Nunito', 'Trebuchet MS', Georgia, sans-serif",
    headingFontFamily: "'DM Serif Display', Georgia, 'Palatino Linotype', serif",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Nunito:wght@400;700&display=swap",
    bodyBg: '#fdf6e3',
    bodyColor: '#3b2a1a',
    headingWeight: '700',
    headingLetterSpacing: '0.02em',
    borderRadius: '12px',
    sectionBorderRadius: '0',
    sectionPadding: '48px 40px',
    buttonBorderRadius: '20px',
    buttonPadding: '14px 44px',
    containerBorder: '2px solid #c8a96e',
    heroAlign: 'center',
    hrStyle: { borderColor: '#c8a96e', borderWidth: '2px', borderStyle: 'dashed', margin: '24px 0' },
    sectionBorderStyle: {},
    cardStyle: { backgroundColor: '#fffbf0', borderRadius: '16px', padding: '24px', border: '2px solid #c8a96e' },
  },
  brutalist: {
    fontFamily: "'Space Grotesk', Arial, Helvetica, sans-serif",
    headingFontFamily: "'Space Grotesk', 'Arial Black', Gadget, sans-serif",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap",
    bodyBg: '#ffffff',
    bodyColor: '#000000',
    headingWeight: '900',
    headingLetterSpacing: '-0.03em',
    borderRadius: '0',
    sectionBorderRadius: '0',
    sectionPadding: '52px 40px',
    buttonBorderRadius: '0',
    buttonPadding: '16px 52px',
    containerBorder: '4px solid #000000',
    heroAlign: 'left',
    hrStyle: { borderColor: '#000000', borderWidth: '4px', margin: '24px 0' },
    sectionBorderStyle: { border: '3px solid #000', padding: '16px' },
    cardStyle: { backgroundColor: '#ffffff', padding: '24px', border: '3px solid #000000', boxShadow: '6px 6px 0px #000000' },
  },
  cyberpunk: {
    fontFamily: "'Share Tech Mono', 'Courier New', Courier, monospace",
    headingFontFamily: "'Orbitron', 'Courier New', Courier, monospace",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap",
    bodyBg: '#0a0a0f',
    bodyColor: '#e0e0ff',
    headingWeight: '700',
    headingLetterSpacing: '0.05em',
    borderRadius: '2px',
    sectionBorderRadius: '0',
    sectionPadding: '48px 40px',
    buttonBorderRadius: '2px',
    buttonPadding: '14px 44px',
    containerBorder: '1px solid #00ffff',
    heroAlign: 'center',
    hrStyle: { borderColor: '#00ffff', borderWidth: '1px', margin: '24px 0' },
    sectionBorderStyle: { borderLeft: '3px solid #00ffff', paddingLeft: '16px' },
    cardStyle: { backgroundColor: '#0f0f1a', padding: '20px', border: '1px solid #00ffff', borderRadius: '6px' },
  },
  handwritten: {
    fontFamily: "'Nunito', 'Trebuchet MS', Verdana, Arial, sans-serif",
    headingFontFamily: "'Caveat', Georgia, 'Palatino Linotype', serif",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Nunito:wght@400;600&display=swap",
    bodyBg: '#fdfaf5',
    bodyColor: '#2c2c2c',
    headingWeight: '600',
    headingLetterSpacing: '0.01em',
    borderRadius: '8px',
    sectionBorderRadius: '0',
    sectionPadding: '44px 40px',
    buttonBorderRadius: '8px',
    buttonPadding: '14px 44px',
    containerBorder: '2px solid #d4c5a9',
    heroAlign: 'center',
    hrStyle: { borderColor: '#d4c5a9', borderWidth: '1px', borderStyle: 'dashed', margin: '20px 0' },
    sectionBorderStyle: {},
    cardStyle: { backgroundColor: '#fffef9', padding: '24px', borderRadius: '14px', border: '1px dashed #d4c5a9' },
  },
  bauhaus: {
    fontFamily: "'Work Sans', Verdana, Arial, Helvetica, sans-serif",
    headingFontFamily: "'Bebas Neue', Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Work+Sans:wght@400;700&display=swap",
    bodyBg: '#ffffff',
    bodyColor: '#000000',
    headingWeight: '900',
    headingLetterSpacing: '-0.02em',
    borderRadius: '0',
    sectionBorderRadius: '0',
    sectionPadding: '52px 40px',
    buttonBorderRadius: '0',
    buttonPadding: '16px 52px',
    containerBorder: '3px solid #000000',
    heroAlign: 'left',
    hrStyle: { borderColor: '#cc0000', borderWidth: '4px', margin: '24px 0' },
    sectionBorderStyle: {},
    cardStyle: { backgroundColor: '#f5f5f5', padding: '24px', border: '3px solid #000' },
  },
};

// ─────────────────────────────────────────────
// Font variant map — curated heading + body pairs per design style
// ─────────────────────────────────────────────

export interface FontVariant {
  label: string;
  fontFamily: string;
  headingFontFamily: string;
  googleFontsUrl: string;
}

export const fontVariants: Record<string, FontVariant[]> = {
  minimalist: [
    {
      label: 'Plus Jakarta Sans',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif",
      headingFontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif",
      googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,700;1,400&display=swap',
    },
    {
      label: 'Inter + DM Sans',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif",
      headingFontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif",
      googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@400;700&display=swap',
    },
    {
      label: 'Outfit',
      fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif",
      headingFontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif",
      googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap',
    },
    {
      label: 'Manrope + Syne',
      fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif",
      headingFontFamily: "'Syne', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif",
      googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Manrope:ital,wght@0,400;0,700;1,400&family=Syne:wght@700;800&display=swap',
    },
  ],
  editorial: [
    {
      label: 'Lora + Playfair',
      fontFamily: "'Lora', Georgia, 'Palatino Linotype', serif",
      headingFontFamily: "'Playfair Display', Georgia, 'Palatino Linotype', serif",
      googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lora:ital,wght@0,400;0,600;1,400&display=swap',
    },
    {
      label: 'Crimson Pro + Cormorant',
      fontFamily: "'Crimson Pro', Georgia, serif",
      headingFontFamily: "'Cormorant Garamond', Georgia, serif",
      googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&display=swap',
    },
    {
      label: 'EB Garamond + DM Serif',
      fontFamily: "'EB Garamond', Georgia, serif",
      headingFontFamily: "'DM Serif Display', Georgia, serif",
      googleFontsUrl: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap',
    },
    {
      label: 'Libre Baskerville',
      fontFamily: "'Libre Baskerville', Georgia, serif",
      headingFontFamily: "'Libre Baskerville', Georgia, serif",
      googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap',
    },
  ],
  retro: [
    {
      label: 'Nunito + DM Serif',
      fontFamily: "'Nunito', 'Trebuchet MS', sans-serif",
      headingFontFamily: "'DM Serif Display', Georgia, serif",
      googleFontsUrl: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Nunito:wght@400;700&display=swap',
    },
    {
      label: 'Josefin Sans + Abril Fatface',
      fontFamily: "'Josefin Sans', Arial, sans-serif",
      headingFontFamily: "'Abril Fatface', Georgia, serif",
      googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Josefin+Sans:wght@400;700&display=swap',
    },
    {
      label: 'Raleway + Lobster Two',
      fontFamily: "'Raleway', Arial, sans-serif",
      headingFontFamily: "'Lobster Two', Georgia, cursive",
      googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Lobster+Two:ital,wght@0,700;1,700&family=Raleway:wght@400;700&display=swap',
    },
    {
      label: 'Karla + Fredoka',
      fontFamily: "'Karla', Arial, sans-serif",
      headingFontFamily: "'Fredoka', Arial, sans-serif",
      googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;700&family=Karla:wght@400;700&display=swap',
    },
  ],
  brutalist: [
    {
      label: 'Space Grotesk',
      fontFamily: "'Space Grotesk', Arial, sans-serif",
      headingFontFamily: "'Space Grotesk', 'Arial Black', sans-serif",
      googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap',
    },
    {
      label: 'Archivo Black',
      fontFamily: "'Archivo Black', Impact, sans-serif",
      headingFontFamily: "'Archivo Black', Impact, sans-serif",
      googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap',
    },
    {
      label: 'Barlow Condensed',
      fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif",
      headingFontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif",
      googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;900&display=swap',
    },
    {
      label: 'Teko',
      fontFamily: "'Teko', Impact, sans-serif",
      headingFontFamily: "'Teko', Impact, sans-serif",
      googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Teko:wght@400;700&display=swap',
    },
  ],
  cyberpunk: [
    {
      label: 'Share Tech Mono + Orbitron',
      fontFamily: "'Share Tech Mono', 'Courier New', monospace",
      headingFontFamily: "'Orbitron', 'Courier New', monospace",
      googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap',
    },
    {
      label: 'Exo 2 + Russo One',
      fontFamily: "'Exo 2', Arial, Helvetica, sans-serif",
      headingFontFamily: "'Russo One', Arial, Helvetica, sans-serif",
      googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Russo+One&family=Exo+2:wght@400;700&display=swap',
    },
    {
      label: 'Rajdhani + Audiowide',
      fontFamily: "'Rajdhani', Arial, Helvetica, sans-serif",
      headingFontFamily: "'Audiowide', Arial, Helvetica, sans-serif",
      googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Audiowide&family=Rajdhani:wght@400;700&display=swap',
    },
    {
      label: 'Oxanium',
      fontFamily: "'Oxanium', 'Courier New', Courier, monospace",
      headingFontFamily: "'Oxanium', 'Courier New', Courier, monospace",
      googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Oxanium:wght@400;700&display=swap',
    },
  ],
  handwritten: [
    {
      label: 'Nunito + Caveat',
      fontFamily: "'Nunito', 'Trebuchet MS', sans-serif",
      headingFontFamily: "'Caveat', Georgia, 'Palatino Linotype', serif",
      googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Nunito:wght@400;600&display=swap',
    },
    {
      label: 'Quicksand + Patrick Hand',
      fontFamily: "'Quicksand', 'Trebuchet MS', Arial, sans-serif",
      headingFontFamily: "'Patrick Hand', Georgia, serif",
      googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Patrick+Hand&family=Quicksand:wght@400;600&display=swap',
    },
    {
      label: 'Comfortaa + Pacifico',
      fontFamily: "'Comfortaa', 'Trebuchet MS', Arial, sans-serif",
      headingFontFamily: "'Pacifico', Georgia, serif",
      googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Pacifico&family=Comfortaa:wght@400;700&display=swap',
    },
    {
      label: 'Lato + Kalam',
      fontFamily: "'Lato', Arial, Helvetica, sans-serif",
      headingFontFamily: "'Kalam', Georgia, serif",
      googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=Lato:ital,wght@0,400;0,700;1,400&display=swap',
    },
  ],
  bauhaus: [
    {
      label: 'Work Sans + Bebas Neue',
      fontFamily: "'Work Sans', Verdana, sans-serif",
      headingFontFamily: "'Bebas Neue', Impact, sans-serif",
      googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Work+Sans:wght@400;700&display=swap',
    },
    {
      label: 'Raleway + Anton',
      fontFamily: "'Raleway', Arial, sans-serif",
      headingFontFamily: "'Anton', Impact, sans-serif",
      googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Anton&family=Raleway:wght@400;700&display=swap',
    },
    {
      label: 'Montserrat + Black Han Sans',
      fontFamily: "'Montserrat', Arial, sans-serif",
      headingFontFamily: "'Black Han Sans', Impact, sans-serif",
      googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Montserrat:wght@400;700&display=swap',
    },
    {
      label: 'Fjalla One',
      fontFamily: "'Fjalla One', Impact, sans-serif",
      headingFontFamily: "'Fjalla One', Impact, sans-serif",
      googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Fjalla+One&display=swap',
    },
  ],
};

// ─────────────────────────────────────────────
// Icon helper
// ─────────────────────────────────────────────

/**
 * Renders a Phosphor icon via the Iconify API as an <img> tag (works in all modern email clients).
 * Falls back to an emoji/unicode Text element when no iconName is provided.
 */
function renderPhosphorIcon(
  iconName: string | undefined,
  emojiFallback: string | undefined,
  color: string,
  size: number,
): React.ReactElement {
  if (iconName) {
    const encodedColor = encodeURIComponent(color);
    // Request 2× the display size so icons look sharp on retina/HiDPI screens
    const fetch2x = size * 2;
    const url = `https://api.iconify.design/ph/${iconName}.svg?color=${encodedColor}&width=${fetch2x}&height=${fetch2x}`;
    return React.createElement(Img, {
      src: url,
      alt: iconName,
      width: String(fetch2x),
      height: String(fetch2x),
      style: { width: `${size}px`, height: `${size}px`, display: 'block', margin: '0 auto' },
    });
  }
  return React.createElement(Text, {
    style: { fontSize: `${Math.round(size * 0.85)}px`, margin: '0', lineHeight: '1', textAlign: 'center' as const },
  }, emojiFallback || '\u2726');
}

// ─────────────────────────────────────────────
// Contrast helper — picks readable text color for a given card bg
// ─────────────────────────────────────────────

/**
 * Returns a text color (dark or light) that contrasts well against `bgHex`.
 * Used to ensure card text is readable regardless of the section's textColor override.
 */
function cardTextColor(bgHex: string | undefined): string {
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
// Section renderers
// ─────────────────────────────────────────────
function renderHero(section: EmailSection, config: StyleConfig, primaryColor: string, si = 0, preview = false): React.ReactElement {
  const hasBgImage = !!section.backgroundImageUrl;
  // When a background image is present, always force white text for readability
  const fg  = section.textColor || (hasBgImage ? '#ffffff' : config.bodyColor);
  const btn = section.buttonColor || primaryColor;

  // Section-level background: photo → gradient → solid color → faint brand tint
  const sectionBgStyle: React.CSSProperties = hasBgImage
    ? {
        backgroundImage: `url(${section.backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        // Solid-color fallback for Outlook desktop which ignores CSS background-image
        backgroundColor: section.backgroundColor || primaryColor,
      }
    : section.backgroundGradient
    ? { background: section.backgroundGradient }
    : section.backgroundColor
    ? { backgroundColor: section.backgroundColor }
    : { background: `linear-gradient(150deg, ${primaryColor}22 0%, ${primaryColor}08 100%)` };

  // Inner wrapper: overlay gradient + padding (replaces Section padding)
  const innerStyle: React.CSSProperties = hasBgImage
    ? {
        background: section.backgroundImageOverlay ||
          'linear-gradient(to bottom, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.62) 100%)',
        padding: '80px 48px',
        textAlign: config.heroAlign,
      }
    : {
        padding: '72px 40px',
        textAlign: config.heroAlign,
      };

  const eyebrowColor = hasBgImage ? 'rgba(255,255,255,0.75)' : btn;
  const subColor     = hasBgImage ? 'rgba(255,255,255,0.82)' : fg + '99';
  const btnBg        = hasBgImage ? '#ffffff' : btn;
  const btnFg        = hasBgImage ? primaryColor : '#ffffff';
  const btnShadow    = hasBgImage ? '0 4px 24px rgba(0,0,0,0.35)' : `0 4px 20px ${btn}55`;
  const linkColor    = hasBgImage ? 'rgba(255,255,255,0.88)' : btn;

  return React.createElement(Section, { style: { ...sectionBgStyle, borderRadius: config.sectionBorderRadius, ...(hasBgImage ? { overflow: 'hidden' as const } : {}) } },
    React.createElement('div', { className: 'em-section', style: innerStyle },
      // Show inline image only when there is no background photo
      !hasBgImage && section.imageUrl
        ? React.createElement(Img, {
            src: section.imageUrl,
            alt: section.imageAlt || '',
            width: '1040',
            style: { width: '100%', maxWidth: '520px', marginBottom: '32px', borderRadius: config.borderRadius, display: 'block', margin: '0 auto 32px auto' }
          })
        : null,
      // Eyebrow label
      section.eyebrow
        ? React.createElement(Text, {
            ...pv(preview, si, 'eyebrow'),
            style: {
              fontFamily: config.fontFamily,
              fontSize: '11px',
              fontWeight: '700',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.14em',
              color: eyebrowColor,
              margin: '0 0 12px 0',
            }
          }, section.eyebrow)
        : null,
      // Main headline — 42px for cinematic impact
      section.heading
        ? React.createElement(Heading, {
            ...pv(preview, si, 'heading'),
            as: 'h1',
            style: {
              fontFamily: config.headingFontFamily,
              fontSize: '42px',
              fontWeight: config.headingWeight,
              letterSpacing: config.headingLetterSpacing,
              color: fg,
              margin: '0 0 16px 0',
              lineHeight: '1.15',
            }
          }, section.heading)
        : null,
      // Intro — large bold lead statement rendered below the headline
      section.intro
        ? React.createElement(Text, {
            ...pv(preview, si, 'intro'),
            style: {
              fontFamily: config.fontFamily,
              fontSize: '19px',
              fontWeight: '600',
              color: fg,
              lineHeight: '1.6',
              margin: '0 0 14px 0',
            }
          }, section.intro)
        : null,
      // Subheading
      section.subheading
        ? React.createElement(Text, {
            ...pv(preview, si, 'subheading'),
            style: {
              fontFamily: config.fontFamily,
              fontSize: '17px',
              color: subColor,
              margin: '0 0 28px 0',
              lineHeight: '1.65',
            }
          }, section.subheading)
        : null,
      // Primary CTA button
      section.buttonText
        ? React.createElement(Button, {
            href: section.buttonUrl || '#',
            className: 'em-btn',
            style: {
              display: 'inline-block',
              marginTop: '4px',
              padding: config.buttonPadding,
              backgroundColor: btnBg,
              color: btnFg,
              fontFamily: config.fontFamily,
              fontWeight: '700',
              fontSize: '16px',
              borderRadius: config.buttonBorderRadius,
              textDecoration: 'none',
              boxShadow: btnShadow,
            }
          }, section.buttonText)
        : null,
      // Optional secondary text link below the primary button
      section.secondaryButtonText
        ? React.createElement(Text, {
            style: { margin: '16px 0 0 0', textAlign: config.heroAlign }
          },
            React.createElement(Link, {
              href: section.secondaryButtonUrl || '#',
              style: {
                fontFamily: config.fontFamily,
                fontSize: '14px',
                color: linkColor,
                textDecoration: 'underline',
                fontWeight: '600',
              }
            }, section.secondaryButtonText)
          )
        : null
    ) // end inner div
  );
}

function renderContent(section: EmailSection, config: StyleConfig, primaryColor: string, si = 0, preview = false): React.ReactElement {
  const bg  = section.backgroundColor;
  const fg  = section.textColor || config.bodyColor;
  const accent = section.buttonColor || primaryColor;
  // Split text on double-newline to create multiple paragraphs
  const paragraphs = (section.text || '').split(/\n\n+/).filter(Boolean);
  return React.createElement(Section, {
    className: 'em-section',
    style: { padding: config.sectionPadding, ...config.sectionBorderStyle, ...(bg ? { backgroundColor: bg, borderRadius: config.sectionBorderRadius } : {}) }
  },
    // Optional eyebrow label — small uppercase coloured category tag above heading
    section.eyebrow
      ? React.createElement(Text, {
          ...pv(preview, si, 'eyebrow'),
          style: {
            fontFamily: config.fontFamily,
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.12em',
            color: accent,
            margin: '0 0 8px 0',
          }
        }, section.eyebrow)
      : null,
    section.heading
      ? React.createElement(Heading, {
          ...pv(preview, si, 'heading'),
          as: 'h2',
          style: {
            fontFamily: config.headingFontFamily,
            fontSize: '24px',
            lineHeight: '1.2',
            fontWeight: config.headingWeight,
            letterSpacing: config.headingLetterSpacing,
            color: fg,
            margin: '0 0 12px 0',
          }
        }, section.heading)
      : null,
    // Optional intro line — rendered larger, slightly bolder
    section.intro
      ? React.createElement(Text, {
          ...pv(preview, si, 'intro'),
          style: {
            fontFamily: config.fontFamily,
            fontSize: '19px',
            fontWeight: '600',
            color: fg,
            lineHeight: '1.6',
            margin: '0 0 16px 0',
          }
        }, section.intro)
      : null,
    // Multi-paragraph body text
    ...paragraphs.map((para, i) =>
      React.createElement(Text, {
        ...pv(preview, si, 'text', i),
        key: i,
        style: {
          fontFamily: config.fontFamily,
          fontSize: '16px',
          color: fg,
          lineHeight: '1.75',
          margin: i < paragraphs.length - 1 ? '0 0 14px 0' : '0',
        }
      }, para)
    )
  );
}

function renderTestimonial(section: EmailSection, config: StyleConfig, primaryColor: string, secondaryColor: string, si = 0, preview = false): React.ReactElement {
  const fg  = section.textColor   || config.bodyColor;
  const btn = section.buttonColor || primaryColor;
  // Side-by-side layout: circular avatar on the left, quote + author on the right
  if (section.authorImage) {
    return React.createElement(Section, { className: 'em-section', style: { padding: config.sectionPadding, ...(section.backgroundColor ? { backgroundColor: section.backgroundColor, borderRadius: config.sectionBorderRadius } : {}) } },
      React.createElement('div', { style: { ...config.cardStyle } },
        React.createElement(Row, null,
          React.createElement(Column, { style: { width: '76px', verticalAlign: 'top' } },
            React.createElement(Img, {
              src: section.authorImage,
              alt: section.author || '',
              width: '56',
              height: '56',
              style: { borderRadius: '50%', display: 'block', width: '56px', height: '56px' }
            })
          ),
          React.createElement(Column, { style: { verticalAlign: 'middle' } },
            section.quote
              ? React.createElement(Text, {
                  ...pv(preview, si, 'quote'),
                  style: {
                    fontFamily: config.fontFamily,
                    fontSize: '16px',
                    fontStyle: 'italic',
                    color: fg,
                    lineHeight: '1.65',
                    margin: '0 0 10px 0',
                  }
                }, `\u201C${section.quote}\u201D`)
              : null,
            section.author
              ? React.createElement(Text, {
                  ...pv(preview, si, 'author'),
                  style: {
                    fontFamily: config.fontFamily,
                    fontSize: '13px',
                    fontWeight: '700',
                    color: btn,
                    margin: '0 0 2px 0',
                  }
                }, section.author)
              : null,
            section.authorTitle
              ? React.createElement(Text, {
                  ...pv(preview, si, 'authorTitle'),
                  style: {
                    fontFamily: config.fontFamily,
                    fontSize: '12px',
                    color: fg + '88',
                    margin: '0',
                  }
                }, section.authorTitle)
              : null
          )
        )
      )
    );
  }

  // Centered card layout (no avatar)
  return React.createElement(Section, {
    className: 'em-section',
    style: { padding: config.sectionPadding, ...(section.backgroundColor ? { backgroundColor: section.backgroundColor, borderRadius: config.sectionBorderRadius } : {}) }
  },
    React.createElement('div', {
      style: {
        ...config.cardStyle,
        textAlign: 'center' as const,
        borderTop: `4px solid ${btn}`,
      }
    },
      // Large decorative opening quotation mark
      React.createElement(Text, {
        style: {
          fontFamily: 'Georgia, serif',
          fontSize: '80px',
          color: btn,
          lineHeight: '0.6',
          margin: '0 0 20px 0',
          opacity: 0.35,
        }
      }, '\u201C'),
      section.quote
        ? React.createElement(Text, {
            ...pv(preview, si, 'quote'),
            style: {
              fontFamily: config.fontFamily,
              fontSize: '18px',
              fontStyle: 'italic',
              color: fg,
              lineHeight: '1.6',
              margin: '0 0 16px 0',
            }
          }, section.quote)
        : null,
      section.author
        ? React.createElement(Text, {
            ...pv(preview, si, 'author'),
            style: {
              fontFamily: config.fontFamily,
              fontSize: '14px',
              fontWeight: '700',
              color: btn,
              margin: '0 0 4px 0',
            }
          }, section.author)
        : null,
      section.authorTitle
        ? React.createElement(Text, {
            ...pv(preview, si, 'authorTitle'),
            style: {
              fontFamily: config.fontFamily,
              fontSize: '12px',
              color: fg + '88',
              margin: '0',
            }
          }, section.authorTitle)
        : null
    )
  );
}

function renderFeatureList(section: EmailSection, config: StyleConfig, primaryColor: string): React.ReactElement {
  const fg  = section.textColor   || config.bodyColor;
  const btn = section.buttonColor || primaryColor;
  // Card text must contrast the card's own background, not the section override
  const cFg = cardTextColor(config.cardStyle.backgroundColor as string | undefined);
  const cFgMuted = cFg + '99';
  const features = section.features || [];
  const isGrid = section.layout === 'grid';
  const isNumbered = !!section.numbered;

  const headingEl = section.heading
    ? React.createElement(Heading, {
        as: 'h2',
        style: {
          fontFamily: config.headingFontFamily,
          fontSize: '24px',
          lineHeight: '1.2',
          fontWeight: config.headingWeight,
          color: fg,
          margin: '0 0 20px 0',
          textAlign: (isGrid ? 'center' : 'left') as any,
        }
      }, section.heading)
    : null;

  // 2-column centered card grid variant
  if (isGrid) {
    const pairs: typeof features[] = [];
    for (let i = 0; i < features.length; i += 2) pairs.push(features.slice(i, i + 2));
    return React.createElement(Section, { className: 'em-section', style: { padding: config.sectionPadding, ...(section.backgroundColor ? { backgroundColor: section.backgroundColor, borderRadius: config.sectionBorderRadius } : {}) } },
      headingEl,
      ...pairs.map((pair, rowIdx) =>
        React.createElement(Section, { key: rowIdx, style: { marginBottom: '16px' } },
          React.createElement(Row, null,
            ...pair.map((feature, i) =>
            React.createElement(Column, {
              key: i,
              className: 'em-col',
              style: { verticalAlign: 'top', padding: '0 8px' }
            },
              React.createElement('div', { style: { ...config.cardStyle, textAlign: 'center' as const } },
                React.createElement('div', { style: { margin: '0 0 10px 0' } },
                  renderPhosphorIcon(feature.iconName, feature.icon, btn, 32)
                ),
                React.createElement(Text, {
                  style: {
                    fontFamily: config.fontFamily,
                    fontSize: '15px',
                    fontWeight: '700',
                    color: cFg,
                    margin: '0 0 6px 0',
                  }
                }, feature.title),
                React.createElement(Text, {
                  style: {
                    fontFamily: config.fontFamily,
                    fontSize: '13px',
                    color: cFgMuted,
                    lineHeight: '1.5',
                    margin: '0',
                  }
                }, feature.description)
              )
            )
            )
          )
        )
      )
    );
  }

  // Default vertical list (numbered badges or icon bullets)
  return React.createElement(Section, { className: 'em-section', style: { padding: config.sectionPadding, ...(section.backgroundColor ? { backgroundColor: section.backgroundColor, borderRadius: config.sectionBorderRadius } : {}) } },
    headingEl,
    ...features.map((feature, i) =>
      React.createElement(Section, { key: i, style: { marginBottom: '16px', display: 'table', width: '100%' } },
        React.createElement(Row, null,
          React.createElement(Column, { style: { width: '40px', verticalAlign: 'top' } },
            isNumbered
              ? React.createElement('div', {
                  style: {
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: btn,
                    color: '#ffffff',
                    fontFamily: config.fontFamily,
                    fontSize: '13px',
                    fontWeight: '700',
                    lineHeight: '28px',
                    textAlign: 'center' as const,
                    display: 'inline-block',
                  }
                }, String(i + 1))
              : React.createElement('div', { style: { margin: '0' } },
                  renderPhosphorIcon(feature.iconName, feature.icon, btn, 24)
                )
          ),
          React.createElement(Column, { style: { verticalAlign: 'top' } },
            React.createElement(Text, {
              style: {
                fontFamily: config.fontFamily,
                fontSize: '15px',
                fontWeight: '700',
                color: fg,
                margin: '0 0 4px 0',
              }
            }, feature.title),
            React.createElement(Text, {
              style: {
                fontFamily: config.fontFamily,
                fontSize: '14px',
                color: fg + '99',
                margin: '0',
                lineHeight: '1.5',
              }
            }, feature.description)
          )
        )
      )
    )
  );
}

function renderPricingTable(section: EmailSection, config: StyleConfig, primaryColor: string): React.ReactElement {
  const fg  = section.textColor   || config.bodyColor;
  const btn = section.buttonColor || primaryColor;
  const plans = section.plans || [];
  return React.createElement(Section, {
    className: 'em-section',
    style: { padding: config.sectionPadding, ...(section.backgroundColor ? { backgroundColor: section.backgroundColor, borderRadius: config.sectionBorderRadius } : {}) }
  },
    section.heading
      ? React.createElement(Heading, {
          as: 'h2',
          style: {
            fontFamily: config.headingFontFamily,
            fontSize: '24px',
            lineHeight: '1.2',
            fontWeight: config.headingWeight,
            color: fg,
            margin: '0 0 20px 0',
            textAlign: 'center',
          }
        }, section.heading)
      : null,
    React.createElement(Row, null,
      ...plans.map((plan, i) =>
        React.createElement(Column, {
          key: i,
          className: 'em-col',
          style: {
            padding: '16px',
            textAlign: 'center' as const,
            ...(plan.highlighted ? {
              backgroundColor: btn,
              color: '#fff',
              borderRadius: config.borderRadius,
            } : config.cardStyle)
          }
        },
          React.createElement(Text, {
            style: {
              fontFamily: config.fontFamily,
              fontSize: '14px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: plan.highlighted ? '#fff' : fg + '88',
              margin: '0 0 8px 0',
            }
          }, plan.name),
          React.createElement(Text, {
            style: {
              fontFamily: config.fontFamily,
              fontSize: '36px',
              fontWeight: '900',
              color: plan.highlighted ? '#fff' : fg,
              margin: '0 0 4px 0',
              lineHeight: '1',
            }
          }, plan.price),
          plan.period
            ? React.createElement(Text, {
                style: {
                  fontFamily: config.fontFamily,
                  fontSize: '12px',
                  color: plan.highlighted ? '#ffffffcc' : fg + '88',
                  margin: '0 0 16px 0',
                }
              }, plan.period)
            : null,
          React.createElement(Hr, { style: { borderColor: plan.highlighted ? '#ffffff44' : '#e0e0e0', margin: '12px 0' } }),
          ...(plan.features || []).map((feat, j) =>
            React.createElement(Text, {
              key: j,
              style: {
                fontFamily: config.fontFamily,
                fontSize: '13px',
                color: plan.highlighted ? '#ffffffdd' : fg,
                margin: '4px 0',
              }
            }, `✓ ${feat}`)
          ),
          plan.buttonText
            ? React.createElement(Button, {
                href: '#',
                className: 'em-btn',
                style: {
                  display: 'block',
                  marginTop: '16px',
                  padding: config.buttonPadding,
                  backgroundColor: plan.highlighted ? '#fff' : btn,
                  color: plan.highlighted ? btn : '#fff',
                  fontFamily: config.fontFamily,
                  fontWeight: '700',
                  fontSize: '14px',
                  borderRadius: config.buttonBorderRadius,
                  textDecoration: 'none',
                }
              }, plan.buttonText)
            : null
        )
      )
    )
  );
}

function renderStats(section: EmailSection, config: StyleConfig, primaryColor: string): React.ReactElement {
  const fg  = section.textColor   || config.bodyColor;
  const btn = section.buttonColor || primaryColor;
  const cFg = cardTextColor(config.cardStyle.backgroundColor as string | undefined);
  const stats = section.stats || [];
  return React.createElement(Section, {
    className: 'em-section',
    style: { padding: config.sectionPadding, ...(section.backgroundColor ? { backgroundColor: section.backgroundColor, borderRadius: config.sectionBorderRadius } : {}) }
  },
    section.heading
      ? React.createElement(Heading, {
          as: 'h2',
          style: {
            fontFamily: config.headingFontFamily,
            fontSize: '24px',
            lineHeight: '1.2',
            fontWeight: config.headingWeight,
            color: fg,
            margin: '0 0 20px 0',
            textAlign: 'center',
          }
        }, section.heading)
      : null,
    React.createElement(Row, null,
      ...stats.map((stat, i) =>
        React.createElement(Column, {
          key: i,
          className: 'em-col',
          style: { verticalAlign: 'top', padding: '6px' }
        },
          React.createElement('div', {
            style: {
              ...config.cardStyle,
              textAlign: 'center' as const,
              borderTop: `3px solid ${btn}`,
              padding: '20px 12px',
            }
          },
            (stat.icon || stat.iconName)
              ? React.createElement('div', { style: { margin: '0 0 8px 0' } },
                  renderPhosphorIcon(stat.iconName, stat.icon, btn, 28)
                )
              : null,
            React.createElement(Text, {
              className: 'em-stat-value',
              style: {
                fontFamily: config.fontFamily,
                fontSize: '48px',
                fontWeight: '900',
                color: btn,
                margin: '0 0 4px 0',
                lineHeight: '1',
              }
            }, stat.value),
            React.createElement(Text, {
              style: {
                fontFamily: config.fontFamily,
                fontSize: '13px',
                color: cFg + '88',
                margin: '0',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }
            }, stat.label)
          )
        )
      )
    )
  );
}

function renderGallery(section: EmailSection, config: StyleConfig): React.ReactElement {
  const fg = section.textColor || config.bodyColor;
  const images = section.images || [];
  // 2 per row for exactly 4 images (2×2 grid), otherwise 3 per row
  const perRow = images.length === 4 ? 2 : Math.min(images.length, 3);
  const rows: typeof images[] = [];
  for (let i = 0; i < images.length; i += perRow) rows.push(images.slice(i, i + perRow));

  return React.createElement(Section, {
    className: 'em-section',
    style: { padding: config.sectionPadding, ...(section.backgroundColor ? { backgroundColor: section.backgroundColor, borderRadius: config.sectionBorderRadius } : {}) }
  },
    section.heading
      ? React.createElement(Heading, {
          as: 'h2',
          style: {
            fontFamily: config.headingFontFamily,
            fontSize: '24px',
            lineHeight: '1.2',
            fontWeight: config.headingWeight,
            color: fg,
            margin: '0 0 16px 0',
          }
        }, section.heading)
      : null,
    ...rows.map((rowImages, rowIdx) =>
      React.createElement(Section, { key: rowIdx, style: { marginBottom: rowIdx < rows.length - 1 ? '8px' : '0' } },
        React.createElement(Row, null,
          ...rowImages.map((img, i) =>
            React.createElement(Column, {
            key: i,
            className: 'em-col',
            style: { padding: '4px', verticalAlign: 'top' }
          },
            React.createElement(Img, {
              src: img.url,
              alt: img.alt,
              width: perRow === 2 ? '280' : '180',
              style: { width: '100%', borderRadius: config.borderRadius, display: 'block' }
            }),
            React.createElement(Text, {
              style: {
                fontFamily: config.fontFamily,
                fontSize: '12px',
                fontWeight: '600',
                color: fg,
                textAlign: 'center' as const,
                margin: '6px 0 0 0',
              }
            }, img.alt),
            img.caption
              ? React.createElement(Text, {
                  style: {
                    fontFamily: config.fontFamily,
                    fontSize: '11px',
                    color: fg + '88',
                    textAlign: 'center' as const,
                    margin: '2px 0 0 0',
                  }
                }, img.caption)
              : null
          )
          )
        )
      )
    )
  );
}

function renderAnnouncement(section: EmailSection, config: StyleConfig, primaryColor: string, si = 0, preview = false): React.ReactElement {
  const accent = section.buttonColor || primaryColor;
  const fg = section.textColor || config.bodyColor;
  return React.createElement(Section, {
    className: 'em-section',
    style: {
      padding: config.sectionPadding,
    }
  },
    React.createElement('div', {
      style: {
        backgroundColor: (section.backgroundColor) || (accent + '15'),
        border: `2px solid ${accent}`,
        borderRadius: config.sectionBorderRadius,
        padding: '24px',
        textAlign: 'center' as const,
      }
    },
      section.heading
        ? React.createElement(Heading, {
            ...pv(preview, si, 'heading'),
            as: 'h2',
            style: {
              fontFamily: config.headingFontFamily,
              fontSize: '22px',
              lineHeight: '1.2',
              fontWeight: config.headingWeight,
              color: accent,
              margin: '0 0 12px 0',
            }
          }, section.heading)
        : null,
      section.text
        ? React.createElement(Text, {
            ...pv(preview, si, 'text'),
            style: {
              fontFamily: config.fontFamily,
              fontSize: '15px',
              color: fg,
              margin: '0 0 16px 0',
              lineHeight: '1.6',
            }
          }, section.text)
        : null,
      section.buttonText
        ? React.createElement(Button, {
            href: section.buttonUrl || '#',
            className: 'em-btn',
            style: {
              padding: config.buttonPadding,
              backgroundColor: accent,
              color: '#ffffff',
              fontFamily: config.fontFamily,
              fontWeight: '700',
              fontSize: '14px',
              borderRadius: config.buttonBorderRadius,
              textDecoration: 'none',
            }
          }, section.buttonText)
        : null
    )
  );
}

function renderCta(section: EmailSection, config: StyleConfig, primaryColor: string, si = 0, preview = false): React.ReactElement {
  const hasBgImage = !!section.backgroundImageUrl;
  // CTA defaults to brand primary background for maximum visual impact
  const sectionBgStyle: React.CSSProperties = hasBgImage
    ? {
        backgroundImage: `url(${section.backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: section.backgroundColor || primaryColor,
      }
    : section.backgroundGradient
    ? { background: section.backgroundGradient }
    : { backgroundColor: section.backgroundColor || primaryColor };

  const fg  = section.textColor || '#ffffff';
  const btn = section.buttonColor || '#ffffff';

  // Inner overlay + padding wrapper
  const innerStyle: React.CSSProperties = hasBgImage
    ? {
        background: section.backgroundImageOverlay ||
          'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.65) 100%)',
        padding: config.sectionPadding,
        textAlign: 'center' as const,
      }
    : {
        padding: config.sectionPadding,
        textAlign: 'center' as const,
      };

  return React.createElement(Section, { style: { ...sectionBgStyle, borderRadius: config.sectionBorderRadius, ...(hasBgImage ? { overflow: 'hidden' as const } : {}) } },
    React.createElement('div', { className: 'em-section', style: innerStyle },
      section.heading
        ? React.createElement(Heading, {
            ...pv(preview, si, 'heading'),
            as: 'h2',
            style: {
              fontFamily: config.headingFontFamily,
              fontSize: '26px',
              lineHeight: '1.2',
              fontWeight: config.headingWeight,
              letterSpacing: config.headingLetterSpacing,
              color: fg,
              margin: '0 0 12px 0',
            }
          }, section.heading)
        : null,
      section.text
        ? React.createElement(Text, {
            ...pv(preview, si, 'text'),
            style: {
              fontFamily: config.fontFamily,
              fontSize: '16px',
              color: hasBgImage ? 'rgba(255,255,255,0.85)' : fg + '99',
              margin: '0 0 24px 0',
              lineHeight: '1.6',
            }
          }, section.text)
        : null,
      section.buttonText
        ? React.createElement(Button, {
            href: section.buttonUrl || '#',
            className: 'em-btn',
            style: {
              padding: config.buttonPadding,
              backgroundColor: btn,
              color: btn === '#ffffff' ? primaryColor : '#ffffff',
              fontFamily: config.fontFamily,
              fontWeight: '700',
              fontSize: '16px',
              borderRadius: config.buttonBorderRadius,
              textDecoration: 'none',
              boxShadow: hasBgImage ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.25)',
            }
          }, section.buttonText)
        : null,
      // Optional secondary action link below the primary CTA button
      section.secondaryButtonText
        ? React.createElement(Text, { style: { margin: '14px 0 0 0' } },
            React.createElement(Link, {
              href: section.secondaryButtonUrl || '#',
              style: {
                fontFamily: config.fontFamily,
                fontSize: '14px',
                color: btn,
                textDecoration: 'underline',
                fontWeight: '600',
              }
            }, section.secondaryButtonText)
          )
        : null
    ) // end inner div
  );
}

function renderFooter(section: EmailSection, config: StyleConfig, secondaryColor: string, si = 0, preview = false): React.ReactElement {
  const fg  = section.textColor   || config.bodyColor;
  const btn = section.buttonColor || secondaryColor;
  return React.createElement(Section, {
    style: { padding: '24px 0 20px 0', textAlign: 'center' as const, ...(section.backgroundColor ? { backgroundColor: section.backgroundColor, borderRadius: config.sectionBorderRadius } : {}) }
  },
    React.createElement(Hr, { style: config.hrStyle }),
    section.logoUrl
      ? React.createElement(Img, {
          src: section.logoUrl,
          alt: section.logoAlt || '',
          height: '28',
          className: 'em-logo',
          style: { height: '28px', maxWidth: '120px', width: 'auto', margin: '0 auto 14px auto', display: 'block', opacity: '0.7' }
        })
      : null,
    React.createElement(Text, {
      ...pv(preview, si, 'text'),
      style: {
        fontFamily: config.fontFamily,
        fontSize: '12px',
        color: fg + '66',
        lineHeight: '1.7',
        margin: '0 0 8px 0',
      }
    }, section.text || ''),
    section.buttonText
      ? React.createElement(Link, {
          href: section.buttonUrl || '#',
          style: {
            fontFamily: config.fontFamily,
            fontSize: '11px',
            color: btn,
            textDecoration: 'underline',
          }
        }, section.buttonText)
      : null,
    React.createElement(Text, {
      style: {
        fontFamily: config.fontFamily,
        fontSize: '11px',
        color: fg + '44',
        margin: '10px 0 0 0',
      }
    },
      'Don\'t want these emails? ',
      React.createElement(Link, {
        href: section.unsubscribeUrl || '{{unsubscribe_url}}',
        style: {
          fontFamily: config.fontFamily,
          fontSize: '11px',
          color: fg + '66',
          textDecoration: 'underline',
        }
      }, 'Unsubscribe')
    )
  );
}

function renderHeader(section: EmailSection, config: StyleConfig, primaryColor: string, secondaryColor: string, si = 0, preview = false): React.ReactElement {
  const fg  = section.textColor   || primaryColor;    // brand name / logo fallback text
  const btn = section.buttonColor || secondaryColor;  // tagline + nav links
  const borderVal = `${config.hrStyle.borderWidth ?? '1px'} ${config.hrStyle.borderStyle ?? 'solid'} ${config.hrStyle.borderColor ?? '#e0e0e0'}`;
  return React.createElement(Section, {
    style: { padding: '20px 0', borderBottom: borderVal, marginBottom: '8px', ...(section.backgroundColor ? { backgroundColor: section.backgroundColor, borderRadius: config.sectionBorderRadius } : {}) }
  },
    React.createElement(Row, null,
      React.createElement(Column, { style: { verticalAlign: 'middle' } },
        section.logoUrl
          ? React.createElement(Img, {
              src: section.logoUrl,
              alt: section.logoAlt || 'Logo',
              height: '40',
              className: 'em-logo',
              style: { height: '40px', maxWidth: '160px', width: 'auto', display: 'block' }
            })
          : React.createElement(Text, {
              style: {
                fontFamily: config.fontFamily,
                fontSize: '20px',
                fontWeight: config.headingWeight,
                color: fg,
                margin: '0',
              }
            }, section.logoAlt || 'Brand')
      ),
      section.tagline && !section.columns?.length
        ? React.createElement(Column, { style: { verticalAlign: 'middle', textAlign: 'right' as const } },
            React.createElement(Text, {
              ...pv(preview, si, 'tagline'),
              style: {
                fontFamily: config.fontFamily,
                fontSize: '12px',
                color: btn,
                margin: '0',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.08em',
                fontWeight: '600',
              }
            }, section.tagline)
          )
        : null
    ),
    // Optional nav links row — supply section.columns: [{heading:'About', buttonUrl:'/about'}, ...]
    section.columns?.length
      ? React.createElement(Row, null,
          React.createElement(Column, { style: { textAlign: 'center' as const, paddingTop: '12px' } },
            ...(section.columns).map((nav, i) =>
              React.createElement(Link, {
                key: i,
                href: nav.buttonUrl || '#',
                style: {
                  fontFamily: config.fontFamily,
                  fontSize: '12px',
                  fontWeight: '600',
                  color: btn,
                  textDecoration: 'none',
                  margin: '0 10px',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.06em',
                  display: 'inline-block',
                }
              }, nav.heading || '')
            )
          )
        )
      : null
  );
}

function renderImageText(section: EmailSection, config: StyleConfig, primaryColor: string, si = 0, preview = false): React.ReactElement {
  const fg  = section.textColor   || config.bodyColor;
  const btn = section.buttonColor || primaryColor;
  const isLeft = section.imagePosition !== 'right';
  const hasImage = !!section.imageUrl;

  const imageCol = hasImage ? React.createElement(Column, {
    className: 'em-col',
    style: {
      width: '45%',
      verticalAlign: 'middle' as const,
      paddingRight: isLeft ? '20px' : '0',
      paddingLeft: isLeft ? '0' : '20px',
    }
  },
    React.createElement(Img, {
      src: section.imageUrl!,
      alt: section.imageAlt || '',
      width: '520',
      style: { width: '100%', borderRadius: config.borderRadius, display: 'block' }
    })
  ) : null;

  const textCol = React.createElement(Column, {
    className: 'em-col',
    style: { width: hasImage ? '55%' : '100%', verticalAlign: 'middle' as const }
  },
    section.heading
      ? React.createElement(Heading, {
          ...pv(preview, si, 'heading'),
          as: 'h2',
          style: {
            fontFamily: config.headingFontFamily,
            fontSize: '22px',
            lineHeight: '1.2',
            fontWeight: config.headingWeight,
            letterSpacing: config.headingLetterSpacing,
            color: fg,
            margin: '0 0 12px 0',
          }
        }, section.heading)
      : null,
    section.text
      ? React.createElement(Text, {
          ...pv(preview, si, 'text'),
          style: {
            fontFamily: config.fontFamily,
            fontSize: '15px',
            color: fg,
            lineHeight: '1.7',
            margin: '0 0 16px 0',
          }
        }, section.text)
      : null,
    section.buttonText
      ? React.createElement(Button, {
          href: section.buttonUrl || '#',
          className: 'em-btn',
          style: {
            padding: config.buttonPadding,
            backgroundColor: btn,
            color: '#ffffff',
            fontFamily: config.fontFamily,
            fontWeight: '700',
            fontSize: '14px',
            borderRadius: config.buttonBorderRadius,
            textDecoration: 'none',
          }
        }, section.buttonText)
      : null,
    // Article-style author byline below text/button
    section.author
      ? React.createElement(Text, {
          style: {
            fontFamily: config.fontFamily,
            fontSize: '12px',
            color: fg + '77',
            margin: '12px 0 0 0',
            lineHeight: '1.4',
          }
        }, section.authorTitle
          ? `${section.author} \u00B7 ${section.authorTitle}`
          : section.author)
      : null
  );

  return React.createElement(Section, {
    className: 'em-section',
    style: { padding: config.sectionPadding, ...(section.backgroundColor ? { backgroundColor: section.backgroundColor, borderRadius: config.sectionBorderRadius } : {}) }
  },
    hasImage
      ? React.createElement(Row, null,
          ...(isLeft ? [imageCol, textCol] : [textCol, imageCol])
        )
      : textCol
  );
}

function renderCoupon(section: EmailSection, config: StyleConfig, primaryColor: string, si = 0, preview = false): React.ReactElement {
  const fg  = section.textColor   || config.bodyColor;
  const btn = section.buttonColor || primaryColor;
  return React.createElement(Section, {
    className: 'em-section',
    style: { padding: config.sectionPadding, ...(section.backgroundColor ? { backgroundColor: section.backgroundColor } : {}) }
  },
    React.createElement('div', {
      style: {
        border: `2px dashed ${btn}`,
        borderRadius: config.sectionBorderRadius,
        padding: '32px 24px',
        textAlign: 'center' as const,
        backgroundColor: btn + '0d',
      }
    },
      section.heading
        ? React.createElement(Text, {
            ...pv(preview, si, 'heading'),
            style: {
              fontFamily: config.fontFamily,
              fontSize: '13px',
              fontWeight: '700',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.1em',
              color: fg + '88',
              margin: '0 0 16px 0',
            }
          }, section.heading)
        : null,
      section.code
        ? React.createElement(Text, {
            ...pv(preview, si, 'code'),
            style: {
              fontFamily: "'Courier New', 'Courier', monospace",
              fontSize: '30px',
              fontWeight: '900',
              letterSpacing: '0.15em',
              color: btn,
              margin: '0 0 8px 0',
              padding: '10px 24px',
              border: `2px solid ${btn}`,
              borderRadius: config.borderRadius,
              display: 'inline-block',
            }
          }, section.code)
        : null,
      section.text
        ? React.createElement(Text, {
            ...pv(preview, si, 'text'),
            style: {
              fontFamily: config.fontFamily,
              fontSize: '15px',
              color: fg,
              margin: '12px 0 8px 0',
              lineHeight: '1.5',
            }
          }, section.text)
        : null,
      section.expiryText
        ? React.createElement(Text, {
            ...pv(preview, si, 'expiryText'),
            style: {
              fontFamily: config.fontFamily,
              fontSize: '12px',
              color: fg + '88',
              margin: '0',
            }
          }, section.expiryText)
        : null
    )
  );
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SOCIAL_ICON_BASE = `${SUPABASE_URL}/storage/v1/object/public/email-images/social`;

const SOCIAL_ICON_MAP: Record<string, string> = {
  twitter:   `${SOCIAL_ICON_BASE}/twitter.png`,
  x:         `${SOCIAL_ICON_BASE}/twitter.png`,
  instagram: `${SOCIAL_ICON_BASE}/instagram.png`,
  facebook:  `${SOCIAL_ICON_BASE}/facebook.png`,
  linkedin:  `${SOCIAL_ICON_BASE}/linkedin.png`,
  tiktok:    `${SOCIAL_ICON_BASE}/tiktok.png`,
  youtube:   `${SOCIAL_ICON_BASE}/youtube.png`,
};

function getSocialIconUrl(link: { platform: string; iconUrl?: string }): string | null {
  if (link.iconUrl) return link.iconUrl;
  const key = link.platform.toLowerCase().trim();
  return SOCIAL_ICON_MAP[key] || null;
}

function renderSocialLinks(section: EmailSection, config: StyleConfig, primaryColor: string): React.ReactElement {
  const fg  = section.textColor   || config.bodyColor;
  const btn = section.buttonColor || primaryColor;
  const links = section.socialLinks || [];
  return React.createElement(Section, {
    style: { padding: '16px 0', textAlign: 'center' as const, ...(section.backgroundColor ? { backgroundColor: section.backgroundColor, borderRadius: config.sectionBorderRadius } : {}) }
  },
    section.heading
      ? React.createElement(Text, {
          style: {
            fontFamily: config.fontFamily,
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.1em',
            color: fg + '88',
            margin: '0 0 12px 0',
          }
        }, section.heading)
      : null,
    React.createElement('div', {
      style: { textAlign: 'center' as const }
    },
      ...links.map((link, i) => {
        const resolvedIconUrl = getSocialIconUrl(link);
        return React.createElement(Link, {
          key: i,
          href: link.url,
          style: {
            display: 'inline-block',
            margin: '0 6px',
            color: btn,
            textDecoration: 'none',
            fontFamily: config.fontFamily,
            fontSize: resolvedIconUrl ? undefined : (link.icon ? '22px' : '12px'),
            fontWeight: resolvedIconUrl ? undefined : (link.icon ? '400' : '700'),
            verticalAlign: 'middle',
          }
        },
          resolvedIconUrl
            ? React.createElement(Img, {
                src: resolvedIconUrl,
                alt: link.platform,
                width: '28',
                height: '28',
                style: { width: '28px', height: '28px', display: 'block' }
              })
            : (link.icon || link.platform)
        );
      })
    )
  );
}

function renderColumns(section: EmailSection, config: StyleConfig, primaryColor: string): React.ReactElement {
  const fg  = section.textColor   || config.bodyColor;
  const btn = section.buttonColor || primaryColor;
  const cFg = cardTextColor(config.cardStyle.backgroundColor as string | undefined);
  const colItems = section.columns || [];
  return React.createElement(Section, {
    className: 'em-section',
    style: { padding: config.sectionPadding, ...(section.backgroundColor ? { backgroundColor: section.backgroundColor, borderRadius: config.sectionBorderRadius } : {}) }
  },
    section.heading
      ? React.createElement(Heading, {
          as: 'h2',
          style: {
            fontFamily: config.headingFontFamily,
            fontSize: '24px',
            lineHeight: '1.2',
            fontWeight: config.headingWeight,
            letterSpacing: config.headingLetterSpacing,
            color: fg,
            margin: '0 0 24px 0',
            textAlign: 'center',
          }
        }, section.heading)
      : null,
    React.createElement(Row, null,
      ...colItems.map((col, i) =>
        React.createElement(Column, {
          key: i,
          className: 'em-col',
          style: { verticalAlign: 'top', padding: '0 8px' }
        },
          React.createElement('div', {
            style: { ...config.cardStyle, textAlign: 'center' as const }
          },
            (col.icon || col.iconName)
              ? React.createElement('div', { style: { margin: '0 0 12px 0' } },
                  renderPhosphorIcon(col.iconName, col.icon, btn, 36)
                )
              : null,
            col.imageUrl
              ? React.createElement(Img, {
                  src: col.imageUrl,
                  alt: col.heading || '',
                  width: '80',
                  height: '80',
                  style: { borderRadius: config.borderRadius, margin: '0 auto 12px auto', display: 'block' }
                })
              : null,
            col.heading
              ? React.createElement(Text, {
                  style: {
                    fontFamily: config.fontFamily,
                    fontSize: '15px',
                    fontWeight: '700',
                    color: cFg,
                    margin: '0 0 8px 0',
                  }
                }, col.heading)
              : null,
            col.text
              ? React.createElement(Text, {
                  style: {
                    fontFamily: config.fontFamily,
                    fontSize: '13px',
                    color: cFg + '99',
                    lineHeight: '1.5',
                    margin: '0 0 12px 0',
                  }
                }, col.text)
              : null,
            col.buttonText
              ? React.createElement(Button, {
                  href: col.buttonUrl || '#',
                  className: 'em-btn',
                  style: {
                    padding: '8px 16px',
                    backgroundColor: btn,
                    color: '#ffffff',
                    fontFamily: config.fontFamily,
                    fontWeight: '700',
                    fontSize: '12px',
                    borderRadius: config.buttonBorderRadius,
                    textDecoration: 'none',
                  }
                }, col.buttonText)
              : null
          )
        )
      )
    )
  );
}

function renderQuote(section: EmailSection, config: StyleConfig, primaryColor: string, si = 0, preview = false): React.ReactElement {
  const fg  = section.textColor   || config.bodyColor;
  const btn = section.buttonColor || primaryColor;
  return React.createElement(Section, {
    className: 'em-section',
    style: { padding: config.sectionPadding, ...(section.backgroundColor ? { backgroundColor: section.backgroundColor } : {}) }
  },
    React.createElement('div', {
      style: {
        borderLeft: `4px solid ${btn}`,
        paddingLeft: '24px',
        margin: '0',
      }
    },
      section.text
        ? React.createElement(Text, {
            ...pv(preview, si, 'text'),
            style: {
              fontFamily: config.headingFontFamily,
              fontSize: '22px',
              fontStyle: 'italic',
              fontWeight: config.headingWeight,
              color: fg,
              lineHeight: '1.5',
              margin: '0 0 12px 0',
            }
          }, `\u201C${section.text}\u201D`)
        : null,
      section.author
        ? React.createElement(Text, {
            ...pv(preview, si, 'author'),
            style: {
              fontFamily: config.fontFamily,
              fontSize: '13px',
              fontWeight: '700',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.08em',
              color: btn,
              margin: '0',
            }
          }, `\u2014 ${section.author}${section.authorTitle ? `, ${section.authorTitle}` : ''}`)
        : null
    )
  );
}

function renderCodeBlock(section: EmailSection, config: StyleConfig, primaryColor: string): React.ReactElement {
  const fg = section.textColor || config.bodyColor;
  // Pick a theme based on design style background
  const isDark = config.bodyBg === '#0a0a0f' || config.bodyBg === '#ffffff' && config.bodyColor === '#000000';
  const theme = isDark ? oneDark : atomDark;
  return React.createElement(Section, {
    className: 'em-section',
    style: { padding: config.sectionPadding, ...(section.backgroundColor ? { backgroundColor: section.backgroundColor } : {}) }
  },
    section.heading
      ? React.createElement(Heading, {
          as: 'h3',
          style: {
            fontFamily: config.headingFontFamily,
            fontSize: '18px',
            lineHeight: '1.3',
            fontWeight: config.headingWeight,
            color: fg,
            margin: '0 0 12px 0',
          }
        }, section.heading)
      : null,
    section.text
      ? React.createElement(CodeBlock, {
          code: section.text,
          language: (section.language as any) || 'javascript',
          theme: theme,
          style: {
            borderRadius: config.borderRadius,
            fontSize: '13px',
            lineHeight: '1.6',
          }
        })
      : null,
    section.subheading
      ? React.createElement(Text, {
          style: {
            fontFamily: config.fontFamily,
            fontSize: '13px',
            color: fg + '88',
            margin: '10px 0 0 0',
            lineHeight: '1.5',
          }
        }, section.subheading)
      : null
  );
}

function renderDivider(section: EmailSection, config: StyleConfig): React.ReactElement {
  return React.createElement(Section, {
    style: { padding: '4px 0' }
  },
    React.createElement(Hr, { style: config.hrStyle }),
    section.text
      ? React.createElement(Text, {
          style: {
            fontFamily: config.fontFamily,
            fontSize: '11px',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.1em',
            color: config.bodyColor + '66',
            textAlign: 'center' as const,
            margin: '-10px 0 0 0',
          }
        }, section.text)
      : null
  );
}

// ─────────────────────────────────────────────
function renderTestimonials(section: EmailSection, config: StyleConfig, primaryColor: string, si = 0, preview = false): React.ReactElement {
  const fg       = section.textColor   || config.bodyColor;
  const btn      = section.buttonColor || primaryColor;
  const cFg      = cardTextColor(config.cardStyle.backgroundColor as string | undefined);
  const cFgMuted = cFg + '99';
  const items    = section.testimonials || [];

  const headingEl = section.heading
    ? React.createElement(Heading, {
        ...pv(preview, si, 'heading'),
        as: 'h2',
        style: {
          fontFamily: config.headingFontFamily,
          fontSize: '24px',
          lineHeight: '1.2',
          fontWeight: config.headingWeight,
          color: fg,
          margin: '0 0 8px 0',
          textAlign: 'center' as const,
        }
      }, section.heading)
    : null;

  const subheadingEl = section.subheading
    ? React.createElement(Text, {
        ...pv(preview, si, 'subheading'),
        style: {
          fontFamily: config.fontFamily,
          fontSize: '15px',
          color: fg + '99',
          margin: '0 0 24px 0',
          textAlign: 'center' as const,
        }
      }, section.subheading)
    : null;

  const pairs: typeof items[] = [];
  for (let i = 0; i < items.length; i += 2) pairs.push(items.slice(i, i + 2));

  return React.createElement(Section, {
    className: 'em-section',
    style: { padding: config.sectionPadding, ...(section.backgroundColor ? { backgroundColor: section.backgroundColor, borderRadius: config.sectionBorderRadius } : {}) }
  },
    headingEl,
    subheadingEl,
    ...pairs.map((pair, rowIdx) =>
      React.createElement(Section, { key: rowIdx, style: { marginBottom: '16px' } },
        React.createElement(Row, null,
          ...pair.map((item, i) => {
            const filled = Math.min(5, Math.max(1, Math.round(item.rating ?? 5)));
            const stars = '\u2605'.repeat(filled) + '\u2606'.repeat(5 - filled);
            return React.createElement(Column, {
              key: i,
              className: 'em-col',
              style: { verticalAlign: 'top', padding: '0 8px' }
            },
              React.createElement('div', { style: { ...config.cardStyle } },
                // Star rating
                React.createElement(Text, {
                  style: {
                    fontFamily: "'Arial', sans-serif",
                    fontSize: '16px',
                    color: btn,
                    margin: '0 0 10px 0',
                    letterSpacing: '1px',
                  }
                }, stars),
                // Quote text
                React.createElement(Text, {
                  style: {
                    fontFamily: config.fontFamily,
                    fontSize: '14px',
                    fontStyle: 'italic',
                    color: cFg,
                    lineHeight: '1.65',
                    margin: '0 0 16px 0',
                  }
                }, `\u201C${item.quote}\u201D`),
                // Author: avatar + name/title
                React.createElement(Row, null,
                  item.authorImage
                    ? React.createElement(Column, { style: { width: '44px', verticalAlign: 'middle' } },
                        React.createElement(Img, {
                          src: item.authorImage,
                          alt: item.author,
                          width: '36',
                          height: '36',
                          style: { width: '36px', height: '36px', borderRadius: '50%', display: 'block' }
                        })
                      )
                    : null,
                  React.createElement(Column, { style: { verticalAlign: 'middle' } },
                    React.createElement(Text, {
                      style: {
                        fontFamily: config.fontFamily,
                        fontSize: '13px',
                        fontWeight: '700',
                        color: cFg,
                        margin: '0 0 2px 0',
                      }
                    }, item.author),
                    item.authorTitle
                      ? React.createElement(Text, {
                          style: {
                            fontFamily: config.fontFamily,
                            fontSize: '11px',
                            color: cFgMuted,
                            margin: '0',
                          }
                        }, item.authorTitle)
                      : null
                  )
                )
              )
            );
          })
        )
      )
    )
  );
}

// ─────────────────────────────────────────────
// Main renderer
// ─────────────────────────────────────────────

function renderSection(
  section: EmailSection,
  si: number,
  config: StyleConfig,
  primaryColor: string,
  secondaryColor: string,
  preview = false,
): React.ReactElement | null {
  switch (section.type) {
    case 'header':        return renderHeader(section, config, primaryColor, secondaryColor, si, preview);
    case 'hero':          return renderHero(section, config, primaryColor, si, preview);
    case 'content':       return renderContent(section, config, primaryColor, si, preview);
    case 'testimonial':   return renderTestimonial(section, config, primaryColor, secondaryColor, si, preview);
    case 'testimonials':  return renderTestimonials(section, config, primaryColor, si, preview);
    case 'feature-list':  return renderFeatureList(section, config, primaryColor);
    case 'pricing-table': return renderPricingTable(section, config, primaryColor);
    case 'stats':         return renderStats(section, config, primaryColor);
    case 'gallery':       return renderGallery(section, config);
    case 'announcement':  return renderAnnouncement(section, config, primaryColor, si, preview);
    case 'image-text':    return renderImageText(section, config, primaryColor, si, preview);
    case 'coupon':        return renderCoupon(section, config, primaryColor, si, preview);
    case 'social-links':  return renderSocialLinks(section, config, primaryColor);
    case 'columns':       return renderColumns(section, config, primaryColor);
    case 'divider':       return renderDivider(section, config);
    case 'quote':         return renderQuote(section, config, primaryColor, si, preview);
    case 'code-block':    return renderCodeBlock(section, config, primaryColor);
    case 'cta':           return renderCta(section, config, primaryColor, si, preview);
    case 'footer':        return renderFooter(section, config, secondaryColor, si, preview);
    default:              return null;
  }
}

export async function generateEmailHtml(
  email: GeneratedEmail,
  designStyle: string,
  brandProfile: BrandProfile | null,
  preview = false,
): Promise<{ html: string; reactCode: string }> {
  // Start with the base style config and overlay the chosen font variant
  const config = { ...(styleConfigs[designStyle] || styleConfigs.minimalist) };
  const styleVariants = fontVariants[designStyle] || fontVariants.minimalist;
  const chosenVariant = styleVariants[email.fontVariant ?? 0] ?? styleVariants[0];

  if (email.fontPairing) {
    // Explicit font pairing set by user — override the curated variant
    config.headingFontFamily = fontFamilyCSS(email.fontPairing.heading, 'serif');
    config.fontFamily        = fontFamilyCSS(email.fontPairing.body,    'sans-serif');
    config.googleFontsUrl    = buildGoogleFontsUrl(email.fontPairing.heading, email.fontPairing.body);
  } else {
    config.fontFamily        = chosenVariant.fontFamily;
    config.headingFontFamily = chosenVariant.headingFontFamily;
    config.googleFontsUrl    = chosenVariant.googleFontsUrl;
  }
  const primaryColor    = brandProfile?.primary_color    || '#5c5cf0';
  const secondaryColor  = brandProfile?.secondary_color  || primaryColor;
  const backgroundColor = brandProfile?.background_color || null;
  const logoUrl         = brandProfile?.logo_url         || null;
  const websiteUrl      = brandProfile?.website_url      || null;
  const brandName       = brandProfile?.brand_name       || 'Company';

  // ── Force-inject brand data into sections ────────────────────────────
  // This guarantees brand assets are present regardless of what the AI returned.
  const processedSections: EmailSection[] = email.sections.map(s => {
    const sec = { ...s };

    // Header: inject brand logo only if the section doesn't already have one set
    if (sec.type === 'header') {
      if (logoUrl && !sec.logoUrl) sec.logoUrl = logoUrl;
      if (!sec.logoAlt) sec.logoAlt = brandName;
    }

    // Hero: use brand logo as the image only when AI left imageUrl undefined (not when user cleared it)
    if (sec.type === 'hero' && sec.imageUrl === undefined && logoUrl) {
      sec.imageUrl = logoUrl;
      sec.imageAlt = brandName;
    }

    // Footer: inject brand logo only if not already set
    if (sec.type === 'footer') {
      if (logoUrl && !sec.logoUrl) sec.logoUrl = logoUrl;
      if (!sec.logoAlt) sec.logoAlt = brandName;
    }

    // CTA / announcement / image-text: replace placeholder # with real website
    if (
      websiteUrl &&
      (sec.type === 'cta' || sec.type === 'announcement' || sec.type === 'image-text')
    ) {
      if (!sec.buttonUrl || sec.buttonUrl === '#') sec.buttonUrl = websiteUrl;
    }

    return sec;
  });

  // Build section elements
  const sectionElements = processedSections
    .map((s, i) => renderSection(s, i, config, primaryColor, secondaryColor, preview))
    .filter((el): el is React.ReactElement => el !== null);

  // Fetch @font-face declarations from Google Fonts on the server using a real browser
  // User-Agent. The returned src URLs point to fonts.gstatic.com — a static CDN with
  // no UA checks — so email clients can fetch the actual font files directly.
  const fontFaceCSS = await resolveFontFaceCSS(config.googleFontsUrl);

  // Build full email element
  const emailElement = React.createElement(
    Html, { lang: 'en' },
    React.createElement(Head, null,
      React.createElement('meta', {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0',
      }),
      // All fonts are system fonts — no external loading needed, renders correctly on every client
      React.createElement('style', null,
        fontFaceCSS + '\n' +
        // Outlook line-height global reset — prevents Word engine from adding extra spacing
        '* { mso-line-height-rule: exactly; }\n' +
        // iOS Safari auto-zoom reset — prevents scaling up small-text links/buttons
        'body { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; text-size-adjust: 100%; }\n' +
        '@media only screen and (max-width:620px){' +
        '.em-wrap{width:100%!important;padding:0 16px!important;border-left:none!important;border-right:none!important;border-radius:0!important;box-sizing:border-box!important}' +
        '.em-col{display:block!important;width:100%!important;max-width:100%!important;padding-left:0!important;padding-right:0!important;box-sizing:border-box!important;margin-bottom:12px!important}' +
        '.em-section{padding-left:16px!important;padding-right:16px!important}' +
        'h1{font-size:28px!important;line-height:1.2!important}' +
        'h2{font-size:21px!important;line-height:1.3!important}' +
        'img{max-width:100%!important;height:auto!important}' +
        '.em-logo{height:32px!important;max-width:120px!important;width:auto!important}' +
        '.em-btn{display:block!important;width:100%!important;text-align:center!important;box-sizing:border-box!important}' +
        '.em-stat-value{font-size:28px!important;line-height:1.1!important}' +
        '}'
      )
    ),
    React.createElement(Preview, null, email.previewText),
    React.createElement(Body, {
      style: {
        backgroundColor: email.emailStyle?.outerBackground || backgroundColor || config.bodyBg,
        margin: '0',
        padding: '20px 0',
        fontFamily: config.fontFamily,
      }
    },
      React.createElement(Container, {
        className: 'em-wrap',
        style: {
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: email.emailStyle?.containerBackground || config.bodyBg,
          border: email.emailStyle?.containerBorderColor !== undefined
            ? (email.emailStyle.containerBorderColor
                ? `${email.emailStyle.containerBorderWidth ?? 1}px solid ${email.emailStyle.containerBorderColor}`
                : 'none')
            : config.containerBorder,
          borderRadius: config.borderRadius,
          overflow: 'hidden',
          padding: '0 40px',
          borderTop: email.emailStyle?.accentBarColor !== undefined
            ? (email.emailStyle.accentBarColor ? `4px solid ${email.emailStyle.accentBarColor}` : 'none')
            : `4px solid ${primaryColor}`,
        }
      },
        ...sectionElements
      )
    )
  );

  const html = await render(emailElement);

  // Generate readable React code string (for display/export)
  const reactCode = generateReactCodeString(email, designStyle, brandName, primaryColor);

  return { html, reactCode };
}

// ─────────────────────────────────────────────
// Generate human-readable TSX code string
// ─────────────────────────────────────────────

function generateReactCodeString(
  email: GeneratedEmail,
  designStyle: string,
  brandName: string,
  primaryColor: string
): string {
  const sectionCode = email.sections.map(s => {
    switch (s.type) {
      case 'hero':
        return `  <Section style={{ textAlign: 'center', padding: '40px 0' }}>
    ${s.imageUrl ? `<Img src="${s.imageUrl}" alt="${s.imageAlt || ''}" width="600" style={{ width: '100%' }} />` : ''}
    ${s.heading ? `<Heading as="h1" style={{ fontSize: '36px', fontWeight: '900' }}>${s.heading}</Heading>` : ''}
    ${s.subheading ? `<Text style={{ fontSize: '18px' }}>${s.subheading}</Text>` : ''}
  </Section>`;
      case 'content':
        return `  <Section style={{ padding: '24px 0' }}>
    ${s.heading ? `<Heading as="h2" style={{ fontSize: '24px' }}>${s.heading}</Heading>` : ''}
    ${s.text ? `<Text style={{ lineHeight: '1.7' }}>${s.text}</Text>` : ''}
  </Section>`;
      case 'cta':
        return `  <Section style={{ textAlign: 'center', padding: '32px 0' }}>
    ${s.heading ? `<Heading as="h2">${s.heading}</Heading>` : ''}
    ${s.text ? `<Text>${s.text}</Text>` : ''}
    ${s.buttonText ? `<Button href="${s.buttonUrl || '#'}" style={{ backgroundColor: '${primaryColor}', color: '#fff', padding: '14px 32px' }}>${s.buttonText}</Button>` : ''}
  </Section>`;
      case 'footer':
        return `  <Section style={{ textAlign: 'center', padding: '24px 0' }}>
    <Hr />
    <Text style={{ fontSize: '12px', color: '#999' }}>${s.text || ''}</Text>
  </Section>`;
      default:
        return `  {/* ${s.type} section */}`;
    }
  }).join('\n\n');

  return `import { Html, Head, Body, Preview, Container, Section, Heading, Text, Button, Img, Hr, Font } from '@react-email/components';

// Design Style: ${designStyle} | Brand: ${brandName}
// Generated by Emlet on ${new Date().toISOString().split('T')[0]}

export default function EmailTemplate() {
  return (
    <Html lang="en">
      <Head />
      <Preview>${email.previewText}</Preview>
      <Body style={{ backgroundColor: '#f9f9f9', padding: '20px 0' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff' }}>

${sectionCode}

        </Container>
      </Body>
    </Html>
  );
}
`;
}
