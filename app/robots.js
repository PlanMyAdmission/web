import { BASE_URL, isProductionCrawlAllowed } from '@/lib/seo';

export default async function robots() {
  const disallow = ['/dashboard', '/dashboard/*'];

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
