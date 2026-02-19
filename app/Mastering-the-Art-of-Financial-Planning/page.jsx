import Article4 from "../../src/higherOrderComponents/Articles/Article4";
import { buildPageMetadata } from "../../src/lib/seo";

export const metadata = buildPageMetadata("/Mastering-the-Art-of-Financial-Planning");

export default function ArticleFourPage() {
  return <Article4 />;
}
