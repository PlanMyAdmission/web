import UniversityView from '@components/explore_university/Universities/University';
import { buildPageMetadata } from '@lib/seo';
export const metadata = buildPageMetadata('/dashboard/university');
export default function DashboardUniversityPage() {
  return <UniversityView />;
}
