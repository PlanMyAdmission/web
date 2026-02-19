import Article1 from '@components/higherOrderComponents/Articles/Article1';
import { buildPageMetadata } from '@lib/seo';
export const metadata = buildPageMetadata('/Navigating-the-American-Campus');
export default function ArticleOnePage() {
  return <Article1 />;
}
