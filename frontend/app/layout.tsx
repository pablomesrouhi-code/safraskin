import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import "./globals.css";
import StoreShell from "@/components/StoreShell";
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
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const tiktokPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;

  const metaScript = metaPixelId
    ? `
      !function(f,b,e,v,n,t,s){
        if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
        s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)
      }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${metaPixelId}');
      fbq('track', 'PageView');
    `
    : "";

  const tiktokScript = tiktokPixelId
    ? `
      !function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie'];ttq.setAndDequeue=function(t,e){t=Array.prototype.slice.call(t);ttq.push(['set',e||{}]);if(!this._d)this._d=t};ttq._i=Date.now();ttq._d=ttq._d||[];(function(){var tt=d.createElement('script');tt.type='text/javascript';tt.async=true;tt.src='https://analytics.tiktok.com/i18n/pixel/sdk.js';var s=d.getElementsByTagName('script')[0];s.parentNode.insertBefore(tt,s)})();}(window,document,'ttq');ttq.load('${tiktokPixelId}');ttq.page();
    `
    : "";

  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          rel="preload"
          as="image"
          href="/home/hero-1600.webp"
          fetchPriority="high"
        />
        <link rel="preload" as="image" href="/brand/logo.webp" />
        {metaScript ? <script dangerouslySetInnerHTML={{ __html: metaScript }} /> : null}
        {tiktokScript ? <script dangerouslySetInnerHTML={{ __html: tiktokScript }} /> : null}
      </head>
      <body className={`${arabic.variable} ${english.variable}`}>
        <StoreShell>{children}</StoreShell>
      </body>
    </html>
  );
}
