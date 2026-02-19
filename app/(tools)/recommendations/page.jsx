import Recommendations from '@components/dashboard/user/Recommendations';
import { buildPageMetadata } from '@lib/seo';
export const metadata = buildPageMetadata('/recommendations');
export default function RecommendationsPage() {
  return <Recommendations />;
}
