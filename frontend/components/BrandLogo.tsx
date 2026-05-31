import Image from "next/image";
import clsx from "clsx";
import { BRAND_NAME_AR, BRAND_NAME_EN } from "@/data/brand";

type Props = {
  variant?: "header" | "footer" | "icon";
  className?: string;
  priority?: boolean;
};

export default function BrandLogo({ variant = "header", className, priority }: Props) {
  if (variant === "header") {
    return (
      <div className={clsx("flex items-center gap-2.5", className)}>
        <Image
          src="/brand/icon.png"
          alt=""
          width={40}
          height={40}
          priority={priority}
          aria-hidden
          className="h-9 w-9 sm:h-10 sm:w-10 object-contain shrink-0"
        />
        <div className="text-right leading-tight">
          <span className="block font-bold text-base sm:text-lg text-sage-dark">{BRAND_NAME_AR}</span>
          <span className="block font-english text-[9px] sm:text-[10px] text-gray-400 tracking-wide uppercase">
            {BRAND_NAME_EN}
          </span>
        </div>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <Image
        src="/brand/app-icon.png"
        alt={BRAND_NAME_AR}
        width={44}
        height={44}
        className={clsx("h-11 w-11 rounded-xl object-cover shrink-0", className)}
      />
    );
  }

  return (
    <Image
      src="/brand/icon.png"
      alt={BRAND_NAME_AR}
      width={48}
      height={48}
      className={clsx("h-12 w-12 object-contain", className)}
    />
  );
}
