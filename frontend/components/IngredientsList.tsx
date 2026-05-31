import { Ingredient } from "@/data/products";

export default function IngredientsList({ items }: { items: Ingredient[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.name}
          className="flex items-start gap-4 bg-white rounded-xl border border-border p-4"
        >
          <div className="w-2 h-2 rounded-full bg-sage mt-2 shrink-0" />
          <div>
            <p className="font-semibold text-gray-900">{item.name}</p>
            <p className="text-sm text-gray-500 mt-0.5">{item.benefit}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
