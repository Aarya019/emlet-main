/**
 * Inline the CSS of an email: copy the rules from <style> blocks onto the elements they match, the way an
 * email platform does before sending, so clients that drop <style> blocks still show the design.
 *
 * Browser only (it uses DOMParser to find which elements a selector matches). The CSS itself is read as
 * text, not through the browser's CSS parser, so every declaration survives, including Outlook-only ones
 * such as mso-line-height-rule that a browser would discard. What cannot be inlined (media queries, :hover
 * and other dynamic or pseudo-element rules, @font-face, @import) is kept in a <style> block, which is
 * where it belongs.
 */

export interface InlineResult {
  html: string;
  /** Rules that matched at least one element and were written onto it. */
  rulesInlined: number;
  elementsStyled: number;
  /** Rules left in a <style> block because they cannot be inlined. */
  rulesKept: number;
  notes: string[];
}

export interface Decl {
  prop: string;
  value: string;
  important: boolean;
}

/** Split on a separator that is not inside (), [] or quotes, e.g. the ; between declarations or the , between selectors. */
export function splitTopLevel(text: string, separator: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let quote: string | null = null;
  let current = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quote) {
      current += ch;
      if (ch === '\\') current += text[++i] ?? '';
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      current += ch;
      continue;
    }
    if (ch === '(' || ch === '[') depth++;
    else if (ch === ')' || ch === ']') depth = Math.max(0, depth - 1);
    if (ch === separator && depth === 0) {
      parts.push(current);
      current = '';
      continue;
    }
    current += ch;
  }
  if (current.trim()) parts.push(current);
  return parts;
}

export function parseDeclarations(cssText: string): Decl[] {
  const out: Decl[] = [];
  for (const part of splitTopLevel(cssText, ';')) {
    const colon = part.indexOf(':');
    if (colon < 1) continue;
    const prop = part.slice(0, colon).trim().toLowerCase();
    let value = part.slice(colon + 1).trim();
    if (!prop || !value) continue;
    const important = /\s*!\s*important\s*$/i.test(value);
    if (important) value = value.replace(/\s*!\s*important\s*$/i, '').trim();
    out.push({ prop, value, important });
  }
  return out;
}

/**
 * Split a stylesheet into plain style rules ("selector { declarations }") and everything else (at-rules such as
 * @media, @font-face and @import, kept whole). Comments are dropped.
 */
export function parseStylesheet(css: string): { rules: { selector: string; body: string }[]; kept: string[] } {
  const text = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const rules: { selector: string; body: string }[] = [];
  const kept: string[] = [];
  let i = 0;

  while (i < text.length) {
    while (i < text.length && /\s/.test(text[i])) i++;
    if (i >= text.length) break;

    // The prelude runs up to the { of a block or the ; of a statement (such as @import), outside quotes and brackets.
    let j = i;
    let depth = 0;
    let quote: string | null = null;
    for (; j < text.length; j++) {
      const ch = text[j];
      if (quote) {
        if (ch === '\\') j++;
        else if (ch === quote) quote = null;
        continue;
      }
      if (ch === '"' || ch === "'") quote = ch;
      else if (ch === '(' || ch === '[') depth++;
      else if (ch === ')' || ch === ']') depth = Math.max(0, depth - 1);
      else if (depth === 0 && (ch === '{' || ch === ';')) break;
    }

    const prelude = text.slice(i, j).trim();
    if (j >= text.length) {
      if (prelude) kept.push(prelude);
      break;
    }
    if (text[j] === ';') {
      if (prelude) kept.push(`${prelude};`);
      i = j + 1;
      continue;
    }

    // A block: find its matching closing brace.
    let k = j + 1;
    let braces = 1;
    quote = null;
    for (; k < text.length && braces > 0; k++) {
      const ch = text[k];
      if (quote) {
        if (ch === '\\') k++;
        else if (ch === quote) quote = null;
        continue;
      }
      if (ch === '"' || ch === "'") quote = ch;
      else if (ch === '{') braces++;
      else if (ch === '}') braces--;
    }
    const body = text.slice(j + 1, braces === 0 ? k - 1 : k);
    if (prelude.startsWith('@') || body.includes('{')) kept.push(`${prelude} {${body}}`);
    else if (prelude) rules.push({ selector: prelude, body });
    i = k;
  }

  return { rules, kept };
}

