import { BASE_URL, isProductionCrawlAllowed } from '@lib/seo';

export default function robots() {
  const allowCrawl = isProductionCrawlAllowed();

  return {
    rules: allowCrawl
      ? {
          userAgent: '*',
          allow: '/',
          disallow: ['/dashboard', '/dashboard/*'],
        }
      : {
          userAgent: '*',
          disallow: '/',
        },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
