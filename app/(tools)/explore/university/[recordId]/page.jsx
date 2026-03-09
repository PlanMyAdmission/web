import { notFound } from 'next/navigation';
import ExploreUniversityData from '@components/explore_university/ExploreUniversityData';
import { getExploreRecordById, getExploreRecordImageUrl } from '@lib/explore.server.js';
import { buildPageMetadata } from '@lib/seo';

export const metadata = buildPageMetadata('/explore/university');

export default async function ExploreUniversityRecordPage({ params }) {
  const record = await getExploreRecordById(params.recordId);
  if (!record) {
    notFound();
  }

  return <ExploreUniversityData records={[record]} imageUrl={getExploreRecordImageUrl(record)} />;
}
