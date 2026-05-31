"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function CartRedirectPage() {
  const { openDrawer } = useCart();
  const router = useRouter();

  useEffect(() => {
    openDrawer();
    router.replace("/");
  }, [openDrawer, router]);

  return null;
}
