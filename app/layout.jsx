import '@/app/globals.css';
import Shell from '@/app/shell.jsx';
import AppProviders from '@/app/providers.jsx';
import {
  BASE_URL,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  SITE_NAME,
} from '@lib/seo';

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
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <Shell>{children}</Shell>
        </AppProviders>
      </body>
    </html>
  );
}
