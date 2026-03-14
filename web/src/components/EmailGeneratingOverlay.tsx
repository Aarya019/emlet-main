'use client';

import { useEffect, useState } from 'react';

const STEPS = [
  { icon: '🧠', text: 'Analysing your prompt...' },
  { icon: '✍️', text: 'Crafting compelling copy...' },
  { icon: '🎨', text: 'Designing layout & sections...' },
  { icon: '🖼️', text: 'Sourcing perfect images...' },
  { icon: '📐', text: 'Perfecting the structure...' },
  { icon: '✨', text: 'Adding finishing touches...' },
];

export default function EmailGeneratingOverlay() {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(5);
  const [stepVisible, setStepVisible] = useState(true);

  // Slowly advance progress bar, capping at 90% until done
  useEffect(() => {
    const id = setInterval(() => {
      setProgress(p => {
        if (p >= 90) return 90;
        // Fast at start, slows down as it approaches 90
        const increment = Math.max(0.3, (90 - p) * 0.04);
        return Math.min(90, p + increment);
      });
    }, 350);
    return () => clearInterval(id);
  }, []);

  // Cycle through step labels with fade transition
  useEffect(() => {
    const id = setInterval(() => {
      setStepVisible(false);
      setTimeout(() => {
        setStepIndex(i => (i + 1) % STEPS.length);
        setStepVisible(true);
      }, 300);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const { icon, text } = STEPS[stepIndex];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.93)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      <style>{`
        @keyframes cubeRotate {
          0%   { transform: rotateX(0deg)   rotateY(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }
        @keyframes floatCube {
          0%, 100% { transform: translateY(0px);   }
          50%       { transform: translateY(-14px); }
        }
        @keyframes progressShimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes orbitA {
          from { transform: rotate(0deg)   translateX(88px) rotate(0deg);    }
          to   { transform: rotate(360deg) translateX(88px) rotate(-360deg); }
        }
        @keyframes orbitB {
          from { transform: rotate(120deg) translateX(88px) rotate(-120deg); }
          to   { transform: rotate(480deg) translateX(88px) rotate(-480deg); }
        }
        @keyframes orbitC {
          from { transform: rotate(240deg) translateX(88px) rotate(-240deg); }
          to   { transform: rotate(600deg) translateX(88px) rotate(-600deg); }
        }
        @keyframes particleDrift {
          0%   { transform: translateY(0)    opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(-80px); opacity: 0; }
        }
        @keyframes bgPulse {
          0%, 100% { opacity: 0.06; }
          50%       { opacity: 0.12; }
        }
        .gen-cube-scene {
          width: 100px;
          height: 100px;
          perspective: 420px;
        }
        .gen-cube {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          animation: cubeRotate 5s linear infinite, floatCube 3.5s ease-in-out infinite;
        }
        .gen-face {
          position: absolute;
          width: 100px;
          height: 100px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(4px);
        }
        .gen-face-front  { transform: rotateY(  0deg) translateZ(50px); background: linear-gradient(135deg,rgba(0,255,255,0.28),rgba(0,255,255,0.06)); box-shadow: inset 0 0 20px rgba(0,255,255,0.1); }
        .gen-face-back   { transform: rotateY(180deg) translateZ(50px); background: linear-gradient(135deg,rgba(255,0,255,0.28),rgba(255,0,255,0.06)); box-shadow: inset 0 0 20px rgba(255,0,255,0.1); }
        .gen-face-right  { transform: rotateY( 90deg) translateZ(50px); background: linear-gradient(135deg,rgba(0,255,128,0.28),rgba(0,255,128,0.06)); box-shadow: inset 0 0 20px rgba(0,255,128,0.1); }
        .gen-face-left   { transform: rotateY(-90deg) translateZ(50px); background: linear-gradient(135deg,rgba(255,200,0,0.28),rgba(255,200,0,0.06));  box-shadow: inset 0 0 20px rgba(255,200,0,0.1);  }
        .gen-face-top    { transform: rotateX( 90deg) translateZ(50px); background: linear-gradient(135deg,rgba(120,80,255,0.28),rgba(120,80,255,0.06)); box-shadow: inset 0 0 20px rgba(120,80,255,0.1); }
        .gen-face-bottom { transform: rotateX(-90deg) translateZ(50px); background: linear-gradient(135deg,rgba(255,80,80,0.28),rgba(255,80,80,0.06));  box-shadow: inset 0 0 20px rgba(255,80,80,0.1);  }
        .gen-orbit-dot {
          position: absolute;
          top: 50%; left: 50%;
          width: 9px; height: 9px;
          border-radius: 50%;
          margin: -4.5px;
        }
        .gen-dot-a { background:#00ffff; box-shadow:0 0 10px #00ffff,0 0 20px rgba(0,255,255,0.4); animation:orbitA 3.2s linear infinite; }
        .gen-dot-b { background:#ff00ff; box-shadow:0 0 10px #ff00ff,0 0 20px rgba(255,0,255,0.4); animation:orbitB 3.2s linear infinite; }
        .gen-dot-c { background:#00ff80; box-shadow:0 0 10px #00ff80,0 0 20px rgba(0,255,128,0.4); animation:orbitC 3.2s linear infinite; }
        .gen-progress-fill {
          background: linear-gradient(90deg, #00ffff, #00ff80, #ff00ff, #00ffff);
          background-size: 300% auto;
          animation: progressShimmer 2s linear infinite;
        }
        .gen-bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          animation: bgPulse 4s ease-in-out infinite;
          pointer-events: none;
        }
      `}</style>

      {/* Ambient background blobs */}
      <div className="gen-bg-blob" style={{ width: 400, height: 400, top: '-10%', right: '-5%', background: 'radial-gradient(circle, rgba(0,255,255,1) 0%, transparent 70%)' }} />
      <div className="gen-bg-blob" style={{ width: 350, height: 350, bottom: '-10%', left: '-5%', background: 'radial-gradient(circle, rgba(255,0,255,1) 0%, transparent 70%)', animationDelay: '2s' }} />
      <div className="gen-bg-blob" style={{ width: 300, height: 300, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, rgba(0,255,128,1) 0%, transparent 70%)', animationDelay: '1s' }} />

      {/* 3D cube + orbiting dots */}
      <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 36 }}>
        <div className="gen-orbit-dot gen-dot-a" />
        <div className="gen-orbit-dot gen-dot-b" />
        <div className="gen-orbit-dot gen-dot-c" />
        <div className="gen-cube-scene">
          <div className="gen-cube">
            <div className="gen-face gen-face-front">✉️</div>
            <div className="gen-face gen-face-back">🎨</div>
            <div className="gen-face gen-face-right">⚡</div>
            <div className="gen-face gen-face-left">✨</div>
            <div className="gen-face gen-face-top">🧠</div>
            <div className="gen-face gen-face-bottom">🚀</div>
          </div>
        </div>
      </div>

      {/* Heading */}
      <h2 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.03em', textAlign: 'center' }}>
        Generating your email...
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 14, margin: '0 0 28px', textAlign: 'center' }}>
        Grab a coffee ☕ — this takes about 15–25 seconds
      </p>

      {/* Cycling step label */}
      <div
        style={{
          opacity: stepVisible ? 1 : 0,
          transform: stepVisible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 100,
          padding: '10px 22px',
          marginBottom: 28,
          minWidth: 290,
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: 20 }}>{icon}</span>
        <span style={{ color: 'rgba(255,255,255,0.88)', fontSize: 14, fontWeight: 500 }}>{text}</span>
      </div>

      {/* Progress bar */}
      <div style={{ width: 290, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 100, overflow: 'hidden' }}>
        <div
          className="gen-progress-fill"
          style={{ height: '100%', width: `${progress}%`, borderRadius: 100, transition: 'width 0.5s ease' }}
        />
      </div>

      {/* Subtle "don't leave" hint */}
      <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, marginTop: 20, textAlign: 'center' }}>
        Please don't close or refresh — your email is on its way
      </p>
    </div>
  );
}
