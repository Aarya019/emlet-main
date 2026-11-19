/**
 * Top-of-post image. By default it is cropped to a 2:1 banner with a soft dark gradient. For a screenshot or a
 * graphic that contains text, pass `natural` to show the whole image at its own shape (no crop, no gradient).
 */
export default function BlogHeroImage({
  src,
  alt,
  caption,
  natural = false,
}: {
  src: string;
  alt: string;
  caption?: string;
  natural?: boolean;
}) {
  return (
    <figure className="mb-10">
      <div className={`relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 ${natural ? '' : 'aspect-[16/8]'}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className={natural ? 'block h-auto w-full' : 'h-full w-full object-cover'} />
        {!natural && <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/20" />}
      </div>
      {caption && <figcaption className="mt-2 text-center text-sm text-white/40">{caption}</figcaption>}
    </figure>
  );
}
