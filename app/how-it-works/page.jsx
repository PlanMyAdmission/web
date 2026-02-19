import HowItWorks from "../../src/components/how-it-works/HowItWorks";
import { buildPageMetadata } from "../../src/lib/seo";

export const metadata = buildPageMetadata("/how-it-works");

export default function HowItWorksPage() {
  return <HowItWorks />;
}
