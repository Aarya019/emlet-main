'use client';

import { useEffect, useRef, useState } from 'react';

// ─────────────────────────────────────────────
// Mini infinite runner game
// ─────────────────────────────────────────────

const CW = 560, CH = 160;
const FLOOR = 130;
const PX = 70, PW = 32, PH = 28;
const GRAVITY = 0.72, JUMP_V = -14.5;

// ── rounded-rect helper ──
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

// ── draw the cat character ──
function drawCat(ctx: CanvasRenderingContext2D, x: number, y: number, alive: boolean, frame: number) {
  const bodyColor  = alive ? '#f0c060' : '#ff5566';
  const darkColor  = alive ? '#c8983a' : '#cc3344';
  const eyeColor   = '#1a1a2e';
  const noseColor  = alive ? '#ff9988' : '#dd2233';

  // walking leg bob (only when alive & grounded)
  const legSwing = alive ? Math.sin(frame * 0.22) * 3 : 0;
  // tail wag
  const tailWag  = Math.sin(frame * 0.18) * 12;

  // tail
  ctx.save();
  ctx.strokeStyle = darkColor;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x + 2, y + PH - 6);
  ctx.quadraticCurveTo(x - 10, y + PH - 14 + tailWag * 0.4, x - 4, y - 6 + tailWag);
  ctx.stroke();
  ctx.restore();

  // body
  ctx.fillStyle = bodyColor;
  rr(ctx, x, y + 4, PW, PH - 4, 8);
  ctx.fill();

  // belly stripe
  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  rr(ctx, x + 8, y + 10, PW - 16, PH - 14, 5);
  ctx.fill();

  // head
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(x + PW * 0.62, y + 2, 12, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  // ears (triangles)
  ctx.fillStyle = darkColor;
  const hcx = x + PW * 0.62;
  ctx.beginPath();
  ctx.moveTo(hcx - 10, y - 2);
  ctx.lineTo(hcx - 5,  y - 12);
  ctx.lineTo(hcx - 1,  y - 2);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(hcx + 2,  y - 2);
  ctx.lineTo(hcx + 7,  y - 11);
  ctx.lineTo(hcx + 11, y - 2);
  ctx.closePath(); ctx.fill();
  // inner ear
  ctx.fillStyle = noseColor;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(hcx - 9, y - 3);
  ctx.lineTo(hcx - 5, y - 10);
  ctx.lineTo(hcx - 2, y - 3);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(hcx + 3,  y - 3);
  ctx.lineTo(hcx + 7,  y - 10);
  ctx.lineTo(hcx + 10, y - 3);
  ctx.closePath(); ctx.fill();
  ctx.globalAlpha = 1;

  // eyes
  ctx.fillStyle = eyeColor;
  ctx.beginPath();
  ctx.ellipse(hcx - 4, y + 3, alive ? 2.5 : 1.5, alive ? 3 : 1, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(hcx + 4, y + 3, alive ? 2.5 : 1.5, alive ? 3 : 1, 0, 0, Math.PI * 2);
  ctx.fill();
  // eye shine
  if (alive) {
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(hcx - 3, y + 2, 0.9, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(hcx + 5, y + 2, 0.9, 0, Math.PI * 2); ctx.fill();
  }

  // nose
  ctx.fillStyle = noseColor;
  ctx.beginPath();
  ctx.ellipse(hcx, y + 7, 2, 1.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // whiskers
  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
  ctx.lineWidth = 0.9;
  for (const [dx, dy, len, dir] of [[-3, 7, 10, -1], [-3, 9, 9, -1], [3, 7, 10, 1], [3, 9, 9, 1]] as [number,number,number,number][]) {
    ctx.beginPath();
    ctx.moveTo(hcx + dx, y + dy);
    ctx.lineTo(hcx + dx + len * dir, y + dy - 1);
    ctx.stroke();
  }

  // legs
  ctx.fillStyle = darkColor;
  const legY = y + PH - 1;
  ctx.beginPath(); rr(ctx, x + 4,       legY + legSwing,  8, 7, 3); ctx.fill();
  ctx.beginPath(); rr(ctx, x + PW - 12, legY - legSwing,  8, 7, 3); ctx.fill();
}

// ── draw one obstacle (spam email column) ──
function drawObstacle(ctx: CanvasRenderingContext2D, ob: { x: number; w: number; h: number }) {
  const x = ob.x, y = FLOOR - ob.h, w = ob.w, h = ob.h;
  // column body
  ctx.fillStyle = 'rgba(180,40,80,0.82)';
  rr(ctx, x, y, w, h, 4);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,100,140,0.35)';
  ctx.lineWidth = 1;
  ctx.stroke();
  // glowing top
  const grd = ctx.createLinearGradient(x, y, x, y + 10);
  grd.addColorStop(0, 'rgba(255,80,130,0.95)');
  grd.addColorStop(1, 'rgba(180,40,80,0)');
  ctx.fillStyle = grd;
  rr(ctx, x, y, w, 10, 4);
  ctx.fill();
  // tiny envelope icon on obstacle
  ctx.fillStyle = 'rgba(255,200,210,0.5)';
  const ex = x + w / 2 - 6, ey = y + 6;
  rr(ctx, ex, ey, 12, 9, 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,180,200,0.6)';
  ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.moveTo(ex + 1, ey + 1); ctx.lineTo(ex + 6, ey + 4); ctx.lineTo(ex + 11, ey + 1); ctx.stroke();
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
    nextObs: 90,
    trackOff: 0,
    cloudOff: 0,
    frame: 0,
    // parallax stars / particles
    stars: Array.from({ length: 28 }, () => ({
      x: Math.random() * CW,
      y: 10 + Math.random() * 70,
      r: 0.5 + Math.random() * 1.5,
      spd: 0.4 + Math.random() * 0.8,
    })),
    // ground pebbles
    pebbles: Array.from({ length: 14 }, (_, i) => ({
      x: (i / 14) * CW + Math.random() * 20,
      y: FLOOR + 6 + Math.random() * 8,
      r: 1 + Math.random() * 2,
    })),
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const s = sRef.current;

    function draw() {
      // sky gradient background
      const sky = ctx!.createLinearGradient(0, 0, 0, CH);
      sky.addColorStop(0, '#0d0d1f');
      sky.addColorStop(1, '#111128');
      ctx!.fillStyle = sky;
      ctx!.fillRect(0, 0, CW, CH);

      // parallax stars
      s.stars.forEach(st => {
        ctx!.fillStyle = `rgba(200,220,255,${0.25 + st.r * 0.12})`;
        ctx!.beginPath();
        ctx!.arc(st.x, st.y, st.r * 0.7, 0, Math.PI * 2);
        ctx!.fill();
      });

      // distant city silhouette (static)
      ctx!.fillStyle = 'rgba(80,60,140,0.18)';
      const buildings = [
        [20,  50, 18, 40], [42,  55, 14, 35], [60,  45, 22, 45],
        [86,  58, 12, 32], [102, 48, 20, 42], [126, 52, 16, 38],
        [146, 44, 24, 46], [174, 56, 14, 34], [192, 46, 18, 44],
        [480, 50, 18, 40], [502, 42, 24, 48], [528, 55, 15, 35],
      ];
      buildings.forEach(([bx, by, bw, bh]) => {
        ctx!.fillRect(bx, FLOOR - bh, bw, bh);
        // window dots
        ctx!.fillStyle = 'rgba(200,180,255,0.2)';
        for (let wx = bx + 3; wx < bx + bw - 3; wx += 5) {
          for (let wy = FLOOR - bh + 4; wy < FLOOR - 4; wy += 6) {
            ctx!.fillRect(wx, wy, 2, 3);
          }
        }
        ctx!.fillStyle = 'rgba(80,60,140,0.18)';
      });

      // neon ground strip
      const groundGrd = ctx!.createLinearGradient(0, FLOOR, 0, CH);
      groundGrd.addColorStop(0, 'rgba(0,255,180,0.12)');
      groundGrd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx!.fillStyle = groundGrd;
      ctx!.fillRect(0, FLOOR, CW, CH - FLOOR);

      // floor line
      ctx!.strokeStyle = 'rgba(0,255,200,0.55)';
      ctx!.lineWidth = 1.5;
      ctx!.setLineDash([]);
      ctx!.shadowColor = '#00ffc8';
      ctx!.shadowBlur = 6;
      ctx!.beginPath();
      ctx!.moveTo(0, FLOOR); ctx!.lineTo(CW, FLOOR);
      ctx!.stroke();
      ctx!.shadowBlur = 0;

      // scrolling dashes
      ctx!.strokeStyle = 'rgba(0,255,160,0.18)';
      ctx!.lineWidth = 1;
      ctx!.setLineDash([14, 10]);
      ctx!.lineDashOffset = -s.trackOff;
      ctx!.beginPath();
      ctx!.moveTo(0, FLOOR + 12); ctx!.lineTo(CW, FLOOR + 12);
      ctx!.stroke();
      ctx!.setLineDash([]);

      // scrolling pebbles
      s.pebbles.forEach(p => {
        ctx!.fillStyle = 'rgba(0,200,140,0.18)';
        ctx!.beginPath();
        ctx!.ellipse(p.x, p.y, p.r * 1.5, p.r, 0, 0, Math.PI * 2);
        ctx!.fill();
      });

      // obstacles
      s.obstacles.forEach(ob => drawObstacle(ctx!, ob));

      // cat
      drawCat(ctx!, PX, s.playerY, s.phase !== 'dead', s.frame);

      // HUD
      ctx!.shadowBlur = 0;
      ctx!.textBaseline = 'middle';
      if (s.phase === 'playing') {
        ctx!.fillStyle = 'rgba(0,255,200,0.55)';
        ctx!.font = '700 13px ui-monospace, monospace';
        ctx!.textAlign = 'right';
        ctx!.fillText(String(Math.floor(s.score)).padStart(5, '0'), CW - 12, 16);
      }
      if (s.phase === 'idle') {
        // frosted pill
        ctx!.fillStyle = 'rgba(255,255,255,0.06)';
        rr(ctx!, CW / 2 - 120, CH / 2 - 16, 240, 32, 16);
        ctx!.fill();
        ctx!.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx!.lineWidth = 1;
        ctx!.stroke();
        ctx!.fillStyle = 'rgba(255,255,255,0.7)';
        ctx!.font = '500 13px system-ui, sans-serif';
        ctx!.textAlign = 'center';
        ctx!.fillText('Space / tap to start  •  help the cat dodge spam!', CW / 2, CH / 2 + 1);
      }
      if (s.phase === 'dead') {
        ctx!.fillStyle = 'rgba(0,0,0,0.52)';
        ctx!.fillRect(0, 0, CW, CH);
        ctx!.fillStyle = '#ff5566';
        ctx!.font = '800 18px system-ui, sans-serif';
        ctx!.textAlign = 'center';
        ctx!.fillText('GAME OVER', CW / 2, CH / 2 - 10);
        ctx!.fillStyle = 'rgba(255,255,255,0.55)';
        ctx!.font = '500 12px system-ui, sans-serif';
        ctx!.fillText(`Score: ${Math.floor(s.score)}   •   tap or Space to retry`, CW / 2, CH / 2 + 12);
      }
    }

    function loop() {
      s.frame++;
      if (s.phase === 'dead') { draw(); return; }

      s.velY += GRAVITY;
      s.playerY += s.velY;
      if (s.playerY >= FLOOR - PH) {
        s.playerY = FLOOR - PH;
        s.velY = 0;
        s.grounded = true;
      }

      s.trackOff = (s.trackOff + s.speed * 0.7) % 24;
      s.cloudOff = (s.cloudOff + s.speed * 0.15) % CW;

      // scroll stars
      s.stars.forEach(st => {
        st.x -= st.spd;
        if (st.x < -4) { st.x = CW + 4; st.y = 10 + Math.random() * 70; }
      });

      // scroll pebbles
      s.pebbles.forEach(p => {
        p.x -= s.speed * 0.9;
        if (p.x < -10) { p.x = CW + 10; p.y = FLOOR + 6 + Math.random() * 8; }
      });

      // spawn obstacles
      s.nextObs--;
      if (s.nextObs <= 0) {
        // occasionally double obstacle
        const n = Math.random() < 0.18 ? 2 : 1;
        for (let i = 0; i < n; i++) {
          s.obstacles.push({ x: CW + 10 + i * 28, w: 16 + Math.random() * 14, h: 22 + Math.random() * 36 });
        }
        s.nextObs = Math.max(45, 88 + Math.random() * 52 - s.score / 180);
      }
      s.obstacles.forEach(ob => { ob.x -= s.speed; });
      s.obstacles = s.obstacles.filter(ob => ob.x + ob.w > -6);

      s.speed = Math.min(11, 4.5 + s.score / 480);
      s.score += 0.16 * (s.speed / 4.5);

      // collision — 5 px forgiveness
      for (const ob of s.obstacles) {
        if (
          PX + 5         < ob.x + ob.w &&
          PX + PW - 5    > ob.x &&
          s.playerY + 5  < FLOOR &&
          s.playerY + PH - 5 > FLOOR - ob.h
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
        s.obstacles = []; s.nextObs = 90;
        s.playerY = FLOOR - PH; s.velY = 0;
        s.grounded = true; s.trackOff = 0; s.frame = 0;
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
    <div style={{ width: '100%', maxWidth: CW, margin: '0 auto', textAlign: 'center' }}>
      <canvas
        ref={canvasRef}
        width={CW}
        height={CH}
        style={{
          display: 'block',
          margin: '0 auto',
          borderRadius: 14,
          border: '1px solid rgba(0,255,180,0.15)',
          boxShadow: '0 0 32px rgba(0,255,180,0.06), 0 0 1px rgba(0,255,180,0.3)',
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
      <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <div className="gen-orbit-dot gen-dot-a" />
        <div className="gen-orbit-dot gen-dot-b" />
        <div className="gen-orbit-dot gen-dot-c" />
        <div className="gen-cube-scene">
          <div className="gen-cube">
            <div className="gen-face gen-face-front">✉️</div>
            <div className="gen-face gen-face-back">📧</div>
            <div className="gen-face gen-face-right">⚡</div>
            <div className="gen-face gen-face-left">✨</div>
            <div className="gen-face gen-face-top">🧠</div>
            <div className="gen-face gen-face-bottom">🚀</div>
          </div>
        </div>
      </div>

      {/* Runner game — below cube, above heading */}
      <div style={{ width: '100%', maxWidth: 560, margin: '0 auto 20px' }}>
        <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: 11, margin: '0 0 7px', letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center' }}>
          🐱 Help the cat dodge spam while you wait
        </p>
        <RunnerGame />
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
    </div>
  );
}
