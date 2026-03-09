import { BASE_URL, isProductionCrawlAllowed } from '@lib/seo';

export default async function robots() {
  const disallow = ['/dashboard', '/dashboard/*', '/admin', '/admin/*'];

  return {
    rules: isProductionCrawlAllowed()
      ? {
          userAgent: '*',
          allow: '/',
          disallow,
        }
      : {
          userAgent: '*',
          disallow: '/',
        },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
