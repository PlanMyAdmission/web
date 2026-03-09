import { notFound } from 'next/navigation';
import UniversityView from '@components/explore-university/detail/University.jsx';
import { buildCmsMetadata } from '@lib/cmsMetadata.js';
import { getUniversityBySlug } from '@lib/explore.server.js';

export async function generateMetadata({ params }) {
  const university = await getUniversityBySlug(params.slug);
  if (!university) {
    return {};
  }

  const title = [university?.name, university?.addr_country]
    .filter(Boolean)
    .join(' | ');
  const description = [
    university?.name,
    university?.addr_state ? `in ${university.addr_state}` : '',
    university?.addr_country || '',
    university?.acceptance_rate ? `with ${university.acceptance_rate} acceptance rate` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return buildCmsMetadata({
    path: `/explore/universities/${params.slug}`,
    title: title || 'University Details | Plan My Admission',
    description: description || 'Explore university highlights, admissions details, and programs.',
    image: university?.logo || undefined,
  });
}

export default async function ExploreUniversitySlugPage({ params }) {
  const university = await getUniversityBySlug(params.slug);
  if (!university) {
    notFound();
  }

  return <UniversityView universities={[university]} />;
}
