import Link from "next/link";
import { PRODUCTS } from "@/data/products";
import { BRAND_NAME_AR, BRAND_NAME_EN } from "@/data/brand";

export default function Footer() {
  return (
    <footer className="bg-sage-dark text-white mt-16">
      <div className="max-w-container mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-sage flex items-center justify-center text-white font-bold">
            S
          </div>
          <div>
            <div className="font-semibold text-lg">{BRAND_NAME_AR}</div>
            <div className="font-english text-[10px] tracking-widest opacity-70 uppercase">
              {BRAND_NAME_EN}
            </div>
          </div>
        </div>
        <p className="text-white/80 mb-2 leading-relaxed max-w-md">
          مكملات gummies سعودية — دورة · فم · بشرة. ثقة من الداخل · مكونات واضحة · COD.
        </p>
        <p className="text-gold-light/90 text-sm mb-8 italic">اتزانكِ يبدأ من الداخل</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-10 text-sm">
          <div>
            <h4 className="font-semibold mb-3 text-gold-light">المنتجات</h4>
            <ul className="space-y-2 text-white/75">
              <li><Link href="/collection" className="hover:text-white">المجموعة</Link></li>
              {PRODUCTS.map((p) => (
                <li key={p.slug}>
                  <Link href={`/products/${p.slug}`} className="hover:text-white">
                    {p.nameAr}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-gold-light">مساعدة</h4>
            <ul className="space-y-2 text-white/75">
              <li><Link href="/contact" className="hover:text-white">تواصل</Link></li>
              <li><span>COD · تغليف سري</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-gold-light">قانوني</h4>
            <ul className="space-y-2 text-white/75">
              <li><Link href="/legal/terms" className="hover:text-white">الشروط</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-white">الخصوصية</Link></li>
              <li><Link href="/legal/returns" className="hover:text-white">الاسترداد</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-xs text-white/70 border-t border-white/20 pt-6">
          <span>✓ Halal-aligned</span>
          <span>✓ COD</span>
          <span>✓ 14-day guarantee</span>
          <span>✓ KSA shipping</span>
        </div>
        <p className="text-xs text-white/50 mt-4">© 2026 Safra Skin · safraskin.online</p>
      </div>
    </footer>
  );
}
