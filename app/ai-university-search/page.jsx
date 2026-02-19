import AIUniversitySearch from '../../src/components/ai-university-search/AIUniversitySearch';
import { buildPageMetadata } from '../../src/lib/seo';

export const metadata = buildPageMetadata('/ai-university-search');

export default function AIUniversitySearchPage() {
  return <AIUniversitySearch />;
}
