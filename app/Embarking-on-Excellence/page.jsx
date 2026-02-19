import Article2 from "../../src/higherOrderComponents/Articles/Article2";
import { buildPageMetadata } from "../../src/lib/seo";

export const metadata = buildPageMetadata("/Embarking-on-Excellence");

export default function ArticleTwoPage() {
  return <Article2 />;
}
