import { ASSETS_READY } from "@/data/brand";

type FrameProps = {
  label?: string;
  className?: string;
  compact?: boolean;
};

export function EmptyFrame({ label, className = "", compact = false }: FrameProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F3EBE0] via-cream to-[#EAD9C4] text-center px-3 ${className}`}
    >
      <span
        className={`flex items-center justify-center rounded-full bg-rose font-semibold text-white ${
          compact ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm"
        }`}
      >
        S
      </span>
      {label ? (
        <span className={compact ? "mt-1 text-[9px] font-semibold text-saffron-dark" : "mt-3 text-[11px] font-semibold leading-5 text-saffron-dark"}>
          {label}
        </span>
      ) : null}
    </div>
  );
}

type ImageProps = {
  src?: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  emptyLabel?: string;
  compact?: boolean;
};

export default function ProductImage({
  src,
  alt,
  className = "",
  priority = false,
  fill,
  emptyLabel,
  compact,
}: ImageProps) {
  const showEmpty = !ASSETS_READY || !src;
  const frameClass = fill ? `absolute inset-0 h-full w-full ${className}` : className;

  if (showEmpty) {
    return <EmptyFrame label={emptyLabel || alt} className={frameClass} compact={compact} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className={fill ? `absolute inset-0 h-full w-full object-cover ${className}` : className}
    />
  );
}
