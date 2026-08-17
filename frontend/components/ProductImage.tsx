import { ASSETS_READY } from "@/data/brand";

type FrameProps = {
  label?: string;
  className?: string;
};

export function EmptyFrame({ label, className = "" }: FrameProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F3EBE0] via-cream to-[#EAD9C4] text-center px-3 ${className}`}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose text-sm font-semibold text-white">
        S
      </span>
      {label ? (
        <span className="mt-3 text-[11px] font-semibold leading-5 text-saffron-dark">{label}</span>
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
};

export default function ProductImage({
  src,
  alt,
  className = "",
  fill,
  emptyLabel,
}: ImageProps) {
  const showEmpty = !ASSETS_READY || !src;
  const frameClass = fill ? `absolute inset-0 h-full w-full ${className}` : className;

  if (showEmpty) {
    return <EmptyFrame label={emptyLabel || alt} className={frameClass} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={fill ? `absolute inset-0 h-full w-full object-cover ${className}` : className}
    />
  );
}
