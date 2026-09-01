import type { ContentBlock } from '@/lib/content/blocks';
import BlogInlineImage from './BlogInlineImage';

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
          default:
            return null;
        }
      })}
    </div>
  );
}
