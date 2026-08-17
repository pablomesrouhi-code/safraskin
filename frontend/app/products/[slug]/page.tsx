import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PRODUCTS, getProduct } from "@/data/products";
import ProductHero from "@/components/ProductHero";
import ProductProblem from "@/components/ProductProblem";
import ProductLanding from "@/components/ProductLanding";
import IngredientsList from "@/components/IngredientsList";
import HowToUse from "@/components/HowToUse";
import ComparisonTable from "@/components/ComparisonTable";
import ProductReviews from "@/components/ProductReviews";
import ProductFAQ from "@/components/ProductFAQ";
import ProductPageCrossSells from "@/components/ProductPageCrossSells";
import ScrollToOrderCTA from "@/components/ScrollToOrderCTA";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const product = getProduct(params.slug);
  if (!product) return {};
  return {
    title: `${product.feelingTitle} | سفراسكين`,
    description: product.taglineAr,
  };
}

export default function ProductPage({ params }: Props) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  return (
    <div className="pb-24">
      <ProductHero product={product} />
      <div id="details" className="scroll-mt-header">
        <ProductProblem product={product} />
        <ProductLanding product={product} />
        <IngredientsList product={product} />
        <HowToUse product={product} />
        <ComparisonTable product={product} />
        <ProductReviews product={product} />
        <ProductFAQ product={product} />
      </div>
      <ProductPageCrossSells currentSlug={product.slug} />
      <ScrollToOrderCTA slug={product.slug} />
    </div>
  );
}
