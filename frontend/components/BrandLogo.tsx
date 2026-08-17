import Link from "next/link";
import { BRAND_NAME_AR } from "@/data/brand";

export default function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="inline-flex min-w-0 items-center" aria-label={BRAND_NAME_AR}>
      {/* native img: public/ files stay visible in Docker/next start without the image optimizer */}
      <img
        src="/brand/logo.png"
        alt={BRAND_NAME_AR}
        width={713}
        height={428}
        className={compact ? "h-8 w-auto max-w-[130px] object-contain" : "h-9 w-auto max-w-[150px] object-contain md:h-12 md:max-w-[210px]"}
      />
    </Link>
  );
}
