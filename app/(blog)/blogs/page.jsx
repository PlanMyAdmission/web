import Blog from '@components/home/Blog';
import { buildPageMetadata } from '@lib/seo';
export const metadata = buildPageMetadata('/blogs');
export default function BlogsPage() {
  return <Blog />;
}
