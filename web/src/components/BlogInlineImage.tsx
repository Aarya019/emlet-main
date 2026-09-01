export default function BlogInlineImage({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="my-8">
      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-white/10 bg-white/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-white/40 text-center">{caption}</figcaption>
      )}
    </figure>
  );
}
