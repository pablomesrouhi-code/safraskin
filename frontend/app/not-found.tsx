import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-container px-4 py-20 text-center">
      <div className="mb-8 flex justify-center">
        <BrandLogo />
      </div>
      <h1 className="text-3xl font-bold">الصفحة ما لقيناهاش</h1>
      <p className="mt-3 text-muted">ارجعي للمجموعة واختاري الحل ديالك.</p>
      <Link href="/collection" className="mt-6 inline-block rounded-xl bg-rose px-5 py-3 font-bold text-white">
        المجموعة
      </Link>
    </div>
  );
}
