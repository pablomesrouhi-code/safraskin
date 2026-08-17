import CollectionProductCard from "@/components/CollectionProductCard";
import { TrustBar } from "@/components/TrustSections";
import { PRODUCTS } from "@/data/products";

export const metadata = {
  title: "الصيغ | سفراسكين",
  description:
    "كلف تحت الفوندو، تساقط فالمغسل، وجه باهت، أو عناية للقوام بهدوء. أربع صيغ. الدفع عند الاستلام.",
};

export default function CollectionPage() {
  return (
    <>
      <div className="mx-auto max-w-container px-4 py-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-dark">
          المشكلة
        </p>
        <h1 className="mt-2 text-3xl font-bold">اختاري الإحساس اللي كتشبه ليكِ</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
          كل علبة لمشكلة واحدة كتعرفيها: البقع، التساقط، البهتان، أو القوام. الثمن من 219 درهم مغربي.
          الدفع عند الاستلام.
        </p>
      </div>
      <TrustBar />
      <div className="mx-auto grid max-w-container gap-5 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {PRODUCTS.map((product) => (
          <CollectionProductCard key={product.slug} product={product} />
        ))}
      </div>
    </>
  );
}
