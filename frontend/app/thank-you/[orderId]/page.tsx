import { getProduct } from "@/data/products";
import ThankYouView from "@/components/ThankYouView";
import { getCallWindow, parseOrderItems } from "@/lib/orderConfirmation";

type Props = {
  params: { orderId: string };
  searchParams: {
    upsell?: string;
    upsellPrice?: string;
    total?: string;
    subtotal?: string;
    name?: string;
    phone?: string;
    items?: string;
  };
};

export default function ThankYouPage({ params, searchParams }: Props) {
  const upsellProduct = searchParams.upsell ? getProduct(searchParams.upsell) : null;
  const upsellPrice = searchParams.upsellPrice ? Number(searchParams.upsellPrice) : null;
  const total = searchParams.total ? Number(searchParams.total) : null;
  const subtotal = searchParams.subtotal ? Number(searchParams.subtotal) : null;
  const customerName = searchParams.name ? decodeURIComponent(searchParams.name) : undefined;
  const customerPhone = searchParams.phone ?? undefined;
  const orderLines = parseOrderItems(searchParams.items);
  const callWindow = getCallWindow();

  return (
    <ThankYouView
      orderId={params.orderId}
      customerName={customerName}
      customerPhone={customerPhone}
      orderLines={orderLines}
      subtotal={subtotal}
      total={total}
      upsellProduct={upsellProduct ?? null}
      upsellPrice={upsellPrice}
      callWindow={callWindow}
    />
  );
}
