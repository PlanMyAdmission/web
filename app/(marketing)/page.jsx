import Home from '@/components/home/Home';
import { fetchBlogPage } from '@/lib/blog/api.js';
import { BLOG_HOMEPAGE_LIMIT } from '@/lib/blog/constants.js';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata('/');

export default async function HomePage() {
  const { items: articles } = await fetchBlogPage({ limit: BLOG_HOMEPAGE_LIMIT });

  return <Home articles={articles} />;
}
