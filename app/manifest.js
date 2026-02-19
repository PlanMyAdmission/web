import { SITE_NAME } from '@lib/seo';

export default function manifest() {
  return {
    name: `${SITE_NAME} | Study Abroad & Admissions Guidance`,
    short_name: SITE_NAME,
    description:
      'Plan My Admission helps students with overseas education consulting, AI-powered university search, and admissions guidance.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#f40076',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '64x64 32x32 24x24 16x16',
        type: 'image/x-icon',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/images/brand/logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
