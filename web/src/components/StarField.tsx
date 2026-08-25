'use client';

import { useEffect, useState } from 'react';

interface Star {
  id: number;
  top: number;
  left: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  color: string;
}

const COLORS = ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#00ffff', '#00ff00'];

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: 1 + Math.random() * 1.8,
    opacity: 0.25 + Math.random() * 0.55,
    duration: 2 + Math.random() * 4,
    delay: Math.random() * 5,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));
}

/**
 * Fixed, viewport-anchored twinkling starfield. Renders behind page content —
 * generated client-side only (avoids an SSR/hydration mismatch from Math.random()).
 */
export default function StarField({ count = 60 }: { count?: number }) {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    setStars(generateStars(count));
  }, [count]);

  if (stars.length === 0) return null;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <style>{`
        @keyframes starTwinkle {
          0%, 100% { opacity: var(--star-opacity); }
          50% { opacity: 0; }
        }
      `}</style>
      {stars.map(star => (
        <div
          key={star.id}
          style={{
            position: 'absolute',
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: star.size,
            height: star.size,
            borderRadius: '50%',
            backgroundColor: star.color,
            boxShadow: star.color !== '#ffffff' ? `0 0 ${star.size * 2}px ${star.color}` : undefined,
            animation: `starTwinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
            ['--star-opacity' as string]: star.opacity,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
