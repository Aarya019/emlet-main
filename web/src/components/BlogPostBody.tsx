import type { ContentBlock } from '@/lib/content/blocks';
import BlogInlineImage from './BlogInlineImage';

function tableCellTone(cell: string) {
  if (cell.startsWith('✓')) return 'text-emerald-400 font-medium';
  if (cell.startsWith('~')) return 'text-yellow-400 font-medium';
  if (cell.startsWith('✗')) return 'text-red-400 font-medium';
  return 'text-white/65';
}

/**
 * Renders a post's ContentBlock[] with the exact same Tailwind conventions
 * the hand-written legacy posts use, so a registry-driven post is visually
 * indistinguishable from one written directly as JSX.
 */
export default function BlogPostBody({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-6 text-white/70 leading-relaxed text-[17px]">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'p':
            return <p key={i}>{block.text}</p>;
          case 'h2':
            return (
              <h2 key={i} className="text-2xl font-bold text-white pt-6">
                {block.text}
              </h2>
            );
          case 'ul':
            return (
              <ul key={i} className="list-disc list-outside pl-5 space-y-3">
                {block.items.map((item, j) => (
                  <li key={j}>
                    {item.bold && <span className="text-white font-semibold">{item.bold} </span>}
                    {item.text}
                  </li>
                ))}
              </ul>
            );
          case 'image':
            return <BlogInlineImage key={i} src={block.src} alt={block.alt} caption={block.caption} />;
          case 'quote':
            return (
              <blockquote key={i} className="border-l-2 border-[#00ffff]/40 pl-5 py-1 text-white/80 italic">
                {block.text}
                {block.attribution && (
                  <footer className="mt-2 text-sm text-white/40 not-italic">— {block.attribution}</footer>
                )}
              </blockquote>
            );
          case 'table':
            return (
              <figure key={i}>
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-white/5">
                        {block.headers.map((h, hi) => (
                          <th
                            key={hi}
                            className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white/50"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row, ri) => (
                        <tr key={ri} className="border-t border-white/8">
                          {row.map((cell, ci) => (
                            <td key={ci} className={`px-4 py-3 text-sm ${tableCellTone(cell)}`}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {block.caption && (
                  <figcaption className="mt-2 text-center text-sm text-white/40">{block.caption}</figcaption>
                )}
              </figure>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
