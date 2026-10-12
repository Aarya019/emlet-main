const STARS = [
  { x: 3,  y: 8,  size: 1.5, delay: 0,   dur: 4 },
  { x: 8,  y: 72, size: 1,   delay: 1.5, dur: 6 },
  { x: 14, y: 35, size: 1,   delay: 3,   dur: 5 },
  { x: 19, y: 18, size: 2,   delay: 0.5, dur: 4 },
  { x: 24, y: 55, size: 1,   delay: 2,   dur: 7 },
  { x: 29, y: 82, size: 1.5, delay: 4,   dur: 5 },
  { x: 33, y: 12, size: 1,   delay: 1,   dur: 6 },
  { x: 38, y: 43, size: 2,   delay: 2.5, dur: 4 },
  { x: 42, y: 67, size: 1,   delay: 0,   dur: 5 },
  { x: 47, y: 28, size: 1.5, delay: 3.5, dur: 6 },
  { x: 51, y: 90, size: 1,   delay: 1,   dur: 4 },
  { x: 56, y: 5,  size: 2,   delay: 2,   dur: 7 },
  { x: 61, y: 48, size: 1,   delay: 0.5, dur: 5 },
  { x: 65, y: 75, size: 1.5, delay: 3,   dur: 6 },
  { x: 70, y: 22, size: 1,   delay: 1.5, dur: 4 },
  { x: 74, y: 60, size: 2,   delay: 4,   dur: 5 },
  { x: 79, y: 38, size: 1,   delay: 0,   dur: 7 },
  { x: 83, y: 85, size: 1.5, delay: 2,   dur: 4 },
  { x: 88, y: 15, size: 1,   delay: 3,   dur: 6 },
  { x: 92, y: 52, size: 2,   delay: 1,   dur: 5 },
  { x: 96, y: 30, size: 1.5, delay: 2.5, dur: 4 },
  { x: 11, y: 45, size: 1,   delay: 4,   dur: 7 },
  { x: 17, y: 95, size: 1.5, delay: 0.5, dur: 5 },
  { x: 22, y: 62, size: 1,   delay: 2,   dur: 6 },
  { x: 36, y: 25, size: 2,   delay: 3,   dur: 4 },
  { x: 44, y: 78, size: 1,   delay: 1.5, dur: 5 },
  { x: 49, y: 15, size: 1.5, delay: 0,   dur: 7 },
  { x: 58, y: 88, size: 1,   delay: 4,   dur: 4 },
  { x: 63, y: 32, size: 2,   delay: 2,   dur: 6 },
  { x: 76, y: 58, size: 1,   delay: 0.5, dur: 5 },
  { x: 85, y: 42, size: 1.5, delay: 3.5, dur: 4 },
  { x: 90, y: 70, size: 1,   delay: 1,   dur: 7 },
  { x: 95, y: 10, size: 2,   delay: 2.5, dur: 5 },
  { x: 7,  y: 50, size: 1,   delay: 0,   dur: 6 },
  { x: 27, y: 3,  size: 1.5, delay: 2,   dur: 4 },
  { x: 53, y: 40, size: 1,   delay: 3.5, dur: 5 },
  { x: 68, y: 92, size: 2,   delay: 1,   dur: 7 },
  { x: 81, y: 20, size: 1.5, delay: 4,   dur: 4 },
  { x: 97, y: 80, size: 1,   delay: 0.5, dur: 6 },
  { x: 2,  y: 65, size: 2,   delay: 2,   dur: 5 },
];

/** Shared grid + twinkling-star backdrop used across the auth pages (sign-in, sign-up, forgot/reset password). */
export default function AuthBackground() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '48px 48px' }}
      />
      <div className="pointer-events-none fixed inset-0 z-[1]">
        {STARS.map((s, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              borderRadius: '50%',
              backgroundColor: 'white',
              animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>
    </>
  );
}
