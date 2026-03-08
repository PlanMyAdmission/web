import { buildPageMetadata } from '@lib/seo';
import { permanentRedirect } from 'next/navigation';

export const metadata = buildPageMetadata('/ai-university-search');

export default function AIUniversitySearchPage() {
  permanentRedirect('/ai-university-matchmaker');
}
