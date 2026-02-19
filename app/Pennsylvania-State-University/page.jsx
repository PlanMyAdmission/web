import Article3 from '../../src/higherOrderComponents/Articles/Article3';
import { buildPageMetadata } from '../../src/lib/seo';

export const metadata = buildPageMetadata('/Pennsylvania-State-University');

export default function ArticleThreePage() {
  return <Article3 />;
}
