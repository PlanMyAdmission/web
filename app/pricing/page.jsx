import Pricing from "../../src/components/pricing/Pricing";
import { buildPageMetadata } from "../../src/lib/seo";

export const metadata = buildPageMetadata("/pricing");

export default function PricingPage() {
  return <Pricing />;
}
