import { Star } from "lucide-react";

type Review = {
  name: string;
  city: string;
  text: string;
  stars: number;
  product?: string;
};

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-white rounded-xl border border-border/80 p-6 shadow-sm">
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < review.stars ? "fill-sage text-sage" : "text-gray-200"}
          />
        ))}
      </div>
      <p className="text-gray-700 leading-relaxed mb-5">&ldquo;{review.text}&rdquo;</p>
      <div className="flex items-center gap-3 pt-4 border-t border-border/60">
        <div className="w-9 h-9 rounded-full bg-cream border border-border flex items-center justify-center text-sage font-semibold text-sm shrink-0">
          {review.name.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-gray-900 text-sm">{review.name}</p>
          <p className="text-xs text-gray-400">{review.city}{review.product ? ` · ${review.product}` : ""}</p>
        </div>
      </div>
    </div>
  );
}
