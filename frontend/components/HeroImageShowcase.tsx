import ProductImage from "@/components/ProductImage";

export default function HeroImageShowcase() {
  return (
    <div className="flex flex-col items-center lg:items-start w-full lg:pl-4">
      <div className="relative w-full max-w-[min(100%,26rem)] sm:max-w-[32rem] md:max-w-[36rem] lg:max-w-[42rem] xl:max-w-[46rem] mx-auto lg:mx-0">
        {/* Small label — premium micro-copy */}
        <div className="absolute -top-2 left-2 sm:left-4 z-10 rounded-xl bg-white border border-sage/15 shadow-md px-2 py-1.5 max-w-[4.5rem]">
          <p className="text-[8px] font-extrabold text-gold text-center leading-none mb-0.5">✦</p>
          <p className="text-[9px] sm:text-[10px] font-bold text-sage leading-[1.25] text-center">
            ثقة
            <br />
            من الداخل
          </p>
        </div>

        <div className="relative aspect-square rounded-3xl overflow-hidden bg-white p-2 border-[6px] border-white shadow-lg ring-1 ring-slate-100/70">
          <ProductImage
            src="/hero-home.png"
            alt="سفرا جلد — مكملات gummies"
            fill
            priority
            quality={100}
            sizes="(max-width: 640px) 416px, (max-width: 1024px) 576px, 736px"
            className="object-contain object-center"
          />
        </div>
      </div>

      <p className="text-center lg:text-start text-xs text-gray-400 mt-4 max-w-xs leading-relaxed">
        3 gummies · 60 حبة · شهر كامل لكل مشكلة
      </p>
    </div>
  );
}
