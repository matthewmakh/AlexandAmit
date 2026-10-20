import Image from "next/image";

/**
 * A photograph in a fixed aspect frame. Drops in where an ImageSlot was.
 * Files live in public/images; `src` is the public path.
 */
export function Photo({
  src,
  alt,
  aspect = "16/9",
  className = "",
  rounded = "rounded-[28px]",
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  objectPosition = "center",
}: {
  src: string;
  alt: string;
  aspect?: string;
  className?: string;
  rounded?: string;
  priority?: boolean;
  sizes?: string;
  objectPosition?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-canvas ${rounded} ${className}`} style={{ aspectRatio: aspect }}>
      <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" style={{ objectPosition }} />
    </div>
  );
}
