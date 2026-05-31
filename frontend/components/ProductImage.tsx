import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  quality?: number;
  sizes?: string;
};

export default function ProductImage({
  src,
  alt,
  className = "",
  priority,
  fill,
  quality,
  sizes,
}: Props) {
  if (src.endsWith(".svg")) {
    const svgClass = fill
      ? `absolute inset-0 h-full w-full object-contain p-8 ${className}`
      : className;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={svgClass} />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      priority={priority}
      quality={quality}
      sizes={sizes}
      className={className}
    />
  );
}
