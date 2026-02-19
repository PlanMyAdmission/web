import Explore from "../../src/components/explore_university/Explore";
import { buildPageMetadata } from "../../src/lib/seo";

export const metadata = buildPageMetadata("/explore");

export default function ExplorePage() {
  return <Explore />;
}
