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
    title: `${product.nameAr} | ${product.problemTitle} | سفراسكين`,
    description: product.taglineAr,
  };
}

export default function ProductPage({ params }: Props) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  return (
    <div className="pb-24 md:pb-0">
      <ProductHero product={product} />
      <TrustBar />

      <section className="mx-auto max-w-container px-4 pb-8 pt-10">
        <h2 className="text-2xl font-bold">{product.problemHook}</h2>
        <p className="mt-4 max-w-3xl text-[15px] leading-8 text-muted">{product.problemBody}</p>
        <h3 className="mt-8 text-xl font-bold">{product.mechanismTitle}</h3>
        <p className="mt-3 max-w-3xl text-[15px] leading-8 text-muted">{product.mechanismBody}</p>
      </section>

      <ProductLanding product={product} />
      <IngredientsList product={product} />
      <HowToUse product={product} />
      <ComparisonTable product={product} />
      <ProductReviews product={product} />
      <ProductFAQ product={product} />
      <ProductPageCrossSells currentSlug={product.slug} />
      <ScrollToOrderCTA productName={product.nameAr} />
    </div>
  );
}
