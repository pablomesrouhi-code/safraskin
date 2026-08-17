import ProductImage from "@/components/ProductImage";
import type { Product } from "@/data/products";

export default function ProductLanding({ product }: { product: Product }) {
  return (
    <div>
      {product.sections.map((section, index) => {
        const imageFirst = index % 2 === 1;
        const image = (
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-white shadow-sm">
            <ProductImage
              src={section.image}
              alt={section.title}
              fill
              emptyLabel={section.imageLabel}
            />
          </div>
        );
        const text = (
          <div>
            <h2 className="text-2xl font-bold leading-snug text-ink">{section.title}</h2>
            <p className="mt-4 text-[15px] leading-8 text-muted">{section.body}</p>
          </div>
        );

        return (
          <section key={section.title} className="mx-auto max-w-container px-4 py-12 md:py-16">
            <div className="grid items-center gap-8 md:grid-cols-2">
              {imageFirst ? (
                <>
                  {image}
                  {text}
                </>
              ) : (
                <>
                  {text}
                  {image}
                </>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
