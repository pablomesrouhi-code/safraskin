import { Suspense } from "react";
import ThankYouView from "@/components/ThankYouView";

export default function ThankYouPage({ params }: { params: { orderId: string } }) {
  return (
    <Suspense fallback={<div className="px-4 py-16 text-center">كنحمّلو تفاصيل الطلب…</div>}>
      <ThankYouView orderId={params.orderId} />
    </Suspense>
  );
}
