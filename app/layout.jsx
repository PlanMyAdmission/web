import '@/app/globals.css';
import Shell from '@/app/shell.jsx';
import AppProviders from '@/app/providers.jsx';
const BASE_URL = 'https://planmyadmission.com';
const DEFAULT_TITLE = 'Plan My Admission | Study Abroad & Admissions Guidance';
const DEFAULT_DESCRIPTION =
  'Plan My Admission offers expert overseas education consulting with personalized university admissions guidance, student visa support, and AI-powered tools to simplify your study abroad journey.';
export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: '%s | Plan My Admission',
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
    siteName: 'Plan My Admission',
    images: [
      {
        url: BASE_URL,
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
    images: [BASE_URL],
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
