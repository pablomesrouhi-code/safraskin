import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { BRAND_NAME_EN, TRUST_BAR } from "@/data/brand";
import { PRODUCTS } from "@/data/products";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-white">
      <div className="mx-auto grid max-w-container gap-10 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <BrandLogo />
          <p className="mt-3 max-w-md text-sm leading-7 text-muted">
            عناية أنثوية: أربع صيغ لمشاكل واضحة. الأثمنة بالدرهم المغربي. الدفع عند الاستلام، ومكالمة تأكيد قبل الإرسال.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {TRUST_BAR.map((item) => (
              <li
                key={item}
                className="rounded-full border border-border bg-cream px-3 py-1 text-[11px] text-muted"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold">المنتجات</p>
          <ul className="space-y-2 text-sm text-muted">
            {PRODUCTS.map((p) => (
              <li key={p.slug}>
                <Link href={`/products/${p.slug}`} className="hover:text-ink">
                  {p.headlineAr}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold">المتجر</p>
          <ul className="space-y-2 text-sm text-muted">
            <li>
              <Link href="/" className="hover:text-ink">
                الرئيسية
              </Link>
            </li>
            <li>
              <Link href="/collection" className="hover:text-ink">
                المجموعة
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-ink">
                المختبر
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-ink">
                تواصل معنا
              </Link>
            </li>
            <li>
              <Link href="/legal/terms" className="hover:text-ink">
                الشروط
              </Link>
            </li>
            <li>
              <Link href="/legal/privacy" className="hover:text-ink">
                الخصوصية
              </Link>
            </li>
            <li>
              <Link href="/legal/returns" className="hover:text-ink">
                الإرجاع
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="border-t border-border py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} {BRAND_NAME_EN} · الدفع عند الاستلام
      </p>
    </footer>
  );
}
