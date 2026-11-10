export type Theme = 'light' | 'dark';

/**
 * Light mode is parked for now: with this off the site is dark only, the toggle is hidden and a stored "light"
 * choice is ignored. All the light-theme CSS is still in globals.css, so turning this back on restores the light
 * default and the toggle with no other change.
 */
export const THEME_SWITCHING_ENABLED = false;

/** The theme a visitor sees when nothing is stored (and always, while switching is off). */
export const DEFAULT_THEME: Theme = THEME_SWITCHING_ENABLED ? 'light' : 'dark';

/** localStorage key holding the visitor's choice. Light is the default when nothing is stored. */
export const THEME_STORAGE_KEY = 'emlet_theme';

/**
 * Runs inline in <head> before the first paint, so a visitor who chose dark never sees a flash of the light
 * page. Everything is wrapped in try/catch: with storage blocked it simply leaves the light default.
 * While switching is off it just pins the page to dark and never reads storage.
 */
export const THEME_INIT_SCRIPT = THEME_SWITCHING_ENABLED
  ? `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');document.documentElement.setAttribute('data-theme',t==='dark'?'dark':'light')}catch(e){}})()`
  : `document.documentElement.setAttribute('data-theme','dark')`;

export function readTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

export function applyTheme(theme: Theme, { persist = true }: { persist?: boolean } = {}): void {
  document.documentElement.setAttribute('data-theme', theme);
  if (!persist) return;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // storage blocked: the choice lasts until the page is closed
  }
}

/** Calls `onChange` whenever the page's theme attribute changes (for useSyncExternalStore). */
export function subscribeToTheme(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}
