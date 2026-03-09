import Home from '@components/home/Home';
import { getHomepageBlogCards } from '@lib/blogs.server.js';
import { buildPageMetadata } from '@lib/seo';

export const metadata = buildPageMetadata('/');

export default async function HomePage() {
  const articles = await getHomepageBlogCards();

  return <Home articles={articles} />;
}
