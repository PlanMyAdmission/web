import Blog from "../../src/components/home/Blog";
import { buildPageMetadata } from "../../src/lib/seo";

export const metadata = buildPageMetadata("/blogs");

export default function BlogsPage() {
  return <Blog />;
}
