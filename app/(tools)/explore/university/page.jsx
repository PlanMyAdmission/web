import ExploreUniversityData from '@components/explore_university/ExploreUniversityData';
import { buildPageMetadata } from '@lib/seo';
export const metadata = buildPageMetadata('/explore/university');
export default function ExploreUniversityDataPage() {
  return <ExploreUniversityData />;
}
