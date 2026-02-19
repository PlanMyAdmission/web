import Article3 from '@components/higherOrderComponents/Articles/Article3';
import { buildPageMetadata } from '@lib/seo';
export const metadata = buildPageMetadata('/Pennsylvania-State-University');
export default function ArticleThreePage() {
  return <Article3 />;
}
