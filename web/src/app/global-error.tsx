'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled root-layout error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#000', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ maxWidth: 420, width: '100%', padding: 32, borderRadius: 12, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', textAlign: 'center' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f87171', marginBottom: 8 }}>Something went wrong</h2>
            <p style={{ color: '#fca5a5', marginBottom: 24 }}>
              The app hit an unexpected error. Please try again.
            </p>
            <button
              onClick={reset}
              style={{ padding: '12px 24px', borderRadius: 9999, background: '#00ffff', color: '#000', fontWeight: 600, border: 'none', cursor: 'pointer' }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
