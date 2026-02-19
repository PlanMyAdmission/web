import ExploreUniversityData from '../../../src/components/explore_university/ExploreUniversityData';
import { buildPageMetadata } from '../../../src/lib/seo';

export const metadata = buildPageMetadata('/explore/university');

export default function ExploreUniversityDataPage() {
  return <ExploreUniversityData />;
}
