import { ProductFaq } from "@/data/products";

export default function ProductFAQ({ items }: { items: ProductFaq[] }) {
  return (
    <div className="space-y-3 max-w-2xl mx-auto">
      {items.map((item) => (
        <details key={item.q} className="bg-white border border-border rounded-xl p-4 group">
          <summary className="font-semibold cursor-pointer list-none flex justify-between items-center gap-4">
            {item.q}
            <span className="text-sage shrink-0 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <p className="mt-3 text-gray-600 text-sm leading-relaxed">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
