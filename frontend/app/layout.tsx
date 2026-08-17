import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DeferredPixels from "@/components/DeferredPixels";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { BRAND_NAME_AR, SITE_URL } from "@/data/brand";

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
  fallback: ["Tahoma", "Arial", "sans-serif"],
  adjustFontFallback: true,
});

const english = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-english",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${BRAND_NAME_AR} | عناية أنثوية`,
  description:
    "سفراسكين — كريم تفتيح الوجه، زيت تساقط الشعر 60 مل، كولاجين بحري 30 كبسولة، وزيادة المناطق الأنثوية 60 كبسولة. الأثمنة بالدرهم المغربي. الدفع عند الاستلام.",
  openGraph: {
    siteName: BRAND_NAME_AR,
    locale: "ar_MA",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${arabic.variable} ${english.variable}`}>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <AnalyticsTracker />
          <DeferredPixels />
        </CartProvider>
      </body>
    </html>
  );
}
