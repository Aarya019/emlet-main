'use client';

interface UpgradeModalProps {
  message: string;
  onClose: () => void;
}

export default function UpgradeModal({ message, onClose }: UpgradeModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-black border border-[#00ffff]/30 rounded-2xl shadow-xl shadow-black/60 max-w-md w-full p-8">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#00ffff]/10 border border-[#00ffff]/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-[#00ffff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-2xl font-black text-white mb-3 text-center">Free Plan Limit Reached</h3>
        <p className="text-white/70 text-center mb-8 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white font-bold hover:bg-white/20 transition-all"
          >
            Not now
          </button>
          <a
            href="/#pricing"
            className="flex-1 px-6 py-3 rounded-xl bg-[#00ffff] text-black font-bold text-center hover:shadow-lg hover:shadow-[#00ffff]/30 transition-all"
          >
            Upgrade
          </a>
        </div>
      </div>
    </div>
  );
}