/** Approximate CSS specificity as one sortable number (ids, then classes/attributes/pseudo-classes, then elements). */
export function specificity(selector: string): number {
  const s = selector.replace(/"[^"]*"|'[^']*'/g, '').replace(/:(?:not|is|has)\(/gi, ' ').replace(/:where\([^)]*\)/gi, ' ').replace(/\)/g, ' ');
  const ids = (s.match(/#[\w-]+/g) ?? []).length;
  const classes = (s.match(/\.[\w-]+|\[[^\]]*\]|:(?!:)[\w-]+/g) ?? []).length;
  const elements = (s.replace(/#[\w-]+|\.[\w-]+|\[[^\]]*\]|::?[\w-]+/g, ' ').match(/(?:^|[\s>+~])[a-zA-Z][\w-]*/g) ?? []).length;
  return Math.min(ids, 99) * 10000 + Math.min(classes, 99) * 100 + Math.min(elements, 99);
}

/** Selectors that depend on user interaction or style a part of an element: they cannot live in a style attribute. */
const NOT_INLINABLE =
  /:{1,2}(?:hover|active|focus(?:-within|-visible)?|visited|link|target|before|after|first-line|first-letter|selection|placeholder|disabled|checked|-webkit-[a-z-]+|-moz-[a-z-]+|-ms-[a-z-]+)/i;

export function inlineCss(source: string): InlineResult {
  const notes: string[] = [];
  const doc = new DOMParser().parseFromString(source, 'text/html');
  const styleEls = [...doc.querySelectorAll('style')];

  if (styleEls.length === 0) {
    return { html: source, rulesInlined: 0, elementsStyled: 0, rulesKept: 0, notes: ['There are no <style> blocks, so there is nothing to inline. The HTML is unchanged.'] };
  }

  interface Match {
    order: number;
    specificity: number;
    decls: Decl[];
  }
  const matches = new Map<Element, Match[]>();
  const kept: string[] = [];
  let order = 0;
  let rulesInlined = 0;

  for (const styleEl of styleEls) {
    const parsed = parseStylesheet(styleEl.textContent ?? '');
    kept.push(...parsed.kept);

    for (const rule of parsed.rules) {
      const decls = parseDeclarations(rule.body);
      const selectors = splitTopLevel(rule.selector, ',').map((s) => s.trim()).filter(Boolean);
      const leftover: string[] = [];
      let applied = false;

      for (const selector of selectors) {
        if (NOT_INLINABLE.test(selector)) {
          leftover.push(selector);
          continue;
        }
        let targets: Element[];
        try {
          targets = [...doc.querySelectorAll(selector)];
        } catch {
          leftover.push(selector); // a selector this browser cannot evaluate: keep it as it was
          continue;
        }
        if (targets.length === 0) continue; // matches nothing in this email
        applied = true;
        for (const el of targets) {
          const list = matches.get(el) ?? [];
          list.push({ order: order++, specificity: specificity(selector), decls });
          matches.set(el, list);
        }
      }

      if (applied) rulesInlined++;
      if (leftover.length > 0) kept.push(`${leftover.join(', ')} { ${rule.body.trim()} }`);
    }
  }

  // Cascade: normal rules by specificity then order, then the element's own style attribute, then !important rules.
  let elementsStyled = 0;
  for (const [el, list] of matches) {
    const final = new Map<string, Decl>();
    const put = (d: Decl) => final.set(d.prop, d);
    list.sort((a, b) => a.specificity - b.specificity || a.order - b.order);
    for (const m of list) for (const d of m.decls) if (!d.important) put(d);
    for (const d of parseDeclarations(el.getAttribute('style') ?? '')) put(d);
    for (const m of list) for (const d of m.decls) if (d.important) put(d);
    const css = [...final.values()].map((d) => `${d.prop}: ${d.value}${d.important ? ' !important' : ''}`).join('; ');
    if (css) {
      el.setAttribute('style', `${css};`);
      elementsStyled++;
    }
  }

  // The original <style> blocks are replaced by one block holding only what could not be inlined.
  const [first, ...rest] = styleEls;
  for (const el of rest) el.remove();
  if (kept.length > 0) {
    first.textContent = `\n${kept.join('\n')}\n`;
  } else {
    first.remove();
  }

  const keptRules = kept.filter((k) => !k.startsWith('@import')).length;
  if (kept.some((k) => k.startsWith('@import'))) notes.push('An @import was kept in the <style> block; it cannot be inlined.');
  if (keptRules > 0) {
    notes.push(`Kept ${keptRules} ${keptRules === 1 ? 'rule' : 'rules'} in a <style> block: media queries, hover styles, fonts and similar cannot be inlined.`);
  }
  if (!/<html[\s>]/i.test(source) || !/<body[\s>]/i.test(source)) {
    notes.push('The HTML was missing <html>, <head> or <body>, so they were added.');
  }

  const doctype = source.match(/^\s*(<!doctype[^>]*>)/i)?.[1] ?? '<!DOCTYPE html>';
  return {
    html: `${doctype}\n${doc.documentElement.outerHTML}`,
    rulesInlined,
    elementsStyled,
    rulesKept: keptRules,
    notes,
  };
}
