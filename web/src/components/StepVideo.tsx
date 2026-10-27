'use client';

import { useEffect, useRef, useState } from 'react';

interface StepVideoProps {
  /** Path without extension, e.g. "/videos/step-1". Always needs step-1.mp4. */
  src: string;
  title: string;
  /** Set when step-1.webm exists too (smaller for Chrome/Firefox). */
  hasWebm?: boolean;
  /** Set when step-1.webp exists: shown instantly before the video loads. */
  hasPoster?: boolean;
}

/**
 * Short, silent, looping product clip that costs the page almost nothing:
 * - nothing is downloaded until the clip is about to scroll into view (the poster image is the only thing loaded up front),
 * - it plays only while visible and pauses when scrolled away,
 * - visitors who prefer reduced motion get the poster plus play controls instead of autoplay.
 * The parent supplies the aspect ratio box, so there is no layout shift.
 */
export default function StepVideo({ src, title, hasWebm = false, hasPoster = false }: StepVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [armed, setArmed] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // Start fetching shortly before the clip scrolls into view.
  useEffect(() => {
    const el = videoRef.current;
    if (!el || armed) return;
    const io = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setArmed(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [armed]);

  // Once the sources are in the DOM, load them, then play only while at least 40% visible.
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !armed) return;
    el.load();
    if (reduceMotion) return;
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) el.play().catch(() => {});
          else el.pause();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [armed, reduceMotion]);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover"
      poster={hasPoster ? `${src}.webp` : undefined}
      muted
      loop
      playsInline
      preload="none"
      controls={reduceMotion}
      aria-label={title}
    >
      {armed && (
        <>
          {hasWebm && <source src={`${src}.webm`} type="video/webm" />}
          <source src={`${src}.mp4`} type="video/mp4" />
        </>
      )}
    </video>
  );
}
