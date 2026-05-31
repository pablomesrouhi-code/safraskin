import Link from "next/link";
import { PRODUCTS } from "@/data/products";

export default function NotFound() {
  return (
    <div className="max-w-container mx-auto px-4 py-20 text-center">
      <h1 className="text-6xl font-bold text-sage mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">الصفحة غير موجودة</p>
      <Link
        href="/"
        className="inline-block bg-sage text-white font-semibold px-8 py-3 rounded-xl mb-10"
      >
        العودة للرئيسية
      </Link>
      <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
        {PRODUCTS.map((p) => (
          <Link
            key={p.slug}
            href={`/products/${p.slug}`}
            className="border border-border rounded-xl p-4 hover:border-sage transition-colors"
          >
            {p.nameAr}
          </Link>
        ))}
      </div>
    </div>
  );
}
