import ProductImage from "@/components/ProductImage";
import { ProductSlug } from "@/data/products";

const ACCENT: Record<
  ProductSlug,
  { frame: string; glow: string; badge: string }
> = {
  cyclecalm: {
    frame: "border-scarcity/25 shadow-scarcity/10",
    glow: "from-scarcity/15 via-cream to-white",
    badge: "bg-scarcity/10 text-scarcity",
  },
  oralflora: {
    frame: "border-sage/25 shadow-sage/10",
    glow: "from-sage/10 via-cream to-white",
    badge: "bg-sage/10 text-sage",
  },
  clearbalance: {
    frame: "border-violet-200 shadow-violet-100",
    glow: "from-violet-100/40 via-cream to-white",
    badge: "bg-violet-100 text-violet-800",
  },
};

type Props = {
  slug: ProductSlug;
  src: string;
  alt: string;
  label?: string;
};

export default function ProductSectionImage({ slug, src, alt, label }: Props) {
  const accent = ACCENT[slug];

  return (
    <div className="group relative w-full max-w-md mx-auto lg:max-w-none">
      <div
        aria-hidden
        className={`absolute -inset-2 rounded-3xl bg-gradient-to-br ${accent.glow} opacity-90 transition-opacity duration-300 group-hover:opacity-100`}
      />
      <div
        className={`relative aspect-square rounded-3xl overflow-hidden bg-white p-2 border-[5px] border-white shadow-xl ring-1 ring-slate-100/60 transition-shadow duration-300 group-hover:shadow-2xl ${accent.frame}`}
      >
        <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border/40">
          <ProductImage
            src={src}
            alt={alt}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            quality={90}
          />
        </div>
      </div>
      {label && (
        <span
          className={`absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold px-3 py-1 rounded-full border border-white shadow-md whitespace-nowrap ${accent.badge}`}
        >
          {label}
        </span>
      )}
    </div>
  );
}
