export interface WinCard {
  title: string;
  description: string;
}

function CheckBadge() {
  return (
    <div className="w-8 h-8 rounded-full bg-[#00ffff]/15 border border-[#00ffff]/40 flex items-center justify-center flex-shrink-0">
      <svg className="w-4 h-4 text-[#00ffff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}

export default function WinCards({ cards }: { cards: WinCard[] }) {
  return (
    <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 my-10">
      {cards.map((card) => (
        <div key={card.title} className="rounded-xl border border-[#00ffff]/20 bg-[#00ffff]/[0.04] p-5">
          <CheckBadge />
          <p className="text-sm font-bold text-white mt-3 mb-1">{card.title}</p>
          <p className="text-xs text-white/50 leading-relaxed">{card.description}</p>
        </div>
      ))}
    </div>
  );
}
