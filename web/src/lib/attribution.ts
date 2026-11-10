/**
 * First-touch marketing attribution: which channel brought a visitor in. SourceCapture stores it in a
 * first-party cookie on the first non-direct visit, and sign-up / the auth callback read it back so a new
 * account can be traced to a channel. It holds no personal data (UTM tags, ?ref=, a template slug, the
 * referring hostname, the landing path), and anything read back from the cookie is untrusted input.
 */

export const SOURCE_COOKIE = 'emlet_src';
export const SOURCE_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const QUERY_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ref', 'template'] as const;
const FIELD_KEYS = [...QUERY_KEYS, 'referrer', 'landing'] as const;
const MAX_VALUE_LENGTH = 80;

export type Attribution = Partial<Record<(typeof FIELD_KEYS)[number], string>>;

function clean(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const cleaned = value.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, MAX_VALUE_LENGTH);
  return cleaned || undefined;
}

const stripWww = (host: string) => host.replace(/^www\./, '');

/** Attribution for a page view, or null for a direct visit (nothing worth remembering). */
export function readAttribution(url: URL, referrer: string): Attribution | null {
  const found: Attribution = {};
  for (const key of QUERY_KEYS) {
    const value = clean(url.searchParams.get(key));
    if (value) found[key] = value;
  }
  try {
    const host = referrer ? new URL(referrer).hostname : '';
    if (host && stripWww(host) !== stripWww(url.hostname)) found.referrer = clean(host);
  } catch {
    // malformed referrer: ignore
  }
  if (Object.keys(found).length === 0) return null;
  found.landing = clean(url.pathname);
  return found;
}

/** Parse the cookie defensively: only known keys, only short plain strings. */
export function parseAttribution(raw: string | undefined): Attribution | null {
  if (!raw) return null;
  let parsed: unknown;
  try {
    // The framework may or may not have percent-decoded the value already.
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = JSON.parse(decodeURIComponent(raw));
    }
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== 'object') return null;
  const out: Attribution = {};
  for (const key of FIELD_KEYS) {
    const value = clean((parsed as Record<string, unknown>)[key]);
    if (value) out[key] = value;
  }
  return Object.keys(out).length > 0 ? out : null;
}
