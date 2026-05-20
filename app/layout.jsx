import '@/app/globals.css';
import Analytics from '@/components/analytics/Analytics.jsx';
import AppProviders from '@/app/providers.jsx';
import Clarity from '@microsoft/clarity';
import GlobalClientUI from '@/components/common/GlobalClientUI.jsx';
import {
  BASE_URL,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  SITE_NAME,
} from '@/lib/seo';
import Script from 'next/script';

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    'study abroad',
    'overseas education',
    'university admissions',
    'international students',
    'Plan My Admission',
    'AI admissions guidance',
  ],
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: BASE_URL,
    type: 'website',
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: DEFAULT_TITLE,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  verification: {
    google: 'FJWAYoMaL14W-xl4VRI_KboMHvMJBICmO47pcxI3tms',
  },
};

export default function RootLayout({ children }) {
  Clarity.init('k3lnvsxob0');
  return (
    <html lang="en">
      <Script
        __innerHTML={{
          __html: `
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:3787493,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
`,
        }}
      ></Script>
      <body className="bg-white text-[#3f1831] antialiased">
        <AppProviders>
          <GlobalClientUI />
          {children}
        </AppProviders>
        <Analytics />
      </body>
    </html>
  );
}
