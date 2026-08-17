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
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-dark">
              {index === 0 ? "الإحساس" : index === 1 ? "التركيبة" : index === 2 ? "الروتين" : "النتيجة"}
            </p>
            <h2 className="mt-3 text-2xl font-bold leading-snug text-ink md:text-[1.75rem]">
              {section.title}
            </h2>
            <p className="mt-4 text-[15px] leading-8 text-muted">{section.body}</p>
          </div>
        );

        return (
          <section
            key={section.title}
            className={index % 2 === 0 ? "bg-transparent" : "bg-white"}
          >
            <div className="mx-auto max-w-container px-4 py-12 md:py-16">
              <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
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
            </div>
          </section>
        );
      })}
    </div>
  );
}
