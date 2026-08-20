import ProductImage from "@/components/ProductImage";
import type { Product } from "@/data/products";

export default function ProductLanding({ product }: { product: Product }) {
  const stories = [
    { section: product.sections[0], image: product.gallery[1], kicker: "المشكلة" },
    { section: product.sections[3], image: product.gallery[2], kicker: "النتيجة" },
    { section: product.sections[2], image: product.gallery[3], kicker: "المنتج والروتين" },
  ].filter((story) => story.section && story.image);

  return (
    <div>
      {stories.map(({ section, image: storyImage, kicker }, index) => {
        const image = (
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-white shadow-sm">
            <ProductImage
              src={storyImage.src}
              alt={section.title}
              fill
              emptyLabel={storyImage.label}
            />
          </div>
        );
        const text = (
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-saffron-dark">
              {kicker}
            </p>
            <h2 className="mt-3 text-xl font-bold leading-[1.45] text-ink md:text-[1.75rem]">
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
            <div className="mx-auto max-w-container px-4 py-10 md:py-16">
              <div className="flex flex-col gap-6 md:grid md:grid-cols-2 md:items-center md:gap-12">
                {image}
                {text}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
