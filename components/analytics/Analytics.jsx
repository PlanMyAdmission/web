import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import Script from 'next/script';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
const HOTJAR_ID = process.env.NEXT_PUBLIC_HOTJAR_ID;

export default function Analytics() {
  return (
    <>
      {GTM_ID ? <GoogleTagManager gtmId={GTM_ID} /> : null}
      {GA_MEASUREMENT_ID ? <GoogleAnalytics gaId={GA_MEASUREMENT_ID} /> : null}
      {CLARITY_PROJECT_ID ? (
        <Script
          id="clarity-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){
  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window,document,"clarity","script","${CLARITY_PROJECT_ID}");`,
          }}
        />
      ) : null}
      {HOTJAR_ID ? (
        <Script
          id="hotjar-analytics"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `(function(h,o,t,j,a,r){
  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
  h._hjSettings={hjid:${HOTJAR_ID},hjsv:6};
  a=o.getElementsByTagName("head")[0];
  r=o.createElement("script");r.async=1;
  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
  a.appendChild(r);
})(window,document,"https://static.hotjar.com/c/hotjar-",".js?sv=");`,
          }}
        />
      ) : null}
    </>
  );
}
