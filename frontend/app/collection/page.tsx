import CollectionProductCard from "@/components/CollectionProductCard";
import { TrustBar } from "@/components/TrustSections";
import { PRODUCTS } from "@/data/products";

export const metadata = {
  title: "المجموعة | سفراسكين",
  description: "أربعة حلول: الكلف، القوام الأنثوي، سقوط الشعر، والإشراق من الداخل.",
};

export default function CollectionPage() {
  return (
    <>
      <div className="mx-auto max-w-container px-4 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-saffron-dark">
          المجموعة
        </p>
        <h1 className="mt-2 text-3xl font-bold">اختاري الحل اللي كيشبه ليكِ</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
          كل منتج لمشكلة واحدة. الثمن من 219 د.م. الدفع عند الاستلام. الصور غادي تزاد هنا.
        </p>
      </div>
      <TrustBar />
      <div className="mx-auto grid max-w-container gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {PRODUCTS.map((product) => (
          <CollectionProductCard key={product.slug} product={product} />
        ))}
      </div>
    </>
  );
}
