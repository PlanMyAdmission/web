import AIUniversitySearch from '@components/ai-university-search/AIUniversitySearch';
import { buildPageMetadata } from '@lib/seo';
export const metadata = buildPageMetadata('/ai-university-search');
export default function AIUniversitySearchPage() {
  return <AIUniversitySearch />;
}
