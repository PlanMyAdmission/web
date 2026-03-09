import { notFound } from 'next/navigation';
import ExploreUniversityData from '@components/explore-university/ExploreUniversityData';
import { buildCmsMetadata } from '@lib/cmsMetadata.js';
import { getExploreRecordById, getExploreRecordImageUrl } from '@lib/explore.server.js';

export async function generateMetadata({ params }) {
  const record = await getExploreRecordById(params.recordId);
  if (!record) {
    return {};
  }

  const title = [record?.Name, record?.University, record?.Country]
    .filter(Boolean)
    .join(' | ');
  const description = [
    record?.Name,
    record?.University ? `at ${record.University}` : '',
    record?.Country ? `in ${record.Country}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return buildCmsMetadata({
    path: `/explore/university/${params.recordId}`,
    title: title || 'University Program | Plan My Admission',
    description: description || 'Explore university program details, destination, and admissions information.',
    image: getExploreRecordImageUrl(record) || undefined,
  });
}

export default async function ExploreUniversityRecordPage({ params }) {
  const record = await getExploreRecordById(params.recordId);
  if (!record) {
    notFound();
  }

  return <ExploreUniversityData records={[record]} imageUrl={getExploreRecordImageUrl(record)} />;
}
