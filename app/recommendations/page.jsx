import Recommendations from '../../src/components/dashboard/user/Recommendations';
import { buildPageMetadata } from '../../src/lib/seo';

export const metadata = buildPageMetadata('/recommendations');

export default function RecommendationsPage() {
  return <Recommendations />;
}
