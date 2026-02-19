import Explore from '@components/explore_university/Explore';
import { buildPageMetadata } from '@lib/seo';
export const metadata = buildPageMetadata('/explore');
export default function ExplorePage() {
  return <Explore />;
}
