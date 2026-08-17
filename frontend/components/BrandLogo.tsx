import Link from "next/link";
import { BRAND_NAME_AR, BRAND_NAME_EN } from "@/data/brand";

export default function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 min-w-0">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose text-white shadow-sm">
        <span className="font-english text-sm font-semibold tracking-tight">S</span>
      </span>
      <span className="min-w-0">
        <span className="block text-[15px] font-bold leading-tight text-ink">{BRAND_NAME_AR}</span>
        {!compact && (
          <span className="block font-english text-[10px] tracking-[0.18em] uppercase text-saffron-dark">
            {BRAND_NAME_EN}
          </span>
        )}
      </span>
    </Link>
  );
}
