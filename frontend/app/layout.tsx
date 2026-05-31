import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DeferredPixels from "@/components/DeferredPixels";

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
  fallback: ["Tahoma", "Arial", "sans-serif"],
});

const english = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-english",
});

export const metadata: Metadata = {
  title: "سفرا جلد | Safra Skin — مكملات gummies للمرأة السعودية",
  description:
    "سفرا جلد — gummies: هدوء الدورة · فلورا الفم · توازن البشرة. مكونات مُعلنة · halal · vegan · دفع عند الاستلام.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${arabic.variable} ${english.variable}`}>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <DeferredPixels />
        </CartProvider>
      </body>
    </html>
  );
}
