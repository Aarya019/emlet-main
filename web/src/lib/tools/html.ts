/** Helpers for tools that build email HTML from what a visitor typed. Everything typed is escaped; links are checked. */

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Merge tags that email platforms replace at send time, e.g. *|UNSUB|*, {{ unsubscribe }}, {$unsubscribe}, {% tag %}. */
const MERGE_TAG = /^(?:\{\{[^{}]{1,60}\}\}|\{%[^{}%]{1,60}%\}|\{\$[a-z_]{1,40}\}|\*\|[A-Z0-9_:]{1,40}\|\*|%[A-Z0-9_]{1,40}%)$/i;

export function isMergeTag(value: string): boolean {
  return MERGE_TAG.test(value.trim());
}

/**
 * A link that is safe to put in an href: http(s), mailto or tel, or an email-platform merge tag.
 * Returns the cleaned value, or null (so callers can leave the link out). javascript: and friends never pass.
 */
export function safeUrl(raw: string, { allowMergeTag = false }: { allowMergeTag?: boolean } = {}): string | null {
  const value = raw.trim();
  if (!value) return null;
  if (allowMergeTag && isMergeTag(value)) return value;
  if (/^(?:https?:\/\/|mailto:|tel:)/i.test(value) && !/[\s<>"']/.test(value)) return value;
  // "example.com/page" typed without a scheme: assume https
  if (/^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}(?:[/?#][^\s<>"']*)?$/i.test(value)) return `https://${value}`;
  return null;
}

export function isHexColor(value: string): boolean {
  return /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim());
}

export function colorOr(value: string, fallback: string): string {
  return isHexColor(value) ? value.trim() : fallback;
}
