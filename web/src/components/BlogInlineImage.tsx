/**
 * An image inside a post, cropped to 16:9 by default. Pass `natural` for screenshots and graphics that contain text,
 * so the whole image shows at its own shape instead of being cropped.
 */
export default function BlogInlineImage({
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
    <figure className="my-8">
      <div className={`relative w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 ${natural ? '' : 'aspect-[16/9]'}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className={natural ? 'block h-auto w-full' : 'h-full w-full object-cover'} />
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-white/40 text-center">{caption}</figcaption>
      )}
    </figure>
  );
}
