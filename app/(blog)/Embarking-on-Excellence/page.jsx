import Article2 from '@components/higherOrderComponents/Articles/Article2';
import { buildPageMetadata } from '@lib/seo';
export const metadata = buildPageMetadata('/Embarking-on-Excellence');
export default function ArticleTwoPage() {
  return <Article2 />;
}
