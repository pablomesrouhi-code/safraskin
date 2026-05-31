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
  metadataBase: new URL("https://safraskin.online"),
  title: "سفرا جلد | Safra Skin — مكملات gummies للمرأة السعودية",
  description:
    "سفرا جلد — gummies: هدوء الدورة · فلورا الفم · توازن البشرة. مكونات مُعلنة · halal · vegan · دفع عند الاستلام.",
  icons: {
    icon: [
      { url: "/brand/favicon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/brand/apple-touch-icon.png",
  },
  openGraph: {
    siteName: "سفرا جلد",
    locale: "ar_SA",
    type: "website",
  },
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
