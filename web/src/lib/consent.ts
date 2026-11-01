/**
 * Cookie consent: who must be asked, and where the answer is kept. Analytics (Google Analytics) and the
 * first-touch attribution cookie only run once consent is given where the law requires it (EU, EEA, UK,
 * Switzerland). Elsewhere they run as before, and the "Cookie settings" link still lets anyone opt out.
 * Vercel Analytics / Speed Insights are cookieless and are not gated.
 */

export const GA_MEASUREMENT_ID = 'G-79R1XR82LB';

export const CONSENT_STORAGE_KEY = 'emlet_consent';
/** sessionStorage: remembers "this visitor's region needs no banner" so later page loads skip the lookup. */
export const REGION_SESSION_KEY = 'emlet_consent_region';
/** Window event that re-opens the banner (the "Cookie settings" link). */
export const OPEN_CONSENT_EVENT = 'emlet:open-consent';

const CONSENT_COUNTRIES = new Set([
  // EU
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
  // EEA
  'IS', 'LI', 'NO',
  // United Kingdom, Switzerland
  'GB', 'CH',
]);

/** Country code from the CDN's geo header. A missing header means "unknown", which fails closed (ask). */
export function consentRequiredFor(country: string | null | undefined): boolean {
  if (!country) return true;
  return CONSENT_COUNTRIES.has(country.trim().toUpperCase());
}

export interface StoredConsent {
  analytics: boolean;
  at: string;
}

export function readStoredConsent(): StoredConsent | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredConsent>;
    return typeof parsed.analytics === 'boolean' ? { analytics: parsed.analytics, at: String(parsed.at ?? '') } : null;
  } catch {
    return null;
  }
}

export function storeConsent(analytics: boolean): void {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ analytics, at: new Date().toISOString() }));
  } catch {
    // storage blocked: the choice just won't be remembered
  }
}

/** Delete Google Analytics' cookies and our attribution cookie, on every domain level they may have been set on. */
export function clearAnalyticsCookies(): void {
  try {
    const names = document.cookie
      .split('; ')
      .map((c) => c.split('=')[0])
      .filter((n) => n === '_ga' || n.startsWith('_ga_') || n === '_gid' || n.startsWith('_gat') || n === 'emlet_src');
    const parts = window.location.hostname.split('.');
    const domains = [undefined, ...parts.map((_, i) => `.${parts.slice(i).join('.')}`).filter((d) => d.includes('.', 1))];
    for (const name of names) {
      for (const domain of domains) {
        document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ''}`;
      }
    }
  } catch {
    // ignore
  }
}
