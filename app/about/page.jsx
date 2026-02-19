import About from "../../src/components/aboutUs/About";
import { buildPageMetadata } from "../../src/lib/seo";

export const metadata = buildPageMetadata("/about");

export default function AboutPage() {
  return <About />;
}
