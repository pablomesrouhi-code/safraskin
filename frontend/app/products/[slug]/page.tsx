import { notFound } from "next/navigation";
import { getProduct, PRODUCTS } from "@/data/products";
import ProductLanding from "@/components/ProductLanding";
import type { Metadata } from "next";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const product = getProduct(params.slug);
  if (!product) return { title: "منتج غير موجود" };
  return {
    title: `${product.nameAr} | سفرا جلد`,
    description: `${product.taglineAr} — ${product.shortDescriptionAr}`,
  };
}

export default function ProductPage({ params }: Props) {
  const product = getProduct(params.slug);
  if (!product) notFound();
  return <ProductLanding product={product} />;
}
