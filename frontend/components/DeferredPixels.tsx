"use client";

import Script from "next/script";

export default function DeferredPixels() {
  const metaId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const tiktokId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
  const snapId = process.env.NEXT_PUBLIC_SNAP_PIXEL_ID;

  if (!metaId && !tiktokId && !snapId) return null;

  const metaBaseCode = `
    !function(f,b,e,v,n,t,s){
      if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
      s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)
    }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${metaId || ""}');
    fbq('track', 'PageView');
  `;

  const tiktokBaseCode = `
    !function(w,d,t){
      w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
      ttq.methods=['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie'];
      ttq.setAndDequeue=function(t,e){t=Array.prototype.slice.call(t);ttq.push(['set',e||{}]);if(!this._d) this._d=t;};
      ttq._i=Date.now();
      ttq._d=ttq._d||[];
      (function(){var tt=d.createElement('script'); tt.type='text/javascript'; tt.async=true; tt.src='https://analytics.tiktok.com/i18n/pixel/sdk.js'; var s=d.getElementsByTagName('script')[0]; s.parentNode.insertBefore(tt,s);})();
    }(window, document, 'ttq');
    ttq.load('${tiktokId || ""}');
    ttq.page();
  `;

  return (
    <>
      {metaId ? (
        <Script id="meta-pixel-base" strategy="afterInteractive">
          {metaBaseCode}
        </Script>
      ) : null}

      {tiktokId ? (
        <Script id="tiktok-pixel-base" strategy="afterInteractive">
          {tiktokBaseCode}
        </Script>
      ) : null}
    </>
  );
}
