import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DeferredPixels from "@/components/DeferredPixels";
import StoreIntro from "@/components/StoreIntro";

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
      <head>
        <link rel="preload" href="/brand/icon.png" as="image" />
        <style
          dangerouslySetInnerHTML={{
            __html:
              "html.store-intro-pending #site-shell{visibility:hidden}html.store-intro-pending{overflow:hidden;background:#FAF7F2}html.store-intro-skip .store-intro-overlay{display:none!important}",
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k='safra-intro-seen';if(sessionStorage.getItem(k)==='1'){document.documentElement.classList.add('store-intro-skip');}else{document.documentElement.classList.add('store-intro-pending');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${arabic.variable} ${english.variable}`}>
        <CartProvider>
          <StoreIntro />
          <div id="site-shell">
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
          <DeferredPixels />
        </CartProvider>
      </body>
    </html>
  );
}
