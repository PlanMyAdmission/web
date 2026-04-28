import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export default function Analytics() {
  return (
    <>
      {GTM_ID ? <GoogleTagManager gtmId={GTM_ID} /> : null}
      {GA_MEASUREMENT_ID ? <GoogleAnalytics gaId={GA_MEASUREMENT_ID} /> : null}
    </>
  );
}
