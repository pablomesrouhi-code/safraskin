import { Star } from "lucide-react";
import { BRAND_NAME_AR } from "@/data/brand";
import Marquee from "@/components/Marquee";

const REPEAT = 12;

export default function LogoMarquee() {
  const row = (
    <>
      {Array.from({ length: REPEAT }, (_, index) => (
        <span key={index} className="flex items-center gap-6 px-6">
          {/* native img: public files work in Docker without the optimizer */}
          <img
            src="/brand/logo.png"
            alt={index === 0 ? BRAND_NAME_AR : ""}
            width={713}
            height={428}
            className="h-9 w-auto max-w-[160px] object-contain md:h-11 md:max-w-[190px]"
          />
          <Star size={15} className="fill-saffron text-saffron" aria-hidden />
        </span>
      ))}
    </>
  );

  return (
    <div className="w-full border-y border-border bg-white py-3.5 md:py-4">
      <Marquee duration={30}>{row}</Marquee>
    </div>
  );
}
