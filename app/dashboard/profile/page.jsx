import Profile from '@/components/dashboard/user/Profile';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata('/dashboard/profile');

const DashboardProfilePage = () => {
  return <Profile />;
};

export default DashboardProfilePage;
