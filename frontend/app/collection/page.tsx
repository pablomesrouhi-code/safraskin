import CollectionProductCard from "@/components/CollectionProductCard";
import { TrustBar } from "@/components/TrustSections";
import { PRODUCTS } from "@/data/products";

export const metadata = {
  title: "الصيغ | سفراسكين",
  description: "كريم الكلف، كريم القوام الأنثوي، سيروم الفروة، وعناية الإشراق من الداخل. الدفع عند الاستلام.",
};

export default function CollectionPage() {
  return (
    <>
      <div className="mx-auto max-w-container px-4 py-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-dark">
          المختبر
        </p>
        <h1 className="mt-2 text-3xl font-bold">أربع صيغ. اختاري اللي كتشبه ليكِ.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
          كل علبة لمشكلة واحدة. الثمن من 219 درهم مغربي. الدفع عند الاستلام. المكوّنات مكتوبة قبل ما تضيفي للسلة.
        </p>
      </div>
      <TrustBar />
      <div className="mx-auto grid max-w-container gap-8 px-4 py-12 md:grid-cols-2">
        {PRODUCTS.map((product) => (
          <CollectionProductCard key={product.slug} product={product} />
        ))}
      </div>
    </>
  );
}
