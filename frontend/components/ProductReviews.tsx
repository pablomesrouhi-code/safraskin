import ReviewCard from "@/components/ReviewCard";
import { ProductReview } from "@/data/products";

export default function ProductReviews({
  reviews,
  productName,
}: {
  reviews: ProductReview[];
  productName: string;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-2">شهادات عن {productName}</h2>
      <p className="text-center text-gray-400 text-sm mb-8">سعوديات جربن المنتج</p>
      <div className="grid md:grid-cols-3 gap-5">
        {reviews.map((r) => (
          <ReviewCard key={r.name} review={{ ...r, product: productName }} />
        ))}
      </div>
    </div>
  );
}
