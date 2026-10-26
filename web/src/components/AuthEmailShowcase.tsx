/**
 * Decorative product visual for the auth pages: three mini emails in different
 * design styles (retro, brutalist, cyberpunk) fanned out and gently floating.
 * Pure markup, no images, so it stays sharp at any size and loads instantly.
 */
function Bar({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`rounded-[2px] ${className}`} style={style} />;
}

export default function AuthEmailShowcase() {
  return (
    <div className="relative mx-auto h-[330px] w-[420px] max-w-full select-none" aria-hidden="true">
      {/* Soft light behind the cards */}
      <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00ffff]/10 blur-3xl" />

      {/* Retro */}
      <div
        className="absolute left-0 top-10 w-[180px] animate-[float-slow_7s_ease-in-out_infinite]"
        style={{ transform: 'rotate(-9deg)' }}
      >
        <div className="rounded-xl border-2 border-dashed p-3.5 shadow-2xl shadow-black/60" style={{ background: '#fdf6e3', borderColor: '#c8a96e' }}>
          <Bar className="mb-2.5 h-[7px] w-10 !rounded-full" style={{ background: '#c8a96e66' }} />
          <Bar className="mb-1.5 h-[10px] w-[85%]" style={{ background: '#3b2a1a' }} />
          <Bar className="mb-3 h-[10px] w-[55%]" style={{ background: '#3b2a1a' }} />
          <div className="mb-3 h-[58px] rounded-lg" style={{ background: 'linear-gradient(135deg,#e9d8a6,#c8a96e)' }} />
          <Bar className="mb-1.5 h-[5px] w-full" style={{ background: '#3b2a1a30' }} />
          <Bar className="mb-1.5 h-[5px] w-[92%]" style={{ background: '#3b2a1a30' }} />
          <Bar className="mb-3.5 h-[5px] w-[70%]" style={{ background: '#3b2a1a30' }} />
          <div className="h-[18px] w-[72px] rounded-full" style={{ background: '#c8a96e' }} />
        </div>
        <p className="mt-2 text-center text-[10px] uppercase tracking-[0.18em] text-white/40">Retro</p>
      </div>

      {/* Brutalist */}
      <div
        className="absolute right-0 top-6 w-[180px] animate-[float-slow_8s_ease-in-out_-2s_infinite]"
        style={{ transform: 'rotate(8deg)' }}
      >
        <div className="border-[3px] border-black bg-white p-3.5" style={{ boxShadow: '6px 6px 0 #000', outline: '1px solid rgba(255,255,255,0.15)' }}>
          <Bar className="mb-2 h-[13px] w-[92%] !rounded-none bg-black" />
          <Bar className="mb-3 h-[13px] w-[60%] !rounded-none bg-black" />
          <div className="mb-3 flex h-[58px] items-center justify-center border-[3px] border-black" style={{ background: '#ffde59' }}>
            <div className="h-6 w-6 border-[3px] border-black bg-white" />
          </div>
          <Bar className="mb-1.5 h-[5px] w-full !rounded-none bg-black/25" />
          <Bar className="mb-3.5 h-[5px] w-[80%] !rounded-none bg-black/25" />
          <div className="h-[18px] w-[78px] border-[3px] border-black bg-black" />
        </div>
        <p className="mt-3 text-center text-[10px] uppercase tracking-[0.18em] text-white/40">Brutalist</p>
      </div>

      {/* Cyberpunk, front and center */}
      <div className="absolute left-1/2 top-0 z-10 w-[210px] -translate-x-1/2 animate-[float-slow_6s_ease-in-out_-1s_infinite]">
        <div
          className="rounded-[4px] border p-4"
          style={{ background: '#0a0a0f', borderColor: '#00ffff', boxShadow: '0 0 28px rgba(0,255,255,0.35), 0 20px 50px rgba(0,0,0,0.7)' }}
        >
          <Bar className="mb-3 h-[7px] w-14" style={{ background: '#00ffff80' }} />
          <div
            className="mb-3 flex h-[78px] items-end rounded-[3px] p-2.5"
            style={{ background: 'linear-gradient(135deg, rgba(0,255,255,0.35), rgba(255,0,255,0.35))', border: '1px solid rgba(0,255,255,0.4)' }}
          >
            <div>
              <Bar className="mb-1.5 h-[9px] w-24" style={{ background: '#ffffffee' }} />
              <Bar className="h-[9px] w-14" style={{ background: '#ffffffaa' }} />
            </div>
          </div>
          <Bar className="mb-1.5 h-[5px] w-full" style={{ background: '#e0e0ff30' }} />
          <Bar className="mb-1.5 h-[5px] w-[94%]" style={{ background: '#e0e0ff30' }} />
          <Bar className="mb-4 h-[5px] w-[66%]" style={{ background: '#e0e0ff30' }} />
          <div className="h-[20px] w-[92px] rounded-[2px]" style={{ background: '#00ffff', boxShadow: '0 0 16px rgba(0,255,255,0.6)' }} />
        </div>
        <p className="mt-2.5 text-center text-[10px] uppercase tracking-[0.18em] text-[#00ffff]/70">Cyberpunk</p>
      </div>
    </div>
  );
}
