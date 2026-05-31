import Link from "next/link";
import { Star, ArrowLeft } from "lucide-react";
import { Product } from "@/data/products";
import ProductImage from "@/components/ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white rounded-3xl border border-border overflow-hidden hover:shadow-2xl hover:shadow-sage/10 transition-all duration-300 hover:-translate-y-1 flex flex-col"
    >
      <div className="relative aspect-square bg-white overflow-hidden">
        <ProductImage
          src={product.image}
          alt={product.nameAr}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={13}
              className={i < Math.floor(product.rating) ? "fill-gold text-gold" : "text-gray-200"}
            />
          ))}
          <span className="text-xs text-gray-400 mr-1">{product.rating}</span>
        </div>

        <p className="text-sage text-xs font-bold mb-1">سفرا جلد</p>
        <h3 className="font-bold text-gray-900 text-xl mb-1 leading-snug">{product.nameAr}</h3>
        <p className="text-sm text-gray-500 mb-3">{product.taglineAr}</p>
        <p className="text-xs text-gray-400 italic mb-5 flex-1">&ldquo;{product.heroQuote}&rdquo;</p>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="text-2xl font-bold text-sage">من {product.unitPriceSar} ر.س</span>
          <span className="flex items-center gap-1 text-sm text-sage font-semibold group-hover:gap-2 transition-all">
            اكتشفي البروتوكول
            <ArrowLeft size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
