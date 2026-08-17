import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PRODUCTS, getProduct } from "@/data/products";
import ProductHero from "@/components/ProductHero";
import ProductLanding from "@/components/ProductLanding";
import IngredientsList from "@/components/IngredientsList";
import HowToUse from "@/components/HowToUse";
import ComparisonTable from "@/components/ComparisonTable";
import ProductReviews from "@/components/ProductReviews";
import ProductFAQ from "@/components/ProductFAQ";
import ProductPageCrossSells from "@/components/ProductPageCrossSells";
import ScrollToOrderCTA from "@/components/ScrollToOrderCTA";
import { TrustBar } from "@/components/TrustSections";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const product = getProduct(params.slug);
  if (!product) return {};
  return {
    title: `${product.headlineAr} | سفراسكين`,
    description: `${product.formulaLine}. ${product.taglineAr}`,
  };
}

export default function ProductPage({ params }: Props) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  return (
    <div className="pb-24 md:pb-0">
      <ProductHero product={product} />
      <TrustBar />

      <section className="bg-ink text-cream">
        <div className="mx-auto max-w-container px-4 py-12 md:py-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron">من المختبر</p>
          <h2 className="mt-3 max-w-3xl text-2xl font-bold leading-snug md:text-3xl">
            {product.headlineAr}
          </h2>
          <p className="mt-4 max-w-3xl text-[15px] leading-8 text-cream/75">{product.labNote}</p>
          <p className="mt-4 text-sm text-saffron">{product.formulaLine}</p>
        </div>
      </section>

      <section className="mx-auto max-w-container px-4 py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-dark">
              المشكلة
            </p>
            <h2 className="mt-3 text-2xl font-bold leading-snug">{product.problemHook}</h2>
            <p className="mt-4 text-[15px] leading-8 text-muted">{product.problemBody}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-dark">
              الصيغة
            </p>
            <h3 className="mt-3 text-2xl font-bold leading-snug">{product.mechanismTitle}</h3>
            <p className="mt-4 text-[15px] leading-8 text-muted">{product.mechanismBody}</p>
          </div>
        </div>
      </section>

      <ProductLanding product={product} />
      <IngredientsList product={product} />
      <HowToUse product={product} />
      <ComparisonTable product={product} />
      <ProductReviews product={product} />
      <ProductFAQ product={product} />
      <ProductPageCrossSells currentSlug={product.slug} />
      <ScrollToOrderCTA productName={product.headlineAr} />
    </div>
  );
}
