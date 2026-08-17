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
        className={compact ? "h-9 w-auto" : "h-12 w-auto md:h-[3.75rem]"}
      />
    </Link>
  );
}
