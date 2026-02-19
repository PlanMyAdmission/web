import Article1 from '../../src/higherOrderComponents/Articles/Article1';
import { buildPageMetadata } from '../../src/lib/seo';

export const metadata = buildPageMetadata('/Navigating-the-American-Campus');

export default function ArticleOnePage() {
  return <Article1 />;
}
