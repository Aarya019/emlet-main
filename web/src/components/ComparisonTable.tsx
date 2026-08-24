export interface ComparisonRow {
  feature: string;
  emlet: string;
  competitor: string;
  /** Mark rows where Emlet has a genuine, specific edge — renders a checkmark instead of just text. */
  emletWins?: boolean;
}

function Check() {
  return (
    <svg className="w-4 h-4 text-[#00ffff] inline-block mr-1.5 -mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function ComparisonTable({ competitor, rows }: { competitor: string; rows: ComparisonRow[] }) {
  return (
    <div className="overflow-x-auto -mx-2 sm:mx-0 my-8 rounded-xl border border-white/10">
      <table className="w-full text-sm border-collapse min-w-[560px]">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-4 text-white/40 font-medium bg-white/[0.03]">Feature</th>
            <th className="text-left py-3 px-4 text-[#00ffff] font-bold bg-[#00ffff]/[0.08]">Emlet</th>
            <th className="text-left py-3 px-4 text-white/60 font-bold bg-white/[0.03]">{competitor}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.feature} className="border-b border-white/5 last:border-0">
              <td className="py-3 px-4 text-white/50 align-top">{row.feature}</td>
              <td className={`py-3 px-4 align-top bg-[#00ffff]/[0.04] ${row.emletWins ? 'text-white font-semibold' : 'text-white'}`}>
                {row.emletWins && <Check />}
                {row.emlet}
              </td>
              <td className="py-3 px-4 text-white/60 align-top">{row.competitor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
