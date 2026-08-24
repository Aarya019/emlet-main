export default function BlogHeroImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-full aspect-[16/8] rounded-2xl overflow-hidden mb-10 border border-white/10 bg-white/5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/20" />
    </div>
  );
}
