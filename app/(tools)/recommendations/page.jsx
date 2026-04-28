import Recommendations from '@/components/recommendations/Recommendations';
import { buildPageMetadata } from '@/lib/seo';
export const metadata = buildPageMetadata('/recommendations');
export default function RecommendationsPage() {
  return <Recommendations />;
}
