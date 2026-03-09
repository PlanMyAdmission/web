import { notFound } from 'next/navigation';
import UniversityView from '@components/explore_university/Universities/University.jsx';
import { getUniversityBySlug } from '@lib/explore.server.js';
import { buildPageMetadata } from '@lib/seo';

export const metadata = buildPageMetadata('/explore/university');

export default async function ExploreUniversitySlugPage({ params }) {
  const university = await getUniversityBySlug(params.slug);
  if (!university) {
    notFound();
  }

  return <UniversityView universities={[university]} />;
}
