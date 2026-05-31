import { TRUST_BAR } from "@/data/brand";

export default function TrustBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap justify-center gap-2 sm:gap-3 ${className}`}>
      {TRUST_BAR.map((badge) => (
        <span
          key={badge}
          className="inline-flex items-center gap-1.5 bg-cream border border-border/80 rounded-full px-4 py-2 text-sm text-gray-600"
        >
          <span className="text-sage font-medium">✓</span>
          {badge}
        </span>
      ))}
    </div>
  );
}
