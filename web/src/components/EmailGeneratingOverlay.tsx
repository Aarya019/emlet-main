'use client';

import { useEffect, useRef, useState } from 'react';

// ─────────────────────────────────────────────
// Mini infinite runner game
// ─────────────────────────────────────────────

const CW = 380, CH = 104;
const FLOOR = 84;
const PX = 52, PW = 22, PH = 22;
const GRAVITY = 0.62, JUMP_V = -12.5;

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function RunnerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sRef = useRef({
    phase: 'idle' as 'idle' | 'playing' | 'dead',
    score: 0,
    speed: 4.5,
    raf: 0,
    playerY: FLOOR - PH,
    velY: 0,
    grounded: true,
    obstacles: [] as { x: number; w: number; h: number }[],
    nextObs: 85,
    trackOff: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const s = sRef.current;

    function draw() {
      ctx!.clearRect(0, 0, CW, CH);

      // floor
      ctx!.strokeStyle = 'rgba(255,255,255,0.18)';
      ctx!.lineWidth = 1.5;
      ctx!.setLineDash([]);
      ctx!.beginPath();
      ctx!.moveTo(0, FLOOR + 2); ctx!.lineTo(CW, FLOOR + 2);
      ctx!.stroke();

      // scrolling ground dashes
      ctx!.strokeStyle = 'rgba(0,255,200,0.13)';
      ctx!.lineWidth = 1;
      ctx!.setLineDash([12, 8]);
      ctx!.lineDashOffset = -s.trackOff;
      ctx!.beginPath();
      ctx!.moveTo(0, FLOOR + 10); ctx!.lineTo(CW, FLOOR + 10);
      ctx!.stroke();
      ctx!.setLineDash([]);

      // player — envelope body
      const py = s.playerY;
      const alive = s.phase !== 'dead';
      ctx!.fillStyle = alive ? '#00ffc8' : '#ff5566';
      rr(ctx!, PX, py, PW, PH, 3);
      ctx!.fill();
      // envelope V flap
      ctx!.strokeStyle = alive ? 'rgba(0,180,140,0.85)' : 'rgba(255,70,90,0.75)';
      ctx!.lineWidth = 1.5;
      ctx!.beginPath();
      ctx!.moveTo(PX + 2, py + 2);
      ctx!.lineTo(PX + PW / 2, py + PH * 0.44);
      ctx!.lineTo(PX + PW - 2, py + 2);
      ctx!.stroke();

      // obstacles — spam columns
      s.obstacles.forEach(ob => {
        ctx!.fillStyle = 'rgba(255,55,95,0.82)';
        rr(ctx!, ob.x, FLOOR - ob.h, ob.w, ob.h, 3);
        ctx!.fill();
        ctx!.strokeStyle = 'rgba(255,100,130,0.4)';
        ctx!.lineWidth = 1;
        ctx!.stroke();
        // top cap glow
        ctx!.fillStyle = 'rgba(255,110,145,0.95)';
        rr(ctx!, ob.x, FLOOR - ob.h, ob.w, 4, 2);
        ctx!.fill();
      });

      ctx!.textBaseline = 'middle';
      if (s.phase === 'playing') {
        ctx!.fillStyle = 'rgba(255,255,255,0.38)';
        ctx!.font = '600 12px ui-monospace, monospace';
        ctx!.textAlign = 'right';
        ctx!.fillText(String(Math.floor(s.score)), CW - 10, 14);
      }
      if (s.phase === 'idle') {
        ctx!.fillStyle = 'rgba(255,255,255,0.28)';
        ctx!.font = '500 12px system-ui, sans-serif';
        ctx!.textAlign = 'center';
        ctx!.fillText('Press Space or tap to play', CW / 2, CH / 2 + 4);
      }
      if (s.phase === 'dead') {
        ctx!.fillStyle = 'rgba(255,255,255,0.78)';
        ctx!.font = '700 13px system-ui, sans-serif';
        ctx!.textAlign = 'center';
        ctx!.fillText('Game Over — tap to retry', CW / 2, CH / 2 + 4);
      }
    }

    function loop() {
      if (s.phase === 'dead') { draw(); return; }

      s.velY += GRAVITY;
      s.playerY += s.velY;
      if (s.playerY >= FLOOR - PH) {
        s.playerY = FLOOR - PH;
        s.velY = 0;
        s.grounded = true;
      }

      s.trackOff = (s.trackOff + s.speed * 0.65) % 20;

      s.nextObs--;
      if (s.nextObs <= 0) {
        s.obstacles.push({ x: CW + 10, w: 14 + Math.random() * 10, h: 20 + Math.random() * 28 });
        s.nextObs = Math.max(40, 78 + Math.random() * 48 - s.score / 200);
      }
      s.obstacles.forEach(ob => { ob.x -= s.speed; });
      s.obstacles = s.obstacles.filter(ob => ob.x + ob.w > -4);

      s.speed = Math.min(10, 4.5 + s.score / 500);
      s.score += 0.14 * (s.speed / 4.5);

      // collision with 4 px forgiveness
      for (const ob of s.obstacles) {
        if (
          PX + 4 < ob.x + ob.w &&
          PX + PW - 4 > ob.x &&
          s.playerY + 4 < FLOOR &&
          s.playerY + PH - 4 > FLOOR - ob.h
        ) {
          s.phase = 'dead';
          draw();
          return;
        }
      }

      draw();
      s.raf = requestAnimationFrame(loop);
    }

    function act() {
      if (s.phase === 'dead') {
        s.phase = 'playing';
        s.score = 0; s.speed = 4.5;
        s.obstacles = []; s.nextObs = 85;
        s.playerY = FLOOR - PH; s.velY = 0;
        s.grounded = true; s.trackOff = 0;
        cancelAnimationFrame(s.raf);
        s.raf = requestAnimationFrame(loop);
        return;
      }
      if (s.phase === 'idle') {
        s.phase = 'playing';
        cancelAnimationFrame(s.raf);
        s.raf = requestAnimationFrame(loop);
      }
      if (s.grounded) {
        s.velY = JUMP_V;
        s.grounded = false;
      }
    }

    function onKey(e: KeyboardEvent) {
      if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); act(); }
    }
    function onTouch(e: TouchEvent) { e.preventDefault(); act(); }

    canvas.addEventListener('click', act);
    canvas.addEventListener('touchstart', onTouch, { passive: false });
    window.addEventListener('keydown', onKey);
    draw();

    return () => {
      canvas.removeEventListener('click', act);
      canvas.removeEventListener('touchstart', onTouch);
      window.removeEventListener('keydown', onKey);
      cancelAnimationFrame(s.raf);
    };
  }, []);

  return (
    <div style={{ marginTop: 22, textAlign: 'center' }}>
      <p style={{ color: 'rgba(255,255,255,0.24)', fontSize: 11, margin: '0 0 8px', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
        🎮 Play while you wait
      </p>
      <canvas
        ref={canvasRef}
        width={CW}
        height={CH}
        style={{
          display: 'block',
          margin: '0 auto',
          borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.08)',
          cursor: 'pointer',
          maxWidth: '100%',
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// Overlay
// ─────────────────────────────────────────────

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
        overflowY: 'auto',
        background: 'rgba(0,0,0,0.93)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        padding: '24px 16px',
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
      <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
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
      <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 14, margin: '0 0 20px', textAlign: 'center' }}>
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
          marginBottom: 22,
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

      <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: 11, marginTop: 14, textAlign: 'center' }}>
        Please don't close or refresh — your email is on its way
      </p>

      {/* Mini runner game */}
      <RunnerGame />
    </div>
  );
}
