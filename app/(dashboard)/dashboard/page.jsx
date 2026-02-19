import { redirect } from 'next/navigation';
import { buildPageMetadata } from '@lib/seo';

export const metadata = buildPageMetadata('/dashboard');

const DashboardIndexPage = () => {
  redirect('/dashboard/profile');
  return null;
};
export default DashboardIndexPage;
