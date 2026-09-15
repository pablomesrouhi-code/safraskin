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

  const tiktokBaseSnippet = tiktokPixelId
    ? `<!-- TikTok Pixel Code Start -->\n<script>\n!function (w, d, t) {\n  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(\nvar e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")\n;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};\n\n\n  ttq.load('${tiktokPixelId}');\n  ttq.page();\n}(window, document, 'ttq');\n</script>\n<!-- TikTok Pixel Code End -->`
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
        {tiktokBaseSnippet ? <script dangerouslySetInnerHTML={{ __html: tiktokBaseSnippet }} /> : null}
      </head>
      <body className={`${arabic.variable} ${english.variable}`}>
        <StoreShell>{children}</StoreShell>
      </body>
    </html>
  );
}
