import AIUniversitySearch from '@components/ai-university-search/AIUniversitySearch';
import { buildPageMetadata } from '@lib/seo';

export const metadata = buildPageMetadata('/ai-university-matchmaker');

export default function AIUniversityMatchmakerPage() {
  return <AIUniversitySearch />;
}
