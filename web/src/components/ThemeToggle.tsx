'use client';

import { useSyncExternalStore } from 'react';
import { DEFAULT_THEME, THEME_STORAGE_KEY, THEME_SWITCHING_ENABLED, applyTheme, readTheme, subscribeToTheme, type Theme } from '@/lib/theme';

function subscribe(onChange: () => void) {
  // The attribute can change from this component or from another tab (via the storage event below).
  const unsubscribe = subscribeToTheme(onChange);
  const onStorage = (e: StorageEvent) => {
    if (e.key === THEME_STORAGE_KEY) applyTheme(e.newValue === 'dark' ? 'dark' : 'light', { persist: false });
  };
  window.addEventListener('storage', onStorage);
  return () => {
    unsubscribe();
    window.removeEventListener('storage', onStorage);
  };
}

const getServerSnapshot = (): Theme => DEFAULT_THEME;

type ToggleProps = { size?: 'sm' | 'md'; className?: string };

/** Renders nothing while light mode is parked (see THEME_SWITCHING_ENABLED in lib/theme.ts). */
export default function ThemeToggle(props: ToggleProps) {
  return THEME_SWITCHING_ENABLED ? <ThemeToggleButton {...props} /> : null;
}

/**
 * Sun / moon button that switches between the light (default) and dark theme. It reads the theme from the
 * page itself (set before first paint by the script in the root layout), so it is never out of step with it.
 */
function ThemeToggleButton({ size = 'md', className = '' }: ToggleProps) {
  const theme = useSyncExternalStore(subscribe, readTheme, getServerSnapshot);
  const next: Theme = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={() => applyTheme(next)}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className={`inline-flex ${size === 'sm' ? 'h-8 w-8' : 'h-9 w-9'} shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:bg-white/10 hover:text-white ${className}`}
    >
      {theme === 'dark' ? (
        // Sun: shown in dark mode, to go back to light
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        // Moon: shown in light mode, to go to dark
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
